import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Use Validation Pipe for DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : (process.env.NODE_ENV === 'production' ? 3000 : 3001);

  // Serve frontend static assets in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../../../dist');
    app.use(express.static(distPath));
    
    // Redirect non-API requests to index.html for SPA fallback
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        next();
      }
    });
  }

  await app.listen(port, '0.0.0.0');
  console.log(`NestJS Backend running on http://0.0.0.0:${port}`);
}
bootstrap();
