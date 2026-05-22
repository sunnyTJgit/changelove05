import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testPgDirect() {
  console.log('Testing direct pg client...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    
    console.log('Querying users table...');
    const result = await client.query('SELECT * FROM users');
    console.log('✅ Query result:', result.rows);
    
    client.release();
    await pool.end();
    console.log('\n🎉 Direct pg client test completed successfully!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

testPgDirect();
