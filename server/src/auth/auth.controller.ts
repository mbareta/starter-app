import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body) {
    try {
      const user = await this.authService.validateLogin(body);
      const userData = { id: user.id, email: user.email };
      return { user, token: this.jwtService.sign(userData) };
    } catch (_) {
      throw new BadRequestException('Login failed.');
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
