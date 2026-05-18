'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Noticia = {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  destacada: boolean; 
};

export default function NewsSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("http://localhost:4000/api/noticias")
    .then((res) => res.json())
    .then((data: Noticia[]) => {
      // Primero las destacadas, luego el resto, y toma solo 3
      const ordenadas = [
        ...data.filter((n) => n.destacada),
        ...data.filter((n) => !n.destacada),
      ];
      setNoticias(ordenadas.slice(0, 3));
    })
    .catch(() => setNoticias([]))
    .finally(() => setLoading(false));
}, []);

  return (
    <section id="noticias" className="py-16">
      <div className="container-main">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a3a5c]">
              Noticias
            </h2>
            <div className="hidden md:block w-40 h-[2px] bg-gradient-to-r from-[#3dbfb8] to-transparent" />
          </div>

          <Link
            href="/noticias"
            className="group flex items-center gap-2 text-sm font-bold text-[#3389B5] hover:text-[#1a3a5c] transition-colors"
          >
            Ver todas
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {loading && (
            <p className="text-slate-500">Cargando noticias...</p>
          )}

          {!loading && noticias.map((noticia) => (
            <Link
              key={noticia.id}
              href={`/noticias/${noticia.id}`}
              className="group flex flex-col gap-4"
            >
              {/* Imagen */}
              <div className="relative h-60 rounded-xl overflow-hidden">
                <img
                  src={`http://localhost:4000/api/noticias/${noticia.id}/logo`}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Texto */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-[#278DC4]">
                  {noticia.categoria}
                </span>

                <h3 className="mt-2 font-bold text-[#1a3a5c] group-hover:text-[#BA3A0B] transition-colors">
                  {noticia.titulo}
                </h3>

                <p className="text-sm text-[#6b7a8d] mt-1 line-clamp-2">
                  {noticia.descripcion}
                </p>
              </div>
            </Link>
          ))}

        </div>

        {/* Línea decorativa */}
        <div className="mt-12 h-[3px] bg-gradient-to-r from-[#1a3a5c] via-[#3dbfb8] to-[#e8a020] rounded-full" />
      </div>
    </section>
  );
}