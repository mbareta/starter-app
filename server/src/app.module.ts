import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from 'health.controller';
import { JwtModule } from '@nestjs/jwt';
import { ResponseTimeMiddleware } from '@nest-middlewares/response-time';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION }
    }),
    AuthModule,
    CoursesModule,
    DatabaseModule,
    UsersModule
  ],
  providers: [AuthGuard, { provide: APP_GUARD, useExisting: AuthGuard }],
  controllers: [HealthController]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseTimeMiddleware).forRoutes('*');
  }
}
