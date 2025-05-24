import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar is-primary">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">Game Store</Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            {user ? (
              <>
                <Link to="/profile" className="navbar-item">Profile</Link>
                <Link to="/library" className="navbar-item">Library</Link>
                <Link to="/my-games" className="navbar-item">My Games</Link>
                <button onClick={logout} className="button is-light">Logout</button>
              </>
            ) : (
              <Link to="/login" className="button is-light">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};