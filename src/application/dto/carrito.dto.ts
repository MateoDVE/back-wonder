import { IsInt, IsNumber, Min } from 'class-validator';

export class AgregarItemCarritoDto {
  @IsInt()
  @Min(1)
  producto_id: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precio_unitario: number;
}

export class ActualizarCantidadDto {
  @IsInt()
  @Min(1)
  cantidad: number;
}
