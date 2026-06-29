import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
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
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account has been suspended');
    }

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

    // Update session token or reuse
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

  private async logActivity(userId: string, action: string, details?: any): Promise<void> {
    try {
      await this.prisma.activityLog.create({
        data: {
          userId,
          action,
          details: details ? JSON.parse(JSON.stringify(details)) : undefined,
        },
      });
    } catch (e) {
      // Gracefully capture/ignore logging issues to not disrupt core auth flow
      console.error('Failed to log activity:', e);
    }
  }
}
