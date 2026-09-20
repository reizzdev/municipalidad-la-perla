'use client';
import { useState, useCallback } from 'react';

export type CalendarView = 'week' | 'month';

// Retorna el lunes de la semana de una fecha dada
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Dom, 1=Lun...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Genera los 7 días de la semana a partir del lunes
export function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

// Genera las franjas horarias de 30min entre 7:00 y 24:00
export function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 7; h < 24; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

export function useCalendar() {
  const [view, setView] = useState<CalendarView>('week');
  const [currentMonday, setCurrentMonday] = useState<Date>(() =>
    getMondayOf(new Date()),
  );

  const goToToday = useCallback(() => {
    setCurrentMonday(getMondayOf(new Date()));
  }, []);

  const goNext = useCallback(() => {
    setCurrentMonday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + (view === 'week' ? 7 : 28));
      return d;
    });
  }, [view]);

  const goPrev = useCallback(() => {
    setCurrentMonday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - (view === 'week' ? 7 : 28));
      return d;
    });
  }, [view]);

  // Etiqueta central: "Abril 2026"
  const headerLabel = currentMonday.toLocaleDateString('es-PE', {
    month: 'long',
    year: 'numeric',
  });

  return { view, setView, currentMonday, goToToday, goNext, goPrev, headerLabel };
}