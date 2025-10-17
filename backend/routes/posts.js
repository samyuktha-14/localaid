const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { auth, verifiedOnly } = require('../middleware/auth');

// Create post
router.post('/', auth, verifiedOnly, async (req, res) => {
  try {
    const { type, category, title, description, location, urgency } = req.body;

    if (!location?.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ error: 'Valid location coordinates required' });
    }

    const post = new Post({
      author: req.userId,
      type,
      category,
      title,
      description,
      neighborhood: req.user.neighborhood,
      location: {
        type: 'Point',
        coordinates: location.coordinates // [lng, lat]
      },
      urgency: urgency || 'medium'
    });

    await post.save();
    await post.populate('author', 'name avatar karma badges');

    res.status(201).json({ 
      message: 'Post created successfully',
      post 
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get posts by neighborhood
router.get('/neighborhood/:neighborhood', auth, async (req, res) => {
  try {
    const { neighborhood } = req.params;
    const { type, category, status } = req.query;

    const filter = { neighborhood };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = { $in: ['active', 'in-progress'] };

    console.log('🔍 Fetching posts with filter:', filter);

    const posts = await Post.find(filter)
      .populate('author', 'name avatar karma badges')
      .populate('assignedTo', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`📦 Found ${posts.length} posts for neighborhood: ${neighborhood}`);
    console.log('📋 Posts:', posts.map(p => ({ 
      id: p._id, 
      title: p.title, 
      type: p.type, 
      author: p.author?.name,
      neighborhood: p.neighborhood 
    })));

    res.json({ posts });
  } catch (error) {
    console.error('❌ Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get nearby posts (geospatial query)
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters

    if (!lng || !lat) {
      return res.status(400).json({ error: 'Coordinates required' });
    }

    const posts = await Post.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: { $in: ['active', 'in-progress'] }
    })
      .populate('author', 'name avatar karma badges')
      .populate('assignedTo', 'name avatar')
      .limit(50);

    res.json({ posts });
  } catch (error) {
    console.error('Get nearby posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
router.get('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'name avatar karma badges phone')
      .populate('assignedTo', 'name avatar karma')
      .populate('responses.user', 'name avatar karma');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Respond to post
router.post('/:postId/respond', auth, verifiedOnly, async (req, res) => {
  try {
    const { message } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.status !== 'active') {
      return res.status(400).json({ error: 'Post is not active' });
    }

    post.responses.push({
      user: req.userId,
      message
    });

    await post.save();
    await post.populate('responses.user', 'name avatar karma');

    res.json({ 
      message: 'Response added',
      post 
    });
  } catch (error) {
    console.error('Respond to post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Assign post to helper
router.post('/:postId/assign/:helperId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only post author can assign
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Only post author can assign helpers' });
    }

    post.assignedTo = req.params.helperId;
    post.status = 'in-progress';

    await post.save();
    await post.populate('assignedTo', 'name avatar karma');

    res.json({ 
      message: 'Helper assigned successfully',
      post 
    });
  } catch (error) {
    console.error('Assign helper error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete post
router.post('/:postId/complete', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only author or assigned helper can mark as complete
    const canComplete = post.author.toString() === req.userId.toString() ||
                       post.assignedTo?.toString() === req.userId.toString();

    if (!canComplete) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    post.status = 'completed';
    post.completedAt = new Date();

    await post.save();

    // Award karma to helper
    if (post.assignedTo) {
      const helper = await User.findById(post.assignedTo);
      helper.karma += 10;
      helper.helpedCount += 1;

      // Award badges based on milestones
      if (helper.helpedCount >= 50 && !helper.badges.includes('Community Elder')) {
        helper.badges.push('Community Elder');
      } else if (helper.helpedCount >= 10 && !helper.badges.includes('Top Helper')) {
        helper.badges.push('Top Helper');
      }

      await helper.save();
    }

    res.json({ 
      message: 'Post marked as completed',
      post 
    });
  } catch (error) {
    console.error('Complete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Rate helper after completion (only post author can rate)
router.post('/:postId/rate', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.status !== 'completed') {
      return res.status(400).json({ error: 'Can only rate completed posts' });
    }

    // Only post author (help seeker) can rate the helper
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Only the help seeker can rate the helper' });
    }

    if (!post.assignedTo) {
      return res.status(400).json({ error: 'No helper assigned to rate' });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      post: post._id,
      ratedBy: req.userId
    });

    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this helper' });
    }

    // Create rating for the helper
    const newRating = new Rating({
      post: post._id,
      ratedUser: post.assignedTo,
      ratedBy: req.userId,
      rating,
      comment
    });

    await newRating.save();

    // Update helper's average rating
    const helper = await User.findById(post.assignedTo);
    const allRatings = await Rating.find({ ratedUser: post.assignedTo });
    
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    helper.ratings.average = totalRating / allRatings.length;
    helper.ratings.count = allRatings.length;

    // Award karma bonus for high ratings
    if (rating >= 4) {
      helper.karma += 5;
    }

    await helper.save();

    res.json({ 
      message: 'Rating submitted successfully',
      rating: newRating 
    });
  } catch (error) {
    console.error('Rate user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's posts
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name avatar karma badges')
      .populate('assignedTo', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
