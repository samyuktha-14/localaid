const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const User = require('../models/User');
const { auth, verifiedOnly } = require('../middleware/auth');

// Create emergency alert
router.post('/alert', auth, verifiedOnly, async (req, res) => {
  try {
    const { type, message, location } = req.body;

    if (!location?.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ error: 'Valid location coordinates required' });
    }

    const emergency = new Emergency({
      user: req.userId,
      type,
      message,
      neighborhood: req.user.neighborhood,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      }
    });

    await emergency.save();
    await emergency.populate('user', 'name avatar phone address');

    // Broadcast to neighborhood via Socket.IO
    const io = req.app.get('io');
    io.to(req.user.neighborhood).emit('new-emergency', {
      emergency,
      timestamp: new Date()
    });

    res.status(201).json({
      message: 'Emergency alert sent to neighborhood',
      emergency
    });
  } catch (error) {
    console.error('Create emergency error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get active emergencies in neighborhood
router.get('/neighborhood/:neighborhood', auth, async (req, res) => {
  try {
    const { neighborhood } = req.params;

    const emergencies = await Emergency.find({
      neighborhood,
      status: 'active',
      expiresAt: { $gt: new Date() }
    })
      .populate('user', 'name avatar phone address')
      .populate('responders.user', 'name avatar phone')
      .sort({ createdAt: -1 });

    res.json({ emergencies });
  } catch (error) {
    console.error('Get emergencies error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get nearby emergencies
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lng, lat, maxDistance = 3000 } = req.query; // 3km default

    if (!lng || !lat) {
      return res.status(400).json({ error: 'Coordinates required' });
    }

    const emergencies = await Emergency.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: 'active',
      expiresAt: { $gt: new Date() }
    })
      .populate('user', 'name avatar phone address')
      .populate('responders.user', 'name avatar phone')
      .limit(20);

    res.json({ emergencies });
  } catch (error) {
    console.error('Get nearby emergencies error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Respond to emergency
router.post('/:emergencyId/respond', auth, verifiedOnly, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.emergencyId);

    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }

    if (emergency.status !== 'active') {
      return res.status(400).json({ error: 'Emergency is not active' });
    }

    if (new Date() > emergency.expiresAt) {
      emergency.status = 'expired';
      await emergency.save();
      return res.status(400).json({ error: 'Emergency has expired' });
    }

    // Check if already responded
    const alreadyResponded = emergency.responders.some(
      r => r.user.toString() === req.userId.toString()
    );

    if (alreadyResponded) {
      return res.status(400).json({ error: 'Already responded to this emergency' });
    }

    emergency.responders.push({
      user: req.userId
    });

    await emergency.save();
    await emergency.populate('user', 'name avatar phone address');
    await emergency.populate('responders.user', 'name avatar phone');

    // Award karma for emergency response
    const responder = await User.findById(req.userId);
    responder.karma += 20; // Higher karma for emergency help
    
    if (!responder.badges.includes('Emergency Responder')) {
      responder.badges.push('Emergency Responder');
    }

    await responder.save();

    // Notify emergency creator via Socket.IO
    const io = req.app.get('io');
    io.to(emergency.neighborhood).emit('emergency-response', {
      emergencyId: emergency._id,
      responder: {
        id: req.userId,
        name: req.user.name,
        avatar: req.user.avatar
      }
    });

    res.json({
      message: 'Response recorded. Stay safe!',
      emergency
    });
  } catch (error) {
    console.error('Respond to emergency error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Resolve emergency
router.post('/:emergencyId/resolve', auth, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.emergencyId);

    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }

    // Only emergency creator can resolve
    if (emergency.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Only emergency creator can resolve' });
    }

    emergency.status = 'resolved';
    emergency.resolvedAt = new Date();

    await emergency.save();

    // Notify via Socket.IO
    const io = req.app.get('io');
    io.to(emergency.neighborhood).emit('emergency-resolved', {
      emergencyId: emergency._id
    });

    res.json({
      message: 'Emergency resolved',
      emergency
    });
  } catch (error) {
    console.error('Resolve emergency error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single emergency
router.get('/:emergencyId', auth, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.emergencyId)
      .populate('user', 'name avatar phone address')
      .populate('responders.user', 'name avatar phone');

    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }

    res.json({ emergency });
  } catch (error) {
    console.error('Get emergency error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
