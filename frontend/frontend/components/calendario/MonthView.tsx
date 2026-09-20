'use client';
import type { ReservationData, AreaInfo } from './types';

type Props = {
  currentDate: Date;
  reservations: ReservationData[];
  currentArea: AreaInfo | null;
  onCancelReservation: (id: string) => void;
};

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function getCalendarStart(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = firstDay.getDay();
  const diff = day === 0 ? 6 : day - 1; // lunes como inicio
  firstDay.setDate(firstDay.getDate() - diff);
  firstDay.setHours(0, 0, 0, 0);
  return firstDay;
}

function buildMonthGrid(date: Date) {
  const start = getCalendarStart(date);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // índice de semana (0,1,2,3,4,5) donde cae el último día del mes
  const diffInDays = Math.floor(
    (lastDayOfMonth.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
  );
  const numberOfWeeks = Math.floor(diffInDays / 7) + 1;

  return Array.from({ length: numberOfWeeks * 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatHour(value: string | Date) {
  const d = new Date(value);
  return d.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Feriados nacionales Perú 2026
const HOLIDAYS_2026 = new Set([
  '2026-01-01',
  '2026-04-02',
  '2026-04-03',
  '2026-05-01',
  '2026-06-07',
  '2026-06-29',
  '2026-07-23',
  '2026-07-28',
  '2026-07-29',
  '2026-08-06',
  '2026-08-30',
  '2026-10-08',
  '2026-11-01',
  '2026-12-08',
  '2026-12-09',
  '2026-12-25',
]);

export default function MonthView({
  currentDate,
  reservations,
  currentArea,
  onCancelReservation,
}: Props) {
  const days = buildMonthGrid(currentDate);
  const today = new Date();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Encabezado días */}
      <div className="grid grid-cols-7 bg-[#1a3a5c]">
        {DAYS_ES.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-bold uppercase tracking-wide text-white"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grilla mensual */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, today);
          const isHoliday = HOLIDAYS_2026.has(formatDateKey(day));

          const dayReservations = reservations
            .filter((reservation) => isSameDay(new Date(reservation.startTime), day))
            .sort(
              (a, b) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
            );

          const firstReservation = dayReservations[0];
          const extraCount = dayReservations.length - 1;

          return (
            <div
              key={index}
              className={`min-h-[140px] border border-gray-200 p-2 align-top ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="mb-2">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                    isToday
                      ? 'bg-[#1a3a5c] text-white'
                      : isHoliday
                      ? 'text-red-600'
                      : 'text-[#1a3a5c]'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {firstReservation && (() => {
                  const canCancel =
                    currentArea?.id === firstReservation.area.id &&
                    new Date(firstReservation.startTime) > new Date();

                  const responsibleName =
                    firstReservation.responsibleName ||
                    firstReservation.responsible_name ||
                    '';

                  return (
                    <div
                      className="rounded-lg px-2 py-1 text-white text-[11px] shadow-sm"
                      style={{ backgroundColor: firstReservation.area.color }}
                    >
                      <div className="font-bold leading-tight">
                        {formatHour(firstReservation.startTime)} - {formatHour(firstReservation.endTime)}
                      </div>

                      <div className="font-black truncate">
                        {firstReservation.area.abbreviation}
                      </div>

                      {responsibleName && (
                        <div className="truncate opacity-90">{responsibleName}</div>
                      )}

                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => onCancelReservation(firstReservation.id!)}
                          className="mt-1 text-[10px] underline font-semibold"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  );
                })()}

                {extraCount > 0 && (
                  <div className="text-xs font-bold text-[#1a3a5c] px-1">
                    +{extraCount}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}