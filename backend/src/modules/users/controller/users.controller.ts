import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { UserQueryDto } from '../dto/user-query.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile information' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getMyProfile(@CurrentUser() currentUser: any) {
    return this.usersService.findProfile(currentUser.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile information' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateMyProfile(
    @CurrentUser() currentUser: any,
    @Body() updateDto: UpdateUserDto,
  ) {
    // Standard users can only update standard profile fields (name, avatar)
    const selfUpdateDto: UpdateUserDto = {
      fullName: updateDto.fullName,
      avatarUrl: updateDto.avatarUrl,
    };
    return this.usersService.updateProfile(currentUser.sub, selfUpdateDto);
  }

  @Get()
  @RequirePermissions('users:read')
  @ApiOperation({ summary: 'List all active/suspended users (Admin/Manager)' })
  @ApiResponse({ status: 200, description: 'Users query list returned' })
  async getAllUsers(@Query() queryDto: UserQueryDto) {
    return this.usersService.listAll(queryDto);
  }

  @Get(':id')
  @RequirePermissions('users:read')
  @ApiOperation({ summary: 'Retrieve specific user details (Admin/Manager)' })
  @ApiResponse({ status: 200, description: 'User record fetched' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findProfile(id);
  }

  @Put(':id')
  @RequirePermissions('users:write')
  @ApiOperation({ summary: 'Administrative update of user fields, roles, or status' })
  @ApiResponse({ status: 200, description: 'User successfully updated by Admin' })
  async adminUpdateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.usersService.adminUpdateUser(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions('users:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Administrative soft-delete of a user' })
  @ApiResponse({ status: 200, description: 'User soft-deleted' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.softDeleteUser(id);
  }
}
