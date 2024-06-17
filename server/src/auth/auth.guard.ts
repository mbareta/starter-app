import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) return true;
    const requiredRoles = this.reflector.getAllAndOverride<any[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'TODO'
      });
      const user = await this.usersService.findByEmail(payload.email);
      request['user'] = user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    if (!requiredRoles) return true;
    return requiredRoles.includes(request.user.role);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
