const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api');
// Extract the base server URL (e.g., http://localhost:4000) from the API URL
export const BASE_SERVER_URL = API_BASE_URL.replace('/api', '');

console.log('API Base URL:', API_BASE_URL);
console.log('Environment variables:', import.meta.env);

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

  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making API request to:', url);
  console.log('Headers:', headers);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    console.error('API Error:', error);
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Response data:', data);
  return data;
};

// Auth API
export const authAPI = {
  login: async (email, password, role = 'advertiser') => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Campaigns API
export const campaignsAPI = {
  getCampaigns: async () => {
    return apiRequest('/advertiser/campaigns');
  },

  createCampaign: async (campaignData) => {
    return apiRequest('/advertiser/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  },

  updateCampaign: async (id, campaignData) => {
    return apiRequest(`/advertiser/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  },

  deleteCampaign: async (id) => {
    return apiRequest(`/advertiser/campaigns/${id}`, {
      method: 'DELETE',
    });
  },
};

// Billboards API
export const billboardsAPI = {
  getBillboards: async () => {
    return apiRequest('/advertiser/billboards');
  },

  createBillboard: async (billboardData) => {
    return apiRequest('/advertiser/billboards', {
      method: 'POST',
      body: JSON.stringify(billboardData),
    });
  },

  updateBillboard: async (id, billboardData) => {
    return apiRequest(`/advertiser/billboards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(billboardData),
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: async (campaignId) => {
    return apiRequest(`/advertiser/analytics${campaignId ? `?campaignId=${campaignId}` : ''}`);
  },
};

// Billing API
export const billingAPI = {
  getInvoices: async () => {
    return apiRequest('/advertiser/invoices');
  },
};

// Account API
export const accountAPI = {
  getAccount: async () => {
    return apiRequest('/advertiser/account');
  },

  updateAccount: async (accountData) => {
    return apiRequest('/advertiser/account', {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  },
};

// Media API
export const mediaAPI = {
  uploadMedia: async (file, tag, description) => {
    const formData = new FormData();
    formData.append('file', file);
    if (tag) formData.append('tag', tag);
    if (description) formData.append('description', description);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/advertiser/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getMedia: async () => {
    return apiRequest('/advertiser/media');
  },

  deleteMedia: async (id) => {
    return apiRequest(`/advertiser/media/${id}`, {
      method: 'DELETE',
    });
  },
};

