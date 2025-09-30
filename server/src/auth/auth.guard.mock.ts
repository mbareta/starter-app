import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthGuardMock extends AuthGuard {
  protected async getUser(tokenData: any): Promise<User> {
    const { account_id, user_id } = tokenData;
    return this.usersService.findByAccountAndUser(account_id, user_id);
  }

  protected async verifyToken(token: string): Promise<object> {
    // Authorization header is the email address of the user in testing
    const user = await this.usersService.findByEmail(token);
    return { account_id: user.accountId, user_id: user.userId };
  }
}
