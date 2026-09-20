
  /*
  AreaLegend.tsx

  Este archivo se encarga de mostrar la leyenda de oficinas (áreas)
  que aparecen en el calendario.

  Qué hace:
  - Recibe una lista de áreas (areas).
  - Muestra cada área como una etiqueta de color.
  - Cada etiqueta tiene:
    - El color del área.
    - La abreviatura (ej: OTI).
    - El nombre completo (visible en pantallas medianas hacia arriba).
  - Si no hay áreas, no renderiza nada (return null).

  De qué depende:
  - Recibe por props:
    - areas → arreglo de objetos AreaInfo.
      Cada área contiene:
        - id
        - name
        - abbreviation
        - color

  Qué NO hace:
  - No maneja estado.
  - No carga datos.
  - No modifica el calendario.
  - Solo representa visualmente la información.

  Resultado final:
  - Una caja visual que explica qué color corresponde a cada oficina.
  - Ayuda al usuario a entender quién está reservando en el calendario.
  */

  'use client';
import { useState } from 'react';
import type { AreaInfo } from './types';

type Props = { areas: AreaInfo[] };

const PRIORITY = ['ALCA', 'SECRE', 'MUNI', 'ADMIN'];

export default function AreaLegend({ areas }: Props) {
  const [open, setOpen] = useState(false);

  if (!areas.length) return null;

  const priorityAreas = areas.filter((a) =>
    PRIORITY.includes(a.abbreviation)
  );

  const otherAreas = areas.filter(
    (a) => !PRIORITY.includes(a.abbreviation)
  );

  const renderItems = (list: AreaInfo[]) => (
    <div className="flex flex-col gap-2">
      {list.map((a) => (
        <div
          key={a.id}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm w-fit"
          style={{ backgroundColor: a.color }}
          title={a.name}
        >
          <span>{a.abbreviation}</span>
          <span className="opacity-80 font-normal hidden sm:inline">
            {' '}
          . {a.name}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed bottom-4 left-4 z-50">

      {/* Botón cuando está cerrado */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#1a3a5c] text-white text-xs px-3 py-2 rounded-full shadow-lg hover:opacity-90"
        >
          Leyenda de Of.
        </button>
      )}

      {/* Panel abierto */}
      {open && (
        <div className="lg:w-67 bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow-lg p-4 space-y-4 relative">

          {/* Botón cerrar */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>

          {/* Título */}
          <h3 className="text-xs font-bold text-[#1a3a5c] uppercase tracking-wide">
            Leyenda
          </h3>

          {/* Prioritarias */}
          <div className='bg-gray-100 border-gray-200 py-2 px-2 rounded-lg'>
            <p className="text-[14px] font-bold text-[#962030] mb-2">
              Areas prioritarias
            </p>
            {renderItems(priorityAreas)}
          </div>

          {/* Otras */}
          <div className='bg-gray-100 border-gray-200 py-2 px-2 rounded-lg'>
            <p className="text-[14px] font-semibold text-[#1D4AAB] mb-2">
              Areas generales
            </p>
            {renderItems(otherAreas)}
          </div>
        </div>
      )}
    </div>
  );
}