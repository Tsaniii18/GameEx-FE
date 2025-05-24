import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, deleteAccount } from '../../api/users';

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState({
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
      setUser(prev => ({
        ...prev,
        username: authUser.username || '',
        email: authUser.email || '',
        foto_profil: authUser.foto_profil || ''
      }));
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (user.password && user.password !== user.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const updateData = {
        username: user.username,
        email: user.email,
        foto_profil: user.foto_profil,
        ...(user.password && { password: user.password })
      };

      await updateProfile(updateData);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await deleteAccount();
        logout();
      } catch (err) {
        setError('Failed to delete account');
      }
    }
  };

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <div className="box">
          <h1 className="title has-text-centered">Profile</h1>
          
          {message && <div className="notification is-success">{message}</div>}
          {error && <div className="notification is-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={user.username}
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
                  value={user.email}
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
                  type="text"
                  name="foto_profil"
                  value={user.foto_profil}
                  onChange={handleChange}
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
                  value={user.password}
                  onChange={handleChange}
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
                  value={user.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="field">
              <div className="control">
                <button className="button is-primary is-fullwidth" type="submit">
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
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;