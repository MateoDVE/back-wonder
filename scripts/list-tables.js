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
    console.log("All tables in Supabase definitions:", Object.keys(schema.definitions || {}));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

run();
