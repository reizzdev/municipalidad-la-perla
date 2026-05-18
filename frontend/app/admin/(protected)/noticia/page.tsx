'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth'; // 👈 usa tu helper

type Noticia = {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  logoName?: string | null;
  destacada: boolean;
};

export default function NoticiaPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/noticias')
      .then((res) => res.json())
      .then((data) => setNoticias(Array.isArray(data) ? data : []))
      .catch(() => setNoticias([]));
  }, []);

  const handleDelete = async (id: string) => {
    const ok = confirm('¿Seguro que deseas eliminar esta noticia?');
    if (!ok) return;

    const { token } = getSession(); // 👈 limpio

    if (!token) {
      alert('Sesión no válida');
      return;
    }

    const res = await fetch(
      `http://localhost:4000/api/noticias/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const error = await res.text();
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar la noticia');
      return;
    }

    setNoticias((prev) => prev.filter((n) => n.id !== id));
  };


const handleToggleDestacada = async (id: string, valor: boolean) => {
  const { token } = getSession();
  const res = await fetch(`http://localhost:4000/api/noticias/${id}/destacada`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ destacada: valor }),
  });

  if (res.ok) {
    setNoticias((prev) =>
      prev.map((n) => (n.id === id ? { ...n, destacada: valor } : n))
    );
  }
};

  return (
    <main className="min-h-screen bg-slate-100 py-14">
      <section className="container-main">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h1 className="text-3xl font-bold text-[#0b2b4c]">
              Noticias
            </h1>
            <div className="hidden md:block w-40 h-[2px] bg-gradient-to-r from-[#3dbfb8] to-transparent" />
          </div>

          <Link
            href="/admin/noticia/nuevo"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Nueva noticia
          </Link>
        </div>

        {noticias.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay noticias publicadas.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {noticias.map((noticia) => (
              <div key={noticia.id} className="group relative">
                <Link href={`/admin/noticia/${noticia.id}`}>
                  <article>
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                      <img
                        src={
                          noticia.logoName
                            ? `http://localhost:4000/api/noticias/${noticia.id}/logo`
                            : '/noticia.jpg'
                        }
                        alt={noticia.titulo}
                        className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase text-blue-500">
                        {noticia.categoria}
                      </p>

                      <h2 className="mt-2 text-base font-bold text-[#0b2b4c]">
                        {noticia.titulo}
                      </h2>

                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {noticia.descripcion}
                      </p>
                    </div>
                  </article>
                </Link>

                {/* Botones admin */}
                <div className="absolute top-2 right-2 flex gap-2">

<label className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded cursor-pointer">
  <input
    type="checkbox"
    checked={noticia.destacada}
    onChange={(e) => handleToggleDestacada(noticia.id, e.target.checked)}
  />
  Destacada
</label>

                  <Link
                    href={`/admin/noticia/${noticia.id}/editar`}
                    className="rounded bg-yellow-600 px-2 py-1 text-xs font-semibold text-white hover:bg-yellow-600"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => handleDelete(noticia.id)}
                    className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}