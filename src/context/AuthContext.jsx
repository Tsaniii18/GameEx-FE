import { createContext, useContext, useEffect, useState } from 'react';
import auth from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          await auth.refreshToken();
          if (storedUser) setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = (userData, refreshToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
  };

  const logout = async () => {
    await auth.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);