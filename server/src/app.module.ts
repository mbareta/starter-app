import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';
import { ResponseTimeMiddleware } from '@nest-middlewares/response-time';
import { UsersModule } from './users/users.module';
import { CourseAssistantModule } from './course-assistant/course-assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CoursesModule,
    DatabaseModule,
    UsersModule,
    CourseAssistantModule
  ],
  providers: [AuthGuard, { provide: APP_GUARD, useExisting: AuthGuard }],
  controllers: [HealthController]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseTimeMiddleware).forRoutes('*');
  }
}
