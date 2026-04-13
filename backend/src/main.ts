import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // CORS configuration
  const allowedOrigins = [
    /^http:\/\/localhost:\d+$/,
    process.env.FRONTEND_URL,
    /^https:\/\/.*\.vercel\.app$/,
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}

bootstrap();
