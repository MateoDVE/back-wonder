import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UsuariosService } from './modules/usuarios/usuarios.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    ...(process.env.FRONTEND_URL ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ];

  app.enableCors({
    origin: Array.from(new Set(allowedOrigins)),
    credentials: true,
  });

  const usuariosService = app.get(UsuariosService);
  await usuariosService.ensureInitialAdminUser();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();