import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /config
router.get('/', async (req, res) => {
  try {
    // For simplicity, we assume there's only one config record.
    let config = await prisma.config.findFirst();
    if (!config) {
      // If no config exists, create a default one.
      config = await prisma.config.create({
        data: {
          risk: 1,
          maxPosition: 10000,
          capital: 100000,
          brokerApiKey: '',
          brokerApiSecret: '',
          sessionStartTime: '09:15',
          sessionEndTime: '15:30',
          discordWebhookUrl: '',
        },
      });
    }
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching configuration' });
  }
});

// PUT /config
router.put('/', async (req, res) => {
  try {
    const configData = req.body;
    const currentConfig = await prisma.config.findFirst();
    if (!currentConfig) {
      return res.status(404).json({ message: 'Configuration not found.' });
    }
    const updatedConfig = await prisma.config.update({
      where: { id: currentConfig.id },
      data: configData,
    });
    res.json(updatedConfig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating configuration' });
  }
});

// POST /config/discord/test
router.post('/discord/test', (req, res) => {
  // This would typically send a test message to the configured Discord webhook.
  console.log('Simulating: Sending test message to Discord...');
  res.json({ message: 'Test message sent successfully!' });
});

export default router;
