"use client";
import { useState, useCallback, useEffect } from "react";
import { getWeekDays, getTimeSlots } from "@/hooks/useCalendar";
import ReservationBlock from "./ReservationBlock";
import LockBlock from "./LockBlock";
import type { ReservationData, LockData, AreaInfo } from "./types";

const DAYS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const SLOT_HEIGHT = 50;

type Props = {
  monday: Date;
  reservations: ReservationData[];
  locks: LockData[];
  currentArea: AreaInfo | null;
  onSlotSelect: (start: Date, end: Date) => void;
  onCancelReservation: (id: string) => void;
};

function buildDate(base: Date, slot: string): Date {
  const d = new Date(base);
  const [h, m] = slot.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}

function slotsCount(startIso: string, endIso: string) {
  return Math.max(
    1,
    Math.round(
      (new Date(endIso).getTime() - new Date(startIso).getTime()) /
        (30 * 60 * 1000),
    ),
  );
}

export default function WeekView({
  monday,
  reservations,
  locks,
  currentArea,
  onSlotSelect,
  onCancelReservation,
}: Props) {
  const days = getWeekDays(monday);
  const slots = getTimeSlots();
  const today = new Date();

  const [frontReservationId, setFrontReservationId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ dayIdx: number; slotIdx: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ dayIdx: number; slotIdx: number } | null>(null);

  // ─── helpers ──────────────────────────────────────────────

  function isSelected(dayIdx: number, slotIdx: number) {
    if (!dragging || !dragStart || !dragEnd) return false;
    if (dragStart.dayIdx !== dayIdx || dragEnd.dayIdx !== dayIdx) return false;
    const minS = Math.min(dragStart.slotIdx, dragEnd.slotIdx);
    const maxS = Math.max(dragStart.slotIdx, dragEnd.slotIdx);
    return slotIdx >= minS && slotIdx <= maxS;
  }

  function getLocksAt(dayIdx: number, slotIdx: number): LockData[] {
    const t = buildDate(days[dayIdx], slots[slotIdx]);
    return locks.filter(
      (lk) => t >= new Date(lk.startTime) && t < new Date(lk.endTime),
    );
  }

  function getReservationsAt(dayIdx: number, slotIdx: number): ReservationData[] {
    const t = buildDate(days[dayIdx], slots[slotIdx]);
    return reservations.filter(
      (r) => t >= new Date(r.startTime) && t < new Date(r.endTime),
    );
  }

  // Reservas cuyo startTime cae exactamente en este slot
  function getReservationStartsAt(dayIdx: number, slotIdx: number): ReservationData[] {
    const t = buildDate(days[dayIdx], slots[slotIdx]).getTime();
    return reservations.filter((r) => new Date(r.startTime).getTime() === t);
  }

  function getLockStartsAt(dayIdx: number, slotIdx: number): LockData[] {
    const t = buildDate(days[dayIdx], slots[slotIdx]).getTime();
    return locks.filter((lk) => new Date(lk.startTime).getTime() === t);
  }

  function getEquipmentsTakenAt(dayIdx: number, slotIdx: number): Set<string> {
    const resAtSlot = getReservationsAt(dayIdx, slotIdx);
    const taken = new Set<string>();
    resAtSlot.forEach((r) => {
      r.reservationEquipments?.forEach((re) => taken.add(re.equipment.id));
    });
    return taken;
  }

  // ─── drag ─────────────────────────────────────────────────

  const onMouseDown = useCallback(
    (dayIdx: number, slotIdx: number) => {
      if (dayIdx === 6 || !currentArea) return;
      const slotDate = buildDate(days[dayIdx], slots[slotIdx]);
      if (slotDate < today) return;
      const locksHere = getLocksAt(dayIdx, slotIdx);
      if (locksHere.some((lk) => lk.area.id !== currentArea.id)) return;
      setDragging(true);
      setDragStart({ dayIdx, slotIdx });
      setDragEnd({ dayIdx, slotIdx });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentArea, locks, days, slots],
  );

  const onMouseEnter = useCallback(
    (dayIdx: number, slotIdx: number) => {
      if (!dragging || !dragStart || dayIdx !== dragStart.dayIdx) return;
      setDragEnd({ dayIdx, slotIdx });
    },
    [dragging, dragStart],
  );

  const onMouseUp = useCallback(() => {
    if (!dragging || !dragStart || !dragEnd) {
      setDragging(false);
      return;
    }
    const dayDate = days[dragStart.dayIdx];
    const minS = Math.min(dragStart.slotIdx, dragEnd.slotIdx);
    const maxS = Math.max(dragStart.slotIdx, dragEnd.slotIdx);
    const start = buildDate(dayDate, slots[minS]);
    const endSlotIdx = maxS + 1;
    const end =
      endSlotIdx < slots.length
        ? buildDate(dayDate, slots[endSlotIdx])
        : (() => {
            const d = new Date(dayDate);
            d.setHours(24, 0, 0, 0);
            return d;
          })();
    setDragging(false);
    setDragStart(null);
    setDragEnd(null);
    onSlotSelect(start, end);
  }, [dragging, dragStart, dragEnd, days, slots, onSlotSelect]);

  useEffect(() => {
    const up = () => { if (dragging) onMouseUp(); };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, [dragging, onMouseUp]);

  // ─── render ───────────────────────────────────────────────

  return (
    <div className="flex shadow-sm bg-white overflow-hidden">

      {/* Columna de horas fija */}
      <div className="flex-shrink-0 w-16 bg-white border-r border-none select-none z-10">
        <div className="h-10 border-b border-gray-200" />
        {slots.map((slot) => {
          const isHour = slot.endsWith(":00");
          return (
            <div
              key={slot}
              className="flex items-start justify-end pr-2 pt-0.5 border-t border-gray-100"
              style={{ height: SLOT_HEIGHT }}
            >
              {isHour && (
                <span className="text-[11px] font-bold text-[#1a3a5c] font-mono leading-none mt-0.5">
                  {slot}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Grid scrollable */}
      <div className="flex-1 overflow-x-auto select-none overflow-hidden">
        <div style={{ minWidth: 560 }}>

          {/* Header días */}
          <div
            className="grid sticky top-0 z-20 bg-[#1a3a5c]"
            style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
          >
            {days.map((day, i) => {
              const isSunday = i === 6;
              const isToday = day.toDateString() === today.toDateString();
              return (
                <div
                  key={i}
                  className={`h-12 flex flex-col items-center justify-center
                    ${isSunday ? "bg-black/25" : ""}
                    ${isToday ? "bg-white/15" : ""}
                  `}
                >
                  <span className="text-white/60 uppercase text-[10px] font-semibold tracking-wider">
                    {DAYS_ES[i]}
                  </span>
                  <span className={`text-white font-black text-sm ${isToday ? "underline underline-offset-2" : ""}`}>
                    {day.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Filas de slots */}
          {slots.map((slot, slotIdx) => {
            const isHour = slot.endsWith(":00");
            return (
              <div
                key={slot}
                className={`grid ${isHour ? "border-t-2 border-gray-300" : "border-t border-gray-100"}`}
                style={{ gridTemplateColumns: "repeat(7, 1fr)", height: SLOT_HEIGHT }}
              >
                {days.map((day, dayIdx) => {
                  const isSunday = dayIdx === 6;
                  const slotDate = buildDate(day, slot);
                  const isPast = slotDate < today;

                  const resStarts = getReservationStartsAt(dayIdx, slotIdx);
                  const lockStarts = getLockStartsAt(dayIdx, slotIdx);
                  const locksHere = getLocksAt(dayIdx, slotIdx);
                  const resHere = getReservationsAt(dayIdx, slotIdx);

                  const hasOtherLock = locksHere.some(
                    (lk) => lk.area.id !== currentArea?.id,
                  );

                  const takenEquipments = getEquipmentsTakenAt(dayIdx, slotIdx);
                  const allEquipmentsTaken = takenEquipments.size >= 4;

                  const canClick =
                    !!currentArea &&
                    !isSunday &&
                    !isPast &&
                    !hasOtherLock &&
                    !allEquipmentsTaken;

                  const sel = isSelected(dayIdx, slotIdx);

                  // Altura máxima del contenedor = la reserva más larga que empieza aquí
                  // Esto solo define el div contenedor, NO el bloque visual
                  const containerHeight =
                    resStarts.length > 0
                      ? Math.max(
                          ...resStarts.map(
                            (r) => slotsCount(r.startTime, r.endTime) * SLOT_HEIGHT - 1,
                          ),
                        )
                      : 0;

                  const isFront = resStarts.some(
                    (r) => (r.id ?? r.reservationId) === frontReservationId,
                  );

                  return (
                    <div
                      key={dayIdx}
                      className={`
                        relative border-l border-gray-100 transition-colors
                        ${isSunday ? "bg-gray-100" : ""}
                        ${!isSunday && isPast ? "bg-gray-50/60" : ""}
                        ${!isSunday && !isPast && sel ? "bg-blue-200" : ""}
                        ${!isSunday && !isPast && !sel && canClick ? "hover:bg-[#1a3a5c]/5 cursor-pointer" : ""}
                        ${allEquipmentsTaken && !isSunday ? "cursor-not-allowed" : ""}
                      `}
                      style={{ height: SLOT_HEIGHT }}
                      onMouseDown={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('[data-reservation-button="true"]')) return;
                        e.stopPropagation();
                        if (allEquipmentsTaken && !isSunday && !isPast) {
                          alert("Todos los equipos están reservados en este horario");
                          return;
                        }
                        onMouseDown(dayIdx, slotIdx);
                      }}
                      onMouseEnter={() => onMouseEnter(dayIdx, slotIdx)}
                    >
                      {/* Rayas domingo */}
                      {isSunday && (
                        <div
                          className="absolute inset-0 opacity-80"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(45deg,#375f96 0,#94a3b8 1px,transparent 0,transparent 50%)",
                            backgroundSize: "14px 14px",
                          }}
                        />
                      )}

                      {/* Bloque de reservas — un solo ReservationBlock con todas las que inician aquí */}
                      {resStarts.length > 0 && (
                        <div
                          className="absolute left-0 top-0"
                          style={{
                            // El contenedor es tan alto como la reserva más larga
                            // pero ReservationBlock dibuja cada reserva con SU altura real
                            height: containerHeight,
                            width: "80%",
                            zIndex: isFront ? 30 : 10,
                          }}
                        >
                          <ReservationBlock
                            reservations={resStarts}
                            currentAreaId={currentArea?.id}
                            onCancel={onCancelReservation}
                            blockHeight={containerHeight}
                            onBringToFront={() =>
                              setFrontReservationId(
                                resStarts[0]?.id ?? resStarts[0]?.reservationId ?? null,
                              )
                            }
                          />
                        </div>
                      )}

                      {/* Locks */}
                      {lockStarts.map((lk) => {
                        const lkHeight = slotsCount(lk.startTime, lk.endTime) * SLOT_HEIGHT - 1;
                        return (
                          <div
                            key={lk.reservationId}
                            className="absolute inset-x-0 top-0"
                            style={{ height: lkHeight, zIndex: 40 }}
                          >
                            <LockBlock lock={lk} />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}