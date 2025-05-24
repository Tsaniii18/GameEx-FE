import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            GameStore
          </Link>
        </div>

        <div className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to="/games">
              Games
            </Link>
            {user && (
              <>
                <Link className="navbar-item" to="/games/my-games">
                  My Games
                </Link>
                <Link className="navbar-item" to="/library">
                  Library
                </Link>
                <Link className="navbar-item" to="/history">
                  Purchase History
                </Link>
              </>
            )}
          </div>

          <div className="navbar-end">
            {user ? (
              <>
                <Link className="navbar-item" to="/profile">
                  Profile
                </Link>
                <div className="navbar-item">
                  <button className="button is-light" onClick={logout}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link className="navbar-item" to="/auth/login">
                  Login
                </Link>
                <Link className="navbar-item" to="/auth/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;