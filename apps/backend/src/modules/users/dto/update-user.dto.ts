import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Johnathan Doe', description: 'Updated full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 'johndoe', description: 'Unique username' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'https://example.com/new-avatar.jpg', description: 'New avatar URL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Full stack engineer with 5 years experience', description: 'User biography' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'America/New_York', description: 'User timezone' })
  @IsOptional()
  @IsString()
  timeZone?: string;

  @ApiPropertyOptional({ example: 'en', description: 'User language' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: 'dark', description: 'User theme preference' })
  @IsOptional()
  @IsString()
  themePreference?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: UserStatus, description: 'Updated user account status' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ example: 'ADMIN', description: 'Updated user role association' })
  @IsOptional()
  @IsString()
  roleName?: string;
}
