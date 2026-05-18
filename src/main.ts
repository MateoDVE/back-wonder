import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { UsuariosService } from './modules/usuarios/usuarios.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
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
  try {
    await usuariosService.ensureInitialAdminUser();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn(`No se pudo inicializar el usuario admin al arrancar. El servidor continuará iniciando. ${message}`);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();