import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@ApiHeader({ name: 'Authorization' })
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  getUserProfile(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }
}
