const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey ? supabaseKey.length : 0);

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_KEY is missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing connection to Supabase...');
  console.time('fetch');
  try {
    const { data, error } = await supabase.from('productos').select('*').limit(5);
    console.timeEnd('fetch');
    if (error) {
      console.error('Supabase query error:', error);
    } else {
      console.log('Success! Fetched products count:', data.length);
      console.log('Sample product:', data[0]);
    }
  } catch (err) {
    console.error('Exception during fetch:', err);
  }
  process.exit(0);
}

test();
