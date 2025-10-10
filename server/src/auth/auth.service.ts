import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

const ALM_URL = 'https://learningmanagereu.adobe.com';

@Injectable()
export class AuthService {
  constructor(protected configService: ConfigService) {}

  async login(code: string): Promise<object> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('client_id', this.configService.get('ADOBE_CLIENT_ID'));
    params.append(
      'client_secret',
      this.configService.get('ADOBE_CLIENT_SECRET')
    );
    params.append('redirect_uri', this.configService.get('ADOBE_REDIRECT_URI'));

    const res = await fetch(`${ALM_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}.`);
    return res.json();
  }
}
