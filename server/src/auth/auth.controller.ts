import { Controller, Get, Query, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  profile(@Request() req): User {
    return req.user;
  }

  @Get('login')
  @Public()
  login(@Query('code') code: string): Promise<object> {
    return this.authService.login(code);
  }
}
