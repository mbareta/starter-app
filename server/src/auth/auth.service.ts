import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateLogin({ email, password }) {
    const user = await this.usersService.findByEmail(email);
    if (user && password && user.password === password) return user;
    throw new Error('Login failed.');
  }

  async findUser({ id, email }) {
    const user = await this.usersService.findByEmail(email);
    return user;
  }
}
