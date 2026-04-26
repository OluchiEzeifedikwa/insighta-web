import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Layout from '../components/Layout';

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/profiles/${id}`)
      .then(res => setProfile(res.data.data))
      .catch(() => navigate('/profiles'));
  }, [id]);

  if (!profile) return <div style={{ padding: 40, color: '#888' }}>Loading...</div>;

  const fields = [
    { label: 'Name', value: profile.name },
    { label: 'Gender', value: profile.gender },
    { label: 'Gender Probability', value: `${(profile.gender_probability * 100).toFixed(0)}%` },
    { label: 'Age', value: profile.age },
    { label: 'Age Group', value: profile.age_group },
    { label: 'Country', value: profile.country_name },
    { label: 'Country Code', value: profile.country_id },
    { label: 'Country Probability', value: `${(profile.country_probability * 100).toFixed(0)}%` },
    { label: 'Created At', value: new Date(profile.created_at).toLocaleString() },
  ];

  return (
    <Layout>
      <div style={styles.container}>
        <button onClick={() => navigate('/profiles')} style={styles.back}>← Back to Profiles</button>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.avatar}>{profile.name[0].toUpperCase()}</div>
            <div>
              <h1 style={styles.name}>{profile.name}</h1>
              <span style={{ ...styles.genderBadge, background: profile.gender === 'male' ? '#e3f2fd' : '#fce4ec', color: profile.gender === 'male' ? '#1565c0' : '#c62828' }}>
                {profile.gender}
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
      </div>
    </Layout>
  );
}

const styles = {
  container: { maxWidth: '640px' },
  back: { background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a2e', marginBottom: '20px', fontSize: '14px', padding: 0, fontWeight: '500' },
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e8eaed', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', borderBottom: '1px solid #e8eaed', background: '#f8f9fa' },
  avatar: { width: '56px', height: '56px', background: '#1a1a2e', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700' },
  name: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' },
  genderBadge: { padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  fields: {},
  field: { display: 'flex', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid #f5f5f5' },
  label: { color: '#888', fontSize: '14px' },
  value: { fontWeight: '600', color: '#1a1a2e', fontSize: '14px', textTransform: 'capitalize' },
};
