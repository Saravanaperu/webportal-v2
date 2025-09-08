import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /stats/summary?scope=...
router.get('/summary', async (req, res) => {
  try {
    const { scope } = req.query; // 'daily', 'weekly', 'monthly'

    const now = new Date();
    let startDate = new Date();
    if (scope === 'daily') {
      startDate.setHours(0, 0, 0, 0);
    } else if (scope === 'weekly') {
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else if (scope === 'monthly') {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }

    const closedTrades = await prisma.trade.findMany({
        where: {
            status: 'Closed',
            updatedAt: { gte: startDate },
            pnl: { not: null },
        },
    });

    let totalPnl = 0;
    let wins = 0;
    let losses = 0;
    let totalReward = 0;
    let totalRisked = 0;

    closedTrades.forEach(trade => {
        totalPnl += trade.pnl;
        if (trade.pnl > 0) {
            wins++;
            totalReward += trade.pnl;
        } else {
            losses++;
            totalRisked += trade.risk || 0; // Use risk if available, fallback to 0
        }
    });

    const winLossRatio = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
    const avgReward = wins > 0 ? totalReward / wins : 0;
    const avgRisk = losses > 0 ? totalRisked / losses : 0;
    const avgRR = avgRisk > 0 ? avgReward / avgRisk : 0;

    // Mock capital deployment for now, as it requires a live broker call
    const capitalDeployment = {
      deployed: 50000,
      available: 50000,
    };

    res.json({
      scope,
      pnl: totalPnl,
      winLossRatio: winLossRatio.toFixed(2),
      avgRR: avgRR.toFixed(2),
      capitalDeployment,
    });

  } catch (error) {
    console.error('Error fetching stats summary:', error);
    res.status(500).json({ message: 'Error fetching stats summary' });
  }
});

// GET /stats/equity-curve?from=...&to=...
router.get('/equity-curve', async (req, res) => {
    try {
        const { from, to } = req.query;
        const trades = await prisma.trade.findMany({
            where: {
                status: 'Closed',
                updatedAt: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
                pnl: { not: null },
            },
            orderBy: {
                updatedAt: 'asc',
            }
        });

        let startingCapital = 100000; // This should come from config
        const equityCurve = trades.map(trade => {
            startingCapital += trade.pnl;
            return {
                date: trade.updatedAt.toISOString().split('T')[0],
                equity: startingCapital,
            };
        });

        res.json(equityCurve);
    } catch (error) {
        console.error('Error fetching equity curve:', error);
        res.status(500).json({ message: 'Error fetching equity curve' });
    }
});

export default router;
