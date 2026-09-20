"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

type HeroImage = {
  id: string;
  imageUrl: string;
  altText: string;
  section: string;
};

const defaultImage: HeroImage = {
  id: "default-newsbox",
  imageUrl: "/images/pagame.png",
  altText: "Imagen pago en línea",
  section: "newbox",
};

export default function NewsBox() {
  const [images, setImages] = useState<HeroImage[]>([defaultImage]);

  useEffect(() => {
    api
      .get("api/website-images/newbox")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setImages(res.data);
        }
      })
      .catch(() => {
        setImages([defaultImage]);
      });
  }, []);

  const currentImage = images[0] || defaultImage;

  return (
    <section className="relative z-10 -mt-12 md:-mt-14 container-main">
      <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#0f2c47] via-[#123a5a] to-[#0f2c47]">
        <div className="grid grid-cols-1 md:grid-cols-3">

          {/* Columna 1 - Imagen */}
          <div className="relative flex items-center justify-center p-0 h-64 md:h-auto">
            <img
              src={currentImage.imageUrl}
              alt={currentImage.altText}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/images/pagame.png";
              }}
              className="object-cover absolute inset-0 w-full h-full"
            />
          </div>

          {/* Columna 2 - Pago fácil */}
          <div className="flex flex-col justify-center p-10 text-white">
            <h3 className="text-2xl font-bold mb-4 leading-tight">
              Paga tus tributos <br /> de forma rápida y segura
            </h3>
            <p className="text-white/80 text-sm mb-6 max-w-sm">
              Realiza el pago de tus impuestos municipales en línea, sin colas y desde cualquier dispositivo.
            </p>

            <Link
              href="https://munilaperla.gob.pe/pagosenlinea-mdlp.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-[#3dbfb8] hover:bg-[#34a8a2] transition-all duration-300 text-[#0f2c47] font-semibold px-6 py-3 rounded-xl w-fit shadow-lg hover:shadow-xl"
            >
              Pagar ahora
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Columna 3 - Consulta */}
          <div className="flex flex-col justify-center p-10 text-white">
            <h3 className="text-2xl font-bold mb-4 leading-tight">
              Consulta tu estado <br /> en segundos
            </h3>
            <p className="text-white/80 text-sm mb-6 max-w-sm">
              Verifica de manera sencilla tus deudas, pagos pendientes o información administrativa.
            </p>

            <Link
              href="https://api.whatsapp.com/send/?phone=51932263278&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 border border-[#e8a020] text-[#e8a020] hover:bg-[#e8a020] hover:text-[#0f2c47] transition-all duration-300 font-semibold px-6 py-3 rounded-xl w-fit"
            >
              Consultar
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}