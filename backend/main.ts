import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // WebSockets
  app.useWebSocketAdapter(new IoAdapter(app));

  // CORS para Next.js frontend
app.enableCors({
  origin: 'https://municipalidad-la-perla-production.up.railway.app',
  credentials: true,
});

  // Prefijo global de la API
  app.setGlobalPrefix('api');

  console.log('PORT=', process.env.PORT);
console.log('DATABASE_URL=', !!process.env.DATABASE_URL);

  await app.listen(process.env.PORT || 4000);
  console.log(`🚀 Backend corriendo en http://localhost:${process.env.PORT || 4000}`);
}
bootstrap();
