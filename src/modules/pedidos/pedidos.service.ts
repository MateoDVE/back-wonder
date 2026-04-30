import { Injectable } from '@nestjs/common';
import { Pedido } from '../../domain/entities/pedido.entity';
import { CrearPedidoDto, ActualizarEstadoPedidoDto } from '../../application/dto/pedido.dto';

@Injectable()
export class PedidosService {
  // En una aplicación real, esto se conectaría con una base de datos

  private pedidos: Map<number, Pedido> = new Map();
  private nextId = 1;

  async crearPedido(dto: CrearPedidoDto): Promise<Pedido> {
    const pedido: Pedido = {
      id: this.nextId++,
      usuario_id: dto.usuario_id,
      total: dto.total,
      estado: 'pendiente',
      notas: dto.notas,
      items: dto.items.map((item, idx) => ({
        id: idx + 1,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.pedidos.set(pedido.id, pedido);
    return pedido;
  }

  async obtenerPedido(id: number): Promise<Pedido> {
    const pedido = this.pedidos.get(id);
    if (!pedido) {
      throw new Error(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async obtenerPedidosDeUsuario(usuarioId: number): Promise<Pedido[]> {
    return Array.from(this.pedidos.values()).filter(
      p => p.usuario_id === usuarioId,
    );
  }

  async actualizarEstado(
    id: number,
    dto: ActualizarEstadoPedidoDto,
  ): Promise<Pedido> {
    const pedido = this.pedidos.get(id);
    if (!pedido) {
      throw new Error(`Pedido con ID ${id} no encontrado`);
    }

    pedido.estado = dto.estado;
    pedido.updated_at = new Date().toISOString();
    this.pedidos.set(id, pedido);
    return pedido;
  }

  async obtenerTodosPedidos(): Promise<Pedido[]> {
    return Array.from(this.pedidos.values());
  }
}
