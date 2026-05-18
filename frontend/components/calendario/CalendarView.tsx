
/*
CalendarView.tsx

Este archivo es el componente principal del calendario.
Es el "cerebro" que conecta toda la lógica: reservas, bloqueos,
modal, navegación y WebSocket en tiempo real.

Qué hace:
- Maneja el estado global del calendario:
  - Reservas confirmadas.
  - Bloqueos temporales (locks).
  - Áreas disponibles.
  - Área actual logueada.
- Controla la navegación de semanas/meses.
- Se conecta al backend para:
  - Obtener reservas de la semana.
  - Crear locks temporales.
  - Confirmar reservas.
  - Cancelar reservas.
- Se conecta por WebSocket para:
  - Recibir bloqueos en tiempo real.
  - Recibir reservas confirmadas por otros usuarios.
  - Sincronizar cancelaciones.
- Controla la apertura y cierre del modal de reserva.
- Maneja el temporizador de 5 minutos del lock.

Flujo principal:
1. El usuario selecciona un horario en WeekView.
2. Se crea un lock en el backend.
3. Se consulta qué equipos están disponibles.
4. Se abre ReservationModal con un temporizador.
5. Si confirma:
   - Se guarda la reserva en el backend.
   - Se notifica por WebSocket.
   - Se actualiza el calendario.
6. Si cancela o expira el tiempo:
   - Se elimina el lock.
   - Se libera el horario.

De qué depende:
- useCalendar → controla semana actual y navegación.
- useSocket → maneja eventos en tiempo real.
- api → llamadas HTTP al backend.
- CalendarHeader → navegación superior.
- WeekView → vista semanal interactiva.
- ReservationModal → formulario de confirmación.
- AreaLegend → muestra colores de áreas.

Qué controla:
- Modo solo lectura si no hay sesión.
- Sincronización en tiempo real entre múltiples usuarios.
- Temporizador automático que cancela el lock si expira.

Resultado final:
- Un calendario completo, interactivo y en tiempo real.
- Permite múltiples usuarios sin que se crucen horarios.
- Gestiona todo el ciclo de vida de una reserva.
*/

'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useCalendar, getWeekDays } from '@/hooks/useCalendar';
import { useSocket } from '@/hooks/useSocket';
import { getSession } from '@/lib/auth';
import api from '@/lib/api';
import CalendarHeader from './CalendarHeader';
import WeekView from './WeekView';
import MonthView from './MonthView';
import ReservationModal from './ReservationModal';
import AreaLegend from './AreaLegend';
import type { ReservationData, LockData, AreaInfo, Equipment } from './types';

const LOCK_TIMEOUT_SECONDS = 300; // 5 minutos

