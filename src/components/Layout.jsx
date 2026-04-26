import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profiles', path: '/profiles' },
    { label: 'Search', path: '/search' },
    { label: 'Account', path: '/account' },
  ];

  return (
    <div>
      <nav style={styles.nav}>
        <span style={styles.brand} onClick={() => navigate('/dashboard')}>Insighta Labs</span>
        <div style={styles.navLinks}>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navBtn,
                ...(location.pathname === item.path ? styles.navBtnActive : {}),
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  nav: {
    background: '#1a1a2e',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  brand: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '18px',
    cursor: 'pointer',
    letterSpacing: '-0.5px',
  },
  navLinks: { display: 'flex', gap: '4px' },
  navBtn: {
    background: 'transparent',
    color: '#ccc',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  navBtnActive: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontWeight: '600',
  },
  main: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
};
