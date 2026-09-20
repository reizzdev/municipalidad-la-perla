export type AreaSession = {
  id: string;
  username: string;
  name: string;
  abbreviation: string;
  color: string;
   role: "AREA" | "ADMIN";
  permissions: string[];
};

export function saveSession(token: string, area: AreaSession) {
  localStorage.setItem('muni_token', token);
  localStorage.setItem('muni_area', JSON.stringify(area));
}

export function getSession(): { token: string | null; area: AreaSession | null } {
  if (typeof window === 'undefined') return { token: null, area: null };
  const token = localStorage.getItem('muni_token');
  const raw = localStorage.getItem('muni_area');
  const area = raw ? (JSON.parse(raw) as AreaSession) : null;
  return { token, area };
}

export function clearSession() {
  localStorage.removeItem('muni_token');
  localStorage.removeItem('muni_area');
}