import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'default-jwt-secret-key-change-in-prod';
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-jwt-refresh-secret-key';

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (dto.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });
      if (existingUsername) {
        throw new ConflictException('User with this username already exists');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Get or lazily create USER role
    let role = await this.prisma.role.findUnique({
      where: { name: 'USER' },
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: {
          name: 'USER',
          description: 'Standard system user role',
        },
      });
    }

    // Generate random email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        username: dto.username || null,
        emailVerificationToken,
        provider: AuthProvider.LOCAL,
        roleId: role.id,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // Abstract Email Provider simulation
    console.log(`[EMAIL DISPATCH] Verification email sent to ${user.email} with token: ${emailVerificationToken}`);

    const permissions = user.role.permissions.map((p) => p.permission.name);
    const tokens = await this.generateTokens(user.id, user.email, user.role.name, permissions);

    await this.saveSession(user.id, tokens.refreshToken);
    await this.logActivity(user.id, 'auth.register', { email: user.email });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        roleName: user.role.name,
      },
    };
  }

  async login(dto: LoginDto, ip?: string, userAgent?: string): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.passwordHash) {
      await this.logActivity(null, 'auth.login_failed', { email: dto.email, reason: 'Invalid credentials' });
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      await this.logActivity(user.id, 'auth.login_failed', { email: dto.email, reason: 'Password mismatch' });
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      await this.logActivity(user.id, 'auth.login_failed', { email: dto.email, reason: 'Suspended account' });
      throw new UnauthorizedException('Your account has been suspended');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const permissions = user.role.permissions.map((p) => p.permission.name);
    const tokens = await this.generateTokens(user.id, user.email, user.role.name, permissions);

    await this.saveSession(user.id, tokens.refreshToken, ip, userAgent);
    await this.logActivity(user.id, 'auth.login', { ip, userAgent });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        roleName: user.role.name,
      },
    };
  }

  async refresh(dto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await this.prisma.session.findUnique({
      where: { token: dto.refreshToken },
      include: {
        user: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.prisma.session.delete({ where: { id: session.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = session.user;
    const permissions = user.role.permissions.map((p) => p.permission.name);
    const tokens = await this.generateTokens(user.id, user.email, user.role.name, permissions);

    // Update session token or reuse (Token Rotation)
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const session = await this.prisma.session.findUnique({
      where: { token: refreshToken },
    });
    if (session) {
      await this.prisma.session.delete({ where: { id: session.id } });
      await this.logActivity(session.userId, 'auth.logout');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Return success message even if email wasn't found for security reasons
      return { message: 'If this email is registered, a password reset link has been dispatched' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    // Abstract Email Provider simulation
    console.log(`[EMAIL DISPATCH] Password reset instructions dispatched to ${user.email} with token: ${token}`);
    await this.logActivity(user.id, 'auth.forgot_password_requested');

    return { message: 'If this email is registered, a password reset link has been dispatched' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    await this.logActivity(user.id, 'auth.password_reset_success');

    return { message: 'Your password has been reset successfully' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.passwordHash) {
      throw new BadRequestException('User has no local password hash configured');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Incorrect current password');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    await this.logActivity(user.id, 'auth.change_password_success');

    return { message: 'Password updated successfully' };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    await this.logActivity(user.id, 'auth.email_verified');

    return { message: 'Email verified successfully' };
  }

  async getUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      select: {
        id: true,
        device: true,
        ip: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeSession(userId: string, sessionId: string): Promise<{ success: boolean }> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found or permission denied');
    }

    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    await this.logActivity(userId, 'auth.session_revoked', { sessionId });

    return { success: true };
  }

  async googleAuth(googleProfile: {
    email: string;
    fullName: string;
    avatarUrl?: string;
    googleId: string;
  }): Promise<AuthResponseDto> {
    let user = await this.prisma.user.findUnique({
      where: { email: googleProfile.email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      let role = await this.prisma.role.findUnique({
        where: { name: 'USER' },
      });

      if (!role) {
        role = await this.prisma.role.create({
          data: {
            name: 'USER',
            description: 'Standard system user role',
          },
        });
      }

      user = await this.prisma.user.create({
        data: {
          email: googleProfile.email,
          fullName: googleProfile.fullName,
          avatarUrl: googleProfile.avatarUrl,
          provider: AuthProvider.GOOGLE,
          providerId: googleProfile.googleId,
          roleId: role.id,
          isEmailVerified: true, // Google accounts are pre-verified
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });
    } else if (user.provider === AuthProvider.LOCAL) {
      // Account Linking: Link existing local account to Google provider safely
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          provider: AuthProvider.GOOGLE,
          providerId: googleProfile.googleId,
          isEmailVerified: true,
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account has been suspended');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const permissions = user.role.permissions.map((p) => p.permission.name);
    const tokens = await this.generateTokens(user.id, user.email, user.role.name, permissions);

    await this.saveSession(user.id, tokens.refreshToken);
    await this.logActivity(user.id, 'auth.google_login');

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        roleName: user.role.name,
      },
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    permissions: string[],
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email, role, permissions };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtRefreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveSession(
    userId: string,
    refreshToken: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.prisma.session.create({
      data: {
        userId,
        token: refreshToken,
        ip,
        device: userAgent,
        expiresAt,
      },
    });
  }

  private async logActivity(userId: string | null, action: string, details?: any): Promise<void> {
    try {
      await this.prisma.activityLog.create({
        data: {
          userId: userId || undefined,
          action,
          details: details ? JSON.parse(JSON.stringify(details)) : undefined,
        },
      });
    } catch (e) {
      console.error('Failed to log activity:', e);
    }
  }
}
