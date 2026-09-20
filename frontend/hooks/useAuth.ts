'use client';
import { useState, useEffect } from 'react';
import { getSession, saveSession, clearSession, type AreaSession } from '@/lib/auth';
import api from '@/lib/api';

export function useAuth() {
  const [area, setArea] = useState<AreaSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { area: saved } = getSession();
    setArea(saved);
    setLoading(false);
  }, []);

  async function login(username: string, password: string): Promise<AreaSession> {
    try{
    const res = await api.post<{ access_token: string; area: AreaSession }>(
      'api/auth/login',
      { username, password },
    );
    console.log("LOGIN AREA:", res.data.area);
    saveSession(res.data.access_token, res.data.area);
    setArea(res.data.area);

     return res.data.area;
  } catch (error) {
    throw error; // 👈 importante
  }
  }

  function logout() {
    clearSession();
    setArea(null);
  }

  return { area, loading, login, logout };
}