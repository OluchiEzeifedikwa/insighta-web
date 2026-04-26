import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { csrfPost, clearCsrfToken } from '../lib/csrf';
import Layout from '../components/Layout';

export default function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data.data))
      .catch(() => navigate('/'));
  }, []);

  async function handleLogout() {
    try { await csrfPost('/auth/logout'); } catch { /* proceed */ }
    clearCsrfToken();
    navigate('/');
  }

  if (!user) return <div style={{ padding: 40, color: '#888' }}>Loading...</div>;

  const fields = [
    { label: 'Username', value: `@${user.username}` },
    { label: 'Email', value: user.email || 'N/A' },
    { label: 'Role', value: user.role },
    { label: 'Status', value: user.is_active ? 'Active' : 'Inactive' },
    { label: 'Last Login', value: user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A' },
    { label: 'Member Since', value: new Date(user.created_at).toLocaleString() },
  ];

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Account</h1>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.avatar}>{user.username[0].toUpperCase()}</div>
            <div>
              <div style={styles.name}>@{user.username}</div>
              <span style={{ ...styles.roleBadge, background: user.role === 'admin' ? '#fff3e0' : '#e8f5e9', color: user.role === 'admin' ? '#e65100' : '#2e7d32' }}>
                {user.role}
              </span>
            </div>
          </div>
          <div style={styles.fields}>
            {fields.map(({ label, value }) => (
              <div key={label} style={styles.field}>
                <span style={styles.label}>{label}</span>
                <span style={styles.value}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
      </div>
    </Layout>
  );
}

const styles = {
  container: { maxWidth: '640px' },
  heading: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px' },
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e8eaed', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '24px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', borderBottom: '1px solid #e8eaed', background: '#f8f9fa' },
  avatar: { width: '56px', height: '56px', background: '#1a1a2e', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700' },
  name: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' },
  roleBadge: { padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  fields: {},
  field: { display: 'flex', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid #f5f5f5' },
  label: { color: '#888', fontSize: '14px' },
  value: { fontWeight: '600', color: '#1a1a2e', fontSize: '14px', textTransform: 'capitalize' },
  logoutBtn: { background: '#d32f2f', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};
