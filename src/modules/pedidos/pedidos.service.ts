import { Injectable } from '@nestjs/common';
import { Pedido } from '../../domain/entities/pedido.entity';
import { CrearPedidoDto, ActualizarEstadoPedidoDto } from '../../application/dto/pedido.dto';
import { supabase } from '../../infrastructure/supabase/supabase.client';

@Injectable()
export class PedidosService {
  async crearPedido(dto: CrearPedidoDto): Promise<Pedido> {
    const numero_orden = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Obtener información del usuario para rellenar los datos de envío obligatorios
    const { data: userData } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', dto.usuario_id)
      .single();

    const nombreCompleto = userData 
      ? `${userData.nombre || ''} ${userData.apellido || ''}`.trim() 
      : '';
    
    // Insertar orden principal
    const { data: orderData, error: orderError } = await supabase
      .from('ordenes')
      .insert({
        usuario_id: dto.usuario_id,
        numero_orden,
        nombre_envio: nombreCompleto || 'Cliente Invitado',
        telefono_envio: userData?.telefono || '00000000',
        direccion_envio: userData?.direccion || 'Recogida en tienda / Sin dirección',
        ciudad_envio: userData?.ciudad || 'Cochabamba',
        departamento_envio: userData?.departamento || 'Cochabamba',
        codigo_postal_envio: userData?.codigo_postal || '0000',
        subtotal: dto.total,
        total: dto.total,
        estado: 'pendiente',
        metodo_pago: 'WhatsApp',
        notas: dto.notas || '',
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Error al crear la orden en base de datos: ${orderError.message}`);
    }

    const orderId = orderData.id;

    // Obtener nombres de productos para guardarlos en orden_items
    const productIds = dto.items.map(item => item.producto_id);
    const { data: products } = await supabase
      .from('productos')
      .select('id, nombre')
      .in('id', productIds);

    const productMap = new Map(products?.map(p => [p.id, p.nombre]) || []);

    // Preparar e insertar items de la orden
    const itemsToInsert = dto.items.map(item => ({
      orden_id: orderId,
      producto_id: item.producto_id,
      nombre_producto: productMap.get(item.producto_id) || 'Producto',
      cantidad: item.cantidad,
      precio_unitario: item.precio,
      subtotal: item.precio * item.cantidad,
    }));

    const { error: itemsError } = await supabase
      .from('orden_items')
      .insert(itemsToInsert);

    if (itemsError) {
      // Limpiar la orden creada si los detalles fallan para mantener consistencia
      await supabase.from('ordenes').delete().eq('id', orderId);
      throw new Error(`Error al registrar los detalles del pedido: ${itemsError.message}`);
    }

    // Registrar historial inicial del pedido
    const { error: historyError } = await supabase
      .from('orden_historial')
      .insert({
        orden_id: orderId,
        estado_anterior: null,
        estado_nuevo: 'pendiente',
        comentario: 'Pedido creado e iniciado por el cliente',
      });

    if (historyError) {
      console.error('[PedidosService] Error al insertar en orden_historial:', historyError);
      throw new Error(`Error al registrar el historial del pedido: ${historyError.message}`);
    }

    return {
      id: orderId,
      usuario_id: orderData.usuario_id,
      total: orderData.total,
      estado: orderData.estado as any,
      notas: orderData.notas,
      items: itemsToInsert.map((item, idx) => ({
        id: idx + 1,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.precio_unitario,
      })),
      created_at: orderData.created_at,
      updated_at: orderData.updated_at,
    };
  }

  async obtenerPedido(id: number): Promise<Pedido> {
    const { data: order, error } = await supabase
      .from('ordenes')
      .select('*, items:orden_items(*)')
      .eq('id', id)
      .single();

    if (error || !order) {
      throw new Error(`Pedido con ID ${id} no encontrado`);
    }

    return {
      id: order.id,
      usuario_id: order.usuario_id,
      total: order.total,
      estado: order.estado,
      notas: order.notas,
      items: (order.items || []).map((item: any) => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.precio_unitario,
      })),
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }

  async obtenerPedidosDeUsuario(usuarioId: string): Promise<Pedido[]> {
    const { data: orders, error } = await supabase
      .from('ordenes')
      .select('*, items:orden_items(*)')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }

    return (orders || []).map((order: any) => ({
      id: order.id,
      usuario_id: order.usuario_id,
      total: order.total,
      estado: order.estado,
      notas: order.notas,
      items: (order.items || []).map((item: any) => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.precio_unitario,
      })),
      created_at: order.created_at,
      updated_at: order.updated_at,
    }));
  }

  async actualizarEstado(
    id: number,
    dto: ActualizarEstadoPedidoDto,
  ): Promise<Pedido> {
    // Obtener estado anterior
    const { data: currentOrder } = await supabase
      .from('ordenes')
      .select('estado')
      .eq('id', id)
      .single();

    const { data: order, error } = await supabase
      .from('ordenes')
      .update({ estado: dto.estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, items:orden_items(*)')
      .single();

    if (error || !order) {
      throw new Error(`Pedido con ID ${id} no encontrado`);
    }

    // Insertar registro de cambio de estado en el historial
    if (currentOrder && currentOrder.estado !== dto.estado) {
      const { error: historyError } = await supabase
        .from('orden_historial')
        .insert({
          orden_id: id,
          estado_anterior: currentOrder.estado,
          estado_nuevo: dto.estado,
          comentario: `Estado del pedido cambiado a: ${dto.estado}`,
        });

      if (historyError) {
        console.error('[PedidosService] Error al insertar en orden_historial durante actualizacion:', historyError);
      }
    }

    return {
      id: order.id,
      usuario_id: order.usuario_id,
      total: order.total,
      estado: order.estado,
      notas: order.notas,
      items: (order.items || []).map((item: any) => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.precio_unitario,
      })),
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }

  async obtenerTodosPedidos(): Promise<Pedido[]> {
    const { data: orders, error } = await supabase
      .from('ordenes')
      .select('*, items:orden_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }

    return (orders || []).map((order: any) => ({
      id: order.id,
      usuario_id: order.usuario_id,
      total: order.total,
      estado: order.estado,
      notas: order.notas,
      items: (order.items || []).map((item: any) => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.precio_unitario,
      })),
      created_at: order.created_at,
      updated_at: order.updated_at,
    }));
  }
}
