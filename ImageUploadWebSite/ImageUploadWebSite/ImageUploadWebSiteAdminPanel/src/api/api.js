// API configuration and service for admin panel
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const getToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email, password, role = 'admin') => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        return { ...response, user: { id: payload.id, email: payload.email || email, role: payload.role } };
      } catch {
        return response;
      }
    }
    return response;
  },

  register: async (userData) => {
    // Register endpoint doesn't require authentication
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData, role: userData?.role || 'admin' }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Users API
export const usersAPI = {
  getUsers: async () => {
    return apiRequest('/admin/users');
  },

  updateUserRole: async (id, role) => {
    return apiRequest(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (id) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Uploads API
export const uploadsAPI = {
  getUploads: async () => {
    return apiRequest('/admin/uploads');
  },

  deleteUpload: async (id) => {
    return apiRequest(`/admin/uploads/${id}`, {
      method: 'DELETE',
    });
  },
};

// Draws API
export const drawsAPI = {
  getDraws: async () => {
    return apiRequest('/admin/draws');
  },

  createDraw: async (drawData) => {
    return apiRequest('/admin/draws', {
      method: 'POST',
      body: JSON.stringify(drawData),
    });
  },

  updateDraw: async (id, drawData) => {
    return apiRequest(`/admin/draws/${id}`, {
      method: 'PUT',
      body: JSON.stringify(drawData),
    });
  },

  deleteDraw: async (id) => {
    return apiRequest(`/admin/draws/${id}`, {
      method: 'DELETE',
    });
  },
};

// Ads API
export const adsAPI = {
  getAds: async () => {
    return apiRequest('/admin/ads');
  },

  createAd: async (adData) => {
    return apiRequest('/admin/ads', {
      method: 'POST',
      body: JSON.stringify(adData),
    });
  },

  updateAd: async (id, adData) => {
    return apiRequest(`/admin/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(adData),
    });
  },

  deleteAd: async (id) => {
    return apiRequest(`/admin/ads/${id}`, {
      method: 'DELETE',
    });
  },
};

// Pages API
export const pagesAPI = {
  getPages: async () => {
    return apiRequest('/pages');
  },

  updatePage: async (slug, pageData) => {
    return apiRequest(`/pages/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(pageData),
    });
  },
};

// Audit Logs API
export const auditAPI = {
  getAuditLogs: async (limit = 100, offset = 0) => {
    return apiRequest(`/audit?limit=${limit}&offset=${offset}`);
  },

  createAuditLog: async (action, details) => {
    return apiRequest('/audit', {
      method: 'POST',
      body: JSON.stringify({ action, details }),
    });
  },
};

