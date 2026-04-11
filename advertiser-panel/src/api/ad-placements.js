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

// Ad Placements API
export const adPlacementsAPI = {
  // Get all social media platforms with availability
  getPlatforms: async () => {
    return apiRequest('/ad-placements/platforms');
  },

  // Get ad placements for a specific platform
  getPlatformPlacements: async (platform) => {
    return apiRequest(`/ad-placements/platforms/${platform}/placements`);
  },

  // Get regional pricing information
  getRegionalPricing: async (region, country, state) => {
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    if (country) params.append('country', country);
    if (state) params.append('state', state);
    
    return apiRequest(`/ad-placements/regional-pricing?${params}`);
  },

  // Calculate pricing for an ad placement
  calculatePricing: async (placementId, region, startDate, endDate) => {
    return apiRequest('/ad-placements/calculate-pricing', {
      method: 'POST',
      body: JSON.stringify({
        placement_id: placementId,
        region,
        start_date: startDate,
        end_date: endDate
      }),
    });
  },

  // Create an ad booking
  createBooking: async (bookingData) => {
    return apiRequest('/ad-placements/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Get advertiser's bookings
  getBookings: async () => {
    return apiRequest('/ad-placements/bookings');
  },

  // Update booking status (admin only)
  updateBookingStatus: async (bookingId, status) => {
    return apiRequest(`/ad-placements/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get active ads for a platform (public endpoint)
  getActiveAds: async (platform) => {
    return apiRequest(`/ad-placements/platforms/${platform}/active-ads`);
  },
};