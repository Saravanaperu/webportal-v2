import { Router } from 'express';
import * as angelOneService from '../services/angelOneService.js';
import { startAngelOneFeed, startAngelOneOrderFeed } from '../websocket.js';

const router = Router();

// POST /broker/connect
router.post('/connect', async (req, res) => {
  try {
    const result = await angelOneService.connectToBroker();
    if (result.success) {
      // Start both the market data feed and the order feed
      startAngelOneFeed();
      startAngelOneOrderFeed();
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /broker/status
router.get('/status', async (req, res) => {
  const status = await angelOneService.getBrokerStatus();
  res.json(status);
});

// GET /broker/positions
router.get('/positions', async (req, res) => {
  try {
    const positions = await angelOneService.getPositions();
    res.json(positions);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// GET /broker/margins
router.get('/margins', async (req, res) => {
  try {
    const margins = await angelOneService.getMargins();
    res.json(margins);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export default router;
