import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CrearPedidoDto, ActualizarEstadoPedidoDto } from '../../application/dto/pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  async crearPedido(@Body() crearPedidoDto: CrearPedidoDto) {
    return await this.pedidosService.crearPedido(crearPedidoDto);
  }

  @Get()
  async obtenerTodosPedidos() {
    return await this.pedidosService.obtenerTodosPedidos();
  }

  @Get('usuario/:usuarioId')
  async obtenerPedidosDeUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return await this.pedidosService.obtenerPedidosDeUsuario(usuarioId);
  }

  @Get(':id')
  async obtenerPedido(@Param('id', ParseIntPipe) id: number) {
    return await this.pedidosService.obtenerPedido(id);
  }

  @Put(':id/estado')
  async actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarEstadoDto: ActualizarEstadoPedidoDto,
  ) {
    return await this.pedidosService.actualizarEstado(id, actualizarEstadoDto);
  }
}
