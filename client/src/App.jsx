import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import History from './pages/History';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/results" element={isLoggedIn ? <Results /> : <Navigate to="/" />} />
        <Route path="/history" element={isLoggedIn ? <History /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;