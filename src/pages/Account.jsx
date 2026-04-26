import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { csrfPost, clearCsrfToken } from '../lib/csrf';

export default function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data.data))
      .catch(() => navigate('/'));
  }, []);

  async function handleLogout() {
    try {
      await csrfPost('/auth/logout');
    } catch {
      // proceed regardless
    }
    clearCsrfToken();
    navigate('/');
  }

  if (!user) return <p style={{ padding: 24 }}>Loading...</p>;

  const fields = [
    ['Username', `@${user.username}`],
    ['Email', user.email || 'N/A'],
    ['Role', user.role],
    ['Status', user.is_active ? 'Active' : 'Inactive'],
    ['Last Login', user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A'],
    ['Member Since', new Date(user.created_at).toLocaleString()],
  ];

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.back}>← Back</button>
      <h1 style={styles.heading}>Account</h1>
      <div style={styles.card}>
        {fields.map(([label, value]) => (
          <div key={label} style={styles.row}>
            <span style={styles.label}>{label}</span>
            <span style={styles.value}>{value}</span>
          </div>
        ))}
      </div>
      <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: '600px', margin: '0 auto' },
  back: { background: 'none', border: 'none', cursor: 'pointer', color: '#24292e', marginBottom: '16px', fontSize: '14px', padding: 0 },
  heading: { fontSize: '28px', marginBottom: '24px' },
  card: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #e0e0e0' },
  label: { color: '#666', fontWeight: '500' },
  value: { fontWeight: '600' },
  logoutBtn: { background: '#d32f2f', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
};
