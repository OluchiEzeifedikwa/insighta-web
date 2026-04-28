import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Layout from '../components/Layout';

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

  if (!stats) return <div style={styles.loading}>Loading...</div>;

  return (
    <Layout>
      <div>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.welcome}>Welcome back, <strong>@{user?.username}</strong></p>
          </div>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardIcon}>👥</div>
            <div style={styles.cardValue}>{stats.total.toLocaleString()}</div>
            <div style={styles.cardLabel}>Total Profiles</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>🔐</div>
            <div style={styles.cardValue}>{user?.role}</div>
            <div style={styles.cardLabel}>Your Role</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>✅</div>
            <div style={styles.cardValue}>{user?.is_active ? 'Active' : 'Inactive'}</div>
            <div style={styles.cardLabel}>Account Status</div>
          </div>
        </div>

        <div style={styles.quickActions}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionCards}>
            <div style={styles.actionCard} onClick={() => navigate('/profiles')}>
              <div style={styles.actionIcon}>📋</div>
              <div style={styles.actionTitle}>Browse Profiles</div>
              <div style={styles.actionDesc}>View and filter all profiles</div>
            </div>
            <div style={styles.actionCard} onClick={() => navigate('/search')}>
              <div style={styles.actionIcon}>🔍</div>
              <div style={styles.actionTitle}>Search</div>
              <div style={styles.actionDesc}>Natural language search</div>
            </div>
            <div style={styles.actionCard} onClick={() => navigate('/account')}>
              <div style={styles.actionIcon}>👤</div>
              <div style={styles.actionTitle}>Account</div>
              <div style={styles.actionDesc}>View your profile</div>
            </div>
            {user?.role === 'admin' && (
              <div style={styles.actionCard} onClick={() => navigate('/profiles')}>
                <div style={styles.actionIcon}>➕</div>
                <div style={styles.actionTitle}>Create Profile</div>
                <div style={styles.actionDesc}>Add a new profile (admin only)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' },
  header: { marginBottom: '32px' },
  heading: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
  welcome: { color: '#666', fontSize: '15px' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e8eaed' },
  cardIcon: { fontSize: '28px', marginBottom: '12px' },
  cardValue: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px', textTransform: 'capitalize' },
  cardLabel: { color: '#888', fontSize: '13px', fontWeight: '500' },
  quickActions: {},
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' },
  actionCards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  actionCard: { background: '#fff', borderRadius: '12px', padding: '24px', cursor: 'pointer', border: '1px solid #e8eaed', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s' },
  actionIcon: { fontSize: '32px', marginBottom: '12px' },
  actionTitle: { fontWeight: '600', color: '#1a1a2e', marginBottom: '4px' },
  actionDesc: { color: '#888', fontSize: '13px' },
};
