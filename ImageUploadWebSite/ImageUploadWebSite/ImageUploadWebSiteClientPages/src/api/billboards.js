const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Billboard search API functions
export const billboardAPI = {
  // Get all billboards
  getAllBillboards: async () => {
    const response = await fetch(`${API_BASE_URL}/billboards/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Search by multiple postal codes (up to 4)
  searchByPostalCodes: async (postalCodes) => {
    const response = await fetch(`${API_BASE_URL}/billboards/search/postal-codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postal_codes: postalCodes }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Search by advertiser sector
  searchBySector: async (sector) => {
    const response = await fetch(`${API_BASE_URL}/billboards/search/sector/${encodeURIComponent(sector)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // General search with filters
  searchBillboards: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.postal_codes) {
      params.append('postal_codes', filters.postal_codes.join(','));
    }
    if (filters.sector) {
      params.append('sector', filters.sector);
    }
    if (filters.country) {
      params.append('country', filters.country);
    }
    if (filters.state) {
      params.append('state', filters.state);
    }
    if (filters.age_filter) {
      params.append('age_filter', filters.age_filter);
    }
    if (filters.active_only !== undefined) {
      params.append('active_only', filters.active_only);
    }

    const response = await fetch(`${API_BASE_URL}/billboards/search?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};