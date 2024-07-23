import { Controller, Get, Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
