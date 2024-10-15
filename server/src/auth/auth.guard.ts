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
    private configService: ConfigService,
    private reflector: Reflector,
    private usersService: UsersService
  ) {
    this.managementClient = new ManagementClient({
      domain: this.configService.get('AUTH0_DOMAIN'),
      clientId: this.configService.get('AUTH0_CLIENT_ID'),
      clientSecret: this.configService.get('AUTH0_CLIENT_SECRET')
    });
  }

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
    const response: Response = context.switchToHttp().getResponse();
    try {
      await this.verifyJWT(request, response);
      const { sub } = request.auth.payload;
      console.log('sub', sub);
      let user = await this.usersService.findBySub(sub);
      if (!user) {
        const { data } = await this.managementClient.users.get({ id: sub });
        console.log('mgmt', data);
        user = await this.usersService.findByEmail(data.email);
        // TODO update user's sub/create the user/whatever
        if (!user) {
          // temporarily allow all new accounts
          const dto = plainToClass(
            CreateUserDto,
            { email: data.email, role: 'ADMIN', sub }
          );
          user = await this.usersService.create(dto);
          console.log(user);
        }

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

  // NOTE: this is a wrapper for Auth0 Express middleware, but this way we can
  // catch the error and handle it gracefully
  private verifyJWT(req, res) {
    return new Promise((resolve) => {
      console.log('header', req.get('Authorization'));
      const domain = this.configService.get('AUTH0_DOMAIN');
      console.log('domain', domain);
      console.log('aud', this.configService.get('AUTH0_AUDIENCE'));
      return auth({
        audience: this.configService.get('AUTH0_AUDIENCE'),
        issuerBaseURL: `https://${domain}/`,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
        tokenSigningAlg: 'RS256'
      })(req, res, resolve);
    });
  }
}
