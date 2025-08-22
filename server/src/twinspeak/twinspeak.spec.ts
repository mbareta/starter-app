import { AppModule } from '../app.module';
import { AuthGuard } from '../auth/auth.guard';
import { AuthGuardMock } from '../auth/auth.guard.mock';
import { INestApplication } from '@nestjs/common';
import path from 'path';
import request from 'supertest';
import { Test } from '@nestjs/testing';

jest.setTimeout(30000);

const routes = { basic: '/twinspeak' };
const credentials = {
  admin: { email: 'admin@test.com' }
};

describe('Twinspeak', () => {
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

  describe(`POST ${routes.basic}`, () => {
    it('returns 401 when user is not authorized', () => {
      return request(server).post(routes.basic).expect(401);
    });

    it('returns success', async () => {
      return request(server)
        .post(routes.basic)
        .set('Authorization', credentials.admin.email)
        .expect(200)
        .attach('file', path.resolve(__dirname, '../../data/test_video.mp4'))
        .then((res) => {
          console.log(res.text);
        });
    }, 60000);
  });

  afterAll(() => app.close());
});
