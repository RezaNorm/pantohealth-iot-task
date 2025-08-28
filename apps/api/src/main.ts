import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from './api.module';
import { GlobalExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  
  // Enable CORS for cross-origin requests
  app.enableCors();
  
  // Set global prefix for API routes
  app.setGlobalPrefix('api');
  
  // Use global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('X-Ray IoT Data Processing API')
    .setDescription('API for processing and managing x-ray data from IoT devices')
    .setVersion('1.0')
    .addTag('Signals', 'X-ray signal management endpoints')
    .addTag('Producer', 'IoT device simulation endpoints')
    .addTag('Consumer', 'Message processing endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'X-Ray IoT API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API server is running on port ${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
