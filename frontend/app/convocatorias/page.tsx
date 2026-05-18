"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';

import ContactSection from "@/components/sections/ContactSection";

import Footer from "@/components/layout/Footer";

type Documento = {
  id: string;
  section: string;
  fileName: string;
  fileMimeType: string;
  fileSize: number;
  createdAt: string;
};

type Convocatoria = {
  id: string;
  title: string;
  description: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  documentos?: Documento[];
};

export default function ConvocatoriasPage() {
  const [items, setItems] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/convocatorias")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  const years = useMemo(() => {
    return Array.from(
      new Set(items.map((item) => new Date(item.createdAt).getFullYear()))
    ).sort((a, b) => b - a);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!year) return items;

    return items.filter(
      (item) => new Date(item.createdAt).getFullYear().toString() === year
    );
  }, [items, year]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <div className="p-10">Cargando...</div>;

  return (
    <>

      <TopBar />
      <Header />
      <Navbar />
      <main className="min-h-screen bg-slate-100 py-14">
        <section className="container-main">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Convocatorias
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Consulta las convocatorias publicadas por año.
                </p>
              </div>

              <div className="w-full md:w-56">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Buscar por año
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Todos los años</option>
                  {years.map((itemYear) => (
                    <option key={itemYear} value={itemYear}>
                      {itemYear}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full border-collapse">
                <thead className="bg-slate-800 text-left text-sm text-white">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Título</th>
                    <th className="px-5 py-4 font-semibold">Descripción</th>
                    <th className="px-5 py-4 font-semibold">Fecha</th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Documentos
                    </th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-sm">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {item.title}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                           <p className="max-w-xs line-clamp-2">
                          {item.description}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {item.documentos?.length ?? 0}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/convocatorias/${item.id}`}
                            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            Ver detalle
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-slate-500"
                      >
                        No se encontraron convocatorias para el año seleccionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <ContactSection />
         <Footer />
    </>
  );
}