"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface IncidenceLog {
  id: string;
  action: "TARDANZA" | "MALOGRADO";
  description: string;
  createdAt: string;
  incidence: {
    area: {
      name: string;
      color: string;
    };
    equipments: {
      equipment: {
        id: string;
        name: string;
      };
    }[];
  };
}

export default function IncidenceLogsPage() {
  const [logs, setLogs] = useState<IncidenceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get("/api/incidencias/logs").then((res) => {
      setLogs(res.data);
      setLoading(false);
    });
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h1 className="text-3xl font-bold text-[#0b2b4c]">
            Incidencias
          </h1>
          <div className="hidden md:block w-40 h-[2px] bg-gradient-to-r from-[#3dbfb8] to-transparent" />
        </div>

        <button
          onClick={() => router.push("/admin/incidencias/crear")}
          className="bg-[#3dbfb8] hover:bg-[#34a8a2] text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
        >
          Nueva Incidencia
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="text-center text-slate-500">Cargando...</div>
      ) : logs.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow text-center text-slate-400">
          No hay incidencias registradas.
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {logs.map((log) => {
            const isTardanza = log.action === "TARDANZA";

            const bgColor = isTardanza
              ? "bg-yellow-50"
              : "bg-red-50";

            const borderColor = isTardanza
              ? "border-yellow-500"
              : "border-red-500";

            const badgeColor = isTardanza
              ? "bg-yellow-600"
              : "bg-red-600";

            return (
              <div
                key={log.id}
                className={`rounded-2xl border-l-4 ${borderColor} ${bgColor} px-6 py-5 shadow-sm hover:shadow-md transition`}
              >
                <div className="flex justify-between gap-6">
                  {/* IZQUIERDA */}
                  <div className="flex-1 space-y-3">

                    {/* Badge + Área */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full text-white ${badgeColor}`}
                      >
                        {log.action}
                      </span>

                      <span
                        className="text-sm font-semibold"
                        style={{ color: log.incidence.area.color }}
                      >
                        {log.incidence.area.name}
                      </span>
                    </div>

                    {/* Descripción */}
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {log.description}
                    </p>

                    {/* Equipos */}
                    {log.incidence.equipments &&
                      log.incidence.equipments.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {log.incidence.equipments.map((eq) => (
                            <span
                              key={eq.equipment.id}
                              className="bg-white/70 backdrop-blur text-slate-700 text-xs px-3 py-1 rounded-full border border-slate-200"
                            >
                              {eq.equipment.name}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* DERECHA - Fecha */}
                  <div className="text-xs text-slate-500 whitespace-nowrap self-start">
                    {formatDate(log.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}