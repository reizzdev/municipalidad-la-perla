import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token?: string): Socket {
  if (socket?.connected) return socket;

  socket = io(
    `${process.env.NEXT_PUBLIC_API_URL || 'https://municipalidad-la-perla-production.up.railway.app'}/calendar`,
    {
      auth: token ? { token: `Bearer ${token}` } : {},
      transports: ['websocket'],
      autoConnect: true,
    },
  );

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}