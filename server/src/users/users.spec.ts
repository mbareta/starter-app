import { AppModule } from '../app.module';
import { AuthGuard } from '../auth/auth.guard';
import { AuthGuardMock } from '../auth/auth.guard.mock';
import { EntityManager } from '@mikro-orm/postgresql';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { User } from './entities/user.entity';

const BASE_URL = '/users';
const credentials = {
  admin: { email: 'admin@test.com' },
  user: { email: 'user@test.com' }
};
const fakeUser = { email: 'new_user@fake.com', role: 'USER' };

describe('Users', () => {
  let app: INestApplication;
  let em: EntityManager;
  let server;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(AuthGuard)
      .useClass(AuthGuardMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    em = app.get(EntityManager).fork();

    adminToken = credentials.admin.email;
    userToken = credentials.user.email;
  });

  describe(`GET ${BASE_URL}`, () => {
    it('returns 401 when user is not authenticated', () => {
      return request(server).get(BASE_URL).expect(401);
    });

    it('returns 403 when user is not authorized', () => {
      return request(server)
        .get(BASE_URL)
        .set('Authorization', userToken)
        .expect(403);
    });

    it('returns list of users', () => {
      return request(server)
        .get(BASE_URL)
        .set('Authorization', adminToken)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBeGreaterThan(0);
          const admin = body.find((it) => it.email === credentials.admin.email);
          expect(admin).not.toBeNull();
        });
    });
  });

  describe(`GET ${BASE_URL}/:id`, () => {
    it('returns 401 when user is not authenticated', async () => {
      const { id } = await em.findOne(User, { email: credentials.admin.email });
      return request(server).get(`${BASE_URL}/${id}`).expect(401);
    });

    it('returns 403 when user is not authorized', async () => {
      const { id } = await em.findOne(User, { email: credentials.admin.email });
      return request(server)
        .get(`${BASE_URL}/${id}`)
        .set('Authorization', userToken)
        .expect(403);
    });

    it('returns a user', async () => {
      const { id } = await em.findOne(User, { email: credentials.admin.email });
      return request(server)
        .get(`${BASE_URL}/${id}`)
        .set('Authorization', adminToken)
        .expect(200)
        .then(({ body }) => {
          expect(body.email).toBe(credentials.admin.email);
        });
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it('returns 401 when user is not authenticated', () => {
      return request(server).post(BASE_URL).send(fakeUser).expect(401);
    });

    it('returns 403 when user is not authorized', () => {
      return request(server)
        .post(BASE_URL)
        .send(fakeUser)
        .set('Authorization', userToken)
        .expect(403);
    });

    it('creates new user', async () => {
      return request(server)
        .post(BASE_URL)
        .send(fakeUser)
        .set('Authorization', adminToken)
        .expect(201)
        .then(async () => {
          const user = await em.findOne(User, { email: fakeUser.email });
          expect(user).not.toBeNull();
        });
    });
  });

  describe(`DELETE ${BASE_URL}/:id`, () => {
    it('returns 401 when user is not authenticated', async () => {
      const { id } = await em.findOne(User, { email: credentials.admin.email });
      return request(server).delete(`${BASE_URL}/${id}`).expect(401);
    });

    it('returns 403 when user is not authorized', async () => {
      const { id } = await em.findOne(User, { email: credentials.admin.email });
      return request(server)
        .delete(`${BASE_URL}/${id}`)
        .set('Authorization', userToken)
        .expect(403);
    });

    it('returns 404 when user does not exist', async () => {
      return request(server)
        .delete(`${BASE_URL}/0`)
        .set('Authorization', adminToken)
        .expect(404);
    });

    it('deletes user', async () => {
      const user = await em.findOne(User, { email: fakeUser.email });
      return request(server)
        .delete(`${BASE_URL}/${user.id}`)
        .set('Authorization', adminToken)
        .expect(204)
        .then(async () => {
          const user = await em.findOne(User, { email: fakeUser.email });
          expect(user).toBeNull();
        });
    });
  });

  afterAll(() => app.close());
});
