import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

dotenv.config({ path: '.env.local' });

async function runMigration() {
  console.log('Starting database migration...');
  console.log('Connecting to:', process.env.DATABASE_URL);
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Step 1: Getting client from pool...');
    const client = await pool.connect();
    
    console.log('Step 2: Testing connection...');
    const result = await client.query('SELECT NOW()');
    console.log('Connection test successful. Current time:', result.rows[0].now);
    
    client.release();
    
    console.log('Step 3: Creating drizzle instance...');
    const db = drizzle(pool);
    
    console.log('Step 4: Running migration...');
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('✅ Migration completed successfully!');
    await pool.end();
  } catch (error: any) {
    console.error('❌ Migration failed at step:', error.message);
    console.error('Full error:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
