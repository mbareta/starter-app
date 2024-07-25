import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';
import clerkKey from './clerk_public_key';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  clerkClient;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
    private usersService: UsersService
  ) {
    this.clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY
    });
  }

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
    const request: Request = context.switchToHttp().getRequest();
    try {
      // HACK: Clerk doesn't work with this type of Request
      request.url = `${request.headers.host}${request.url}`;
      if (!Object.keys(request.body).length) request.body = null;
      const data = await this.clerkClient.authenticateRequest(request, {
        jwtKey: clerkKey
      });
      if (!data.isSignedIn) throw new UnauthorizedException();
      const sub = data.toAuth().userId;
      let user = await this.usersService.findBySub(sub);
      if (!user) {
        const { emailAddresses } = await this.clerkClient.users.getUser(sub);
        // TODO try all email addresses or something else
        const email = emailAddresses[0].emailAddress && 'admin@test.com';
        user = await this.usersService.findByEmail(email);
        // TODO update user's sub/create the user/whatever
      }
      if (!user) throw new UnauthorizedException();
      request['user'] = user;
      if (!requiredRoles) return true;
      return requiredRoles.includes(user.role);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
