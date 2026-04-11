export const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? 'http://127.0.0.1:4000/api' 
    : window.location.origin + '/api';

export const NodeAPI = {
    async register(data) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Registration failed');
        }
        return response.json();
    },

    async login(email, password, role = 'user') {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Login failed');
        }
        return response.json();
    },

    async subscribe(email) {
        const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Subscription failed');
        }
        return response.json();
    },

    async uploadImage(formData) {
        const token = this.getToken();
        if (!token) throw new Error('You must be logged in to upload images');

        const response = await fetch(`${API_BASE_URL}/uploads`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Upload failed');
        }
        return response.json();
    },

    getToken() {
        // Check for standardized key first, then fallback to common 'token' key
        const token = localStorage.getItem('GTSA_SESSION_TOKEN') || localStorage.getItem('token');
        if (!token) console.log("NodeAPI: No token found in localStorage.");
        return token;
    },

    setToken(token) {
        localStorage.setItem('GTSA_SESSION_TOKEN', token);
        localStorage.setItem('token', token); // Also set generic 'token' for Admin/Advertiser panels
    },

    removeToken() {
        localStorage.removeItem('GTSA_SESSION_TOKEN');
        localStorage.removeItem('GTSA_SESSION_USER');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getUser() {
        try {
            const user = localStorage.getItem('GTSA_SESSION_USER') || localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error("NodeAPI: Error parsing user from localStorage", e);
            return null;
        }
    },

    setUser(user) {
        localStorage.setItem('GTSA_SESSION_USER', JSON.stringify(user));
        localStorage.setItem('user', JSON.stringify(user)); // Also set generic 'user' for Admin/Advertiser panels
    },

    isAuthenticated() {
        const token = this.getToken();
        console.log("NodeAPI: Checking isAuthenticated. Token found:", !!token);
        return !!token;
    }
};

// Ensure it's available globally for non-module scripts
window.NodeAPI = NodeAPI;
