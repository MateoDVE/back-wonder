import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CarruselService } from './carrusel.service';
import { CreateCarruselImagenDto, UpdateCarruselImagenDto } from './carrusel.dto';
import { AdminGuard } from '../../infrastructure/guards';

@Controller('carrusel')
export class CarruselController {
  constructor(private readonly carruselService: CarruselService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateCarruselImagenDto) {
    return this.carruselService.create(dto);
  }

  @Get()
  findAll(@Query('activo') activo?: string) {
    const onlyActive = activo === 'true';
    return this.carruselService.findAll(onlyActive);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carruselService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCarruselImagenDto,
  ) {
    return this.carruselService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carruselService.remove(id);
  }
}
