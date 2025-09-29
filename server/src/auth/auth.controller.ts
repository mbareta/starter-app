import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Public()
  login(@Query('code') code: string): Promise<object> {
    return this.authService.login(code);
  }
}
