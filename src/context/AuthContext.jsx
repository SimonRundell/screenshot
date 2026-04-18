import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

/**
 * Provides authentication state and actions for the app.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Checks current login status from the API.
   * @returns {Promise<void>}
   */
  const loadStatus = useCallback(async () => {
    try {
      const response = await api.get('/auth/status.php');
      if (response.data?.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  /**
   * Logs a user in via email/password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login.php', { email, password });
    setUser(response.data.user);
  }, []);

  /**
   * Logs the current user out.
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    await api.post('/auth/logout.php');
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, refreshStatus: loadStatus }), [user, loading, login, logout, loadStatus]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Returns the authentication context.
 * @returns {{ user: any, loading: boolean, login: (email: string, password: string) => Promise<void>, logout: () => Promise<void>, refreshStatus: () => Promise<void> }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
