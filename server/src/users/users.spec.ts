import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

const BASE_URL = '/users';
const credentials = {
  admin: { email: 'admin@test.com', password: 'test' }
};

describe('Users', () => {
  let app: INestApplication;
  let server;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    const res = await request(server)
      .post('/auth/login')
      .send(credentials.admin);
    token = res.body.token;
  });

  describe(`GET ${BASE_URL}`, () => {
    it('returns 401 when user is not authorized', () => {
      return request(server).get(BASE_URL).expect(401);
    });

    it('returns list of users', () => {
      return request(server)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBeGreaterThan(0);
          const admin = body.find((it) => it.email === credentials.admin.email);
          expect(admin).not.toBeNull();
        });
    });
  });

  afterAll(() => app.close());
});
