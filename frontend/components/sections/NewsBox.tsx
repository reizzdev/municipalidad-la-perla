import Image from "next/image";
import { ArrowRight } from "lucide-react";

const newsItems = [
  {
    date: "24 MARZO 2026",
    title: "Llaman a una pesquisa oportuna en el Dia de la Tuberculosis",
    accent: "#3dbfb8",
  },
  {
    date: "08 MARZO 2026",
    title: "Atencion Primaria de Salud invita a operativos para pesquisa del glaucoma",
    accent: "#e8a020",
  },
];

export default function NewsBox() {
return (
  <section className="relative z-10 -mt-12 md:-mt-16 container-main">
    <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#0f2c47] via-[#123a5a] to-[#0f2c47]">
      <div className="grid grid-cols-1 md:grid-cols-3">

        {/* Columna 1 - Imagen */}
        <div className="relative flex items-center justify-center p-0">
          <div className="absolute inset-0 to-transparent"></div>
          <Image
            src="/images/ilustracionCentral.png"
            alt="Servicios municipales"
            width={300}
            height={300}
            className="object-contain drop-shadow-2xl relative z-10"
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

          <button className="group flex items-center gap-2 bg-[#3dbfb8] hover:bg-[#34a8a2] transition-all duration-300 text-[#0f2c47] font-semibold px-6 py-3 rounded-xl w-fit shadow-lg hover:shadow-xl">
            Pagar ahora
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Columna 3 - Consulta */}
        <div className="flex flex-col justify-center p-10 text-white">
          <h3 className="text-2xl font-bold mb-4 leading-tight">
            Consulta tu estado <br /> en segundos
          </h3>
          <p className="text-white/80 text-sm mb-6 max-w-sm">
            Verifica de manera sencilla tus deudas, pagos pendientes o información administrativa.
          </p>

          <button className="group flex items-center gap-2 border border-[#e8a020] text-[#e8a020] hover:bg-[#e8a020] hover:text-[#0f2c47] transition-all duration-300 font-semibold px-6 py-3 rounded-xl w-fit">
            Consultar
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  </section>
);
}
