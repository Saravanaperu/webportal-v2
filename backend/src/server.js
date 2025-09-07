import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import apiRoutes from './api/index.js';
import { init as initWebSocket } from './websocket.js';
import { init as initStatusService, start as startStatusService } from './services/statusService.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: '/ws',
  cors: {
    origin: '*', // Allow all origins for now
  },
});

// Initialize services
initWebSocket(io);
initStatusService(io);

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

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // Start the status service after the server is running
  startStatusService();
});
