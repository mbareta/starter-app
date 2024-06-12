import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  login(@Request() req) {
    const data = req.user.toJSON();
    return { user: req.user, token: this.jwtService.sign(data) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
