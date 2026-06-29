import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus } from '@prisma/client';

export class UserQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'John', description: 'Search term for user full name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ example: 'USER', description: 'Role name filter' })
  @IsOptional()
  @IsString()
  role?: string;
}
