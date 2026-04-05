import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const newsCards = [
  {
    label: "TUPA",
    sublabel: "Texto Unico de Procedimientos Administrativos",
    image: "/images/noticiasTupa.jpg",
    tag: "Tramites",
  },
  {
    label: "Licencias de Edificacion",
    sublabel: "Conoce el proceso para obtener tu licencia",
    image: "/images/noticiasLicenciasEdificacion.jpg",
    tag: "Obras",
  },
  {
    label: "Licencias de Funcionamiento",
    sublabel: "Requisitos y pasos para tu negocio",
    image: "/images/noticiasLicenciasFuncionamiento.jpg",
    tag: "Comercio",
  },
  
];

export default function NewsSection() {
return (
  <section id="noticias" className="py-16 bg-[#f4f6f8]">
    <div className="container-main">

      {/* Header con Ver todas */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a3a5c]">
            Noticias
          </h2>
          <div className="hidden md:block w-40 h-[2px] bg-gradient-to-r from-[#3dbfb8] to-transparent" />
        </div>

        <Link
          href="https://www.gob.pe/institucion/munilaperla/noticias"
          className="group flex items-center gap-2 text-sm font-bold text-[#3389B5] hover:text-[#1a3a5c] transition-colors"
        >
          Ver todas
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Línea horizontal de noticias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {newsCards.map((card) => (
          <a
            key={card.label}
            href="#"
            className="group flex flex-col gap-4"
          >
            {/* Imagen */}
            <div className="relative h-60 rounded-xl overflow-hidden">
              <Image
                src={card.image}
                alt={card.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Texto */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[#278DC4]">
                {card.tag}
              </span>

              <h3 className="mt-2 font-bold text-[#1a3a5c] group-hover:text-[#BA3A0B] transition-colors">
                {card.label}
              </h3>

              <p className="text-sm text-[#6b7a8d] mt-1">
                {card.sublabel}
              </p>
            </div>
          </a>
        ))}

      </div>

      {/* Línea decorativa inferior */}
      <div className="mt-12 h-[3px] bg-gradient-to-r from-[#1a3a5c] via-[#3dbfb8] to-[#e8a020] rounded-full" />

    </div>
  </section>
);
}
