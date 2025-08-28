import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Use global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Producer service is running on port ${port}`);
}
bootstrap();
