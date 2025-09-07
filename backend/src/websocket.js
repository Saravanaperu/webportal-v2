import { WebSocket } from 'smartapi-javascript';
import { getSessionData, getPositions } from './services/angelOneService.js';
import { onTick as onStrategyTick } from './services/strategyService.js';

let io = null;
let openPositions = [];
let currentPnl = { realized: 0, unrealized: 0, total: 0 };

export const init = (socketIoInstance) => {
  io = socketIoInstance;
};

export const startAngelOneFeed = async () => {
  const session = getSessionData();
  if (!session || !io) {
    console.error('Cannot start Angel One feed: Not connected to broker or WebSocket server not initialized.');
    return;
  }

  try {
    const positions = await getPositions();
    openPositions = positions.data || [];
  } catch (error) {
    console.error('Could not fetch initial positions for P&L calculation:', error);
  }

  const { clientcode, feedtoken } = session;
  const apiKey = process.env.ANGEL_API_KEY;

  const ws = new WebSocket({
    client_code: clientcode,
    feed_token: feedtoken,
  });

  ws.connect()
    .then(() => {
      console.log('Connected to Angel One WebSocket feed.');
      ws.runScript("nse_cm|2885", "mw"); // Reliance
      ws.runScript("nse_cm|3045", "mw"); // SBIN
    })
    .catch(err => {
      console.error('Error connecting to Angel One WebSocket feed:', err);
    });

  ws.on('tick', (ticks) => {
    // Pass ticks to the strategy service
    onStrategyTick(ticks);

    // Broadcast the raw ticks to the frontend
    io.to('market:NIFTY').emit('market:tick', ticks);

    // Calculate P&L
    let totalUnrealizedPnl = 0;
    openPositions.forEach(pos => {
      const tick = ticks.find(t => t.tk === pos.symboltoken);
      if (tick && tick.ltp) {
        const ltp = parseFloat(tick.ltp);
        const avgPrice = parseFloat(pos.averageprice);
        const qty = parseInt(pos.netqty);
        totalUnrealizedPnl += (ltp - avgPrice) * qty;
      }
    });

    currentPnl.unrealized = totalUnrealizedPnl;
    currentPnl.total = currentPnl.realized + currentPnl.unrealized;

    // Emit the P&L update
    io.to('pnl').emit('pnl:update', currentPnl);
  });
};
