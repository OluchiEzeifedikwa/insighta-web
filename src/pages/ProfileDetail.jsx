import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/profiles/${id}`)
      .then(res => setProfile(res.data.data))
      .catch(() => navigate('/profiles'));
  }, [id]);

  if (!profile) return <p style={{ padding: 24 }}>Loading...</p>;

  const fields = [
    ['Name', profile.name],
    ['Gender', profile.gender],
    ['Gender Probability', `${(profile.gender_probability * 100).toFixed(0)}%`],
    ['Age', profile.age],
    ['Age Group', profile.age_group],
    ['Country', profile.country_name],
    ['Country Code', profile.country_id],
    ['Country Probability', `${(profile.country_probability * 100).toFixed(0)}%`],
    ['Created At', new Date(profile.created_at).toLocaleString()],
  ];

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/profiles')} style={styles.back}>← Back to Profiles</button>
      <h1 style={styles.heading}>{profile.name}</h1>
      <div style={styles.card}>
        {fields.map(([label, value]) => (
          <div key={label} style={styles.row}>
            <span style={styles.label}>{label}</span>
            <span style={styles.value}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: '600px', margin: '0 auto' },
  back: { background: 'none', border: 'none', cursor: 'pointer', color: '#24292e', marginBottom: '16px', fontSize: '14px', padding: 0 },
  heading: { fontSize: '28px', marginBottom: '24px' },
  card: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #e0e0e0' },
  label: { color: '#666', fontWeight: '500' },
  value: { fontWeight: '600' },
};
