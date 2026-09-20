"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactSection from "@/components/sections/ContactSection";
import Breadcrumb from "@/components/ui/Breadcrumb";

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
    fetch("http://localhost:4000/api/noticias")
      .then((res) => res.json())
      .then((data: Noticia[]) => {
        // Las destacadas siempre primero
        const ordenadas = [
          ...data.filter((n) => n.destacada),
          ...data.filter((n) => !n.destacada),
        ];
        setNoticias(Array.isArray(data) ? ordenadas : []);
      })
      .catch(() => setNoticias([]));
  }, []);

  return (
    <>
      <TopBar />
      <Header />
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-4">
        <Breadcrumb
          items={[{ label: "Inicio", href: "/" }, { label: "Noticias" }]}
        />
        <section className="container-main">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <h1 className="text-3xl font-bold text-[#0b2b4c]">Noticias</h1>
              <div className="hidden md:block w-40 h-[2px] bg-gradient-to-r from-[#3dbfb8] to-transparent" />
            </div>
          </div>

          {noticias.length === 0 ? (
            <p className="text-sm text-slate-500">
              No hay noticias publicadas.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {noticias.map((noticia) => (
                <Link
                  href={`/noticias/${noticia.id}`}
                  key={noticia.id}
                  className="group"
                >
                  <article>
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                      {noticia.destacada && (
                        <span className="inline-block mt-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-2 rounded">
                          Destacada
                        </span>
                      )}

                      <img
                        src={
                          noticia.logoName
                            ? `http://localhost:4000/api/noticias/${noticia.id}/logo`
                            : "/noticia.jpg"
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

                      <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm text-slate-500">
                        {noticia.descripcion}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <ContactSection />
      <Footer />
    </>
  );
}
