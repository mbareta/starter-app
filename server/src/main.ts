import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from './middleware/request-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
