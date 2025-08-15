// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API documentation')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Enable automatic validation using class-validator
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  

  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: true, // optional, if you need cookies or authorization headers
  });


  await app.listen(3000);

  setInterval(async () => {
    try {
      const res = await fetch("https://nest-backend-4z6f.onrender.com/");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      console.log(`[KeepAlive] Pinged at ${new Date().toISOString()}`);
    } catch (err: any) {
      console.error(`[KeepAlive] Failed to ping: ${err.message}`);
    }
  }, 10 * 60 * 1000); // 10 minutes
}
bootstrap();
