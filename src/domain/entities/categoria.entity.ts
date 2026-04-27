export class Categoria {
  id: number;

  nombre: string;

  descripcion?: string;

  imagen_url?: string;

  activa: boolean;

  created_at: Date;

  updated_at: Date;

  productos?: any[];
}
