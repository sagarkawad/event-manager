import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import { createServer } from 'http';
import { Server } from 'socket.io';


dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity (restrict in production)
  },
});
const PORT = process.env.VITE_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Middleware to make `io` available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Handle socket connections
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.listen(4000)


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});