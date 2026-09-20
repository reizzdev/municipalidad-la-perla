"use client";

import { useEffect, useState } from "react";
import api from '@/lib/api';

type IncidenceType = "TARDANZA" | "MALOGRADO";

interface Area {
  id: string;
  name: string;
}

interface Equipment {
  id: string;
  name: string;
}

export default function IncidenciasPage() {
  const [type, setType] = useState<IncidenceType>("TARDANZA");
  const [areas, setAreas] = useState<Area[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const [form, setForm] = useState({
    areaId: "",
    responsibleName: "",
    equipments: [] as string[],
  });

  // Cargar áreas y equipos desde API
  useEffect(() => {
    api.get<Area[]>("/api/areas").then((r) => setAreas(r.data));
    api.get<Equipment[]>( `/api/admin/equipments`).then((r) => setEquipments(r.data));
  }, []);

  const toggleEquipment = (id: string) => {
    setForm((prev) => ({
      ...prev,
      equipments: prev.equipments.includes(id)
        ? prev.equipments.filter((e) => e !== id)
        : [...prev.equipments, id],
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await api.post("/api/incidencias", {
      type,
      areaId: form.areaId,
      responsibleName: form.responsibleName,
      equipments: form.equipments,
    });

    alert("Incidencia registrada correctamente");

    // limpiar formulario
    setForm({
      areaId: "",
      responsibleName: "",
      equipments: [],
    });

  } catch (error) {
    console.error(error);
    alert("Error al registrar incidencia");
  }
};

  const isTardanza = type === "TARDANZA";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          CONTROL DE INCIDENCIAS
        </h1>

        {/* Selector tipo */}
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            onClick={() => setType("TARDANZA")}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              isTardanza
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            TARDANZA
          </button>

          <button
            type="button"
            onClick={() => setType("MALOGRADO")}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              !isTardanza
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            MALOGRADO
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Área */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Área
            </label>
            <select
              className="w-full border rounded-lg p-3"
              value={form.areaId}
              onChange={(e) =>
                setForm({ ...form, areaId: e.target.value })
              }
              required
            >
              <option value="">Seleccionar área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nombre del Responsable
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              placeholder="Ej. Juan Pérez"
              value={form.responsibleName}
              onChange={(e) =>
                setForm({
                  ...form,
                  responsibleName: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Equipos */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              {isTardanza
                ? "Equipos entregados tarde"
                : "Equipos malogrados"}
            </label>

            <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-gray-50">
              {equipments.map((eq) => (
                <label
                  key={eq.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.equipments.includes(eq.id)}
                    onChange={() => toggleEquipment(eq.id)}
                  />
                  {eq.name}
                </label>
              ))}
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-white transition ${
              isTardanza
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Registrar {type}
          </button>
        </form>
      </div>
    </div>
  );
}
