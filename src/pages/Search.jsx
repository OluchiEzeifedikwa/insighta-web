import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Layout from '../components/Layout';

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

  const suggestions = ['young females from nigeria', 'adult males from kenya', 'seniors from ghana', 'teenagers from south africa'];

  return (
    <Layout>
      <div>
        <h1 style={styles.heading}>Search Profiles</h1>
        <p style={styles.subtext}>Use natural language to search demographic profiles</p>

        <div style={styles.searchBox}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder='e.g. "young females from nigeria"'
            style={styles.input}
          />
          <button onClick={() => handleSearch()} style={styles.searchBtn}>Search</button>
        </div>

        <div style={styles.suggestions}>
          {suggestions.map(s => (
            <button key={s} onClick={() => { setQuery(s); }} style={styles.suggestionChip}>{s}</button>
          ))}
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {loading && <div style={styles.loadingMsg}>Searching...</div>}

        {results && !loading && (
          <div>
            <p style={styles.resultCount}>{pagination.total} result{pagination.total !== 1 ? 's' : ''} found</p>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    {['Name', 'Gender', 'Age', 'Age Group', 'Country'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((p, i) => (
                    <tr key={p.id} onClick={() => navigate(`/profiles/${p.id}`)} style={{ ...styles.row, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ ...styles.td, fontWeight: '600' }}>{p.name}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.genderBadge, background: p.gender === 'male' ? '#e3f2fd' : '#fce4ec', color: p.gender === 'male' ? '#1565c0' : '#c62828' }}>
                          {p.gender}
                        </span>
                      </td>
                      <td style={styles.td}>{p.age}</td>
                      <td style={styles.td}>{p.age_group}</td>
                      <td style={styles.td}>{p.country_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.pagination}>
              <button disabled={pagination.page <= 1} onClick={() => handleSearch(pagination.page - 1)} style={styles.pageBtn}>← Prev</button>
              <span style={styles.pageInfo}>Page {pagination.page} of {pagination.total_pages}</span>
              <button disabled={pagination.page >= pagination.total_pages} onClick={() => handleSearch(pagination.page + 1)} style={styles.pageBtn}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  heading: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' },
  subtext: { color: '#888', fontSize: '14px', marginBottom: '24px' },
  searchBox: { display: 'flex', gap: '10px', marginBottom: '16px' },
  input: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' },
  searchBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
  suggestions: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
  suggestionChip: { background: '#f0f2f5', color: '#555', border: '1px solid #e0e0e0', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  loadingMsg: { textAlign: 'center', color: '#888', padding: '40px' },
  resultCount: { color: '#666', fontSize: '14px', marginBottom: '12px' },
  tableWrapper: { background: '#fff', borderRadius: '12px', border: '1px solid #e8eaed', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  th: { textAlign: 'left', padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e8eaed' },
  row: { cursor: 'pointer' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#444', borderBottom: '1px solid #f0f0f0' },
  genderBadge: { padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  pagination: { display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginTop: '24px' },
  pageBtn: { background: '#fff', border: '1px solid #ddd', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  pageInfo: { color: '#666', fontSize: '14px' },
};
