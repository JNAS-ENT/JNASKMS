import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Prefix APIs globally
  app.setGlobalPrefix('api');

  // Register Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Register Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Setup Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('AI Knowledge OS - Backend')
    .setDescription('Enterprise NestJS API for AI Knowledge Operating System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Server is running on http://localhost:${port}/api`);
  logger.log(`Swagger documentation is available at http://localhost:${port}/docs`);
}

bootstrap();
