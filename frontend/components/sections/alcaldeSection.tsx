"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function HighlightSection() {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // LOAD IMAGE
  useEffect(() => {
    async function loadAlcalde() {
      try {
        const res = await api.get("api/website-images/alcalde");

        if (res.data.length > 0) {
          setImageUrl(res.data[0].imageUrl);
        }
      } catch (error) {
        console.error("Error cargando imagen del alcalde");
      }
    }

    loadAlcalde();
  }, []);

  if (!imageUrl) return null;

  return (
    <section className="relative w-full overflow-hidden bg-white md:pt-18">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/fondo-ciudad.jpg"
          alt="background"
          className="h-full w-full object-cover blur-md"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-transparent" />
      </div>

      <div className="container-main relative z-10">
        {/* MOBILE */}
        <div className="space-y-6 md:hidden">
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="Mensaje del Alcalde"
              className="w-64 select-none object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold text-[#1a3a5c]">
            Mensaje del Alcalde
          </h2>

          <p className="text-lg text-gray-700">
            El alcalde lidera con compromiso la gestión municipal,
            promoviendo desarrollo sostenible y bienestar ciudadano.
          </p>

          <div className="flex justify-end pb-10">
            <button
              onClick={() => router.push("/ciudad")}
              className="rounded-lg bg-[#1a3a5c] px-6 py-3 text-white shadow-md transition hover:bg-[#15304d]"
            >
              Más de la ciudad
            </button>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden items-end md:flex">
          <img
            src={imageUrl}
            alt="Mensaje del Alcalde"
            className="relative z-30 w-[500px] select-none object-contain"
          />

          <div className="relative ml-[-50px] flex-1">
            <div className="bg-[#1a3a5c] px-12 py-10 text-white shadow-xl -skew-x-6">
              <div className="skew-x-6">
                <h2 className="text-5xl font-bold">
                  Mensaje del Alcalde
                </h2>
              </div>
            </div>

            <div className="ml-12 mt-[-25px] bg-gray-100/95 px-12 py-10 shadow-lg backdrop-blur-sm -skew-x-6">
              <div className="skew-x-6">
                <p className="mb-4 text-lg leading-relaxed text-gray-700">
                  El alcalde lidera con compromiso la gestión municipal,
                  promoviendo desarrollo sostenible y bienestar ciudadano.
                </p>

                <p className="mb-6 text-lg leading-relaxed text-gray-600">
                  Su gestión impulsa proyectos estratégicos en seguridad,
                  infraestructura y participación vecinal.
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => router.push("/ciudad")}
                    className="rounded-lg bg-[#1a3a5c] px-6 py-3 text-white shadow-md transition hover:bg-[#15304d]"
                  >
                    Más de la ciudad
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}