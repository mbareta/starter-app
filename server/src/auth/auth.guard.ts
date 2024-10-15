import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ManagementClient } from 'auth0';
import { plainToClass } from '@nestjs/class-transformer';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  managementClient: ManagementClient;

  constructor(
    protected configService: ConfigService,
    protected reflector: Reflector,
    protected usersService: UsersService
  ) {
    this.managementClient = new ManagementClient({
      domain: this.configService.get('AUTH0_DOMAIN'),
      clientId: this.configService.get('AUTH0_CLIENT_ID'),
      clientSecret: this.configService.get('AUTH0_CLIENT_SECRET')
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) return true;
    const requiredRoles = this.getRequiredRoles(context);
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    try {
      await this.verifyJWT(request, response);
      const user = await this.getUser(request);
      if (!user) throw new UnauthorizedException();
      request['user'] = user;
      if (!requiredRoles) return true;
      return requiredRoles.includes(user.role);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async getUser(request) {
    const { sub } = request.auth.payload;
    let user = await this.usersService.findBySub(sub);
    if (!user) {
      const { data } = await this.managementClient.users.get({ id: sub });
      user = await this.usersService.findByEmail(data.email);
      // TODO define and handle use-case when user is not found
      // temporarily allow all new accounts, but rejection is also valid
      if (!user) {
        const dto = plainToClass(CreateUserDto, {
          email: data.email,
          role: 'ADMIN',
          sub
        });
        user = await this.usersService.create(dto);
      }
    }
    return user;
  }

  private getRequiredRoles(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
  }

  // NOTE: this is a wrapper for Auth0 Express middleware, but this way we can
  // catch the error and handle it gracefully
  private verifyJWT(req, res): Promise<any> {
    return new Promise((resolve) => {
      const domain = this.configService.get('AUTH0_DOMAIN');
      return auth({
        audience: this.configService.get('AUTH0_AUDIENCE'),
        issuerBaseURL: `https://${domain}/`,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
        tokenSigningAlg: 'RS256'
      })(req, res, resolve);
    });
  }
}
