import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { AgregarItemCarritoDto, ActualizarCantidadDto } from '../../application/dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post(':usuarioId')
  agregarItem(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body() agregarItemDto: AgregarItemCarritoDto,
  ) {
    return this.carritoService.agregarItem(usuarioId, agregarItemDto);
  }

  @Get(':usuarioId')
  obtenerCarrito(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.carritoService.obtenerCarrito(usuarioId);
  }

  @Get('item/:id')
  obtenerItem(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.obtenerItem(id);
  }

  @Put('item/:id')
  actualizarCantidad(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarCantidadDto: ActualizarCantidadDto,
  ) {
    return this.carritoService.actualizarCantidad(id, actualizarCantidadDto);
  }

  @Delete('item/:id')
  eliminarItem(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.eliminarItem(id);
  }

  @Delete(':usuarioId')
  vaciarCarrito(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.carritoService.vaciarCarrito(usuarioId);
  }
}
