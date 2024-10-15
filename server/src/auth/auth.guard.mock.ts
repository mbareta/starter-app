import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AuthGuardMock extends AuthGuard {
  async getUser(request) {
    const email = request.headers.authorization;
    if (!email) throw new UnauthorizedException();
    return this.usersService.findByEmail(email);
  }
}
