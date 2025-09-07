import { useEffect, useState } from 'react';
import socket from '../services/socket';

export const useSocket = (event, callback) => {
  useEffect(() => {
    socket.connect();

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
      socket.disconnect();
    };
  }, [event, callback]);
};

export const useSocketSubscription = (channels) => {
  useEffect(() => {
    socket.connect();
    socket.emit('subscribe', { channels });

    return () => {
      // Unsubscribe logic can be added here if the backend supports it
      socket.disconnect();
    };
  }, [channels]);
};
