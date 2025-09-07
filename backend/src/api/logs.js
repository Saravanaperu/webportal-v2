import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /logs/recent?limit=...
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 200;
    const recentLogs = await prisma.log.findMany({
      take: limit,
      orderBy: {
        timestamp: 'desc',
      },
    });
    res.json(recentLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recent logs' });
  }
});

export default router;
