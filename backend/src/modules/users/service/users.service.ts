import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { PrismaService } from '../../../database/prisma.service';
import { UserQueryDto } from '../dto/user-query.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private prisma: PrismaService,
  ) {}

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findProfile(id: string) {
    const user = await this.findOne(id);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      timeZone: user.timeZone,
      language: user.language,
      themePreference: user.themePreference,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
      role: {
        id: (user as any).role.id,
        name: (user as any).role.name,
        description: (user as any).role.description,
      },
    };
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async listAll(queryDto: UserQueryDto) {
    return this.usersRepository.findAll(queryDto);
  }

  async updateProfile(id: string, updateDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const updateData: any = {};
    if (updateDto.fullName !== undefined) updateData.fullName = updateDto.fullName;
    if (updateDto.avatarUrl !== undefined) updateData.avatarUrl = updateDto.avatarUrl;
    if (updateDto.bio !== undefined) updateData.bio = updateDto.bio;
    if (updateDto.timeZone !== undefined) updateData.timeZone = updateDto.timeZone;
    if (updateDto.language !== undefined) updateData.language = updateDto.language;
    if (updateDto.themePreference !== undefined) updateData.themePreference = updateDto.themePreference;

    if (updateDto.username !== undefined && updateDto.username !== user.username) {
      const existing = await this.prisma.user.findFirst({
        where: {
          username: updateDto.username,
          deletedAt: null,
        },
      });
      if (existing) {
        throw new ConflictException('Username is already taken');
      }
      updateData.username = updateDto.username;
    }

    return this.usersRepository.update(id, updateData);
  }

  async adminUpdateUser(id: string, updateDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const updateData: any = {};
    if (updateDto.fullName !== undefined) updateData.fullName = updateDto.fullName;
    if (updateDto.avatarUrl !== undefined) updateData.avatarUrl = updateDto.avatarUrl;
    if (updateDto.bio !== undefined) updateData.bio = updateDto.bio;
    if (updateDto.timeZone !== undefined) updateData.timeZone = updateDto.timeZone;
    if (updateDto.language !== undefined) updateData.language = updateDto.language;
    if (updateDto.themePreference !== undefined) updateData.themePreference = updateDto.themePreference;
    if (updateDto.status !== undefined) updateData.status = updateDto.status;

    if (updateDto.username !== undefined && updateDto.username !== user.username) {
      const existing = await this.prisma.user.findFirst({
        where: {
          username: updateDto.username,
          deletedAt: null,
        },
      });
      if (existing) {
        throw new ConflictException('Username is already taken');
      }
      updateData.username = updateDto.username;
    }

    if (updateDto.roleName) {
      const role = await this.prisma.role.findUnique({
        where: { name: updateDto.roleName },
      });
      if (!role) {
        throw new BadRequestException(`Role ${updateDto.roleName} does not exist`);
      }
      updateData.roleId = role.id;
    }

    return this.usersRepository.update(id, updateData);
  }

  async softDeleteUser(id: string) {
    await this.findOne(id);
    await this.usersRepository.softDelete(id);
    return { success: true, message: 'User deleted successfully' };
  }
}
