'use client';
import { useEffect, useRef, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import type { Socket } from 'socket.io-client';
import type { ReservationData, LockData } from'@/components/calendario/types';

type SocketHandlers = {
  onLockBroadcast: (data: LockData) => void;
  onLockReleased: (data: { reservationId: string }) => void;
  onReservationBroadcast: (data: ReservationData) => void;
  onReservationCancelled: (data: { reservationId: string }) => void;
  onCalendarRefresh: () => void;
};

export function useSocket(token: string | null, handlers: SocketHandlers) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const s = getSocket(token ?? undefined);
    socketRef.current = s;

    s.on('lock:broadcast', handlers.onLockBroadcast);
    s.on('lock:released', handlers.onLockReleased);
    s.on('reservation:broadcast', handlers.onReservationBroadcast);
    s.on('reservation:cancelledBroadcast', handlers.onReservationCancelled);
    s.on('calendar:refresh', handlers.onCalendarRefresh);

    return () => {
      s.off('lock:broadcast', handlers.onLockBroadcast);
      s.off('lock:released', handlers.onLockReleased);
      s.off('reservation:broadcast', handlers.onReservationBroadcast);
      s.off('reservation:cancelledBroadcast', handlers.onReservationCancelled);
      s.off('calendar:refresh', handlers.onCalendarRefresh);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { emit };
}