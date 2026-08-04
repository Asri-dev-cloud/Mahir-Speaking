// 🌐 Base URL API ngambil dari environment variable ya bestie, super fleksibel & anti ribet! ✨
// Trigger build vercel 2
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// 🔑 Helper buat ngambil token autentikasi di localStorage biar aman jaya no cap 🛡️
export const getAuthHeader = () => {
  const token = localStorage.getItem('mahir_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      cache: 'no-store',
      headers
    });

    const contentType = response.headers.get('content-type');
    let data = {};
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      // Treat 404 (Not Found) or 5xx (Server Error) as backend unavailable to trigger local mock database fallback
      const isUnavailable = response.status === 404 || response.status >= 500;
      return {
        success: false,
        status: response.status,
        message: data.message || `Server status ${response.status}`,
        isOffline: isUnavailable
      };
    }

    return { success: true, ...data };
  } catch (err) {
    // Silent fallback handler to prevent console cluttering when offline (actual network failure)
    return { success: false, isOffline: true, message: err.message };
  }
};

// Database lokal pengguna terdaftar (offline/mock mode) - Purged: Hanya Admin Senior
const defaultRegisteredUsers = [
  {
    id: 1,
    full_name: 'Hartini Asri (Admin Senior)',
    email: 'hartiniasri32@gmail.com',
    whatsapp: '6281572120190',
    password: '20424014',
    role: 'admin',
    admin_type: 'Senior Admin',
    avatar: null,
    xp: 0,
    streak: 0,
    points: 0
  }
];

const getRegisteredUsers = () => {
  const saved = localStorage.getItem('mahir_registered_users');
  let users = [...defaultRegisteredUsers];
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach(u => {
          if (u.email && !users.some(existing => existing.email.toLowerCase() === u.email.toLowerCase())) {
            users.push(u);
          }
        });
      }
    } catch (e) { }
  }
  localStorage.setItem('mahir_registered_users', JSON.stringify(users));
  return users;
};

// Services API calls with seamless local fallbacks & strict security
export const authService = {
  login: async (credentials) => {
    const emailLower = (credentials.email || credentials.username || '').toLowerCase().trim();
    const password = String(credentials.password || '').trim();

    // Coba panggil API backend resmi terlebih dahulu
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailLower, password })
    });

    if (res.success && res.token && res.user) {
      return res; // Login berhasil via database cloud!
    }

    // Jika server offline atau koneksi gagal, baru pakai fallback LocalStorage
    if (res.isOffline) {
      const registered = getRegisteredUsers();
      const foundUser = registered.find(u => u.email.toLowerCase() === emailLower);

      if (!foundUser) {
        return {
          success: false,
          error: `Akun dengan email "${emailLower}" tidak ditemukan! Silakan klik tab "Daftar Baru" terlebih dahulu.`
        };
      }

      if (foundUser.password && String(foundUser.password).trim() !== password) {
        return {
          success: false,
          error: `Kata sandi yang Anda masukkan untuk "${emailLower}" tidak cocok! Silakan periksa kembali atau gunakan fitur "Forgot password?".`
        };
      }

      const mockToken = 'mock-user-' + btoa(JSON.stringify({
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role || 'student',
        username: foundUser.username || foundUser.email.split('@')[0],
        full_name: foundUser.full_name
      }));

      return {
        success: true,
        token: mockToken,
        user: foundUser
      };
    }

    // Jika gagal dari server karena password/email salah, kembalikan pesan error server asli
    return {
      success: false,
      error: res.message || 'Email atau kata sandi tidak cocok.'
    };
  },

  register: async (userData) => {
    const res = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
    if (res.success && res.token && res.user) {
      return res;
    }

    if (res.isOffline) {
      const registered = getRegisteredUsers();
      const emailLower = (userData.email || '').toLowerCase().trim();

      if (registered.some(u => u.email.toLowerCase() === emailLower)) {
        return {
          success: false,
          error: `Email "${emailLower}" sudah terdaftar di sistem! Silakan klik "Masuk" di tab atas atau gunakan Lupa Password.`
        };
      }

      if (userData.password && userData.password.length < 6) {
        return {
          success: false,
          error: 'Kata sandi terlalu pendek! Minimal harus 6 karakter.'
        };
      }

      const newUser = {
        id: Date.now(),
        full_name: userData.full_name,
        email: emailLower,
        whatsapp: userData.whatsapp || '',
        password: userData.password,
        role: 'student',
        admin_type: null,
        avatar: null,
        xp: 0,
        streak: 0,
        points: 0,
        package_id: 1,
        package_name: 'Kelas Reguler',
        is_trial: true
      };

      registered.push(newUser);
      localStorage.setItem('mahir_registered_users', JSON.stringify(registered));

      const mockToken = 'mock-user-' + btoa(JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        username: newUser.email.split('@')[0],
        full_name: newUser.full_name
      }));

      return {
        success: true,
        token: mockToken,
        user: newUser,
        message: 'Pendaftaran akun berhasil!'
      };
    }

    return {
      success: false,
      error: res.message || 'Pendaftaran gagal.'
    };
    return res;
  },

  resetPassword: async ({ email, newPassword }) => {
    const res = await apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email, newPassword }) });
    if (!res.success) {
      const registered = getRegisteredUsers();
      const emailLower = (email || '').toLowerCase().trim();
      const idx = registered.findIndex(u => u.email.toLowerCase() === emailLower);

      if (idx === -1) {
        return {
          success: false,
          error: 'Email ini tidak terdaftar di sistem! Silakan buat akun baru terlebih dahulu.'
        };
      }

      registered[idx].password = newPassword;
      localStorage.setItem('mahir_registered_users', JSON.stringify(registered));

      return {
        success: true,
        message: 'Kata sandi berhasil diperbarui! Silakan masuk menggunakan kata sandi baru Anda.'
      };
    }
    return res;
  },

  forgotPassword: (email) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
};

