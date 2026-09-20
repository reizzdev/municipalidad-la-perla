
/*
LoginPanel.tsx

Este archivo se encarga de manejar el inicio y cierre de sesión
de las áreas dentro del sistema del calendario.

Qué hace:
- Si el usuario NO está logueado:
  - Muestra un botón "Iniciar sesión".
  - Al hacer clic, abre un panel desplegable (dropdown).
  - Permite ingresar usuario y contraseña.
  - Llama a la función login() del hook useAuth.
  - Muestra error si las credenciales son incorrectas.

- Si el usuario SÍ está logueado:
  - Muestra la información del área activa:
    - Color del área.
    - Abreviatura.
    - Nombre completo.
  - Muestra un botón para cerrar sesión.
  - Al cerrar sesión ejecuta logout() y recarga la página.

De qué depende:
- useAuth() → hook que maneja:
    - area → área autenticada.
    - loading → estado de carga.
    - login() → función para iniciar sesión.
    - logout() → función para cerrar sesión.
- Estados internos:
    - open → controla si el panel está visible.
    - username → usuario ingresado.
    - password → contraseña ingresada.
    - error → mensaje de error.
    - submitting → estado de envío del formulario.

Qué NO hace:
- No valida credenciales directamente.
- No maneja la lógica del backend.
- Solo llama a funciones del hook useAuth.

Resultado final:
- Permite que cada área inicie sesión.
- Muestra claramente qué área está autenticada.
- Controla visualmente el acceso para poder reservar en el calendario.
*/

'use client';
import { useState } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPanel() {
  const { area, loading, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  if (area) {
    return (
      <div className="flex items-center gap-3 bg-white border-2 border-[#1a3a5c]/20 rounded-xl px-4 py-2 shadow-sm">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
          style={{ backgroundColor: area.color }}
        >
          {area.abbreviation.slice(0, 2)}
        </div>
        <div className="text-sm">
          <p className="font-bold text-[#1a3a5c]">{area.abbreviation}</p>
          <p className="text-gray-400 text-xs">{area.name}</p>
        </div>
        <button
          onClick={() => { logout(); window.location.reload(); }}
          className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      setOpen(false);
      window.location.reload();
    } catch {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1a3a5c] text-white text-sm font-bold rounded-xl hover:bg-[#1a3a5c]/90 transition-all shadow-sm"
      >
        <LogIn size={16} />
        Iniciar sesión
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl w-72 p-5 z-40">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-[#1a3a5c]" />
            <h3 className="font-bold text-[#1a3a5c] text-sm">Acceso por Área</h3>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Usuario (ej: otecnologia)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1a3a5c] transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1a3a5c] transition-colors"
              required
            />

            {error && (
              <p className="text-red-500 text-xs font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="py-2 bg-[#1a3a5c] text-white font-bold text-sm rounded-lg hover:bg-[#1a3a5c]/90 transition-all disabled:opacity-50"
            >
              {submitting ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}