"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";

 {/* TIPOS */}

type DropdownItem = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href?: string;
  action: "page" | "scroll" | "dropdown";
  scrollTarget?: string;
  dropdown?: DropdownItem[];
};

 {/* DATOS */}

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio",       action: "page",     href: "/"            },
  { label: "Ciudad",       action: "page",     href: "/ciudad"      },
  { label: "Noticias",     action: "scroll",   scrollTarget: "noticias" },
  {
    label: "Servicios",
    action: "dropdown",
    dropdown: [
      { label: "Tramites",            href: "https://www.gob.pe/institucion/munilaperla/tramites-y-servicios" },
      { label: "Registro de Visitas", href: "https://munilaperla.gob.pe/visitas.php" },
      { label: "Bolsa de Trabajo",    href: "https://munilaperla.gob.pe/convocatorias-mdlp.html#" },
    ],
  },
  { label: "Autoridades",  action: "page",     href: "https://www.gob.pe/institucion/munilaperla/funcionarios" },
  {
    label: "Publicaciones",
    action: "dropdown",
    dropdown: [
      { label: "Ordenanzas",    href: "#" },
      { label: "Resoluciones",  href: "https://www.gob.pe/institucion/munilaperla/colecciones/14603-resoluciones-de-alcaldia" },
      { label: "Decretos",      href: "#" },
    ],
  },
  { label: "Contacto", action: "scroll", scrollTarget: "contacto" },
];

 {/* CLASES REUTILIZABLES */}

const cls = {
  navLink:
    "px-3 py-1.5 text-sm font-semibold text-[#1a3a5c] rounded-md transition-all hover:bg-[#1a3a5c] hover:text-white",
  dropdownLink:
    "block px-4 py-2.5 text-sm font-semibold text-[#1a3a5c] transition-all hover:bg-[#1a3a5c] hover:text-white",
  mobileLink:
    "block px-4 py-3 text-sm font-semibold text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white transition-all",
  searchBox:
    "flex items-center bg-gray-50 border border-gray-500 rounded-full px-3 gap-2 focus-within:border-[#1a3a5c] transition-colors",
};

 {/* SUBCOMPONENTES */}

 {/* BUSCADOR DE ESCRITORIO */}
function SearchBar({ className, inputClass }: { className?: string; inputClass?: string }) {
  return (
    <div className={`${cls.searchBox} ${className ?? ""}`}>
      <input
        type="text"
        placeholder="Buscar..."
        className={`bg-transparent text-[#1a3a5c] placeholder-gray-600 text-sm outline-none ${inputClass ?? ""}`}
      />
      <Search size={20} className="text-gray-600 flex-shrink-0" />
    </div>
  );
}

 {/* FLECHA LATERAL DE LOS NAVBAR */}
function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      size={18}
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    />
  );
}

 {/* COMPONENTE PRINCIPAL */}

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra dropdown al hacer click fuera
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  function scrollTo(target: string) {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  function toggleDropdown(label: string) {
    setOpenDropdown((prev) => (prev === label ? null : label));
  }

 {/* RENDERIZANDO CADA ITEM EN ESCRITORIO */}

  function renderDesktopItem(item: NavItem) {
    if (item.action === "page") {
      return (
        <Link href={item.href!} className={cls.navLink}>
          {item.label}
        </Link>
      );
    }

    if (item.action === "scroll") {
      return (
        <button onClick={() => scrollTo(item.scrollTarget!)} className={cls.navLink}>
          {item.label}
        </button>
      );
    }

 {/* ITEMS DE CADA ITEMS DEL NAVBAR */}
    const isOpen = openDropdown === item.label;
    return (
      <>
        <button
          onClick={() => toggleDropdown(item.label)}
          className={`${cls.navLink} flex items-center gap-1`}
        >
          {item.label}
          <Chevron open={isOpen} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 min-w-48 py-1 z-50 overflow-hidden">
            {item.dropdown!.map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                className={cls.dropdownLink}
                onClick={() => setOpenDropdown(null)}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </>
    );
  }

 {/* RENDER MOVIL */}

  function renderMobileItem(item: NavItem) {
    if (item.action === "page") {
      return (
        <Link
          href={item.href!}
          className={`${cls.mobileLink} uppercase`}
          onClick={() => setMobileOpen(false)}
        >
          {item.label}
        </Link>
      );
    }

    if (item.action === "scroll") {
      return (
        <button
          onClick={() => scrollTo(item.scrollTarget!)}
          className={`w-full text-left uppercase ${cls.mobileLink}`}
        >
          {item.label}
        </button>
      );
    }

 {/* ITEMS DE CADA ITEMS DEL NAVBAR */}
    const isOpen = openDropdown === item.label;
    return (
      <>
        <button
          onClick={() => toggleDropdown(item.label)}
          className={`w-full flex items-center justify-between uppercase ${cls.mobileLink}`}
        >
          {item.label}
          <Chevron open={isOpen} />
        </button>

 {/* ITEMS DE CADA ITEMS DEL NAVBAR MOVIL */}
        {isOpen && (
          <div className="bg-gray-50 border-t border-gray-100">
            {item.dropdown!.map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                className="block pl-8 pr-4 py-2.5 text-sm font-semibold text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white transition-all"
                onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}
              >
                {"➤ "} &nbsp; {sub.label}
              </Link>
            ))}
          </div>
        )}
      </>
    );
  }


  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container-main" ref={dropdownRef}>

        
 {/* BARRA PRINCIPAL */}
        <div className="flex items-center justify-between h-14">


 {/* ITEMS ESCRITORIO */}
          <ul className="hidden lg:flex items-center h-full gap-2.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="relative h-full flex items-center">
                {renderDesktopItem(item)}
              </li>
            ))}
          </ul>


 {/* BUSCADOR - ESCRITORIO */}
          <SearchBar className="hidden lg:flex py-1.5" inputClass="w-50" />


 {/* HAMBURGUESA MOVIL */}
          <button
            className="lg:hidden ml-auto p-2 text-[#1a3a5c] hover:bg-gray-500 rounded-xl transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

 {/* MENU MOVIL */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 pb-4">

            {/* BUSCADOR MOVIL */}
            <SearchBar className="mx-2 mb-3 py-2" inputClass="flex-1" />

            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  {renderMobileItem(item)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}