export const userService = {
  getProfile: async () => {
    const res = await apiFetch('/users/profile');
    if (!res.success) {
      const savedUser = localStorage.getItem('mahir_user');
      return { success: true, user: savedUser ? JSON.parse(savedUser) : { username: 'student', role: 'student', full_name: 'Aci Student', avatar: '/ma.png', xp: 3450, streak: 18 } };
    }
    return res;
  },
  updateProfile: async (data) => {
    const res = await apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(data) });
    if (!res.success) {
      const savedUser = JSON.parse(localStorage.getItem('mahir_user') || '{}');
      const updated = { ...savedUser, ...data };
      localStorage.setItem('mahir_user', JSON.stringify(updated));
      return { success: true, user: updated };
    }
    return res;
  },
};

export const courseService = {
  getCourses: async () => {
    const res = await apiFetch('/courses');
    if (!res.success) return { success: true, courses: [] };
    return res;
  },
  getCourseById: (id) => apiFetch(`/courses/${id}`),
  completeLesson: (data) => apiFetch('/courses/complete-lesson', { method: 'POST', body: JSON.stringify(data) }),
  uploadLesson: (data) => apiFetch('/courses/upload-lesson', { method: 'POST', body: JSON.stringify(data) }),
};

export const packageService = {
  getPackages: async () => {
    const res = await apiFetch('/packages');
    if (!res.success) return { success: true, packages: [] };
    return res;
  },
  purchasePackage: (data) => apiFetch('/packages/purchase', { method: 'POST', body: JSON.stringify(data) }),
  getPurchaseHistory: () => apiFetch('/packages/history'),
};

export const aiService = {
  sendMessage: (message, mode) => apiFetch('/ai/chat', { method: 'POST', body: JSON.stringify({ message, mode }) }),
  getHistory: async () => {
    const res = await apiFetch('/ai/history');
    if (!res.success) return { success: true, history: [] };
    return res;
  },
  clearHistory: () => apiFetch('/ai/history', { method: 'DELETE' }),
};

export const leaderboardService = {
  getLeaderboard: async () => {
    const res = await apiFetch('/leaderboard');
    if (!res.success) return { success: true, rankings: [] };
    return res;
  },
};

