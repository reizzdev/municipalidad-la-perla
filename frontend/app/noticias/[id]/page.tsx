'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type ImagenNoticia = {
  id: string;
  fileName: string;
};

type Noticia = {
  id: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  logoName?: string | null;
  imagenes?: ImagenNoticia[];
};

const API_URL = 'http://localhost:4000';

export default function DetalleNoticiaPage() {
  const params = useParams();
const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarNoticia() {
      try {
        const rutas = [
          `${API_URL}/noticias/${params.id}`,
          `${API_URL}/api/noticias/${params.id}`,
        ];

        let data: Noticia | null = null;

        for (const url of rutas) {
          const res = await fetch(url, { cache: 'no-store' });

          if (res.ok) {
            data = await res.json();
            break;
          }
        }

        if (!data) throw new Error('No se pudo cargar la noticia');

        setNoticia(data);
      } catch (error) {
        console.error('Error cargando noticia:', error);
        setNoticia(null);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) cargarNoticia();
  }, [params.id]);

  async function eliminarNoticia() {
    if (!noticia) return;

    if (!confirm(`¿Eliminar "${noticia.titulo}"?`)) return;

    try {
      const rutas = [
        `${API_URL}/noticias/${noticia.id}`,
        `${API_URL}/api/noticias/${noticia.id}`,
      ];

      for (const url of rutas) {
        const res = await fetch(url, { method: 'DELETE' });

        if (res.ok) {
          router.push('/noticias');
          router.refresh();
          return;
        }
      }

      throw new Error('No se pudo eliminar');
    } catch {
      alert('No tienes permisos o ocurrió un error');
    }
  }

  const logoUrl = noticia
    ? `${API_URL}/noticias/${noticia.id}/logo`
    : '';

  const logoUrlApi = noticia
    ? `${API_URL}/api/noticias/${noticia.id}/logo`
    : '';

  return (
    <>
      <TopBar />
      <Header />
      <Navbar />

      <main className="min-h-screen bg-white py-10">
        <div className="container-main max-w-4xl mx-auto">
          {loading ? (
            <p className="text-sm text-slate-500">Cargando noticia...</p>
          ) : !noticia ? (
            <p className="text-sm text-slate-500">No encontrada</p>
          ) : (
            <>
              <div className="flex justify-between mb-6">
                <p className="text-blue-600 font-bold uppercase">
                  {noticia.categoria}
                </p>


              </div>

              <h1 className="text-3xl font-bold text-center text-[#0b2b4c]">
                {noticia.titulo}
              </h1>

              {noticia.logoName && (
                <img
                  src={logoUrl}
                  alt={noticia.titulo}
                  className="mt-6 max-h-[420px] w-full object-contain"
                  onError={(e) => {
                    if (e.currentTarget.src !== logoUrlApi) {
                      e.currentTarget.src = logoUrlApi;
                    } else {
                      e.currentTarget.style.display = 'none';
                    }
                  }}
                />
              )}

              <div className="mt-6 whitespace-pre-line text-slate-700 leading-7">
                {noticia.descripcion}
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Publicado el{' '}
                {new Date(noticia.fecha).toLocaleDateString('es-PE')}
              </p>

              {noticia.imagenes && noticia.imagenes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {noticia.imagenes.map((img) => (
                    <img
                      key={img.id}
                      src={`${API_URL}/noticias/imagenes/${img.id}`}
                      alt={img.fileName}
                      className="h-56 w-full rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `${API_URL}/api/noticias/imagenes/${img.id}`;
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}