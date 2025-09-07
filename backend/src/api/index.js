import { Router } from 'express';
import authRoutes from './auth.js';
import configRoutes from './config.js';
import botRoutes from './bot.js';
import ordersRoutes from './orders.js';
import brokerRoutes from './broker.js';
import statsRoutes from './stats.js';
import logsRoutes from './logs.js';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/config', configRoutes);
router.use('/strategy', botRoutes);
router.use('/orders', ordersRoutes);
router.use('/trades', ordersRoutes); // Also handles /trades routes
router.use('/broker', brokerRoutes);
router.use('/stats', statsRoutes);
router.use('/logs', logsRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

export default router;
