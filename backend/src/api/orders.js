import { Router } from 'express';
import prisma from '../prisma/client.js';
import * as angelOneService from '../services/angelOneService.js';

const router = Router();

// Note: The /place endpoint is now effectively handled by the strategyService
// calling the angelOneService directly. This API endpoint might be used for
// manual order placement in the future. We'll leave it for now.
router.post('/place', async (req, res) => {
    // ...
});


// POST /orders/cancel/:id
router.post('/cancel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cancelledOrder = await angelOneService.cancelOrder(id);
    res.json(cancelledOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ... (other routes remain the same)
// GET /trades/open, /trades, /logs
router.get('/trades/open', async (req, res) => {
    try {
      const openTrades = await prisma.trade.findMany({ where: { status: 'Open' }, include: { orders: true } });
      res.json(openTrades);
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error fetching open trades' }); }
});
router.get('/trades', async (req, res) => {
    try {
      const allTrades = await prisma.trade.findMany({ include: { orders: true } });
      res.json(allTrades);
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error fetching trades' }); }
});
router.get('/logs', async (req, res) => {
    try {
      const orderLogs = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(orderLogs);
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error fetching order logs' }); }
});


export default router;
