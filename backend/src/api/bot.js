import { Router } from 'express';

const router = Router();

// POST /strategy/start
router.post('/strategy/start', (req, res) => {
  const { strategy } = req.body;
  console.log(`Starting strategy: ${strategy}`);
  // In a real app, this would trigger the trading bot logic.
  res.json({ message: `Strategy '${strategy}' started successfully.` });
});

// POST /strategy/stop
router.post('/strategy/stop', (req, res) => {
  console.log('Stopping strategy.');
  // In a real app, this would stop the trading bot logic.
  res.json({ message: 'Strategy stopped successfully.' });
});

// POST /strategy/mode
router.post('/strategy/mode', (req, res) => {
  const { mode } = req.body;
  console.log(`Setting mode to: ${mode}`);
  // This could also be handled via WebSocket.
  res.json({ message: `Mode set to '${mode}'.` });
});

export default router;
