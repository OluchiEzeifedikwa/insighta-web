const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://mesh-data-persistence.vercel.app';

export default function Login() {
  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/github`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Insighta Labs</h1>
        <p style={styles.subtitle}>Demographic Intelligence Platform</p>
        <button onClick={handleLogin} style={styles.button}>
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' },
  card: { background: '#fff', padding: '48px', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.1)', textAlign: 'center', minWidth: '320px' },
  title: { margin: '0 0 8px', fontSize: '28px', fontWeight: '700' },
  subtitle: { margin: '0 0 32px', color: '#666' },
  button: { background: '#24292e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', width: '100%' },
};
