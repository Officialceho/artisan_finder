import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem('artisan_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await client.get('/auth/me');
      setArtisan(data.artisan);
    } catch (err) {
      localStorage.removeItem('artisan_token');
      setArtisan(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    localStorage.setItem('artisan_token', data.token);
    setArtisan(data.artisan);
    return data.artisan;
  };

  const signup = async (payload) => {
    const { data } = await client.post('/auth/signup', payload);
    localStorage.setItem('artisan_token', data.token);
    setArtisan(data.artisan);
    return data.artisan;
  };

  const logout = () => {
    localStorage.removeItem('artisan_token');
    setArtisan(null);
  };

  const updateArtisanLocal = (updated) => setArtisan(updated);

  return (
    <AuthContext.Provider
      value={{ artisan, loading, login, signup, logout, updateArtisanLocal, isAuthenticated: Boolean(artisan) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
