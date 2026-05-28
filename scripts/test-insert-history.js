require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Creating a test order in 'ordenes' first...");
  
  // 1. Get a valid user
  const { data: users, error: userError } = await supabase.from('usuarios').select('id').limit(1);
  if (userError || !users.length) {
    console.error("No users found to link the order:", userError);
    return;
  }
  const userId = users[0].id;
  console.log("Using user ID:", userId);

  // 2. Create order
  const { data: order, error: orderError } = await supabase
    .from('ordenes')
    .insert({
      usuario_id: userId,
      numero_orden: `TEST-${Date.now()}`,
      nombre_envio: 'Test User',
      telefono_envio: '12345678',
      direccion_envio: 'Test Address',
      ciudad_envio: 'Test City',
      departamento_envio: 'Test Dept',
      codigo_postal_envio: '0000',
      subtotal: 100,
      total: 100,
      estado: 'pendiente',
      metodo_pago: 'Test',
      notas: 'Test order for debugging history',
    })
    .select()
    .single();

  if (orderError) {
    console.error("Failed to create order:", orderError);
    return;
  }

  const orderId = order.id;
  console.log("Order created successfully with ID:", orderId);

  // 3. Insert into orden_historial
  console.log("Inserting into 'orden_historial'...");
  const { data: history, error: historyError } = await supabase
    .from('orden_historial')
    .insert({
      orden_id: orderId,
      estado_anterior: null,
      estado_nuevo: 'pendiente',
      comentario: 'Test history log',
    })
    .select();

  if (historyError) {
    console.error("--- ERROR INSERTING INTO ORDEN_HISTORIAL ---");
    console.error(historyError);
  } else {
    console.log("--- SUCCESS ---");
    console.log(history);
  }

  // Cleanup test order
  console.log("Cleaning up test order...");
  await supabase.from('ordenes').delete().eq('id', orderId);
}

test();
