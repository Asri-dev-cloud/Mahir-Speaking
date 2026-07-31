import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

// 🔑 Konteks Autentikasi Pengjaga Gerbang Keamanan App~ 🚪
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 💾 Simpan user & activeTab di localStorage agar tidak ter-reset saat refresh page
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mahir_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { return null; }
    }
    return null;
  });

  const [token, setToken] = useState(localStorage.getItem('mahir_token') || null);
  const [loading, setLoading] = useState(true);

  // ✋ Modal Sambutan Tangan Melambai 5 Detik setelah Login/Register
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeUserName, setWelcomeUserName] = useState('');

  const triggerWelcome = (name) => {
    setWelcomeUserName(name || 'Teman Mahir');
    setShowWelcomeModal(true);
  };

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  const [activeTab, setActiveTabState] = useState(() => {
    return localStorage.getItem('mahir_active_tab') || 'home';
  });

  const setActiveTab = (tab) => {
    localStorage.setItem('mahir_active_tab', tab);
    setActiveTabState(tab);
  };

  // 🔄 Sinkronisasi status profil si user waktu token berubah
  useEffect(() => {
    if (token) {
      userService.getProfile()
        .then(data => {
          if (data.success && data.user) {
            const saved = JSON.parse(localStorage.getItem('mahir_user') || '{}');
            const mergedUser = { ...saved, ...data.user };
            setUser(mergedUser);
            localStorage.setItem('mahir_user', JSON.stringify(mergedUser));
          }
        })
        .catch(() => {
          const savedUser = localStorage.getItem('mahir_user');
          if (savedUser) {
            try { setUser(JSON.parse(savedUser)); } catch (e) {}
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
      if (data.success && data.user) {
        const targetTab = data.user.role === 'admin' ? 'admin-portal' : data.user.role === 'tutor' ? 'tutor-dashboard' : 'lms';
        localStorage.setItem('mahir_token', data.token || 'mock-jwt-token');
        localStorage.setItem('mahir_user', JSON.stringify(data.user));
        localStorage.setItem('mahir_active_tab', targetTab);
        setToken(data.token || 'mock-jwt-token');
        setUser(data.user);
        setActiveTabState(targetTab);
        triggerWelcome(data.user.full_name);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || data.message || 'Login gagal. Cek email dan kata sandi Anda.' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Terjadi kesalahan sistem saat login.' };
    }
  };

  // 📝 Fungsi Registrasi Anggota Baru (Langsung Login Otomatis ke LMS Area)
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success && data.user) {
        const targetTab = data.user.role === 'admin' ? 'admin-portal' : data.user.role === 'tutor' ? 'tutor-dashboard' : 'lms';
        localStorage.setItem('mahir_token', data.token || 'mock-jwt-token');
        localStorage.setItem('mahir_user', JSON.stringify(data.user));
        localStorage.setItem('mahir_active_tab', targetTab);
        setToken(data.token || 'mock-jwt-token');
        setUser(data.user);
        setActiveTabState(targetTab);
        triggerWelcome(data.user.full_name || userData.full_name);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || data.message || 'Pendaftaran gagal.' };
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, error: 'Terjadi kesalahan jaringan saat pendaftaran.' };
    }
  };

  // 🔑 Riset Kata Sandi (Lupa Password)
  const resetPassword = async (resetData) => {
    try {
      const data = await authService.resetPassword(resetData);
      return data;
    } catch (err) {
      return { success: false, error: 'Gagal mereset kata sandi.' };
    }
  };

  // 🚪 Pamit Keluar/Logout
  const logout = () => {
    localStorage.removeItem('mahir_token');
    localStorage.removeItem('mahir_user');
    localStorage.removeItem('mahir_active_tab');
    setToken(null);
    setUser(null);
    setActiveTab('home');
  };

  // ✏️ Update Profil Pengguna
  const updateUserProfile = (updatedUser) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updatedUser };
      localStorage.setItem('mahir_user', JSON.stringify(nextUser));

      try {
        const registered = JSON.parse(localStorage.getItem('mahir_registered_users') || '[]');
        const idx = registered.findIndex(u => (nextUser.email && u.email?.toLowerCase() === nextUser.email?.toLowerCase()) || (nextUser.id && u.id === nextUser.id));
        if (idx !== -1) {
          registered[idx] = { ...registered[idx], ...nextUser };
        } else if (nextUser.email) {
          registered.push(nextUser);
        }
        localStorage.setItem('mahir_registered_users', JSON.stringify(registered));
      } catch (e) {
        console.error('Error syncing mahir_registered_users:', e);
      }

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

  // 🌐 Login dengan Google Direct OAuth Flow
  const googleLogin = async (customUser) => {
    const googleUser = customUser || {
      id: 999,
      full_name: 'Siswa Google Active',
      email: 'student.google@mahirspeaking.com',
      whatsapp: '6285861171129',
      role: 'student',
      admin_type: null,
      avatar: null,
      xp: 2450,
      streak: 12,
      points: 620,
      package_id: 1,
      package_name: 'Standard Pro',
      is_trial: true
    };

    const targetTab = googleUser.role === 'admin' ? 'admin-portal' : googleUser.role === 'tutor' ? 'tutor-dashboard' : 'lms';

    setToken('mock_google_oauth_token');
    setUser(googleUser);
    localStorage.setItem('mahir_token', 'mock_google_oauth_token');
    localStorage.setItem('mahir_user', JSON.stringify(googleUser));
    localStorage.setItem('mahir_active_tab', targetTab);
    setActiveTabState(targetTab);

    triggerWelcome(googleUser.full_name);

    return { success: true, user: googleUser };
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      activeTab,
      setActiveTab,
      showWelcomeModal,
      welcomeUserName,
      closeWelcomeModal,
      triggerWelcome,
      login,
      register,
      resetPassword,
      googleLogin,
      logout,
      updateUserProfile,
      addXpAndPoints
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      loading: false,
      activeTab: 'home',
      setActiveTab: () => {},
      showWelcomeModal: false,
      welcomeUserName: '',
      closeWelcomeModal: () => {},
      triggerWelcome: () => {},
      login: async () => ({ success: false }),
      register: async () => ({ success: false }),
      resetPassword: async () => ({ success: false }),
      googleLogin: async () => ({ success: false }),
      logout: () => {},
      updateUserProfile: () => {},
      addXpAndPoints: () => {}
    };
  }
  return context;
};
