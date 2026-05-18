
/*
CalendarHeader.tsx

Este archivo se encarga de renderizar la barra superior del calendario.
Es el componente que controla la navegación y el cambio de vista.

Qué hace:
- Muestra botones para:
  - Ir a la semana/mes anterior.
  - Ir a hoy.
  - Ir a la semana/mes siguiente.
- Muestra el texto central con el mes y año actual (label).
- Permite cambiar entre vista semanal y mensual.

De qué depende:
- Recibe por props:
  - label → texto del período actual (ej: "Abril 2026").
  - view → vista activa ('week' o 'month').
  - onPrev → función para ir al período anterior.
  - onNext → función para ir al siguiente período.
  - onToday → función para volver a la fecha actual.
  - onViewChange → función para cambiar de vista.

Qué NO hace:
- No maneja estado propio.
- No carga datos.
- No controla lógica del calendario.
- Solo dispara funciones que vienen del componente padre.

Resultado final:
- Una barra de navegación limpia y clara.
- Permite moverse entre semanas/meses.
- Permite cambiar entre vista semanal y mensual.
*/

'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarView } from '@/hooks/useCalendar';

type Props = {
  label: string;
  view: CalendarView;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (v: CalendarView) => void;
};

export default function CalendarHeader({
  label, view, onPrev, onNext, onToday, onViewChange,
}: Props) {
  const views: { key: CalendarView; label: string }[] = [
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mes' },
  ];

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Navegación izquierda */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="p-2 rounded-lg hover:bg-[#1a3a5c]/10 text-[#1a3a5c] transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={onToday}
          className="px-4 py-1.5 text-sm font-bold text-[#1a3a5c] border-2 border-[#1a3a5c] rounded-lg hover:bg-[#1a3a5c] hover:text-white transition-all"
        >
          Hoy
        </button>

        <button
          onClick={onNext}
          className="p-2 rounded-lg hover:bg-[#1a3a5c]/10 text-[#1a3a5c] transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Mes y año — centro */}
      <h2 className="text-lg font-black text-[#1a3a5c] capitalize tracking-wide">
        {label}
      </h2>

      {/* Selector de vista — derecha */}
      <div className="flex border-2 border-[#1a3a5c] rounded-lg overflow-hidden">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => onViewChange(v.key)}
            className={`px-4 py-1.5 text-sm font-bold transition-all ${
              view === v.key
                ? 'bg-[#1a3a5c] text-white'
                : 'text-[#1a3a5c] hover:bg-[#1a3a5c]/10'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}