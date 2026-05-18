'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Noticia = {
  id: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  logo: string;
  imagenes: string[];
  fecha: string;
};

export default function EditarNoticiaPage() {
  const params = useParams();
const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [message, setMessage] = useState('');

 useEffect(() => {
  if (!id) return;

fetch(`http://localhost:4000/api/noticias/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error('Noticia no encontrada');
      return res.json();
    })
    .then((data) => {
      setNoticia(data);
      setTitulo(data.titulo);
      setDescripcion(data.descripcion);
      setCategoria(data.categoria);
    })
    .catch(() => {
      setNoticia(null);
    });
}, [params.id]);

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!noticia) return;

  if (!titulo.trim() || !descripcion.trim() || !categoria) {
    setMessage('Título, descripción y categoría son obligatorios');
    return;
  }

  const token = localStorage.getItem('muni_token');

  if (!token) {
    setMessage('No estás autenticado');
    return;
  }

  try {
    const formData = new FormData();

    formData.append('titulo', titulo.trim());
    formData.append('descripcion', descripcion.trim());
    formData.append('categoria', categoria);

    // 👉 enviar logo si hay uno nuevo
    if (logo) {
      formData.append('logo', logo);
    }

    // 👉 enviar imágenes nuevas
    imagenes.forEach((img) => {
      formData.append('imagenes', img);
    });

    const res = await fetch(
      `http://localhost:4000/api/noticias/${noticia.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ NO pongas Content-Type aquí
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error('Error al actualizar:', error);
      setMessage('Error al actualizar noticia');
      return;
    }
console.log('ID:', noticia.id);
console.log('TYPE:', typeof noticia.id);
    router.push(`/admin/noticia/${noticia.id}`);
  } catch (error) {
    console.error(error);
    setMessage('Ocurrió un error');
  }
}

  if (!noticia) {
    return (
      <>

        <main className="min-h-screen bg-white py-20 text-center text-slate-500">
          Noticia no encontrada.
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-slate-100 py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200"
        >
          <div className="border-b border-slate-200 px-8 py-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Editar noticia
            </h1>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Título *
              </label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 min-h-[180px] outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Categoría *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Seleccione una categoría</option>
                <option value="TRÁMITES">Trámites</option>
                <option value="OBRAS">Obras</option>
                <option value="COMERCIO">Comercio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Logo actual
              </label>

              {noticia.logo ? (
                <img
                  src={noticia.logo}
                  alt={noticia.titulo}
                  className="mb-3 h-40 w-full rounded-xl object-cover"
                />
              ) : (
                <p className="mb-3 text-sm text-slate-500">Sin logo</p>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
              />

              {logo && (
                <p className="mt-2 text-sm text-slate-500">
                  Nuevo logo: {logo.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Imágenes adicionales actuales
              </label>

              {noticia.imagenes.length > 0 ? (
                <div className="mb-3 grid grid-cols-3 gap-3">
                  {noticia.imagenes.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Imagen actual ${index + 1}`}
                      className="h-28 w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              ) : (
                <p className="mb-3 text-sm text-slate-500">
                  Sin imágenes adicionales
                </p>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setImagenes(Array.from(e.target.files || []))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
              />

              {imagenes.length > 0 && (
                <div className="mt-2 text-sm text-slate-500 space-y-1">
                  {imagenes.map((img, index) => (
                    <p key={index}>• Nueva imagen: {img.name}</p>
                  ))}
                </div>
              )}
            </div>

            {message && (
              <div className="rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-600 border border-red-200">
                {message}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push(`/admin/noticia/${noticia.id}`)}
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}