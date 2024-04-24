import {
  Body, Controller, HttpCode, HttpException, HttpStatus, Post
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  create(@Body() credentials) {
    return this.authService.validateLogin(credentials)
      .catch(e => { throw new HttpException(e.message, HttpStatus.BAD_REQUEST) });
  }
}
