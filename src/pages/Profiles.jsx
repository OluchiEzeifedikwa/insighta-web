import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Layout from '../components/Layout';

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
  const [filters, setFilters] = useState({ gender: '', country_id: '', age_group: '' });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const navigate = useNavigate();

  function fetchProfiles(page = 1) {
    setLoading(true);
    const params = { page, limit: 10, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
    api.get('/api/profiles', { params })
      .then((res) => {
        setProfiles(res.data.data);
        setPagination({ page: res.data.page, total_pages: res.data.total_pages, total: res.data.total });
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!createName.trim()) return;
    setCreateLoading(true);
    setCreateError('');
    try {
      await api.post('/api/profiles', { name: createName.trim() });
      setShowCreate(false);
      setCreateName('');
      fetchProfiles(1);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create profile');
    } finally {
      setCreateLoading(false);
    }
  }

  useEffect(() => {
    Promise.all([
      api.get('/auth/me'),
      api.get('/api/profiles', { params: { page: 1, limit: 10 } }),
    ]).then(([userRes, profilesRes]) => {
      setUser(userRes.data.data);
      setProfiles(profilesRes.data.data);
      setPagination({ page: profilesRes.data.page, total_pages: profilesRes.data.total_pages, total: profilesRes.data.total });
      setLoading(false);
    }).catch(() => navigate('/'));
  }, []);

  return (
    <Layout>
      <div>
        {showCreate && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h2 style={styles.modalTitle}>Create Profile</h2>
              <form onSubmit={handleCreate}>
                <input
                  style={styles.modalInput}
                  placeholder="Full name (e.g. Harriet Tubman)"
                  value={createName}
                  onChange={e => setCreateName(e.target.value)}
                  autoFocus
                />
                {createError && <p style={styles.modalError}>{createError}</p>}
                <div style={styles.modalActions}>
                  <button type="button" onClick={() => { setShowCreate(false); setCreateName(''); setCreateError(''); }} style={styles.cancelBtn}>Cancel</button>
                  <button type="submit" disabled={createLoading || !createName.trim()} style={styles.submitBtn}>
                    {createLoading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={styles.heading}>Profiles</h1>
            <span style={styles.badge}>{pagination.total.toLocaleString()} total</span>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowCreate(true)} style={styles.createBtn}>+ Create Profile</button>
          )}
        </div>

        <div style={styles.filterBar}>
          <select value={filters.gender} onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))} style={styles.select}>
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select value={filters.age_group} onChange={e => setFilters(f => ({ ...f, age_group: e.target.value }))} style={styles.select}>
            <option value="">All Age Groups</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
          <input
            placeholder="Country code (e.g. NG)"
            value={filters.country_id}
            onChange={e => setFilters(f => ({ ...f, country_id: e.target.value.toUpperCase() }))}
            style={styles.input}
            maxLength={2}
          />
          <button onClick={() => fetchProfiles(1)} style={styles.filterBtn}>Apply Filters</button>
          <button onClick={() => { setFilters({ gender: '', country_id: '', age_group: '' }); fetchProfiles(1); }} style={styles.clearBtn}>Clear</button>
        </div>

        <div style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.loadingRow}>Loading profiles...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {['Name', 'Gender', 'Age', 'Age Group', 'Country'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profiles.map((p, i) => (
                  <tr key={p.id} onClick={() => navigate(`/profiles/${p.id}`)} style={{ ...styles.row, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ ...styles.td, fontWeight: '600', color: '#1a1a2e' }}>{p.name}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.genderBadge, background: p.gender === 'male' ? '#e3f2fd' : '#fce4ec', color: p.gender === 'male' ? '#1565c0' : '#c62828' }}>
                        {p.gender}
                      </span>
                    </td>
                    <td style={styles.td}>{p.age}</td>
                    <td style={styles.td}><span style={styles.ageBadge}>{p.age_group}</span></td>
                    <td style={styles.td}>{p.country_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={styles.pagination}>
          <button disabled={pagination.page <= 1} onClick={() => fetchProfiles(pagination.page - 1)} style={styles.pageBtn}>← Prev</button>
          <span style={styles.pageInfo}>Page {pagination.page} of {pagination.total_pages}</span>
          <button disabled={pagination.page >= pagination.total_pages} onClick={() => fetchProfiles(pagination.page + 1)} style={styles.pageBtn}>Next →</button>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  heading: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e' },
  badge: { background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  filterBar: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center', background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e8eaed' },
  select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', color: '#333', background: '#fff' },
  input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '160px' },
  filterBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  clearBtn: { background: '#f5f5f5', color: '#666', border: '1px solid #ddd', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  tableWrapper: { background: '#fff', borderRadius: '12px', border: '1px solid #e8eaed', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  loadingRow: { padding: '40px', textAlign: 'center', color: '#888' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  th: { textAlign: 'left', padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e8eaed' },
  row: { cursor: 'pointer', transition: 'background 0.15s' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#444', borderBottom: '1px solid #f0f0f0' },
  genderBadge: { padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  ageBadge: { background: '#f3f4f6', color: '#555', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', textTransform: 'capitalize' },
  pagination: { display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginTop: '24px' },
  pageBtn: { background: '#fff', border: '1px solid #ddd', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  pageInfo: { color: '#666', fontSize: '14px' },
  createBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '14px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' },
  modalInput: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' },
  modalError: { color: '#c62828', fontSize: '13px', marginBottom: '12px' },
  modalActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: { background: '#f5f5f5', color: '#666', border: '1px solid #ddd', padding: '9px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  submitBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};
