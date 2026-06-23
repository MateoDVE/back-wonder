const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: 'db.tzymbxkrlixuiyrbfigv.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '5312681Wonder.',
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  console.log("Connecting to PostgreSQL...");
  try {
    await client.connect();
    console.log("Connected successfully!");
    
    // Let's create the table
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS carrusel_imagenes (
        id SERIAL PRIMARY KEY,
        imagen_url TEXT NOT NULL,
        titulo TEXT,
        descripcion TEXT,
        link_url TEXT,
        orden INT DEFAULT 0,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
      ALTER TABLE carrusel_imagenes DISABLE ROW LEVEL SECURITY;
    `;
    console.log("Creating table...");
    await client.query(createTableSql);
    console.log("Table created successfully!");
    
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
}

run();
