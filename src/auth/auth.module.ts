import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
