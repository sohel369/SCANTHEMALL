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

export const stripeAPI = {
  // Get Stripe publishable key
  getConfig: async () => {
    return apiRequest('/stripe/config');
  },

  // Create Stripe customer
  createCustomer: async (email, name, company) => {
    return apiRequest('/stripe/customer', {
      method: 'POST',
      body: JSON.stringify({ email, name, company }),
    });
  },

  // Create payment intent
  createPaymentIntent: async (amount, bookingId, description) => {
    return apiRequest('/stripe/payment-intent', {
      method: 'POST',
      body: JSON.stringify({ 
        amount, 
        currency: 'usd',
        bookingId,
        description 
      }),
    });
  },

  // Create setup intent (for saving payment method)
  createSetupIntent: async () => {
    return apiRequest('/stripe/setup-intent', {
      method: 'POST',
    });
  },

  // Get payment methods
  getPaymentMethods: async () => {
    return apiRequest('/stripe/payment-methods');
  },

  // Attach payment method
  attachPaymentMethod: async (paymentMethodId) => {
    return apiRequest('/stripe/payment-methods/attach', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId }),
    });
  },

  // Detach payment method
  detachPaymentMethod: async (paymentMethodId) => {
    return apiRequest(`/stripe/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
    });
  },

  // Get payment history
  getPaymentHistory: async () => {
    return apiRequest('/stripe/payment-history');
  },
};
