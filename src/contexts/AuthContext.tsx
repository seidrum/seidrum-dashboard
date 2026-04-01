import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { setAccessToken, getAccessToken } from '@/api/client';
import { getMe } from '@/api/users';
import { login as apiLogin, register as apiRegister, revokeToken } from '@/api/auth';
import { AuthContext } from './authState';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<import('@/types').User | null>(null);
  const [isLoading, setIsLoading] = useState(!!getAccessToken());

  const fetchUser = useCallback(async () => {
    if (!getAccessToken()) return;
    setIsLoading(true);
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const tokens = await apiLogin({ username, password });
      setAccessToken(tokens.access_token);
      const me = await getMe();
      setUser(me);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const tokens = await apiRegister({ username, password });
      setAccessToken(tokens.access_token);
      const me = await getMe();
      setUser(me);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const token = getAccessToken();
    if (token) {
      try {
        await revokeToken(token);
      } catch {
        // ignore
      }
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
