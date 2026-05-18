'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function NuevaNoticiaPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoria, setCategoria] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [extraImages, setExtraImages] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !categoria) {
      setMessage('Título, descripción y categoría son obligatorios');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const formData = new FormData();

      formData.append('titulo', title.trim());
      formData.append('descripcion', description.trim());
      formData.append('categoria', categoria);

      if (logo) {
        formData.append('logo', logo);
      }

      extraImages.forEach((img, index) => {
        formData.append(`imagen_${index}`, img);
      });
const token = localStorage.getItem('muni_token');
    const res = await fetch('http://localhost:4000/api/noticias', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'No se pudo guardar');
      }

      router.push('/admin/noticia');
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage('No se pudo guardar la noticia en la base de datos');
    } finally {
      setLoading(false);
    }
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
              Agregar noticia
            </h1>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ingrese el título"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ingrese la descripción"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 min-h-[140px] outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
              />

              {logo && (
                <p className="mt-2 text-sm text-slate-500">
                  Logo seleccionado: {logo.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Imágenes adicionales
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setExtraImages(Array.from(e.target.files || []))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
              />

              {extraImages.length > 0 && (
                <div className="mt-2 text-sm text-slate-500 space-y-1">
                  {extraImages.map((img, index) => (
                    <p key={index}>• {img.name}</p>
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
                onClick={() => router.push('/admin/noticia')}
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? 'Guardando...' : 'Guardar noticia'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}