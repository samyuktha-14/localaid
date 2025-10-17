require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const emergencyRoutes = require('./routes/emergency');
const chatRoutes = require('./routes/chat');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://samyukthaselvaraj24cse_db_user:Samyu2006@cluster0.vnwxe2v.mongodb.net/localaid?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log('📊 Database:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('Check your connection string and network access in MongoDB Atlas');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LocalAid API is running' });
});

// Socket.IO for real-time features (emergency alerts, chat)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-neighborhood', (neighborhood) => {
    socket.join(neighborhood);
    console.log(`User joined neighborhood: ${neighborhood}`);
  });

  socket.on('join-chat', (postId) => {
    socket.join(`chat-${postId}`);
    console.log(`User joined chat for post: ${postId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`chat-${data.postId}`).emit('new-message', data);
  });

  socket.on('emergency-alert', (data) => {
    io.to(data.neighborhood).emit('new-emergency', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
