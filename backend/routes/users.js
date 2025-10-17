const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Rating = require('../models/Rating');
const { auth } = require('../middleware/auth');

// Get user profile
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -verificationOTP');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address, neighborhood } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (neighborhood) updates.neighborhood = neighborhood;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard for neighborhood
router.get('/leaderboard/:neighborhood', auth, async (req, res) => {
  try {
    const { neighborhood } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const leaders = await User.find({ 
      neighborhood,
      verified: true 
    })
      .select('name karma helpedCount badges avatar')
      .sort({ karma: -1 })
      .limit(limit);

    res.json({ leaders });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user ratings
router.get('/ratings/:userId', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUser: req.params.userId })
      .populate('ratedBy', 'name avatar')
      .populate('post', 'title category')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ ratings });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
