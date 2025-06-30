// pages/settings.js
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Settings() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    else {
      api.get('/users/theme').then((res) => {
        setTheme(res.data.theme);
      });
    }
  }, [user, loading]);

  const handleThemeChange = async (e) => {
    const selected = e.target.value;
    setTheme(selected);
    await api.put('/users/theme', { theme: selected });
    document.body.className = selected;
  };

  return (
    <>
      <Head>
        <title>Settings | Multi-Tenant Blog</title>
      </Head>

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
        <h1>⚙️ User Settings</h1>
        <p><strong>Email:</strong> {user?.email}</p>

        <div style={{ marginTop: '30px' }}>
          <label>
            <strong>Theme:</strong>
            <select value={theme} onChange={handleThemeChange} style={{ marginLeft: '10px' }}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="blue">Blue</option>
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
