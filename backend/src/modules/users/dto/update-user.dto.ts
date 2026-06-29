import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsEnum, IsUrl } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Johnathan Doe', description: 'Updated full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/new-avatar.jpg', description: 'New avatar URL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: UserStatus, description: 'Updated user account status' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ example: 'ADMIN', description: 'Updated user role association' })
  @IsOptional()
  @IsString()
  roleName?: string;
}
