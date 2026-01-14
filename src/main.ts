import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.use('/temp-uploads', express.static(join(__dirname, '..', 'temp-uploads'))); 
  console.log('Serving uploads from:', join(__dirname, '..', 'temp-uploads'));

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: true,
  }); 

  // Enable automatic validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // ✅ Stripe webhook: raw body parser
  app.use('/payment/webhook', bodyParser.raw({ type: 'application/json' }));


  // Only the Calendly webhook route should use raw body
  app.use('/webhooks/calendly', bodyParser.raw({ type: 'application/json' }));

  // ✅ Prefix all routes with /api
  // app.setGlobalPrefix('api');

  // Swagger setup at /api-docs (outside /api prefix)
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API documentation')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('/api-docs', app, document); // accessible at /api-docs

  await app.listen(3000);
}
bootstrap();
