import { WebSocket, WebSocketClient } from 'smartapi-javascript';
import { getSessionData, getPositions } from './services/angelOneService.js';
import { onTick as onStrategyTick } from './services/strategyService.js';
import prisma from '../prisma/client.js';

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
    onStrategyTick(ticks);
    io.to('market:NIFTY').emit('market:tick', ticks);

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
    io.to('pnl').emit('pnl:update', currentPnl);
  });
};

export const startAngelOneOrderFeed = () => {
    const session = getSessionData();
    if (!session || !io) {
      console.error('Cannot start Angel One order feed: Not connected or WebSocket server not initialized.');
      return;
    }

    const { clientcode, jwtToken } = session; // Note: The property from the library is likely jwtToken
    const apiKey = process.env.ANGEL_API_KEY;

    const orderWs = new WebSocketClient({
      clientcode,
      jwttoken: jwtToken,
      apikey: apiKey,
      feedtype: 'order_feed',
    });

    orderWs.connect()
      .then(() => {
        console.log('Connected to Angel One Order Feed WebSocket.');
      })
      .catch(err => {
        console.error('Error connecting to Angel One Order Feed:', err);
      });

    orderWs.on('tick', async (orderData) => {
      console.log('Received order update:', orderData);

      if (!orderData || !orderData.orderid) return;

      try {
        const updatedOrder = await prisma.order.update({
          where: { brokerOrderId: orderData.orderid },
          data: { status: orderData.status },
        });

        io.to('orders').emit('orders:execution', updatedOrder);

        if (updatedOrder.status === 'EXECUTED' || updatedOrder.status === 'CANCELLED' || updatedOrder.status === 'REJECTED') {
          const allTrades = await prisma.trade.findMany({ include: { orders: true } });
          io.to('trades').emit('trades:update', allTrades);
        }

      } catch (error) {
          console.warn(`Could not find order with broker ID ${orderData.orderid} to update in local DB.`);
      }
    });
  };
