import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUrl()
  imagen_url?: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}

export class UpdateCategoriaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUrl()
  imagen_url?: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
