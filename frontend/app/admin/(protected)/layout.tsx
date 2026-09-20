"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { clearSession } from "@/lib/auth";
import { ChevronDown, LayoutDashboard, Newspaper, Calendar, AlertTriangle, ImageIcon, Menu, X } from "lucide-react";

type Props = {
  children: ReactNode;
};

export default function AdminProtectedLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { area, loading } = useAuth();

  const [openMenu, setOpenMenu] = useState<Record<string, boolean>>({
    convocatorias: false,
    noticias: false,
    calendario: false,
    incidencias: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔐 Protección
  useEffect(() => {
    if (loading) return;

    if (!area) {
      router.replace("/admin/login");
    } else if (area.role !== "ADMIN") {
      router.replace("/");
    }
  }, [loading, area, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    router.replace("/admin/login");
  };

  if (loading || !area) return null;

  const hasPermission = (perm: string) =>
    area.permissions?.includes(perm);

  const linkStyle = (path: string) =>
    `block px-3 py-2 rounded-lg transition-all duration-200 ${
      pathname === path
        ? "bg-gray-800 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const menuButtonStyle = (menu: string) =>
    `flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:pl-4 ${
      openMenu[menu] ? "bg-gray-800" : "text-gray-300"
    }`;

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col justify-between overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 p-6 text-white shadow-2xl transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:overflow-visible ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <h2 className="text-xl font-bold mb-6 tracking-wide">
            Panel Admin
          </h2>

          {/* AREA INFO */}
          <div
            className="mb-6 p-3 rounded-xl shadow-md"
            style={{ backgroundColor: area.color }}
          >
            <p className="font-semibold text-white text-sm">
              {area.username} - {area.role}
            </p>
            <p className="text-white/90 text-xs">{area.name}</p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">

            {/* DASHBOARD */}
            {hasPermission("DASHBOARD_VIEW") && (
              <Link href="/admin" className={linkStyle("/admin")}>
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  Dashboard
                </div>
              </Link>
            )}

            {/* CONVOCATORIAS */}
            {hasPermission("CONVOCATORIAS_CRUD") && (
              <>
                <button
                  onClick={() => toggleMenu("convocatorias")}
                  className={menuButtonStyle("convocatorias")}
                >
                  <span className="flex items-center gap-2">
                    <Newspaper size={16} />
                    Convocatorias
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openMenu.convocatorias ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openMenu.convocatorias && (
                  <div className="ml-4 flex flex-col gap-1 border-l border-gray-700 pl-3 mt-1">
                    <Link
                      href="/admin/convocatorias"
                      className={linkStyle("/admin/convocatorias")}
                    >
                      Ver todas
                    </Link>
                    <Link
                      href="/admin/convocatorias/nueva"
                      className={linkStyle("/admin/convocatorias/nueva")}
                    >
                      Crear nueva
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* NOTICIAS */}
            {hasPermission("NOTICIAS_CRUD") && (
              <>
                <button
                  onClick={() => toggleMenu("noticias")}
                  className={menuButtonStyle("noticias")}
                >
                  <span className="flex items-center gap-2">
                    <Newspaper size={16} />
                    Noticias
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openMenu.noticias ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openMenu.noticias && (
                  <div className="ml-4 flex flex-col gap-1 border-l border-gray-700 pl-3 mt-1">
                    <Link
                      href="/admin/noticia"
                      className={linkStyle("/admin/noticia")}
                    >
                      Ver noticias
                    </Link>
                    <Link
                      href="/admin/noticia/nuevo"
                      className={linkStyle("/admin/noticia/nuevo")}
                    >
                      Crear noticia
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* CALENDARIO */}
            {hasPermission("CALENDARIO_CRUD") && (
              <>
                <button
                  onClick={() => toggleMenu("calendario")}
                  className={menuButtonStyle("calendario")}
                >
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    Calendario
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openMenu.calendario ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openMenu.calendario && (
                  <div className="ml-4 flex flex-col gap-1 border-l border-gray-700 pl-3 mt-1">
                    <Link
                      href="/admin/calendario"
                      className={linkStyle("/admin/calendario")}
                    >
                      Ver calendario
                    </Link>
                    {hasPermission("DASHBOARD_VIEW") && (
                      <Link
                        href="/admin/calendario/logs"
                        className={linkStyle("/admin/calendario/logs")}
                      >
                        Logs de reservas
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}

            {/* INCIDENCIAS */}
            {hasPermission("INCIDENCIAS_CRUD") && (
              <>
                <button
                  onClick={() => toggleMenu("incidencias")}
                  className={menuButtonStyle("incidencias")}
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Incidencias
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openMenu.incidencias ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openMenu.incidencias && (
                  <div className="ml-4 flex flex-col gap-1 border-l border-gray-700 pl-3 mt-1">
                    <Link
                      href="/admin/incidencias"
                      className={linkStyle("/admin/incidencias")}
                    >
                      Ver incidencias
                    </Link>
                    <Link
                      href="/admin/incidencias/crear"
                      className={linkStyle("/admin/incidencias/crear")}
                    >
                      Crear incidencia
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* GESTION WEB */}
            {hasPermission("FOTOS_CRUD") && (
              <Link href="/admin/fotos" className={linkStyle("/admin/fotos")}>
                <div className="flex items-center gap-2">
                  <ImageIcon size={16} />
                  Gestión Web
                </div>
              </Link>
            )}
          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 transition-all duration-200 hover:scale-[1.02] text-white py-2 px-3 rounded-xl shadow-md"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="min-w-0 flex-1 bg-gray-100 p-4 pt-20 lg:p-10">
        <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Panel administrativo
            </p>
            <p className="truncate text-sm font-semibold text-gray-900">
              {area.abbreviation}
            </p>
          </div>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
            className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
        {children}
      </main>
    </div>
  );
}