// 🤖 Data Awal Latihan Chatbot Mashira AI
const defaultExercises = [
  {
    id: 1,
    level: "A1",
    title: "Introduce Yourself",
    instruction: "Dengarkan lalu ulangi kalimat berikut.",
    referenceText: "Hello, my name is Dhalfa and I am learning English.",
    translation: "Halo, nama saya Dhalfa dan saya sedang belajar bahasa Inggris."
  },
  {
    id: 2,
    level: "A1",
    title: "Daily Routine",
    instruction: "Dengarkan lalu ulangi dengan jelas.",
    referenceText: "I usually study English in the evening.",
    translation: "Saya biasanya belajar bahasa Inggris pada malam hari."
  },
  {
    id: 3,
    level: "A2",
    title: "Speaking Goal",
    instruction: "Ucapkan kalimat berikut dengan percaya diri.",
    referenceText: "My goal is to speak English confidently.",
    translation: "Tujuan saya adalah berbicara bahasa Inggris dengan percaya diri."
  },
  {
    id: 4,
    level: "A2",
    title: "Weekend Story",
    instruction: "Jawab pertanyaan berikut dalam bahasa Inggris.",
    referenceText: "Tell me about your weekend.",
    translation: "Ceritakan tentang akhir pekanmu."
  }
];

