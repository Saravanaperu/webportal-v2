import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import apiRoutes from './api/index.js';
import { init as initWebSocket } from './websocket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: '/ws',
  cors: {
    origin: '*', // Allow all origins for now
  },
});

// Initialize WebSocket module
initWebSocket(io);

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1', apiRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('subscribe', (data) => {
    console.log('User subscribed to channels:', data.channels);
    if (data.channels && Array.isArray(data.channels)) {
      data.channels.forEach(channel => {
        socket.join(channel);
      });
    }
  });

  // I will keep some mock emitters for other events for now
  const interval = setInterval(() => {
    io.to('pnl').emit('pnl:update', {
      realized: Math.random() * 1000,
      unrealized: (Math.random() - 0.5) * 500,
      total: Math.random() * 1500,
    });
    io.to('status').emit('status:update', {
      broker: 'connected',
      strategy: 'Scalper V1',
      ticksPerMin: 60,
      latencyMs: 120,
    });
  }, 2000);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    clearInterval(interval);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
