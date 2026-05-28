require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

async function run() {
  const url = `${supabaseUrl}/rest/v1/`;
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    const schema = await res.json();
    if (schema.definitions) {
      console.log("\n--- 'orden_historial' definition ---");
      console.log(JSON.stringify(schema.definitions.orden_historial.properties, null, 2));
      
      console.log("\n--- 'ordenes' definition ---");
      console.log(JSON.stringify(schema.definitions.ordenes.properties, null, 2));
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

run();
