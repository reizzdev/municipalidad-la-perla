
/*
LockBlock.tsx

ESTE ARCHIVO POSIBLEMENTE ES USADO EN weekbiew.tsx

Este archivo se encarga de mostrar visualmente un bloqueo temporal
mientras alguien está reservando un horario.

Qué hace:
- Renderiza un bloque visual encima del calendario.
- Indica que ese horario está siendo reservado por un área.
- Usa el color del área para:
  - El borde.
  - El fondo (con opacidad).
  - El texto.
- Muestra la abreviatura del área junto a "Reservando..".
- Tiene animación (pulse) para indicar que es temporal.

De qué depende:
- Recibe por props:
  - lock → información del bloqueo (incluye área y color).

Qué NO hace:
- No permite interacción.
- No maneja lógica.
- No guarda estado.
- No cancela ni confirma nada.

Resultado final:
- Un bloque visual animado que bloquea el horario
  mientras una reserva aún no ha sido confirmada.
*/

'use client';
import type { LockData } from './types';

type Props = { lock: LockData };

export default function LockBlock({ lock }: Props) {
  return (
    <div
      className="absolute inset-0.5 rounded-lg border-2 z-10 flex items-center justify-center text-[10px] font-bold animate-pulse"
      style={{
        borderColor: lock.area.color,
        backgroundColor: lock.area.color + '22', // 13% opacity
        color: lock.area.color,
      }}
    >
      <span className="truncate px-1">{lock.area.abbreviation} Reservando.. </span>
    </div>
  );
}