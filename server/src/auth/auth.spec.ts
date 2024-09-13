import { AppModule } from '../app.module';
import { AuthGuard } from './auth.guard';
import { AuthGuardMock } from './auth.guard.mock';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';

const routes = { profile: '/auth/profile' };
const credentials = {
  admin: { email: 'admin@test.com' }
};

describe('Auth', () => {
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(AuthGuard)
      .useClass(AuthGuardMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe(`GET ${routes.profile}`, () => {
    it('returns 401 when user is not authorized', () => {
      return request(server).get(routes.profile).expect(401);
    });

    it('returns profile when user is logged in', async () => {
      return request(server)
        .get(routes.profile)
        .set('Authorization', credentials.admin.email)
        .expect(200)
        .then(({ body: user }) => {
          expect(user).not.toBeNull();
          expect(user.email).toBe(credentials.admin.email);
        });
    });
  });

  afterAll(() => app.close());
});
