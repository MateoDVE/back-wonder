import { Injectable } from '@nestjs/common';
import { CarritoItem } from '../../domain/entities/carrito.entity';
import { AgregarItemCarritoDto, ActualizarCantidadDto } from '../../application/dto';
import {
  AgregarItemAlCarritoUseCase,
  ObtenerCarritoDeUsuarioUseCase,
  ObtenerItemDelCarritoUseCase,
  ActualizarCantidadItemUseCase,
  EliminarItemDelCarritoUseCase,
  VaciarCarritoUseCase,
} from '../../domain/use-cases';

@Injectable()
export class CarritoService {
  constructor(
    private readonly agregarItemAlCarritoUseCase: AgregarItemAlCarritoUseCase,
    private readonly obtenerCarritoDeUsuarioUseCase: ObtenerCarritoDeUsuarioUseCase,
    private readonly obtenerItemDelCarritoUseCase: ObtenerItemDelCarritoUseCase,
    private readonly actualizarCantidadItemUseCase: ActualizarCantidadItemUseCase,
    private readonly eliminarItemDelCarritoUseCase: EliminarItemDelCarritoUseCase,
    private readonly vaciarCarritoUseCase: VaciarCarritoUseCase,
  ) {}

  async agregarItem(usuarioId: string, dto: AgregarItemCarritoDto): Promise<CarritoItem> {
    return await this.agregarItemAlCarritoUseCase.execute({
      usuario_id: usuarioId,
      producto_id: dto.producto_id,
      cantidad: dto.cantidad,
      precio_unitario: dto.precio_unitario,
    });
  }

  async obtenerCarrito(usuarioId: string): Promise<CarritoItem[]> {
    return await this.obtenerCarritoDeUsuarioUseCase.execute(usuarioId);
  }

  async obtenerItem(id: number): Promise<CarritoItem> {
    return await this.obtenerItemDelCarritoUseCase.execute(id);
  }

  async actualizarCantidad(id: number, dto: ActualizarCantidadDto): Promise<CarritoItem> {
    return await this.actualizarCantidadItemUseCase.execute(id, dto.cantidad);
  }

  async eliminarItem(id: number): Promise<void> {
    return await this.eliminarItemDelCarritoUseCase.execute(id);
  }

  async vaciarCarrito(usuarioId: string): Promise<void> {
    return await this.vaciarCarritoUseCase.execute(usuarioId);
  }
}
