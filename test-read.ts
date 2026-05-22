import { db } from './src/db';
import { users } from './src/schema';

async function testRead() {
  console.log('Testing Drizzle ORM read operation...');
  
  try {
    // 只查询用户，不进行写入
    const allUsers = await db.select().from(users);
    console.log('✅ Retrieved users:', allUsers);
    
    console.log('\n🎉 Read operation completed successfully!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testRead();
