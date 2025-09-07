import { WebSocket } from 'smartapi-javascript';
import { getSessionData } from './services/angelOneService.js';

let io = null;

export const init = (socketIoInstance) => {
  io = socketIoInstance;
};

export const startAngelOneFeed = () => {
  const session = getSessionData();
  if (!session || !io) {
    console.error('Cannot start Angel One feed: Not connected to broker or WebSocket server not initialized.');
    return;
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
      // Subscribe to some sample scripts
      // In a real app, these would be dynamic based on user needs
      ws.runScript("nse_cm|2885", "mw"); // Reliance
      ws.runScript("nse_cm|3045", "mw"); // SBIN
    })
    .catch(err => {
      console.error('Error connecting to Angel One WebSocket feed:', err);
    });

  ws.on('tick', (ticks) => {
    // Broadcast the ticks to the frontend clients
    io.to('market:NIFTY').emit('market:tick', ticks); // Assuming NIFTY for now
  });
};
