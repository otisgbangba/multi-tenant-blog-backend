// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, tenant } = useAuth();

  return (
    <>
      <Head>
        <title>Home | Multi-Tenant Blog Platform</title>
      </Head>

      <div style={styles.container}>
        <h1 style={styles.title}>🚀 Welcome to Multi-Tenant Blog Platform</h1>
        <p style={styles.subtitle}>
          A powerful blogging solution for creators, educators, teams, and startups.
        </p>

        <div style={styles.actions}>
          {!user ? (
            <>
              <Link href="/signup" style={styles.buttonPrimary}>
                Get Started – Sign Up
              </Link>
              <Link href="/login" style={styles.buttonSecondary}>
                Already Registered? Log In
              </Link>
            </>
          ) : (
            <Link href="/dashboard" style={styles.buttonPrimary}>
              Go to Your Dashboard ({tenant})
            </Link>
          )}
        </div>

        <div style={styles.features}>
          <h2>🔧 Features:</h2>
          <ul>
            <li>✅ Multi-Tenant Blog Management</li>
            <li>✅ Secure Authentication</li>
            <li>✅ Post Analytics (views, likes, shares)</li>
            <li>✅ Theme Customization (coming soon!)</li>
          </ul>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '0 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '15px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '30px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '40px',
  },
  buttonPrimary: {
    padding: '12px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  buttonSecondary: {
    padding: '12px 20px',
    backgroundColor: '#eaeaea',
    color: '#333',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  features: {
    textAlign: 'left',
    marginTop: '40px',
  },
};
