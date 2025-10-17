// Test MongoDB Connection Script
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://samyukthaselvaraj24cse_db_user:Samyu2006@cluster0.vnwxe2v.mongodb.net/localaid?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔄 Testing MongoDB Connection...');
console.log('📍 Connection String:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 second timeout
})
.then(async () => {
  console.log('\n✅ MongoDB Connected Successfully!');
  console.log('📊 Database Name:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
  
  // List all collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\n📁 Collections in database:');
  if (collections.length === 0) {
    console.log('   (No collections yet - they will be created when you add data)');
  } else {
    collections.forEach(coll => {
      console.log(`   - ${coll.name}`);
    });
  }
  
  // Test write operation
  console.log('\n🧪 Testing write operation...');
  const testData = {
    test: true,
    timestamp: new Date(),
    message: 'Connection test successful!'
  };
  
  await mongoose.connection.db.collection('test').insertOne(testData);
  console.log('✅ Write test successful!');
  
  // Clean up test data
  await mongoose.connection.db.collection('test').deleteOne({ test: true });
  console.log('🧹 Cleaned up test data');
  
  console.log('\n🎉 Your database is working perfectly!');
  console.log('✅ You can now run your backend server');
  
})
.catch(err => {
  console.error('\n❌ MongoDB Connection Failed!');
  console.error('Error:', err.message);
  
  if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
    console.error('\n💡 Possible issues:');
    console.error('1. Check your internet connection');
    console.error('2. Verify the cluster URL is correct');
  } else if (err.message.includes('Authentication failed')) {
    console.error('\n💡 Authentication issue:');
    console.error('1. Check your username and password in MongoDB Atlas');
    console.error('2. Make sure the user has read/write permissions');
  } else if (err.message.includes('IP') || err.message.includes('not allowed')) {
    console.error('\n💡 Network access issue:');
    console.error('1. Go to MongoDB Atlas → Network Access');
    console.error('2. Add your IP address or allow access from anywhere (0.0.0.0/0)');
  }
})
.finally(() => {
  mongoose.connection.close();
  setTimeout(() => process.exit(0), 1000);
});
