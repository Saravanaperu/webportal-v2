import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// POST /orders/place
router.post('/place', async (req, res) => {
  try {
    const { symbol, side, qty, sl, target } = req.body;
    // In a real app, this would also interact with the broker service.
    const newTrade = await prisma.trade.create({
      data: {
        symbol,
        entry: 0, // This would be set after the order is filled
        sl,
        target,
        status: 'Open',
        orders: {
          create: {
            symbol,
            action: side,
            status: 'Pending',
          },
        },
      },
      include: {
        orders: true,
      },
    });
    res.status(201).json(newTrade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// POST /orders/cancel/:id
router.post('/cancel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // In a real app, this would also cancel the order with the broker.
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'Cancelled' },
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
});

// GET /trades/open
router.get('/trades/open', async (req, res) => {
  try {
    const openTrades = await prisma.trade.findMany({
      where: { status: 'Open' },
      include: { orders: true },
    });
    res.json(openTrades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching open trades' });
  }
});

// GET /trades
router.get('/trades', async (req, res) => {
  try {
    const allTrades = await prisma.trade.findMany({
      include: { orders: true },
    });
    res.json(allTrades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching trades' });
  }
});

// GET /orders/logs
router.get('/logs', async (req, res) => {
  try {
    const orderLogs = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(orderLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order logs' });
  }
});

export default router;
