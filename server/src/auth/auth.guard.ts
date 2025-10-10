import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { IS_PUBLIC_KEY } from './public.decorator';
import { plainToClass } from '@nestjs/class-transformer';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

const ALM_URL = 'https://learningmanagereu.adobe.com';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected configService: ConfigService,
    protected reflector: Reflector,
    protected usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) return true;
    const requiredRoles: string[] = this.getRequiredRoles(context);
    const request: Request = context.switchToHttp().getRequest();
    try {
      const tokenData = await this.verifyToken(request.headers.authorization);
      const user: User = await this.getUser(tokenData);
      if (!user) throw new UnauthorizedException();
      request['user'] = user;
      if (!requiredRoles) return true;
      return requiredRoles.includes(user.role);
    } catch {
      throw new UnauthorizedException();
    }
  }

  protected async getUser(tokenData: any): Promise<User> {
    const { access_token, account_id, user_id } = tokenData;
    let user: User = await this.usersService.findByAccountAndUser(
      account_id,
      user_id
    );
    if (!user) {
      const { data } = await this.getAccount(access_token);
      // TODO define and handle use-case when user is not found
      // temporarily allow all new accounts, but rejection is also valid
      const dto: CreateUserDto = plainToClass(CreateUserDto, {
        email: data.attributes.email,
        role: 'ADMIN',
        accountId: account_id,
        userId: user_id
      });
      user = await this.usersService.create(dto);
    }
    return user;
  }

  protected async verifyToken(accessToken: string): Promise<any> {
    const response = await fetch(
      `${ALM_URL}/oauth/token/check?access_token=${accessToken}`
    );
    if (response.ok) return response.json();
    throw new Error(`Authentication failed: ${response.status}`);
  }

  private getRequiredRoles(context: ExecutionContext): string[] {
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

  private async getAccount(accessToken: string): Promise<any> {
    const response = await fetch(`${ALM_URL}/primeapi/v2/user`, {
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `oauth ${accessToken}`
      }
    });
    if (response.ok) return response.json();
    throw new Error(`Authentication failed: ${response.status}`);
  }
}
