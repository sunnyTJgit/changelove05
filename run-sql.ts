import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function runSql() {
  console.log('Reading migration file...');
  
  const sqlContent = fs.readFileSync('./drizzle/0000_tough_hellion.sql', 'utf-8');
  console.log('SQL content loaded successfully');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
  });

  try {
    const client = await pool.connect();
    client.queryTimeout = 60000;
    
    console.log('Executing SQL statements...');
    const statements = sqlContent.split('--> statement-breakpoint');
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}...`);
        await client.query(statement);
        console.log(`Statement ${i + 1} executed successfully`);
      }
    }
    
    client.release();
    await pool.end();
    console.log('✅ All SQL statements executed successfully!');
  } catch (error: any) {
    console.error('❌ SQL execution failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

runSql();
