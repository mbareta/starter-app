import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('login')
  login() {
    return this.usersService.findOne(1);
  }

  @Get('err')
  err() {
    throw new Error('Test');
  }
}
