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
    console.log("All paths in Supabase:");
    const rpcPaths = Object.keys(schema.paths || {}).filter(p => p.startsWith('/rpc/'));
    console.log(rpcPaths);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

run();
