import { io } from 'socket.io-client';

// The URL for the backend WebSocket server.
// Replace with your actual backend URL in a production environment.
const SOCKET_URL = 'http://localhost:3000';

const socket = io(SOCKET_URL, {
  path: '/ws', // as specified in the backend spec
  autoConnect: false, // only connect when needed
});

export default socket;
