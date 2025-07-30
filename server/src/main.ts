import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import logger from './middleware/request-logger';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const configService: ConfigService = new ConfigService();
  const origin = configService.get('ALLOW_ORIGIN');
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  app.enableCors({ origin });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
