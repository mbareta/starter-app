import { Controller, Get, Request } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  @Get('profile')
  getProfile(@Request() req): User {
    return req.user;
  }
}
