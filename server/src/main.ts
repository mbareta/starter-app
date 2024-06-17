import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from './middleware/request-logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
