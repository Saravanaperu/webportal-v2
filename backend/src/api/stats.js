import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /stats/summary?scope=...
router.get('/summary', async (req, res) => {
  const { scope } = req.query; // 'daily', 'weekly', 'monthly'
  // Mock implementation
  console.log(`Fetching ${scope} stats summary...`);
  res.json({
    scope,
    pnl: (Math.random() - 0.5) * 5000,
    winLossRatio: Math.random() * 100,
    avgRR: Math.random() * 3 + 1,
    capitalDeployment: {
      deployed: Math.random() * 100000,
      available: Math.random() * 100000,
    },
  });
});

// GET /stats/equity-curve?from=...&to=...
router.get('/equity-curve', (req, res) => {
  const { from, to } = req.query;
  // Mock implementation
  console.log(`Fetching equity curve from ${from} to ${to}...`);
  const data = [];
  for (let i = 0; i < 30; i++) {
    data.push({
      date: new Date(new Date(from).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      equity: 100000 + (Math.random() * 10000 * i),
    });
  }
  res.json(data);
});

export default router;
