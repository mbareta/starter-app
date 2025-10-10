import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

@Injectable()
export class WebhookService {
  constructor(private readonly configService: ConfigService) {}

  getToken(req: Request) {
    console.log(req.headers);
    if (!this.validateCredentials(req)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = jwt.sign(
      {
        clientId: this.configService.get('CONSUMER_CLIENT_ID'),
        exp: Date.now() + 3600 * 1000
      },
      this.configService.get('CONSUMER_CLIENT_SECRET')
    );
    console.log(token);
    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600,
      expires_at: Date.now() + 3600 * 1000
    };
  }

  validateToken(token: string) {
    const decoded = jwt.verify(token, this.configService.get('CONSUMER_CLIENT_SECRET')) as { clientId: string };
    return decoded.clientId === this.configService.get('CONSUMER_CLIENT_ID');
  }

  private validateCredentials(req: Request) {
    const authHeader = req.headers['authorization']; // 'Basic YWJjOmRlZg=='
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [clientId, clientSecret] = credentials.split(':');
    const isValidClientId = clientId === this.configService.get('CONSUMER_CLIENT_ID');
    const isValidClientSecret = clientSecret === this.configService.get('CONSUMER_CLIENT_SECRET');
    return isValidClientId && isValidClientSecret;
  }
}
