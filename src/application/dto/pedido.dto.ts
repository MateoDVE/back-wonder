import { IsNumber, IsOptional, IsString, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearPedidoItemDto {
  @IsNumber()
  producto_id: number;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precio: number;
}

export class CrearPedidoDto {
  @IsString()
  usuario_id: string;

  @IsNumber()
  @Min(0)
  total: number;

  @ValidateNested({ each: true })
  @Type(() => CrearPedidoItemDto)
  @ArrayMinSize(1)
  items: CrearPedidoItemDto[];

  @IsOptional()
  @IsString()
  notas?: string;
}

export class ActualizarEstadoPedidoDto {
  @IsString()
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
}
