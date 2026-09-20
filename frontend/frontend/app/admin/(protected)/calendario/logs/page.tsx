"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSession } from "@/lib/auth";

interface ReservationLog {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  area?: {
    name: string;
    abbreviation: string;
  };
}

export default function AdminLogs() {
  const { token } = getSession();
  const [logs, setLogs] = useState<ReservationLog[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/reservations/logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-4">
          Logs de Reservas
        </h1>

        {logs.length === 0 ? (
          <p className="text-sm text-slate-400">
            No hay actividad registrada.
          </p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 hover:bg-slate-100 transition"
              >
                {/* Badge */}
                <span
                  className={`mt-0.5 flex-shrink-0 text-xs font-black rounded-full px-2 py-0.5 ${
                    log.action === "RESERVATION"
                      ? "bg-[#3dbfb8]/10 text-[#3dbfb8]"
                      : log.action === "CANCELLATION"
                      ? "bg-red-50 text-red-500"
                      : "bg-blue-50 text-blue-500"
                  }`}
                >
                  {log.action === "RESERVATION"
                    ? "RESERVA"
                    : log.action === "CANCELLATION"
                    ? "CANCEL."
                    : "DEVOLUC."}
                </span>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">
                    {log.description}
                  </p>

                  {log.area && (
                    <p className="text-xs text-slate-400 mt-1">
                      Área: {log.area.name} ({log.area.abbreviation})
                    </p>
                  )}
                </div>

                {/* Fecha */}
                <span className="flex-shrink-0 text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}