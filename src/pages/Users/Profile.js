import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, deleteAccount } from '../../api/users';

const Profile = () => {
  const { user: authUser, logout, setUser: setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    foto_profil: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authUser) {
      setFormData(prev => ({
        ...prev,
        username: authUser.username || '',
        email: authUser.email || '',
        foto_profil: authUser.foto_profil || ''
      }));
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        foto_profil: formData.foto_profil,
        ...(formData.password && { password: formData.password })
      };

      const response = await updateProfile(updateData);
      setMessage(response.data.msg || 'Profile updated successfully');

    if (authUser) {
      setAuthUser(response.data.user);
        setAuthUser({
          ...authUser,
          username: formData.username,
          email: formData.email,
          foto_profil: formData.foto_profil
        });
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
      console.error('Profile update error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await deleteAccount();
        logout();
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete account');
      }
    }
  };

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <div className="box">
          <h1 className="title has-text-centered">Profile Settings</h1>

          {/* Profile picture preview */}
          {formData.foto_profil && (
            <div className="has-text-centered mb-4">
              <figure className="image is-128x128 is-inline-block">
                <img
                  src={formData.foto_profil}
                  alt="Profile preview"
                  className="is-rounded"
                />
              </figure>
            </div>
          )}

          {message && (
            <div className="notification is-success">
              <button className="delete" onClick={() => setMessage('')}></button>
              {message}
            </div>
          )}

          {error && (
            <div className="notification is-danger">
              <button className="delete" onClick={() => setError('')}></button>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Profile Picture URL</label>
              <div className="control">
                <input
                  className="input"
                  type="url"
                  name="foto_profil"
                  value={formData.foto_profil}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">New Password (leave blank to keep current)</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Confirm Password</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="6"
                />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button
                  className="button is-primary is-fullwidth"
                  type="submit"
                  disabled={!formData.username || !formData.email}
                >
                  Update Profile
                </button>
              </div>
            </div>
          </form>

          <div className="field mt-5">
            <div className="control">
              <button
                className="button is-danger is-fullwidth"
                onClick={handleDeleteAccount}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;