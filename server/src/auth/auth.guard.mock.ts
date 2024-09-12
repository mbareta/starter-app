import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuardMock implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) return true;
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    const request: Request = context.switchToHttp().getRequest();
    const email = request.headers.authorization;
    if (!email) throw new UnauthorizedException();
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException();
    request['user'] = user;
    if (!requiredRoles) return true;
    return requiredRoles.includes(user.role);
  }
}
