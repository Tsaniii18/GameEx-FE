import { useState, useEffect } from 'react';
import users from '../services/users';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await users.getProfile();
      setProfile(response.data);
      setForm(response.data);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await users.updateProfile(form);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Update failed');
    }
  };

  return (
    <div className="container mt-4">
      <div className="box">
        <h1 className="title">Profile</h1>
        {message && <div className="notification is-info">{message}</div>}
        <form onSubmit={handleUpdate}>
          {/* Form fields untuk username, email, password, foto profil */}
          <button type="submit" className="button is-primary">Update</button>
        </form>
        <button 
          onClick={() => users.deleteAccount()}
          className="button is-danger mt-4"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};