export default function CalendarView() {
  const { view, setView, currentMonday, goToToday, goNext, goPrev, headerLabel } =
    useCalendar();

  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [locks, setLocks] = useState<LockData[]>([]);
  const [areas, setAreas] = useState<AreaInfo[]>([]);
  const [currentArea, setCurrentArea] = useState<AreaInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Estado del modal
  const [modal, setModal] = useState<{
    reservationId: string;
    startTime: Date;
    endTime: Date;
    returnEnd: Date;
    availableEquipments: Equipment[]; // ← nuevo campo
  } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(LOCK_TIMEOUT_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── inicializar sesión ──────────────────────────────────
  useEffect(() => {
    const { token: t, area } = getSession();
    setToken(t);
    if (area) setCurrentArea(area);
  }, []);

  // ─── cargar áreas ────────────────────────────────────────
  useEffect(() => {
    api.get<AreaInfo[]>('/api/areas').then((r) => setAreas(r.data));
  }, []);

  // ─── cargar reservas al cambiar semana ───────────────────
  const fetchReservations = useCallback(() => {
    const days = getWeekDays(currentMonday);
    const start = days[0].toISOString();
    const end = new Date(days[6].getTime() + 24 * 60 * 60 * 1000 - 1).toISOString();

    api
      .get<ReservationData[]>(`/api/reservations?start=${start}&end=${end}`)
      .then((r) => setReservations(r.data))
      .catch(console.error);
  }, [currentMonday]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // ─── WebSocket ───────────────────────────────────────────
  const { emit } = useSocket(token, {
    onLockBroadcast: useCallback((data: LockData) => {
      setLocks((prev) => {
        const exists = prev.find((l) => l.reservationId === data.reservationId);
        return exists ? prev : [...prev, data];
      });
    }, []),

    onLockReleased: useCallback(({ reservationId }: { reservationId: string }) => {
      setLocks((prev) => prev.filter((l) => l.reservationId !== reservationId));
    }, []),

    onReservationBroadcast: useCallback((data: ReservationData) => {
      setLocks((prev) =>
        prev.filter((l) => l.reservationId !== data.reservationId),
      );
      setReservations((prev) => {
        const filtered = prev.filter((r) => r.id !== data.reservationId);
        return [...filtered, { ...data, id: data.reservationId }];
      });
    }, []),

    onReservationCancelled: useCallback(({ reservationId }: { reservationId: string }) => {
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    }, []),

    onCalendarRefresh: useCallback(() => {
      fetchReservations();
    }, [fetchReservations]),
  });

  // ─── selección de celdas → lock ─────────────────────────
 const handleSlotSelect = useCallback(
  async (start: Date, end: Date) => {
    if (!currentArea || !token) return;

    try {
      // 1. Crear lock
      const res = await api.post<{ id: string; returnEnd: string }>(
        '/api/reservations/lock',
        { startTime: start.toISOString(), endTime: end.toISOString() },
      );
      const { id: reservationId, returnEnd } = res.data;

      // 2. Consultar equipos disponibles para ese horario
      const eqRes = await api.get<Equipment[]>(
        `/api/reservations/available-equipments?start=${start.toISOString()}&end=${end.toISOString()}`,
      );

      emit('lock:created', {
        reservationId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      setModal({
        reservationId,
        startTime: start,
        endTime: end,
        returnEnd: new Date(returnEnd),
        availableEquipments: eqRes.data, // ← pasar al modal
      });
      setSecondsLeft(LOCK_TIMEOUT_SECONDS);

      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleModalCancel(reservationId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'No se pudo bloquear el horario';
      alert(msg);
    }
  },
  [currentArea, token, emit],
);

  // ─── cancelar modal / lock ───────────────────────────────
  const handleModalCancel = useCallback(
    async (reservationId?: string) => {
      const id = reservationId ?? modal?.reservationId;
      if (!id) return;

      clearInterval(timerRef.current!);
      setModal(null);

      try {
        await api.delete(`/api/reservations/lock/${id}`);
        emit('lock:release', { reservationId: id });
      } catch {
        // lock ya expiró o no existe, ignorar
      }
    },
    [modal, emit],
  );

  // ─── confirmar reserva ───────────────────────────────────
  const handleConfirm = useCallback(
    async (data: {
      reservationId: string;
      equipmentIds: string[];
      responsibleName: string;
      roomId: string;
    }) => {
      if (!currentArea) return;
      clearInterval(timerRef.current!);

      try {
        const res = await api.post<ReservationData>('/api/reservations/confirm', data);
        const confirmed = res.data;

        emit('reservation:confirmed', {
          reservationId: data.reservationId,
          startTime: confirmed.startTime,
          endTime: confirmed.endTime,
          returnStart: confirmed.returnStart,
          returnEnd: confirmed.returnEnd,
          
          room: confirmed.room?.name ?? '',
          equipments:
            confirmed.reservationEquipments?.map((re) => re.equipment.name) ?? [],
        });

        setModal(null);
        fetchReservations();
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? 'Error al confirmar';
        alert(msg);
      }
    },
    [currentArea, emit, fetchReservations],
  );

  // ─── cancelar reserva confirmada ─────────────────────────
  const handleCancelReservation = useCallback(
    async (id: string) => {
      if (!confirm('¿Cancelar esta reserva?')) return;
      try {
        await api.post('/api/reservations/cancel', { reservationId: id });
        emit('reservation:cancelled', { reservationId: id });
        fetchReservations();
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? 'No se pudo cancelar';
        alert(msg);
      }
    },
    [emit, fetchReservations],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Leyenda */}
      <AreaLegend areas={areas} />

      {/* Header navegación */}
      <CalendarHeader
        label={headerLabel}
        view={view}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToToday}
        onViewChange={setView}
      />

      {/* Aviso si no hay sesión */}
      {!currentArea && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1a3a5c] font-medium">
          👁 Estás en modo <strong>solo lectura</strong>. Inicia sesión para crear reservas.
        </div>
      )}

      {/* Calendario */}
      {view === 'week' && (
        <WeekView
          monday={currentMonday}
          reservations={reservations}
          locks={locks}
          currentArea={currentArea}
          onSlotSelect={handleSlotSelect}
          onCancelReservation={handleCancelReservation}
        />
      )}

      {view === 'month' && (
        <MonthView
          currentDate={currentMonday}
          reservations={reservations}
          currentArea={currentArea}
          onCancelReservation={handleCancelReservation}
        />
      )}


      {/* Modal */}
      {modal && currentArea && (
        <ReservationModal
          reservationId={modal.reservationId}
          startTime={modal.startTime}
          endTime={modal.endTime}
          returnEnd={modal.returnEnd}
          area={currentArea}
          availableEquipments={modal.availableEquipments}  // ← nuevo
          onConfirm={handleConfirm}
          onCancel={() => handleModalCancel()}
          secondsLeft={secondsLeft}
        />
      )}
      
    </div>
  );
}