import { db } from './src/db';
import { users, posts } from './src/schema';

async function testOrm() {
  console.log('Testing Drizzle ORM...');
  
  try {
    // 创建用户
    const newUser = await db.insert(users).values({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
    }).returning();
    
    console.log('✅ Created user:', newUser[0]);
    
    // 创建帖子
    const newPost = await db.insert(posts).values({
      title: 'Hello World',
      content: 'This is my first post!',
      authorId: newUser[0].id,
      published: true,
    }).returning();
    
    console.log('✅ Created post:', newPost[0]);
    
    // 查询用户
    const user = await db.select().from(users).where(users.id.eq(newUser[0].id));
    console.log('✅ Retrieved user:', user[0]);
    
    // 查询帖子
    const userPosts = await db.select().from(posts).where(posts.authorId.eq(newUser[0].id));
    console.log('✅ Retrieved posts:', userPosts);
    
    console.log('\n🎉 All ORM operations completed successfully!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testOrm();
