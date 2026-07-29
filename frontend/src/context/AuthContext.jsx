import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mahir_token') || null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); // Navigation state for SPA routing

  useEffect(() => {
    if (token) {
      userService.getProfile()
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (emailOrCredentials, password) => {
    try {
      const credentials = typeof emailOrCredentials === 'object'
        ? emailOrCredentials
        : { email: emailOrCredentials, password };

      const data = await authService.login(credentials);
      if (data.success) {
        localStorage.setItem('mahir_token', data.token);
        setToken(data.token);
        setUser(data.user);
        // Navigate based on role
        if (data.user.role === 'admin') setActiveTab('admin-dashboard');
        else if (data.user.role === 'tutor') setActiveTab('tutor-dashboard');
        else setActiveTab('student-dashboard');
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // Ensure username exists
      const payload = {
        username: userData.username || userData.email?.split('@')[0] || `user_${Date.now()}`,
        ...userData
      };

      const data = await authService.register(payload);
      if (data.success) {
        localStorage.setItem('mahir_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setActiveTab('student-dashboard');
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('mahir_token');
    setToken(null);
    setUser(null);
    setActiveTab('home');
  };

  const updateUserProfile = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const addXpAndPoints = (xp, points) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        xp: (prev.xp || 0) + xp,
        points: (prev.points || 0) + points
      };
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      activeTab,
      setActiveTab,
      login,
      register,
      logout,
      updateUserProfile,
      addXpAndPoints
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
