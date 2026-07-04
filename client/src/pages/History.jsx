import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/resume/history');
        setHistory(res.data);
      } catch (err) {
        setError('Failed to load history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 75) return '#27ae60';
    if (score >= 50) return '#f39c12';
    return '#e74c3c';
  };

  const viewDetails = (item) => {
    const analysis = {
      atsScore: item.ats_score,
      missingKeywords: JSON.parse(item.missing_keywords),
      suggestions: JSON.parse(item.suggestions),
      strengths: JSON.parse(item.strengths),
    };
    navigate('/results', { state: { analysis } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.logo} onClick={() => navigate('/dashboard')}>ResumeIQ</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>Your Resume History</h3>

        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && history.length === 0 && (
          <p style={styles.emptyText}>No analysis history yet. Go analyze a resume!</p>
        )}

        <div style={styles.list}>
          {history.map((item) => (
            <div key={item.id} style={styles.itemCard} onClick={() => viewDetails(item)}>
              <div>
                <p style={styles.itemDate}>
                  {new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p style={styles.itemHint}>Click to view full details</p>
              </div>
              <div style={{ ...styles.scoreCircle, backgroundColor: getScoreColor(item.ats_score) }}>
                {item.ats_score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  logo: {
    color: '#2563eb',
    margin: 0,
    cursor: 'pointer',
  },
  backBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #2563eb',
    backgroundColor: '#fff',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  content: {
    maxWidth: '700px',
    margin: '30px auto',
    padding: '0 20px',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '18px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    cursor: 'pointer',
  },
  itemDate: {
    margin: 0,
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '14px',
  },
  itemHint: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#999',
  },
  scoreCircle: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  error: {
    color: '#e74c3c',
  },
  emptyText: {
    color: '#999',
  },
};

export default History;