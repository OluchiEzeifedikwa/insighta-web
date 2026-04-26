import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/auth/me'),
      api.get('/api/profiles?limit=1'),
    ]).then(([userRes, profilesRes]) => {
      setUser(userRes.data.data);
      setStats({ total: profilesRes.data.total });
    }).catch(() => navigate('/'));
  }, []);

  if (!stats) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Dashboard</h1>
      <p style={styles.welcome}>Welcome, @{user?.username}</p>
      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardValue}>{stats.total.toLocaleString()}</div>
          <div style={styles.cardLabel}>Total Profiles</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardValue}>{user?.role}</div>
          <div style={styles.cardLabel}>Your Role</div>
        </div>
      </div>
      <div style={styles.links}>
        <button onClick={() => navigate('/profiles')} style={styles.btn}>View Profiles</button>
        <button onClick={() => navigate('/search')} style={styles.btn}>Search</button>
        <button onClick={() => navigate('/account')} style={styles.btn}>Account</button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: '800px', margin: '0 auto' },
  heading: { fontSize: '28px', marginBottom: '4px' },
  welcome: { color: '#666', marginBottom: '32px' },
  cards: { display: 'flex', gap: '16px', marginBottom: '32px' },
  card: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '24px', flex: 1, textAlign: 'center' },
  cardValue: { fontSize: '36px', fontWeight: '700', marginBottom: '8px' },
  cardLabel: { color: '#666', fontSize: '14px' },
  links: { display: 'flex', gap: '12px' },
  btn: { background: '#24292e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
};
