import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ReservationsService } from '../reservations/reservations.service';

type AreaInfo = {
  id: string;
  username: string;
  abbreviation: string;
  color: string;
  name: string;
};

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/calendar',
})
export class CalendarGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedAreas = new Map<string, AreaInfo>();
  private activeLocks = new Map<string, string>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly jwtService: JwtService,
    private readonly reservationsService: ReservationsService,
  ) {}

  // ─── CONEXIÓN ───────────────────────────────────────────────────────────────

  handleConnection(client: Socket): void {
    const rawToken: string | undefined =
      (client.handshake.auth as Record<string, string>)?.token ||
      (client.handshake.headers?.authorization as string | undefined);

    if (rawToken) {
      try {
        const token = rawToken.replace('Bearer ', '');
        const payload = this.jwtService.verify<{
          sub: string;
          username: string;
          abbreviation?: string;
          color?: string;
          name?: string;
        }>(token);

        this.connectedAreas.set(client.id, {
          id: payload.sub,
          username: payload.username,
          abbreviation: payload.abbreviation ?? '',
          color: payload.color ?? '#1e3a5f',
          name: payload.name ?? '',
        });

        console.log(`[WS] Área conectada: ${payload.username} (${client.id})`);
      } catch {
        console.log(`[WS] Token inválido — cliente público: ${client.id}`);
      }
    } else {
      console.log(`[WS] Cliente público conectado: ${client.id}`);
    }

    if (!this.cleanupInterval) {
      this.cleanupInterval = setInterval(() => {
        void this.runCleanup();
      }, 60_000);
    }
  }

  // ─── DESCONEXIÓN ────────────────────────────────────────────────────────────

  handleDisconnect(client: Socket): void {
    for (const [reservationId, socketId] of this.activeLocks.entries()) {
      if (socketId === client.id) {
        this.activeLocks.delete(reservationId);
        this.server.emit('lock:released', { reservationId });
      }
    }

    const area = this.connectedAreas.get(client.id);
    this.connectedAreas.delete(client.id);

    if (area) {
      console.log(`[WS] Área desconectada: ${area.username} (${client.id})`);
    }
  }

  // ─── EVENTOS ────────────────────────────────────────────────────────────────

  @SubscribeMessage('lock:created')
  handleLockCreated(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { reservationId: string; startTime: string; endTime: string },
  ): void {
    const area = this.connectedAreas.get(client.id);
    if (!area) return;

    this.activeLocks.set(data.reservationId, client.id);

    this.server.emit('lock:broadcast', {
      reservationId: data.reservationId,
      startTime: data.startTime,
      endTime: data.endTime,
      area: {
        id: area.id,
        abbreviation: area.abbreviation,
        color: area.color,
        name: area.name,
        
      },
    });
  }

  @SubscribeMessage('reservation:confirmed')
  handleReservationConfirmed(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      reservationId: string;
      startTime: string;
      endTime: string;
      returnStart: string;
      returnEnd: string;
      responsible: string;
      room: string;
      equipments: string[];
    },
  ): void {
    const area = this.connectedAreas.get(client.id);
    if (!area) return;

    this.activeLocks.delete(data.reservationId);

    this.server.emit('reservation:broadcast', {
      ...data,
      area: {
        id: area.id,
        abbreviation: area.abbreviation,
        color: area.color,
        name: area.name,
        
      },
    });
  }

  @SubscribeMessage('lock:release')
  handleLockRelease(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { reservationId: string },
  ): void {
    this.activeLocks.delete(data.reservationId);
    this.server.emit('lock:released', { reservationId: data.reservationId });
  }

  @SubscribeMessage('reservation:cancelled')
  handleReservationCancelled(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { reservationId: string },
  ): void {
    const area = this.connectedAreas.get(client.id);
    if (!area) return;

    this.server.emit('reservation:cancelledBroadcast', {
      reservationId: data.reservationId,
      area: { abbreviation: area.abbreviation },
    });
  }

  // ─── MÉTODO PÚBLICO ─────────────────────────────────────────────────────────

  broadcastCalendarRefresh(): void {
    this.server.emit('calendar:refresh');
  }

  // ─── LIMPIEZA INTERNA ───────────────────────────────────────────────────────

  private async runCleanup(): Promise<void> {
    try {
      const cleaned = await this.reservationsService.cleanExpiredLocks();
      if (cleaned > 0) {
        console.log(`[WS] Locks expirados limpiados: ${cleaned}`);
        this.server.emit('calendar:refresh');
      }
    } catch (err) {
      console.error('[WS] Error en limpieza:', err);
    }
  }
}