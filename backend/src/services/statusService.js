import { getBrokerStatus } from './angelOneService.js';
import { getStatus as getStrategyStatus } from './strategyService.js';
import prisma from '../prisma/client.js';

let io = null;

export const init = (socketIoInstance) => {
  io = socketIoInstance;
};

const checkMarketStatus = (startTime, endTime) => {
  if (!startTime || !endTime) return 'Unknown';

  const now = new Date();
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const marketOpen = new Date();
  marketOpen.setHours(startHour, startMinute, 0, 0);

  const marketClose = new Date();
  marketClose.setHours(endHour, endMinute, 0, 0);

  if (now >= marketOpen && now <= marketClose) {
    return 'Open';
  }
  return 'Closed';
};

const emitStatusUpdate = async () => {
  if (!io) return;

  try {
    const config = await prisma.config.findFirst();
    const brokerStatus = await getBrokerStatus();
    const strategyStatus = getStrategyStatus();

    const marketStatus = checkMarketStatus(config?.sessionStartTime, config?.sessionEndTime);

    const fullStatus = {
      broker: brokerStatus.isConnected ? 'Connected' : 'Disconnected',
      strategy: strategyStatus.isActive ? strategyStatus.strategyName : 'Stopped',
      market: marketStatus,
      // Other stats can be added here later
    };

    io.to('status').emit('status:update', fullStatus);
  } catch (error) {
    console.error('Error emitting status update:', error);
  }
};

export const start = () => {
  // Emit status immediately and then every 5 seconds
  emitStatusUpdate();
  setInterval(emitStatusUpdate, 5000);
};
