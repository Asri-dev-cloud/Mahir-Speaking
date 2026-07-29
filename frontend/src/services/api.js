const API_BASE = '/api';

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
      headers
    });

    const contentType = response.headers.get('content-type');
    let data = {};
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || 'Respon server tidak valid' };
    }

    if (!response.ok) {
      throw new Error(data.message || 'Permintaan API gagal');
    }
    return data;
  } catch (err) {
    console.warn(`API Error on ${endpoint}:`, err.message);
    throw err;
  }
};

// Services API calls
export const authService = {
  login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  forgotPassword: (email) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
};

export const userService = {
  getProfile: () => apiFetch('/users/profile'),
  updateProfile: (data) => apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export const courseService = {
  getCourses: () => apiFetch('/courses'),
  getCourseById: (id) => apiFetch(`/courses/${id}`),
  completeLesson: (data) => apiFetch('/courses/complete-lesson', { method: 'POST', body: JSON.stringify(data) }),
  uploadLesson: (data) => apiFetch('/courses/upload-lesson', { method: 'POST', body: JSON.stringify(data) }),
};

export const packageService = {
  getPackages: () => apiFetch('/packages'),
  purchasePackage: (data) => apiFetch('/packages/purchase', { method: 'POST', body: JSON.stringify(data) }),
  getPurchaseHistory: () => apiFetch('/packages/history'),
};

export const aiService = {
  sendMessage: (message, mode) => apiFetch('/ai/chat', { method: 'POST', body: JSON.stringify({ message, mode }) }),
  getHistory: () => apiFetch('/ai/history'),
  clearHistory: () => apiFetch('/ai/history', { method: 'DELETE' }),
};

export const leaderboardService = {
  getLeaderboard: () => apiFetch('/leaderboard'),
};

export const adminService = {
  getAnalytics: () => apiFetch('/admin/analytics'),
  getUsers: () => apiFetch('/admin/users'),
  updateUser: (id, data) => apiFetch(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updatePackage: (id, data) => apiFetch(`/admin/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
