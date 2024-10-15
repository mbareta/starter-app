import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuardMock extends AuthGuard {
  async getUser(request) {
    const email = request.headers.authorization;
    if (!email) throw new UnauthorizedException();
    return this.usersService.findByEmail(email);
  }
}
