const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  neighborhood: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    postalCode: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  verified: {
    type: Boolean,
    default: true
  },
  karma: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String,
    enum: ['Verified Neighbor', 'Top Helper', 'Community Elder', 'Emergency Responder', 'Kind Heart']
  }],
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  helpedCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate avatar based on name
userSchema.methods.generateAvatar = function() {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(this.name)}`;
};

module.exports = mongoose.model('User', userSchema);
