import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ResponseTimeMiddleware } from '@nest-middlewares/response-time';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'TODO',
      signOptions: { expiresIn: 3600000 } // TODO
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseTimeMiddleware).forRoutes('*');
  }
}
