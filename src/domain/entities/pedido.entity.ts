export class Pedido {
  id: number;
  usuario_id: number;
  total: number;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  notas?: string;
  items: Array<{
    id: number;
    producto_id: number;
    cantidad: number;
    precio: number;
  }>;
  created_at: string;
  updated_at: string;
}
