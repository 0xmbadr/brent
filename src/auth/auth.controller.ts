import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }

  @Post('login')
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Request() request) {
    const returnedUser = request.user;
    delete returnedUser.password;

    return {
      userId: request.user,
    };
  }
}
