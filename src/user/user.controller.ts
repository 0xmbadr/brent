import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuardJwt)
@ApiHeader({ name: 'Authorization' })
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  getUserProfile(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  @Patch(':userId')
  updateUserProfile(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUserProfile(userId, dto);
  }
}
