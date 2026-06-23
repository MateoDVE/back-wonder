export interface CarruselImagen {
  id: number;
  imagen_url: string;
  titulo?: string;
  descripcion?: string;
  link_url?: string;
  orden: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}
