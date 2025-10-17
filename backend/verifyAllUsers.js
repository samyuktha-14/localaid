// Quick script to verify all existing users in the database
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://samyukthaselvaraj24cse_db_user:Samyu2006@cluster0.vnwxe2v.mongodb.net/localaid?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB Connected');
  
  try {
    // Update all unverified users
    const result = await User.updateMany(
      { verified: false },
      { 
        $set: { verified: true },
        $addToSet: { badges: "Verified Neighbor" }
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} users`);
    console.log('All users are now verified!');
    
    // Show all users
    const users = await User.find({}).select('name email verified badges');
    console.log('\nAll users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}): verified=${user.verified}, badges=${user.badges.join(', ')}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});
