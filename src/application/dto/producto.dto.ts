import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUrl,
  IsDecimal,
  IsInt,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  categoria_id: number;

  @IsOptional()
  @IsNumber()
  precio_costo?: number;

  @IsNumber()
  precio_venta: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  stock_minimo?: number;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsNumber()
  gradacion_alcoholica?: number;

  @IsOptional()
  @IsInt()
  volumen_ml?: number;

  @IsOptional()
  @IsString()
  tipo_bebida?: string;

  @IsOptional()
  @IsString()
  pais_origen?: string;

  @IsOptional()
  @IsUrl()
  imagen_url?: string;

  @IsOptional()
  @IsString()
  imagenes_adicionales?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;
}

export class UpdateProductoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  categoria_id?: number;

  @IsOptional()
  @IsNumber()
  precio_costo?: number;

  @IsOptional()
  @IsNumber()
  precio_venta?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  stock_minimo?: number;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsNumber()
  gradacion_alcoholica?: number;

  @IsOptional()
  @IsInt()
  volumen_ml?: number;

  @IsOptional()
  @IsString()
  tipo_bebida?: string;

  @IsOptional()
  @IsString()
  pais_origen?: string;

  @IsOptional()
  @IsUrl()
  imagen_url?: string;

  @IsOptional()
  @IsString()
  imagenes_adicionales?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;
}
