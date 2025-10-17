const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

// Get or create chat for a post
router.get('/post/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only post author and assigned helper can access chat
    const isAuthor = post.author.toString() === req.userId.toString();
    const isHelper = post.assignedTo?.toString() === req.userId.toString();

    if (!isAuthor && !isHelper) {
      return res.status(403).json({ error: 'You are not part of this conversation' });
    }

    if (!post.assignedTo) {
      return res.status(400).json({ error: 'No helper assigned yet' });
    }

    // Find or create chat
    let chat = await Chat.findOne({ post: post._id })
      .populate('messages.sender', 'name avatar')
      .populate('participants', 'name avatar');

    if (!chat) {
      chat = new Chat({
        post: post._id,
        participants: [post.author, post.assignedTo]
      });
      await chat.save();
      await chat.populate('messages.sender', 'name avatar');
      await chat.populate('participants', 'name avatar');
    }

    res.json({ chat });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message
router.post('/post/:postId/message', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only post author and assigned helper can send messages
    const isAuthor = post.author.toString() === req.userId.toString();
    const isHelper = post.assignedTo?.toString() === req.userId.toString();

    if (!isAuthor && !isHelper) {
      return res.status(403).json({ error: 'You are not part of this conversation' });
    }

    if (!post.assignedTo) {
      return res.status(400).json({ error: 'No helper assigned yet' });
    }

    // Find or create chat
    let chat = await Chat.findOne({ post: post._id });

    if (!chat) {
      chat = new Chat({
        post: post._id,
        participants: [post.author, post.assignedTo]
      });
    }

    // Add message
    chat.messages.push({
      sender: req.userId,
      content
    });

    await chat.save();
    await chat.populate('messages.sender', 'name avatar');
    await chat.populate('participants', 'name avatar');

    res.json({ 
      message: 'Message sent',
      chat 
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.post('/post/:postId/read', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ post: req.params.postId });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Mark all messages not from current user as read
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== req.userId.toString()) {
        msg.read = true;
      }
    });

    await chat.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
