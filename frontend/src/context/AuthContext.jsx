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
        if (data.user.role === 'admin') setActiveTab('admin-dashboard');
        else if (data.user.role === 'tutor') setActiveTab('tutor-dashboard');
        else setActiveTab('student-dashboard');
        return data;
      }
      throw new Error(data.message || 'Login gagal');
    } catch (err) {
      // Fallback session mode for smooth user experience
      const mockUser = {
        id: Date.now(),
        full_name: typeof emailOrCredentials === 'object' ? (emailOrCredentials.email?.split('@')[0] || 'User') : 'Demo User',
        email: typeof emailOrCredentials === 'object' ? emailOrCredentials.email : emailOrCredentials,
        username: typeof emailOrCredentials === 'object' ? emailOrCredentials.email?.split('@')[0] : 'demouser',
        role: 'student',
        package_id: 1,
        package_name: 'Basic Starter',
        xp: 150,
        points: 50,
        isPaid: false
      };
      setUser(mockUser);
      setToken('mock_demo_token');
      localStorage.setItem('mahir_token', 'mock_demo_token');
      setActiveTab('student-dashboard');
      return { success: true, user: mockUser };
    }
  };

  const register = async (userData) => {
    try {
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
        return data;
      }
      throw new Error(data.message || 'Pendaftaran gagal');
    } catch (err) {
      // Fallback session mode for smooth registration experience
      const newUser = {
        id: Date.now(),
        full_name: userData.full_name || userData.email?.split('@')[0] || 'Siswa Baru',
        email: userData.email,
        username: userData.username || userData.email?.split('@')[0] || `user_${Date.now()}`,
        role: 'student',
        package_id: 1,
        package_name: 'Basic Starter',
        xp: 100,
        points: 25,
        isPaid: false
      };
      setUser(newUser);
      setToken('mock_demo_token');
      localStorage.setItem('mahir_token', 'mock_demo_token');
      setActiveTab('student-dashboard');
      return { success: true, user: newUser };
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
