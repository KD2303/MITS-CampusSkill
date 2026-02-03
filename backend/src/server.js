import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handler middleware
app.use(errorHandler);

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('user:online', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} is online`);
  });

  // Join chat room
  socket.on('chat:join', (chatRoomId) => {
    socket.join(chatRoomId);
    console.log(`Socket ${socket.id} joined chat room ${chatRoomId}`);
  });

  // Leave chat room
  socket.on('chat:leave', (chatRoomId) => {
    socket.leave(chatRoomId);
    console.log(`Socket ${socket.id} left chat room ${chatRoomId}`);
  });

  // Send message
  socket.on('chat:message', (data) => {
    const { chatRoomId, message } = data;
    // Broadcast to all users in the chat room except sender
    socket.to(chatRoomId).emit('chat:newMessage', message);
  });

  // Typing indicator
  socket.on('chat:typing', (data) => {
    const { chatRoomId, user } = data;
    socket.to(chatRoomId).emit('chat:userTyping', user);
  });

  // Stop typing indicator
  socket.on('chat:stopTyping', (data) => {
    const { chatRoomId, user } = data;
    socket.to(chatRoomId).emit('chat:userStopTyping', user);
  });

  // Read receipt
  socket.on('chat:read', (data) => {
    const { chatRoomId, userId } = data;
    socket.to(chatRoomId).emit('chat:messagesRead', { userId });
  });

  // Task notifications
  socket.on('task:taken', (data) => {
    const { taskPosterId, message } = data;
    io.to(taskPosterId).emit('notification', {
      type: 'task_taken',
      message,
    });
  });

  socket.on('task:submitted', (data) => {
    const { taskPosterId, message } = data;
    io.to(taskPosterId).emit('notification', {
      type: 'task_submitted',
      message,
    });
  });

  socket.on('task:completed', (data) => {
    const { userId, message, credits } = data;
    io.to(userId).emit('notification', {
      type: 'task_completed',
      message,
      credits,
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});
