
/*
ReservationModal.tsx

Este archivo se encarga de mostrar el modal (ventana emergente)
para confirmar una nueva reserva después de seleccionar un horario.

Qué hace:
- Muestra el rango de horas seleccionado.
- Muestra un temporizador (cuenta regresiva) mientras la reserva está bloqueada temporalmente.
- Permite elegir:
  - Equipos disponibles en ese horario.
  - Un responsable del área.
  - Un lugar (sala).
- Valida que todos los campos estén seleccionados antes de confirmar.
- Llama a onConfirm con los datos necesarios para finalizar la reserva.
- Permite cancelar la reserva temporal con onCancel.

De qué depende:
- Recibe por props:
  - reservationId → ID de la reserva temporal.
  - startTime / endTime → horario reservado.
  - returnEnd → hora límite de devolución.
  - area → información del área (color, nombre, etc).
  - availableEquipments → equipos ya filtrados y disponibles.
  - onConfirm → función que termina de confirmar la reserva.
  - onCancel → función para cancelar.
  - secondsLeft → tiempo restante del bloqueo temporal.

Qué controla internamente:
- Guarda qué equipos fueron seleccionados.
- Guarda qué responsable y sala fueron elegidos.
- Muestra errores si falta algún dato.
- Cambia el color del temporizador según el tiempo restante.
- Hace una llamada al backend para cargar responsables y salas al abrirse.

Resultado final:
- Una ventana interactiva que completa la información de la reserva.
- Solo permite confirmar si todo está correctamente seleccionado.
- Envía los datos al componente padre para que se guarden en la base de datos.
*/

'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import type { Equipment, Responsible, Room, AreaInfo } from './types';
import api from '@/lib/api';

type Props = {
  reservationId: string;
  startTime: Date;
  endTime: Date;
  returnEnd: Date;
  area: AreaInfo;
  availableEquipments: Equipment[]; // ← viene del padre, ya filtrados
  onConfirm: (data: {
    reservationId: string;
    equipmentIds: string[];
    responsibleName: string;
    roomId: string;
  }) => void;
  onCancel: () => void;
  secondsLeft: number;
};

function formatTime(d: Date) {
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

export default function ReservationModal({
  reservationId,
  startTime,
  endTime,
  returnEnd,
  area,
  availableEquipments,
  onConfirm,
  onCancel,
  secondsLeft,
}: Props) {
  //const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [responsibleName, setResponsibleName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Cargar responsables y salas una vez
  useState(() => {
    Promise.all([
      api.get<Responsible[]>(`/api/areas/${area.id}/responsibles`),
      api.get<Room[]>('/api/areas/rooms/all'),
    ]).then(([resp, rm]) => {
      //setResponsibles(resp.data);
      setRooms(rm.data);
      setLoaded(true);
    });
  });

  function toggleEquipment(id: string) {
    setSelectedEquipments((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  }

  async function handleConfirm() {
    if (!selectedEquipments.length) { setError('Selecciona al menos un equipo'); return; }
    if (!responsibleName) { setError('Selecciona un responsable'); return; }
    if (!selectedRoom) { setError('Selecciona un lugar'); return; }
    setSubmitting(true);
    setError('');
    try {
      onConfirm({ reservationId, equipmentIds: selectedEquipments, responsibleName: responsibleName, roomId: selectedRoom });
    } catch {
      setError('Error al confirmar. Intenta de nuevo.');
      setSubmitting(false);
    }
  }

  const timerColor = secondsLeft > 120 ? '#16a34a' : secondsLeft > 60 ? '#d97706' : '#dc2626';

  return (
    <div 
  className="fixed inset-0 flex items-center justify-center bg-black/40 p-4"
  style={{ zIndex: 100 }}
>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between text-white"
          style={{ backgroundColor: area.color }}>
          <div>
            <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">
              Nuevo Prestamo para {area.name} ( {area.abbreviation} )
            </p>
            <p className="text-lg font-black">
              {formatTime(startTime)} ➔ {formatTime(endTime)}
              <span className="text-xs font-normal opacity-70 ml-2">
                devolver hasta {formatTime(endTime)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-black tabular-nums px-2 py-1 rounded-lg bg-white/20"
              style={{ color: timerColor === '#16a34a' ? 'white' : timerColor }}>
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </div>
            <button onClick={onCancel} className="hover:opacity-70 transition-opacity">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Equipos disponibles */}
          <div className='p-4 bg-gray-100 rounded-lg'>
            <h4 className="text-xs font-bold text-[#1a3a5c] uppercase tracking-wide mb-1">
              EQUIPOS DISPONIBLES
            </h4>
            {availableEquipments.length === 0 ? (
              <p className="text-sm text-red-500 font-medium mt-2">
                No hay equipos disponibles en este horario
              </p>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                {availableEquipments.map((eq) => {
                  const selected = selectedEquipments.includes(eq.id);
                  return (
                    <button
                      key={eq.id}
                      onClick={() => toggleEquipment(eq.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left border-2 transition-all
                        ${selected
                          ? 'border-[#1a3a5c] bg-[#1a3a5c] text-white'
                          : 'border-gray-200 text-[#1a3a5c] hover:border-[#1a3a5c]'
                        }`}
                    >
                      {selected ? '✓ ' : ''}{eq.name}
                     
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Responsable + Lugar */}
          <div className="flex flex-col gap-4">
           <div className='p-4 bg-gray-100 rounded-lg'>
  <h4 className="text-xs font-bold text-[#1a3a5c] uppercase tracking-wide mb-2">
    RESPONSABLE DE LOS EQUIPOS?
  </h4>

  <input
    type="text"
    placeholder="Escribe el nombre del responsable"
    value={responsibleName}
    onChange={(e) => setResponsibleName(e.target.value)}
    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#1a3a5c]"
  />
</div>

            <div className='p-4 bg-gray-100 rounded-lg'>
              <h4 className="text-xs font-bold text-[#1a3a5c] uppercase tracking-wide mb-2">
                LUGAR?
              </h4>
              <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
                {rooms.map((rm) => (
                  <label key={rm.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all
                      ${selectedRoom === rm.id
                        ? 'border-[#1a3a5c] bg-[#1a3a5c]/5 font-semibold text-[#1a3a5c]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}>
                    <input type="radio" name="room" value={rm.id}
                      checked={selectedRoom === rm.id}
                      onChange={() => setSelectedRoom(rm.id)}
                      className="accent-[#1a3a5c]" />
                    {rm.name}
                    {rm.floor && <span className="text-xs text-gray-400 ml-auto">{rm.floor}</span>}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && <p className="px-6 pb-2 text-sm text-red-600 font-medium">{error}</p>}

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={handleConfirm} disabled={submitting || availableEquipments.length === 0}
            className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: area.color }}>
            {submitting ? 'Confirmando…' : 'Confirmar Reserva'}
          </button>
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold text-sm hover:border-gray-400 transition-all">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}