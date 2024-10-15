import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthGuardMock extends AuthGuard {
  protected async getUser(request): Promise<User> {
    const email = request.headers.authorization;
    if (!email) throw new UnauthorizedException();
    return this.usersService.findByEmail(email);
  }
}
