// API configuration and service for customer frontend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
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
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...userData, role: userData?.role || 'user' }),
    });
  },

  login: async (email, password, role = 'user') => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (formData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/uploads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  getUserUploads: async () => {
    return apiRequest('/uploads/user');
  },
};

// Billboard API
export const billboardAPI = {
  search: async (postalCodes) => {
    return apiRequest('/billboards/search', {
      method: 'POST',
      body: JSON.stringify({ postalCodes }),
    });
  },
};

// Draw API
export const drawAPI = {
  getDraws: async () => {
    return apiRequest('/draws');
  },

  getUserEntries: async () => {
    return apiRequest('/draws/entries');
  },

  getLeaderboard: async (drawId) => {
    return apiRequest(`/draws/${drawId}/leaderboard`);
  },

  getUserPosition: async () => {
    return apiRequest('/draws/position');
  },
};

// Ads API
export const adsAPI = {
  getAdsForPlatform: async (platform, placement) => {
    return apiRequest(`/ads/platform/${platform}?placement=${placement || ''}`);
  },
  // Get active ads for a platform using the ad placements system
  getActiveAdsForPlatform: async (platform) => {
    return apiRequest(`/ad-placements/platforms/${platform}/active-ads`);
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/user/profile');
  },

  updateProfile: async (profileData) => {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  uploadProfilePhoto: async (formData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/user/profile-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};

// Bonus API
export const bonusAPI = {
  getMilestones: async () => {
    return apiRequest('/bonus/milestones');
  },

  getAllMilestones: async () => {
    return apiRequest('/bonus/milestones/all');
  },

  checkMilestone: async () => {
    return apiRequest('/bonus/check', {
      method: 'POST',
    });
  },
};
