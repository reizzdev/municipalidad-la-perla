'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

type Noticia = {
  id: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  logoName?: string | null;
  imagenes: {
    id: string;
    fileName: string;
  }[];
};

export default function DetalleNoticiaPage() {
  const params = useParams();
const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [noticia, setNoticia] = useState<Noticia | null>(null);

  useEffect(() => {
    if (!id) return;

fetch(`http://localhost:4000/api/noticias/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Noticia no encontrada');
        return res.json();
      })
      .then((data) => setNoticia(data))
      .catch(() => setNoticia(null));
  }, [params.id]);

  async function eliminarNoticia() {
    if (!noticia) return;

    if (!confirm(`¿Eliminar "${noticia.titulo}"?`)) return;

    const { token } = getSession();

    if (!token) {
      alert('Sesión no válida');
      return;
    }

    const res = await fetch(
      `http://localhost:4000/api/noticias/${noticia.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert('No tienes permisos para eliminar');
      return;
    }

    router.push('/admin/noticia');
  }

  if (!noticia) return <div>No encontrada</div>;

  return (
    <main className="min-h-screen bg-white py-10">
      <div className="container-main max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <p className="text-blue-600 font-bold">
            {noticia.categoria}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() =>
                router.push(`/admin/noticia/${noticia.id}/editar`)
              }
              className="border px-4 py-2 text-blue-600"
            >
              Editar
            </button>

            <button
              onClick={eliminarNoticia}
              className="border px-4 py-2 text-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>

        {/* TITULO */}
        <h1 className="text-3xl font-bold text-center">
          {noticia.titulo}
        </h1>

        {/* LOGO */}
        <img
          src={`http://localhost:4000/api/noticias/${noticia.id}/logo`}
          className="mt-6 w-full object-cover rounded-xl"
        />

        {/* DESCRIPCION */}
        <div className="mt-6 whitespace-pre-line">
          {noticia.descripcion}
        </div>

        {/* FECHA */}
        <p className="mt-4 text-sm text-gray-500">
          Publicado el {noticia.fecha}
        </p>

        {/* IMAGENES */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {noticia.imagenes.map((img) => (
            <img
              key={img.id}
              src={`http://localhost:4000/api/noticias/imagenes/${img.id}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
        </div>

      </div>
    </main>
  );
}