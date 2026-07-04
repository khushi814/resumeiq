import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');

    if (!resumeFile) {
      setError('Please upload your resume (PDF).');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload PDF and extract text
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const uploadRes = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const resumeText = uploadRes.data.fullText;

      // Step 2: Send extracted text + job description for analysis
      const analyzeRes = await api.post('/analyze', {
        resumeText,
        jobDescription,
      });

      // Step 3: Navigate to results page with the analysis data
      navigate('/results', { state: { analysis: analyzeRes.data } });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.logo}>ResumeIQ</h2>
        <div style={styles.headerRight}>
          <span style={styles.welcomeText}>Hi, {user?.name || 'User'}</span>
          <button style={styles.historyBtn} onClick={() => navigate('/history')}>
            History
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Analyze Your Resume</h3>
        <p style={styles.cardSubtitle}>
          Upload your resume and paste the job description to get your ATS score.
        </p>

        <form onSubmit={handleAnalyze} style={styles.form}>
          <label style={styles.label}>Upload Resume (PDF)</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} style={styles.fileInput} />

          <label style={styles.label}>Job Description</label>
          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            style={styles.textarea}
            rows={8}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
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
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  welcomeText: {
    color: '#555',
    fontSize: '14px',
  },
  historyBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #2563eb',
    backgroundColor: '#fff',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  logoutBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  card: {
    maxWidth: '600px',
    margin: '40px auto',
    backgroundColor: '#fff',
    padding: '35px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    color: '#2c3e50',
    marginBottom: '5px',
  },
  cardSubtitle: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: '10px',
  },
  fileInput: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#fafafa',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
  },
  button: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '13px',
    margin: '5px 0 0 0',
  },
};

export default Dashboard;