import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUser = async () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && isMounted) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.error('Session verification notice:', error?.message);
          // Only clear and logout if status explicitly indicates unauthorized / forbidden
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (isMounted) {
              logout();
            }
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const cleanEmail = email?.trim().toLowerCase();
    const res = await api.post('/auth/login', { email: cleanEmail, password });
    if (res.data && res.data.success) {
      const { token: userToken, ...userData } = res.data.data;
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  // Register handler
  const register = async (userData) => {
    const payload = {
      ...userData,
      email: userData.email?.trim().toLowerCase(),
    };
    const res = await api.post('/auth/register', payload);
    if (res.data && res.data.success) {
      const { token: userToken, ...createdUser } = res.data.data;
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(createdUser));
      setToken(userToken);
      setUser(createdUser);
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.data && res.data.success) {
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      return res.data;
    }
    throw new Error(res.data?.message || 'Profile update failed');
  };

  // Change password handler
  const changePassword = async (passwordData) => {
    const res = await api.put('/auth/change-password', passwordData);
    return res.data;
  };

  // Logout handler
  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      console.error('Error clearing localStorage on logout:', e);
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
