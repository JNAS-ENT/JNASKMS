import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '3a4b5c6d-7e8f-901a-2b3c-4d5e6f7a8b9c' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  fullName!: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  avatarUrl?: string | null;

  @ApiProperty({ example: 'ADMIN' })
  roleName!: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'ey...' })
  accessToken!: string;

  @ApiProperty({ example: 'ey...' })
  refreshToken!: string;

  @ApiProperty()
  user!: UserResponseDto;
}
