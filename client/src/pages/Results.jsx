import { useLocation, useNavigate } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const analysis = location.state?.analysis;

  // If someone lands here directly without data, send them back
  if (!analysis) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p>No analysis data found.</p>
          <button style={styles.button} onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { atsScore, missingKeywords, suggestions, strengths } = analysis;

  const getScoreColor = (score) => {
    if (score >= 75) return '#27ae60';
    if (score >= 50) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.logo} onClick={() => navigate('/dashboard')}>
          ResumeIQ
        </h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.scoreCard}>
          <p style={styles.scoreLabel}>ATS Match Score</p>
          <h1 style={{ ...styles.scoreValue, color: getScoreColor(atsScore) }}>
            {atsScore}
            <span style={styles.scoreOutOf}>/100</span>
          </h1>
        </div>

        <div style={styles.grid}>
          <div style={styles.section}>
            <h3 style={{ ...styles.sectionTitle, color: '#e74c3c' }}>Missing Keywords</h3>
            <ul style={styles.list}>
              {missingKeywords?.length > 0 ? (
                missingKeywords.map((keyword, idx) => <li key={idx} style={styles.listItem}>{keyword}</li>)
              ) : (
                <p style={styles.emptyText}>No missing keywords found. Great job!</p>
              )}
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={{ ...styles.sectionTitle, color: '#27ae60' }}>Strengths</h3>
            <ul style={styles.list}>
              {strengths?.length > 0 ? (
                strengths.map((strength, idx) => <li key={idx} style={styles.listItem}>{strength}</li>)
              ) : (
                <p style={styles.emptyText}>No strengths identified.</p>
              )}
            </ul>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, color: '#2563eb' }}>Suggestions to Improve</h3>
          <ul style={styles.list}>
            {suggestions?.length > 0 ? (
              suggestions.map((suggestion, idx) => <li key={idx} style={styles.listItem}>{suggestion}</li>)
            ) : (
              <p style={styles.emptyText}>No suggestions available.</p>
            )}
          </ul>
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
    maxWidth: '800px',
    margin: '30px auto',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  scoreLabel: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '5px',
  },
  scoreValue: {
    fontSize: '48px',
    margin: 0,
  },
  scoreOutOf: {
    fontSize: '20px',
    color: '#aaa',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    marginBottom: '15px',
    fontSize: '17px',
  },
  list: {
    paddingLeft: '20px',
    margin: 0,
  },
  listItem: {
    marginBottom: '10px',
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.5',
  },
  emptyText: {
    color: '#999',
    fontSize: '14px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default Results;