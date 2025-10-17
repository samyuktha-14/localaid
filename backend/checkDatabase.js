// Check what's in the database - Posts and Users
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://samyukthaselvaraj24cse_db_user:Samyu2006@cluster0.vnwxe2v.mongodb.net/localaid?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔍 Checking database...\n');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB\n');
  
  try {
    // Check Users
    console.log('═══════════ USERS ═══════════');
    const users = await User.find({}).select('name email neighborhood verified');
    console.log(`Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Neighborhood: "${user.neighborhood}"`);
      console.log(`   Verified: ${user.verified}`);
      console.log('');
    });
    
    // Check Posts
    console.log('\n═══════════ POSTS ═══════════');
    const posts = await Post.find({})
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${posts.length} posts:\n`);
    
    if (posts.length === 0) {
      console.log('❌ NO POSTS IN DATABASE!');
      console.log('   This is why you only see your own posts after creating them.');
      console.log('   Solution: Create posts with TWO DIFFERENT users.\n');
    } else {
      posts.forEach((post, index) => {
        console.log(`${index + 1}. "${post.title}"`);
        console.log(`   Type: ${post.type === 'request' ? '🔴 REQUEST' : '🟢 OFFER'}`);
        console.log(`   Author: ${post.author?.name} (${post.author?.email})`);
        console.log(`   Neighborhood: "${post.neighborhood}"`);
        console.log(`   Status: ${post.status}`);
        console.log(`   Created: ${post.createdAt}`);
        console.log('');
      });
    }
    
    // Check for neighborhood mismatches
    console.log('\n═══════════ ANALYSIS ═══════════');
    
    const neighborhoods = [...new Set(users.map(u => u.neighborhood))];
    console.log(`\n📍 Neighborhoods in use: ${neighborhoods.join(', ')}`);
    
    if (neighborhoods.length > 1) {
      console.log('\n⚠️  WARNING: Users are in DIFFERENT neighborhoods!');
      console.log('   Posts are only visible to users in the SAME neighborhood.');
      console.log('   Make sure all test users use the exact same neighborhood name.\n');
      
      neighborhoods.forEach(neighborhood => {
        const usersInNeighborhood = users.filter(u => u.neighborhood === neighborhood);
        const postsInNeighborhood = posts.filter(p => p.neighborhood === neighborhood);
        console.log(`\n   "${neighborhood}":`);
        console.log(`   - ${usersInNeighborhood.length} users: ${usersInNeighborhood.map(u => u.name).join(', ')}`);
        console.log(`   - ${postsInNeighborhood.length} posts`);
      });
    } else if (neighborhoods.length === 1) {
      console.log(`\n✅ All users are in the same neighborhood: "${neighborhoods[0]}"`);
      console.log('   Posts should be visible to all users!');
    }
    
    // Check if posts exist but users are different
    if (posts.length > 0 && users.length > 1) {
      const uniqueAuthors = [...new Set(posts.map(p => p.author?._id?.toString()))];
      console.log(`\n📝 Posts created by ${uniqueAuthors.length} different user(s)`);
      
      if (uniqueAuthors.length === 1) {
        console.log('   ⚠️  All posts are by the SAME user!');
        console.log('   Solution: Login as a DIFFERENT user and create posts.');
      } else {
        console.log('   ✅ Posts are by multiple users - good for testing!');
      }
    }
    
    console.log('\n═══════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    process.exit(0);
  }
})
.catch(err => {
  console.error('❌ Connection Error:', err.message);
  process.exit(1);
});
