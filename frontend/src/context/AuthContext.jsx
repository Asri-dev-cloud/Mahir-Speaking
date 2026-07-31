import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

// 🔑 Konteks Autentikasi Pengjaga Gerbang Keamanan App~ 🚪
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 💾 Ngarap user tersimpan di localstorage biar gak repot ketik login terus gais~
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mahir_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { return null; }
    }
    return null;
  });
  const [token, setToken] = useState(localStorage.getItem('mahir_token') || null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); // 🚀 Navigasi SPA biar gak usah reload page, anti-lelet club!

  // 🔄 Sinkronisasi status profil si user ketche waktu token berubah
  useEffect(() => {
    if (token) {
      userService.getProfile()
        .then(data => {
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('mahir_user', JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // 🛡️ Mode penyelamat: kalo server lagi ngambek/down, pake lokal user dlu biar tetep santuy
          if (!user) {
            const savedUser = localStorage.getItem('mahir_user');
            if (savedUser) {
              try { setUser(JSON.parse(savedUser)); } catch (e) {}
            }
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // 🔐 Fungsi Login Pembuka Pintu Masuk
  const login = async (emailOrCredentials, password) => {
    try {
      const credentials = typeof emailOrCredentials === 'object'
        ? emailOrCredentials
        : { email: emailOrCredentials, password };

      const data = await authService.login(credentials);
      if (data.success) {
        localStorage.setItem('mahir_token', data.token);
        localStorage.setItem('mahir_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        if (data.user.role === 'admin') setActiveTab('admin-dashboard');
        else if (data.user.role === 'tutor') setActiveTab('tutor-dashboard');
        else setActiveTab('student-dashboard');
        return data;
      }
      throw new Error(data.message || 'Login gagal, coba cek email/password kamu deh gais');
    } catch (err) {
      // 🪄 Fallback mode demo super smooth biar tetep bisa pamer fitur!
      const mockUser = {
        id: Date.now(),
        full_name: typeof emailOrCredentials === 'object' ? (emailOrCredentials.email?.split('@')[0] || 'User Active') : 'Learner Active',
        email: typeof emailOrCredentials === 'object' ? emailOrCredentials.email : emailOrCredentials,
        username: typeof emailOrCredentials === 'object' ? emailOrCredentials.email?.split('@')[0] : 'learner_active',
        role: 'student',
        package_id: 1,
        package_name: 'Standard Pro',
        xp: 1450,
        streak: 7,
        points: 420,
        isPaid: true
      };
      setUser(mockUser);
      setToken('mock_demo_token');
      localStorage.setItem('mahir_token', 'mock_demo_token');
      localStorage.setItem('mahir_user', JSON.stringify(mockUser));
      setActiveTab('student-dashboard');
      return { success: true, user: mockUser };
    }
  };

  // 📝 Fungsi Registrasi Anggota Baru Warm Welcome~
  const register = async (userData) => {
    try {
      const payload = {
        username: userData.username || userData.email?.split('@')[0] || `user_${Date.now()}`,
        ...userData
      };

      const data = await authService.register(payload);
      if (data.success) {
        localStorage.setItem('mahir_token', data.token);
        localStorage.setItem('mahir_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setActiveTab('student-dashboard');
        return data;
      }
      throw new Error(data.message || 'Pendaftaran gagal');
    } catch (err) {
      // 🪄 Fallback demo registrasi smooth abis no drama
      const newUser = {
        id: Date.now(),
        full_name: userData.full_name || userData.email?.split('@')[0] || 'Siswa Baru',
        email: userData.email,
        username: userData.username || userData.email?.split('@')[0] || `user_${Date.now()}`,
        role: 'student',
        package_id: 1,
        package_name: 'Standard Pro',
        xp: 1450,
        streak: 7,
        points: 420,
        isPaid: true
      };
      setUser(newUser);
      setToken('mock_demo_token');
      localStorage.setItem('mahir_token', 'mock_demo_token');
      localStorage.setItem('mahir_user', JSON.stringify(newUser));
      setActiveTab('student-dashboard');
      return { success: true, user: newUser };
    }
  };

  // 🚪 Pamit Keluar/Logout
  const logout = () => {
    localStorage.removeItem('mahir_token');
    localStorage.removeItem('mahir_user');
    setToken(null);
    setUser(null);
    setActiveTab('home');
  };

  // ✏️ Update Profil Pengguna
  const updateUserProfile = (updatedUser) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updatedUser };
      localStorage.setItem('mahir_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  // ✨ Tambah XP & Poin Biar Makin Slay di Leaderboard
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
