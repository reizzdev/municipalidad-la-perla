"use client";

import { useState } from "react";
import type { ReservationData } from "./types";

const TAB_HEIGHT = 24;
const TAB_WIDTH = 38;
const SLOT_HEIGHT = 50;

function slotsCount(startIso: string, endIso: string) {
  return Math.max(
    1,
    Math.round(
      (new Date(endIso).getTime() - new Date(startIso).getTime()) /
        (30 * 60 * 1000)
    )
  );
}

type Props = {
  reservations: ReservationData[];
  currentAreaId?: string;
  onCancel?: (id: string) => void;
  blockHeight: number;
  onBringToFront?: () => void;
  newestId?: string;
};

export default function ReservationBlock({
  reservations,
  currentAreaId,
  onCancel,
  blockHeight,
  onBringToFront,
  newestId,
}: Props) {
  const defaultId =
    newestId ??
    reservations[reservations.length - 1]?.id ??
    reservations[reservations.length - 1]?.reservationId ??
    "";

  const [activeId, setActiveId] = useState<string>(defaultId);

  const active =
    reservations.find((r) => (r.id ?? r.reservationId) === activeId) ??
    reservations[reservations.length - 1];

  if (!active) return null;

  const responsibleName =
    active.responsibleName ?? active.responsible_name ?? "";

  const roomName = active.room?.name ?? active.room_name ?? "";

  const canCancel =
    currentAreaId === active.area.id &&
    onCancel &&
    active.id &&
    new Date(active.startTime) > new Date();

  const activeHeight =
    slotsCount(active.startTime, active.endTime) * SLOT_HEIGHT - 1;

  // ✅ FUNCIÓN CORRECTA PARA FORMATEAR HORA
  const formatHora = (fecha: string | Date) =>
    new Date(fecha).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  async function descargarPDF() {
    try {
      const equipos =
        active.reservationEquipments
          ?.map((e) => e.equipment.name)
          .join(", ") ||
        active.equipments?.join(", ") ||
        "";

      // ✅ HORAS CORRECTAS (AQUÍ ESTABA EL ERROR)
      const horasCorrectas = `${formatHora(
        active.startTime
      )} - ${formatHora(active.endTime)}`;

      const res = await fetch("/api/generar-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          area: active.area.name,
          responsable: responsibleName,
          equipos,
          fecha: active.startTime.split("T")[0],
          horas: horasCorrectas, // 👈 FIX AQUÍ
          lugar: roomName,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error generando PDF:", errorText);
        alert("Error generando PDF. Revisa la consola del navegador.");
        return;
      }

      const blob = await res.blob();

      if (blob.size === 0) {
        alert("El PDF salió vacío. Revisa tu plantilla solicitud.docx.");
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "solicitud.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando PDF:", error);
      alert("No se pudo descargar el PDF.");
    }
  }

  return (
    <>
      {reservations.map((r, index) => {
        const rid = r.id ?? r.reservationId ?? "";
        const isActive = rid === activeId;

        return (
          <button
            key={rid}
            data-reservation-button="true"
            onClick={(e) => {
              e.stopPropagation();
              setActiveId(rid);
              onBringToFront?.();
            }}
            title={r.area.name}
            className="absolute rounded-r-md text-white font-bold shadow-md transition-all pointer-events-auto flex items-center justify-center"
            style={{
              top: index * TAB_HEIGHT,
              right: -TAB_WIDTH,
              width: TAB_WIDTH,
              height: TAB_HEIGHT,
              fontSize: 9,
              backgroundColor: r.area.color,
              opacity: isActive ? 1 : 0.6,
              zIndex: isActive ? 50 : 10 + index,
            }}
          >
            {r.area.abbreviation}
          </button>
        );
      })}

      <div
        className="absolute inset-x-0 top-0 rounded-l-lg overflow-hidden shadow-md flex flex-col"
        style={{ height: activeHeight }}
      >
        <div
          className="flex-1 flex flex-col px-1.5 py-1 relative group overflow-hidden"
          style={{ backgroundColor: active.area.color }}
        >
          <div className="flex flex-wrap gap-1 mb-1 pr-8">
            {reservations.map((r) => {
              const rid = r.id ?? r.reservationId ?? "";
              const eqs =
                r.reservationEquipments?.map((re) => re.equipment.name) ??
                r.equipments ??
                [];

              const label = eqs.join(" · ") || r.area.abbreviation;
              const isActive = rid === activeId;

              return (
                <button
                  key={rid}
                  data-reservation-button="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(rid);
                  }}
                  className="px-1.5 rounded text-white font-bold transition-all pointer-events-auto"
                  style={{
                    fontSize: 9,
                    lineHeight: "16px",
                    backgroundColor: r.area.color,
                    opacity: isActive ? 1 : 0.5,
                    border: isActive
                      ? "1px solid white"
                      : "1px solid transparent",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 flex items-center justify-center">
            <span className="font-black text-white text-sm tracking-wide drop-shadow">
              {active.area.abbreviation}
            </span>
          </div>

          {(responsibleName || roomName) && (
            <div className="text-white/85 truncate" style={{ fontSize: 9 }}>
              {responsibleName}
              {responsibleName && roomName ? " · " : ""}
              {roomName}
            </div>
          )}

          <button
            data-reservation-button="true"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              descargarPDF();
            }}
            className="absolute top-1 right-1 pointer-events-auto bg-white text-black rounded px-1 hover:bg-gray-200 transition-all"
            style={{ fontSize: 10 }}
          >
            PDF
          </button>

          {canCancel && (
            <button
              data-reservation-button="true"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onCancel!(active.id!);
              }}
              className="absolute bottom-1 right-1 pointer-events-auto bg-black/40 hover:bg-red-500 text-white rounded px-1 transition-all"
              style={{ fontSize: 10 }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </>
  );
}
