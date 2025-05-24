import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await auth.login(form);
      login({ id: response.data.userId }, response.data.refreshToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="container mt-6">
      <div className="box">
        <h1 className="title">Login</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="button is-primary">Login</button>
        </form>
      </div>
    </div>
  );
};