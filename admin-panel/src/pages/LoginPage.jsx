import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCredentials, getCourts } from '../api/client';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setCredentials(username, password);

    try {
      const res = await getCourts();
      if (res.status === 401) {
        setError('Invalid credentials');
        return;
      }
      if (!res.ok) {
        setError('An unexpected error occurred. Please try again.');
        return;
      }
      onLogin();
      navigate('/dashboard');
    } catch {
      // TODO: Distinguish network errors from server errors if better UX is needed.
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Court Reservation</h1>
        <p className="login-subtitle">Admin Panel</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