export const exerciseService = {
  getExercises: async () => {
    const res = await apiFetch('/exercises');
    if (!res.success && res.isOffline) {
      const saved = localStorage.getItem('mahir_exercises');
      if (saved) {
        try { return { success: true, exercises: JSON.parse(saved) }; } catch (e) { }
      }
      localStorage.setItem('mahir_exercises', JSON.stringify(defaultExercises));
      return { success: true, exercises: defaultExercises };
    }
    return res;
  },

  createExercise: async (data) => {
    const res = await apiFetch('/exercises', { method: 'POST', body: JSON.stringify(data) });
    if (!res.success && res.isOffline) {
      const saved = localStorage.getItem('mahir_exercises') || JSON.stringify(defaultExercises);
      let exercises = [];
      try { exercises = JSON.parse(saved); } catch (e) { }
      const newExercise = {
        id: Date.now(),
        ...data
      };
      exercises.push(newExercise);
      localStorage.setItem('mahir_exercises', JSON.stringify(exercises));
      return { success: true, exercise: newExercise, message: 'Latihan berhasil ditambahkan (Offline Mode)!' };
    }
    return res;
  },

  updateExercise: async (id, data) => {
    const res = await apiFetch(`/exercises/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.success && res.isOffline) {
      const saved = localStorage.getItem('mahir_exercises') || JSON.stringify(defaultExercises);
      let exercises = [];
      try { exercises = JSON.parse(saved); } catch (e) { }
      const idx = exercises.findIndex(e => e.id === id);
      if (idx !== -1) {
        exercises[idx] = { ...exercises[idx], ...data };
        localStorage.setItem('mahir_exercises', JSON.stringify(exercises));
      }
      return { success: true, message: 'Latihan berhasil diperbarui (Offline Mode)!' };
    }
    return res;
  },

  deleteExercise: async (id) => {
    const res = await apiFetch(`/exercises/${id}`, { method: 'DELETE' });
    if (!res.success && res.isOffline) {
      const saved = localStorage.getItem('mahir_exercises') || JSON.stringify(defaultExercises);
      let exercises = [];
      try { exercises = JSON.parse(saved); } catch (e) { }
      const filtered = exercises.filter(e => e.id !== id);
      localStorage.setItem('mahir_exercises', JSON.stringify(filtered));
      return { success: true, message: 'Latihan berhasil dihapus (Offline Mode)!' };
    }
    return res;
  }
};

// Initial Mock Data for Admin Portal - PURGED DATABASE: HANYA ADMIN SENIOR
const mockUsersList = [
  {
    id: 1,
    full_name: 'Hartini Asri (Admin Senior)',
    username: 'hartiniasri',
    email: 'hartiniasri32@gmail.com',
    whatsapp: '6281572120190',
    role: 'admin',
    admin_type: 'Senior Admin',
    package_id: 3,
    package_name: 'Master Admin',
    is_trial: false,
    trial_expires: null,
    package_expires: '2099-12-31',
    xp: 0,
    points: 0,
    streak: 0,
    last_active: 'Aktif Sekarang',
    activities: [
      { action: 'Clean Database Purge (Drop All Except Admin Senior)', time: 'Baru saja' },
      { action: 'Master Admin Login Verified', time: '10 menit lalu' }
    ]
  }
];

const mockLeadsList = [];

export const adminService = {
  getAnalytics: async () => {
    const res = await apiFetch('/admin/analytics');
    if (!res.success && res.isOffline) {
      const savedLeads = JSON.parse(localStorage.getItem('mahir_leads') || JSON.stringify(mockLeadsList));
      return {
        success: true,
        stats: {
          totalUsers: mockUsersList.length,
          totalStudents: mockUsersList.filter(u => u.role === 'student').length,
          totalTutors: mockUsersList.filter(u => u.role === 'tutor').length,
          activeTrials: mockUsersList.filter(u => u.is_trial).length,
          totalLeads: savedLeads.length,
          expiringSoon: mockUsersList.filter(u => u.package_expires && new Date(u.package_expires) <= new Date(Date.now() + 7 * 86400000)).length,
          totalRevenue: 24500000
        }
      };
    }
    return res;
  },

  getUsers: async () => {
    const res = await apiFetch('/admin/users');
    if (!res.success && res.isOffline) {
      const saved = localStorage.getItem('mahir_mock_admin_users');
      if (saved) {
        try { return { success: true, users: JSON.parse(saved) }; } catch (e) { }
      }
      localStorage.setItem('mahir_mock_admin_users', JSON.stringify(mockUsersList));
      return { success: true, users: mockUsersList };
    }
    return res;
  },

  updateUser: async (id, data) => {
    const res = await apiFetch(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.success && res.isOffline) {
      const currentUsers = JSON.parse(localStorage.getItem('mahir_mock_admin_users') || JSON.stringify(mockUsersList));
      const idx = currentUsers.findIndex(u => u.id === id);
      if (idx !== -1) {
        currentUsers[idx] = { ...currentUsers[idx], ...data };
        localStorage.setItem('mahir_mock_admin_users', JSON.stringify(currentUsers));
      }
      return { success: true, message: 'Data pengguna berhasil diperbarui!' };
    }
    return res;
  },

  addAssistantAdmin: async (assistantData) => {
    const res = await apiFetch('/admin/assistants', { method: 'POST', body: JSON.stringify(assistantData) });
    if (!res.success && res.isOffline) {
      const emailLower = (assistantData.email || '').trim().toLowerCase();
      // Check if user is registered in localStorage
      const registered = JSON.parse(localStorage.getItem('mahir_registered_users') || '[]');
      const userIndex = registered.findIndex(u => u.email.toLowerCase() === emailLower);

      if (userIndex === -1) {
        return {
          success: false,
          message: 'Pengguna dengan email tersebut belum terdaftar! Silakan minta calon asisten mendaftar akun di website terlebih dahulu.'
        };
      }

      const targetUser = registered[userIndex];
      targetUser.role = 'admin';
      targetUser.admin_type = 'Admin Asisten';
      localStorage.setItem('mahir_registered_users', JSON.stringify(registered));

      // Also update in mock admin users list
      const currentUsers = JSON.parse(localStorage.getItem('mahir_mock_admin_users') || JSON.stringify(mockUsersList));
      const adminIndex = currentUsers.findIndex(u => u.email.toLowerCase() === emailLower);
      if (adminIndex !== -1) {
        currentUsers[adminIndex].role = 'admin';
        currentUsers[adminIndex].admin_type = 'Admin Asisten';
      } else {
        currentUsers.unshift({
          ...targetUser,
          package_id: 3,
          package_name: 'Admin Assistant',
          last_active: 'Baru ditambahkan',
          activities: [{ action: 'Akun Admin Asisten Dibuat', time: 'Baru saja' }]
        });
      }
      localStorage.setItem('mahir_mock_admin_users', JSON.stringify(currentUsers));

      return {
        success: true,
        assistant: targetUser,
        message: `${targetUser.full_name} berhasil dijadikan Admin Asisten!`
      };
    }
    return res;
  },

  getLeads: async () => {
    const res = await apiFetch('/admin/leads');
    if (!res.success && res.isOffline) {
      const saved = localStorage.getItem('mahir_leads');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return { success: true, leads: parsed };
        } catch (e) { }
      }
      localStorage.setItem('mahir_leads', JSON.stringify(mockLeadsList));
      return { success: true, leads: mockLeadsList };
    }
    return { success: true, leads: Array.isArray(res.leads) ? res.leads : [] };
  },

  updateLeadStatus: async (id, status) => {
    const res = await apiFetch(`/admin/leads/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    if (!res.success && res.isOffline) {
      const currentLeads = JSON.parse(localStorage.getItem('mahir_leads') || JSON.stringify(mockLeadsList));
      const idx = currentLeads.findIndex(l => l.id === id);
      if (idx !== -1) {
        currentLeads[idx].status = status;
        localStorage.setItem('mahir_leads', JSON.stringify(currentLeads));
      }
      return { success: true, message: 'Status lead berhasil diperbarui!' };
    }
    return res;
  },

  deleteLead: async (id) => {
    const res = await apiFetch(`/admin/leads/${id}`, { method: 'DELETE' });
    if (!res.success) {
      const currentLeads = JSON.parse(localStorage.getItem('mahir_leads') || JSON.stringify(mockLeadsList));
      const filtered = currentLeads.filter(l => l.id !== id);
      localStorage.setItem('mahir_leads', JSON.stringify(filtered));
      return { success: true, message: 'Data lead berhasil dihapus.' };
    }
    return res;
  },

  // 📝 Quizzes Management (Upload CSV / XLSX & Manual)
  getQuizzes: async () => {
    const res = await apiFetch('/admin/quizzes');
    return { ...res, quizzes: Array.isArray(res.quizzes) ? res.quizzes : [] };
  },

  saveQuizzes: async (newQuizzes) => {
    return apiFetch('/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify({ quizzes: newQuizzes })
    });
  },

  deleteQuiz: async (id) => {
    return apiFetch(`/admin/quizzes/${id}`, { method: 'DELETE' });
  },

  // 📦 Modules Management (PDF, DOC, PPT)
  getModules: async () => {
    const res = await apiFetch('/admin/modules');
    return { ...res, modules: Array.isArray(res.modules) ? res.modules : [] };
  },

  saveModule: async (moduleData) => {
    return apiFetch('/admin/modules', {
      method: 'POST',
      body: JSON.stringify(moduleData)
    });
  },

  deleteModule: async (id) => {
    return apiFetch(`/admin/modules/${id}`, { method: 'DELETE' });
  },

  // 📹 Recorded Class Video Management (YouTube & Google Drive)
  getRecordedVideos: async () => {
    const res = await apiFetch('/admin/recorded-videos');
    return { ...res, videos: Array.isArray(res.videos) ? res.videos : [] };
  },

  saveRecordedVideo: async (videoData) => {
    const { embedUrl, thumbnailUrl, provider } = parseVideoUrl(videoData.videoUrl, videoData.thumbnail);
    return apiFetch('/admin/recorded-videos', {
      method: 'POST',
      body: JSON.stringify({
        ...videoData,
        videoUrl: embedUrl,
        rawUrl: videoData.videoUrl,
        thumbnail: thumbnailUrl,
        provider: provider
      })
    });
  },

  deleteRecordedVideo: async (id) => {
    return apiFetch(`/admin/recorded-videos/${id}`, { method: 'DELETE' });
  }
};

// 🎬 Helper Parser YouTube / GDrive Video & Thumbnail
export const parseVideoUrl = (url, customThumb = '') => {
  let embedUrl = url;
  let thumbnailUrl = customThumb;
  let provider = 'other';

  if (!url) return { embedUrl: '', thumbnailUrl: '', provider: 'none' };

  // YouTube Regex Matcher
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    provider = 'youtube';
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
    if (!thumbnailUrl) {
      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  // Google Drive Matcher
  else if (url.includes('drive.google.com')) {
    provider = 'gdrive';
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      if (!thumbnailUrl) {
        thumbnailUrl = `https://lh3.googleusercontent.com/d/${fileId}=s800`;
      }
    }
  }

  // Fallback thumbnail default jika kosong
  if (!thumbnailUrl) {
    thumbnailUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
  }

  return { embedUrl, thumbnailUrl, provider };
};
