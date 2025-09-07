import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import apiRoutes from './api/index.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: '/ws',
  cors: {
    origin: '*', // Allow all origins for now
  },
});

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

  // Mock WebSocket event emitters
  const interval = setInterval(() => {
    // pnl:update
    io.to('pnl').emit('pnl:update', {
      realized: Math.random() * 1000,
      unrealized: (Math.random() - 0.5) * 500,
      total: Math.random() * 1500,
    });

    // status:update
    io.to('status').emit('status:update', {
      broker: 'connected',
      strategy: 'Scalper V1',
      ticksPerMin: 60,
      latencyMs: 120,
    });

    // market:tick
    io.to('market:NIFTY').emit('market:tick', {
      symbol: 'NIFTY',
      ltp: 18000 + Math.random() * 100,
      ts: new Date().getTime(),
    });
  }, 2000); // Send updates every 2 seconds

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    clearInterval(interval);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
