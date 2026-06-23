import { Module } from '@nestjs/common';
import { CarruselService } from './carrusel.service';
import { CarruselController } from './carrusel.controller';

@Module({
  controllers: [CarruselController],
  providers: [CarruselService],
  exports: [CarruselService],
})
export class CarruselModule {}
