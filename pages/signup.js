// pages/signup.js
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Signup() {
  const { signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    tenantName: '',
    tenantSlug: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(form);
  };

  return (
    <>
      <Head>
        <title>Signup | Multi-Tenant Blog</title>
      </Head>
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Create Your Blog</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="tenantName"
            placeholder="Blog/Company Name"
            value={form.tenantName}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="tenantSlug"
            placeholder="Blog Slug (e.g., myblog)"
            value={form.tenantSlug}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Sign Up
          </button>

          <p style={styles.text}>
            Already have an account?{' '}
            <span style={styles.link} onClick={() => router.push('/login')}>
              Login
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0070f3',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  text: {
    textAlign: 'center',
    marginTop: '15px',
  },
  link: {
    color: '#0070f3',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
