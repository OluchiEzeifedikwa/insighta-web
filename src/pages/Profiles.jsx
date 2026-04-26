import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
  const [filters, setFilters] = useState({ gender: '', country_id: '', age_group: '' });
  const [loading, setLoading] = useState(false);
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

  useEffect(() => { fetchProfiles(); }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Profiles</h1>
      <p style={{ color: '#666', marginBottom: '16px' }}>{pagination.total.toLocaleString()} total profiles</p>

      <div style={styles.filters}>
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
        <input placeholder="Country code (e.g. NG)" value={filters.country_id} onChange={e => setFilters(f => ({ ...f, country_id: e.target.value }))} style={styles.input} />
        <button onClick={() => fetchProfiles(1)} style={styles.btn}>Filter</button>
        <button onClick={() => navigate('/dashboard')} style={{ ...styles.btn, background: '#666' }}>Back</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <table style={styles.table}>
          <thead>
            <tr>{['Name', 'Gender', 'Age', 'Age Group', 'Country'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.id} onClick={() => navigate(`/profiles/${p.id}`)} style={styles.row}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.gender}</td>
                <td style={styles.td}>{p.age}</td>
                <td style={styles.td}>{p.age_group}</td>
                <td style={styles.td}>{p.country_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={styles.pagination}>
        <button disabled={pagination.page <= 1} onClick={() => fetchProfiles(pagination.page - 1)} style={styles.pageBtn}>Prev</button>
        <span>Page {pagination.page} of {pagination.total_pages}</span>
        <button disabled={pagination.page >= pagination.total_pages} onClick={() => fetchProfiles(pagination.page + 1)} style={styles.pageBtn}>Next</button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
  heading: { fontSize: '28px', marginBottom: '4px' },
  filters: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  select: { padding: '8px', borderRadius: '6px', border: '1px solid #ccc' },
  input: { padding: '8px', borderRadius: '6px', border: '1px solid #ccc' },
  btn: { background: '#24292e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
  td: { padding: '12px', borderBottom: '1px solid #e0e0e0' },
  row: { cursor: 'pointer' },
  pagination: { display: 'flex', gap: '16px', alignItems: 'center', marginTop: '20px' },
  pageBtn: { padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' },
};
