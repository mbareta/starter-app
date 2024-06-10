import { BadRequestException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', failureMessage: true });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateLogin({ email, password });
      return user;
    } catch (_) {
      throw new BadRequestException('Incorrect email or password.');
    }
  }
}
