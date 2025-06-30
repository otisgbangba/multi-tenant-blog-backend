// contexts/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

const [theme, setTheme] = useState('light');

useEffect(() => {
  if (token) {
    api.get('/users/theme').then((res) => {
      setTheme(res.data.theme);
      document.body.className = res.data.theme;
    });
  }
}, [token]);

  // Load user from token on first load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const tenantSlug = localStorage.getItem('tenantSlug');

    if (token && tenantSlug) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
        setTenant(tenantSlug);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        api.defaults.headers.common['x-tenant-slug'] = tenantSlug;
      } catch (err) {
        console.error('Invalid token');
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password, tenantSlug) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data;
      const decoded = jwt_decode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('tenantSlug', tenantSlug);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.defaults.headers.common['x-tenant-slug'] = tenantSlug;

      setUser(decoded);
      setTenant(tenantSlug);

      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Login failed');
    }
  };

  const signup = async (userData) => {
    try {
      const res = await api.post('/auth/signup', userData);
      const { token, tenant } = res.data;
      const decoded = jwt_decode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('tenantSlug', tenant.slug);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.defaults.headers.common['x-tenant-slug'] = tenant.slug;

      setUser(decoded);
      setTenant(tenant.slug);

      toast.success('Signup successful!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantSlug');
    setUser(null);
    setTenant(null);
    delete api.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['x-tenant-slug'];
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, tenant, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
