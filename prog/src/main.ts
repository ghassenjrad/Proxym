import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow multiple development origins (adjust for production)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://192.168.56.1:3000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
