import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateCarruselImagenDto {
  @IsString()
  imagen_url: string;

  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  link_url?: string;

  @IsNumber()
  @IsOptional()
  orden?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpdateCarruselImagenDto {
  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  link_url?: string;

  @IsNumber()
  @IsOptional()
  orden?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
