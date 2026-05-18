import 'reflect-metadata';
import express from 'express';
import serverless from 'serverless-http';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UsuariosService } from '../src/modules/usuarios/usuarios.service';

const server = express();
let cachedHandler: ReturnType<typeof serverless> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

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

  await app.init();

  if (process.env.VERCEL !== '1') {
    void usuariosService.ensureInitialAdminUser().catch(() => undefined);
  }

  return serverless(server);
}

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }

  return cachedHandler(req, res);
}
