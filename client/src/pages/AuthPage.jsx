import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin ? { email, password } : { name, email, password };

      const response = await api.post(endpoint, payload);

      // Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ResumeIQ</h1>
        <p style={styles.subtitle}>
          {isLogin ? 'Welcome back! Please login.' : 'Create an account to get started.'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.toggleLink} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f6f8',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '350px',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '13px',
    textAlign: 'center',
    margin: 0,
  },
  toggleText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#555',
    marginTop: '20px',
  },
  toggleLink: {
    color: '#2563eb',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default AuthPage;