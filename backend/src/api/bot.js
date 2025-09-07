import { Router } from 'express';
import * as strategyService from '../services/strategyService.js';

const router = Router();

// POST /strategy/start
router.post('/strategy/start', (req, res) => {
  const { strategy } = req.body;
  strategyService.start(strategy);
  res.json({ message: `Strategy '${strategy}' started successfully.` });
});

// POST /strategy/stop
router.post('/strategy/stop', (req, res) => {
  strategyService.stop();
  res.json({ message: 'Strategy stopped successfully.' });
});

// POST /strategy/mode
router.post('/strategy/mode', (req, res) => {
  const { mode } = req.body;
  console.log(`Setting mode to: ${mode}`);
  // In a real app, this would be handled by the strategy service
  res.json({ message: `Mode set to '${mode}'.` });
});

export default router;
