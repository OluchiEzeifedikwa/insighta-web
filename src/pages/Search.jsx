import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSearch(page = 1) {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    api.get('/api/profiles/search', { params: { q: query, page, limit: 10 } })
      .then(res => {
        setResults(res.data.data);
        setPagination({ page: res.data.page, total_pages: res.data.total_pages, total: res.data.total });
      })
      .catch(err => setError(err.response?.data?.message || 'Search failed'))
      .finally(() => setLoading(false));
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.back}>← Back</button>
      <h1 style={styles.heading}>Search Profiles</h1>

      <div style={styles.searchRow}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder='e.g. "young females from nigeria"'
          style={styles.input}
        />
        <button onClick={() => handleSearch()} style={styles.btn}>Search</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Searching...</p>}

      {results && (
        <>
          <p style={{ color: '#666' }}>{pagination.total} results</p>
          <table style={styles.table}>
            <thead>
              <tr>{['Name', 'Gender', 'Age', 'Age Group', 'Country'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {results.map(p => (
                <tr key={p.id} onClick={() => navigate(`/profiles/${p.id}`)} style={{ cursor: 'pointer' }}>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.gender}</td>
                  <td style={styles.td}>{p.age}</td>
                  <td style={styles.td}>{p.age_group}</td>
                  <td style={styles.td}>{p.country_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.pagination}>
            <button disabled={pagination.page <= 1} onClick={() => handleSearch(pagination.page - 1)} style={styles.pageBtn}>Prev</button>
            <span>Page {pagination.page} of {pagination.total_pages}</span>
            <button disabled={pagination.page >= pagination.total_pages} onClick={() => handleSearch(pagination.page + 1)} style={styles.pageBtn}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
  back: { background: 'none', border: 'none', cursor: 'pointer', color: '#24292e', marginBottom: '16px', fontSize: '14px', padding: 0 },
  heading: { fontSize: '28px', marginBottom: '24px' },
  searchRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  input: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  btn: { background: '#24292e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e0e0e0', fontWeight: '600' },
  td: { padding: '12px', borderBottom: '1px solid #e0e0e0' },
  pagination: { display: 'flex', gap: '16px', alignItems: 'center', marginTop: '20px' },
  pageBtn: { padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' },
};
