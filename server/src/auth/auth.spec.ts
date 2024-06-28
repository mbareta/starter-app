import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

const routes = { login: '/auth/login', profile: '/auth/profile' };
const credentials = {
  admin: { email: 'admin@test.com', password: 'test' }
};

describe('Auth', () => {
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe(`POST ${routes.login}`, () => {
    it('successfully logs in with valid credentials', () => {
      return request(server)
        .post(routes.login)
        .send(credentials.admin)
        .expect(200)
        .then(({ body }) => {
          expect(body.token).not.toBeNull();
          expect(body.user).not.toBeNull();
          expect(body.user.email).toBe(credentials.admin.email);
        });
    });

    it('returns 401 with invalid credentials', () => {
      return request(server)
        .post(routes.login)
        .send({ ...credentials.admin, password: 'invalid' })
        .expect(401);
    });
  });

  describe(`GET ${routes.profile}`, () => {
    it('returns 401 when user is not authorized', () => {
      return request(server).get(routes.profile).expect(401);
    });

    it('returns profile when user is logged in', async () => {
      const res = await request(server)
        .post(routes.login)
        .send(credentials.admin);
      const data = res.body;
      return request(server)
        .get(routes.profile)
        .set('Authorization', `Bearer ${data.token}`)
        .expect(200)
        .then(({ body: user }) => {
          expect(user).not.toBeNull();
          expect(user.email).toBe(credentials.admin.email);
        });
    });
  });

  afterAll(() => app.close());
});
