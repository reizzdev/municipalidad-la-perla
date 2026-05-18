"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type RangeMode = "semana" | "mes";

type StatCard = {
  totalEquipments: number;
  disabledEquipments: number;
  activeReservations: number;
  reservationsByDate: number;
};

type AreaReservationStat = {
  area: {
    id: string;
    name: string;
    abbreviation: string;
    color: string;
  };
  totalReservations: number;
};

type Incidencia = {
  id: string;
  type: "TARDANZA" | "MALOGRADO";
  responsibleName: string;
  createdAt: string;
  area: { name: string; abbreviation: string; color: string };
  equipments: { equipment: { name: string } }[];
};

type ReservationLog = {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  area: { name: string; abbreviation: string; color: string };
  reservation: {
    startTime: string;
    endTime: string;
    status: string;
  } | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRangeForMode(mode: RangeMode): { start: string; end: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (mode === "semana") {
    const day = now.getDay(); // 0 = domingo
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: fmt(monday), end: fmt(sunday) };
  } else {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: fmt(start), end: fmt(end) };
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function StatBox({
  label,
  value,
  accent,

}: {
  label: string;
  value: number | string;
  accent: string;

}) {
  // Detectar si el color es oscuro o claro
  const isDark = (hex: string) => {
    const c = hex.replace("#", "");
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 160;
  };

  const dark = isDark(accent);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 shadow-md transition hover:scale-[1.02]"
      style={{
        backgroundColor: accent,
        color: dark ? "#ffffff" : "#1f2937",
      }}
    >
  

      <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
        {label}
      </p>

      <p className="mt-2 text-4xl font-black">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
        {children}
      </h2>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const { area, loading } = useAuth();

  // Rango
  const [mode, setMode] = useState<RangeMode>("semana");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customRange, setCustomRange] = useState(false);

  // Datos
  const [stats, setStats] = useState<StatCard | null>(null);
  const [areaStats, setAreaStats] = useState<AreaReservationStat[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [logs, setLogs] = useState<ReservationLog[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Protección
  useEffect(() => {
    if (loading) return;
    if (!area?.permissions?.includes("DASHBOARD_VIEW")) {
      router.replace("/admin/calendario");
    }
  }, [loading, area, router]);

  // Inicializar rango al modo
  useEffect(() => {
    if (!customRange) {
      const { start, end } = getRangeForMode(mode);
      setStartDate(start);
      setEndDate(end);
    }
  }, [mode, customRange]);

  const fetchAll = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoadingData(true);
    try {
      const [statsRes, areaStatsRes, incidenciasRes, logsRes] =
        await Promise.all([
          api.get<StatCard>(
            `/api/admin/stats?start=${startDate}&end=${endDate}`
          ),
          api.get<AreaReservationStat[]>("/api/logs/dashboard"),
          api.get<Incidencia[]>("/api/incidencias"),
          api.get<ReservationLog[]>("/api/logs?limit=100"),
        ]);

      setStats(statsRes.data);
      setAreaStats(areaStatsRes.data);
      setIncidencias(incidenciasRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  }, [startDate, endDate]);

  // Fetch cuando el rango cambie
  useEffect(() => {
    if (!loading && area?.permissions?.includes("DASHBOARD_VIEW") && startDate && endDate) {
      fetchAll();
    }
  }, [loading, area, startDate, endDate, fetchAll]);

  // ── Filtros derivados ─────────────────────────────────────────────────────

  const rangeStart = new Date(startDate + "T00:00:00");
  const rangeEnd = new Date(endDate + "T23:59:59");

  const incidenciasEnRango = incidencias.filter((i) => {
    const d = new Date(i.createdAt);
    return d >= rangeStart && d <= rangeEnd;
  });

  const tardanzas = incidenciasEnRango.filter((i) => i.type === "TARDANZA");
  const malogrados = incidenciasEnRango.filter((i) => i.type === "MALOGRADO");

  const logsEnRango = logs.filter((l) => {
    const d = new Date(l.createdAt);
    return d >= rangeStart && d <= rangeEnd;
  });

  const reservasLogs = logsEnRango.filter((l) => l.action === "RESERVATION");
  const cancelacionesLogs = logsEnRango.filter(
    (l) => l.action === "CANCELLATION"
  );

  // Equipos más pedidos en el rango (desde logs de reserva)
  // Contamos cuántas veces aparece cada área en reservas del rango
  const porArea: Record<string, { area: AreaReservationStat["area"]; count: number }> = {};
  reservasLogs.forEach((l) => {
    if (!l.area) return;
    const key = l.area.abbreviation;
    if (!porArea[key]) porArea[key] = { area: l.area, count: 0 };
    porArea[key].count++;
  });
  const topAreas = Object.values(porArea).sort((a, b) => b.count - a.count);

  // Incidencias agrupadas por área
  const incidPorArea: Record<
    string,
    { area: Incidencia["area"]; tardanzas: number; malogrados: number }
  > = {};
  incidenciasEnRango.forEach((i) => {
    const key = i.area.abbreviation;
    if (!incidPorArea[key])
      incidPorArea[key] = { area: i.area, tardanzas: 0, malogrados: 0 };
    if (i.type === "TARDANZA") incidPorArea[key].tardanzas++;
    else incidPorArea[key].malogrados++;
  });
  const incidResumen = Object.values(incidPorArea).sort(
    (a, b) => b.tardanzas + b.malogrados - (a.tardanzas + a.malogrados)
  );

  // ─────────────────────────────────────────────────────────────────────────

  if (loading || !area?.permissions?.includes("DASHBOARD_VIEW")) return null;

  const modeLabel = mode === "semana" ? "esta semana" : "este mes";

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-6 md:p-10 space-y-10 font-sans">

      {/* ── Encabezado ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Panel de control
          </p>
          <h1 className="text-3xl font-black text-[#0b2b4c] leading-tight">
            Dashboard
          </h1>
        </div>

        {/* Controles de rango */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Botones semana / mes */}
          <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {(["semana", "mes"] as RangeMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setCustomRange(false); }}
                className={`px-4 py-2 text-sm font-bold capitalize transition-colors ${
                  mode === m && !customRange
                    ? "bg-[#0b2b4c] text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {m === "semana" ? "Esta semana" : "Este mes"}
              </button>
            ))}
          </div>

          {/* Rango manual */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <input
              type="date"
              className="text-sm text-slate-600 outline-none bg-transparent"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCustomRange(true); }}
            />
            <span className="text-slate-300">→</span>
            <input
              type="date"
              className="text-sm text-slate-600 outline-none bg-transparent"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCustomRange(true); }}
            />
          </div>

          <button
            onClick={fetchAll}
            disabled={loadingData}
            className="rounded-xl bg-[#0b2b4c] px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#1a3a5c] disabled:opacity-50 transition-colors"
          >
            {loadingData ? "Cargando…" : "Actualizar"}
          </button>
        </div>
      </div>

      {/* ── Tarjetas principales ── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox
            label="Total equipos"
            value={stats.totalEquipments}
            accent="#1d948e"
          />
          <StatBox
            label="Equipos inhabilitados"
            value={stats.disabledEquipments}
            accent="#c58618"
          />
          <StatBox
            label="Reservas activas ahora"
            value={stats.activeReservations}
            accent="#129241"
          />
          <StatBox
            label={`Reservas ${modeLabel}`}
            value={stats.reservationsByDate}
            accent="#3a3cbb"
          />
        </div>
      )}

      {/* ── Fila 2: actividad + incidencias resumen ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Actividad del rango */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <SectionTitle>Actividad en rango</SectionTitle>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Reservas confirmadas</span>
              <span className="text-lg font-black text-[#0b2b4c]">
                {reservasLogs.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Cancelaciones</span>
              <span className="text-lg font-black text-red-500">
                {cancelacionesLogs.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Tardanzas</span>
              <span className="text-lg font-black text-amber-500">
                {tardanzas.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Equipos malogrados</span>
              <span className="text-lg font-black text-rose-600">
                {malogrados.length}
              </span>
            </div>
          </div>

          {/* Mini barra proporcional */}
          {reservasLogs.length + cancelacionesLogs.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-slate-400 mb-1">Reservas vs Cancelaciones</p>
              <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
                <div
                  className="bg-[#3dbfb8] transition-all"
                  style={{
                    width: `${Math.round(
                      (reservasLogs.length /
                        (reservasLogs.length + cancelacionesLogs.length)) *
                        100
                    )}%`,
                  }}
                />
                <div className="bg-red-400 flex-1" />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>✔ Confirmadas</span>
                <span>✖ Canceladas</span>
              </div>
            </div>
          )}
        </div>

        {/* Incidencias por área */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionTitle>Incidencias por área en rango</SectionTitle>

          {incidResumen.length === 0 ? (
            <p className="text-sm text-slate-400 mt-4">
              Sin incidencias en este período 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {incidResumen.map((r) => (
                <div
                  key={r.area.abbreviation}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
                >
                  <Badge color={r.area.color} label={r.area.abbreviation} />
                  <span className="flex-1 text-sm font-semibold text-slate-700">
                    {r.area.name}
                  </span>
                  {r.tardanzas > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                       {r.tardanzas} tardanza{r.tardanzas > 1 ? "s" : ""}
                    </span>
                  )}
                  {r.malogrados > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 rounded-full px-2 py-0.5">
                       {r.malogrados} malogrado{r.malogrados > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Fila 3: top áreas que más reservan + histórico global ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Áreas que más reservaron en el rango */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionTitle>Áreas más activas en rango</SectionTitle>

          {topAreas.length === 0 ? (
            <p className="text-sm text-slate-400 mt-4">Sin reservas en este período.</p>
          ) : (
            <div className="space-y-3 mt-2">
              {topAreas.map((a, i) => {
                const max = topAreas[0].count;
                const pct = Math.round((a.count / max) * 100);
                return (
                  <div key={a.area.abbreviation}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                        <Badge color={a.area.color} label={a.area.abbreviation} />
                        <span className="text-sm font-semibold text-slate-700">
                          {a.area.name}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-800">
                        {a.count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: a.area.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Histórico total por área (todos los tiempos) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionTitle>Historial total por área</SectionTitle>
          <p className="text-xs text-slate-400 mb-4">Todas las reservas registradas</p>

          {areaStats.length === 0 ? (
            <p className="text-sm text-slate-400">Sin datos.</p>
          ) : (
            <div className="space-y-3">
              {areaStats
                .sort((a, b) => b.totalReservations - a.totalReservations)
                .map((a, i) => {
                  const max = areaStats[0].totalReservations;
                  const pct = Math.round((a.totalReservations / max) * 100);
                  return (
                    <div key={a.area.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                          <Badge color={a.area.color} label={a.area.abbreviation} />
                          <span className="text-sm font-semibold text-slate-700">
                            {a.area.name}
                          </span>
                        </div>
                        <span className="text-sm font-black text-slate-800">
                          {a.totalReservations}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: a.area.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* ── Fila 4: Detalle de incidencias recientes ── */}
      {incidenciasEnRango.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionTitle>
            Detalle de incidencias — {modeLabel}
          </SectionTitle>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="pb-3 pr-4">Tipo</th>
                  <th className="pb-3 pr-4">Área</th>
                  <th className="pb-3 pr-4">Responsable</th>
                  <th className="pb-3 pr-4">Equipos</th>
                  <th className="pb-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {incidenciasEnRango.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      {inc.type === "TARDANZA" ? (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                           Tardanza
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 rounded-full px-2 py-0.5">
                           Malogrado
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge color={inc.area.color} label={inc.area.abbreviation} />
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{inc.responsibleName}</td>
                    <td className="py-3 pr-4 text-slate-500">
                      {inc.equipments.map((e) => e.equipment.name).join(", ")}
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {formatDate(inc.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Fila 5: Log de reservas recientes en rango ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <SectionTitle>Actividad reciente en rango</SectionTitle>

        {logsEnRango.length === 0 ? (
          <p className="text-sm text-slate-400 mt-2">Sin actividad en este período.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {logsEnRango.slice(0, 30).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3"
              >
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug truncate">
                    {log.description}
                  </p>
                </div>
                <span className="flex-shrink-0 text-xs text-slate-400">
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