// components/Navbar.js
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link href="/" style={styles.logo}>
          📝 MultiTenantBlog
        </Link>
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            <span style={styles.user}>👤 {user.name || user.email}</span>
            <Link href="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <button onClick={logout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={styles.link}>
              Login
            </Link>
            <Link href="/signup" style={styles.button}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 25px',
    backgroundColor: '#0070f3',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 999,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    textDecoration: 'none',
    color: '#fff',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  user: {
    marginRight: '10px',
    fontSize: '0.9rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#fff',
    color: '#0070f3',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
