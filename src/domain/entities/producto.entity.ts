export class Producto {
  id: number;

  nombre: string;

  descripcion?: string;

  categoria_id: number;

  precio_costo?: number;

  precio_venta: number;

  stock: number;

  stock_minimo: number;

  marca?: string;

  gradacion_alcoholica?: number;

  volumen_ml?: number;

  tipo_bebida?: string;

  pais_origen?: string;

  imagen_url?: string;

  imagenes_adicionales?: string;

  activo: boolean;

  destacado: boolean;

  created_at: Date;

  updated_at: Date;

  categoria?: any;
}
