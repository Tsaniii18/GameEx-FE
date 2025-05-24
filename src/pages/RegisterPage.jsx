import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../services/auth';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="container mt-6">
      <div className="box">
        <h1 className="title">Register</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Username</label>
            <input
              type="text"
              className="input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          {/* Tambahkan field email dan password serupa */}
          <button type="submit" className="button is-primary">Register</button>
        </form>
      </div>
    </div>
  );
};