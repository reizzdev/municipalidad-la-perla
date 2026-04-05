import Link from "next/link";
import { ArrowRight, FileText, BookOpen, Search, MessageSquare, ShieldAlert, CreditCard, HeartPulse, PawPrint, ClipboardList } from "lucide-react";

// ─── Datos ────────────────────────────────────────────────────────────────────

const ICONS = [
  FileText,
  BookOpen,
  Search,
  MessageSquare,
  ShieldAlert,
  CreditCard,
  HeartPulse,
  PawPrint,
  ClipboardList,
];

const SERVICES = [
  "Mesa de Partes Virtual",
  "Libro de Reclamaciones",
  "Acceso a la Informacion Publica",
  "Atencion de Consultas y Sugerencias",
  "Atencion de Denuncias Ciudadanas",
  "Pagos en Linea",
  "Centro Medico Municipal",
  "Adogta un Amigo",
  "Registro de Visitas",
];

{/* CLASES */}

const cls = {
  card: [
    "group flex items-center gap-4 p-4",
    "bg-white rounded-xl border border-gray-100",
    "hover:border-[#3389B5] hover:bg-[#f4fdfb]",
    "transition-all duration-150",
  ].join(" "),
  iconWrap: [
    "w-10 h-10 rounded-lg flex-shrink-0",
    "flex items-center justify-center",
    "bg-[#edf9f8] group-hover:bg-[#3389B5]",
    "transition-colors duration-150",
  ].join(" "),
  label: [
    "text-sm font-semibold leading-snug",
    "text-[#1a3a5c] group-hover:text-[#278DC4]",
    "transition-colors duration-150",
  ].join(" "),
};

{/* COMPONENTE */}

export default function ServicesGrid() {
  return (
    <section className="container-main py-20">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-extrabold text-[#1a3a5c]">Servicios</h2>
          <div className="hidden md:block w-40 h-[2px] bg-[#3dbfb8] opacity-30 rounded-full" />
        </div>
        <Link
          href="#"
          className="group flex items-center gap-1.5 text-sm font-bold text-[#3389B5] hover:text-[#1a3a5c] transition-colors"
        >
          Ver todos
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-150" />
        </Link>
      </div>

{/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SERVICES.map((label, i) => {
          const Icon = ICONS[i];
          return (
            <a key={label} href="#" className={cls.card}>
              <div className={cls.iconWrap}>
                <Icon
                  size={25}
                  className="text-[#3389B5] group-hover:text-white transition-colors duration-150"
                />
              </div>
              <span className={cls.label}>{label}</span>
            </a>
          );
        })}
      </div>

    </section>
  );
}