// For local dev: uses localhost:4000
// For production (Railway): uses BACKEND_URL injected via window.__BACKEND_URL__ or hardcoded Railway URL
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_BASE_URL = isLocal
    ? 'http://127.0.0.1:4000/api'
    : (window.__BACKEND_URL__ || 'https://scanthemall-production.up.railway.app') + '/api';

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

        try {
            const response = await fetch(`${API_BASE_URL}/uploads`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.status === 401 || response.status === 403) {
                console.warn("NodeAPI: Session expired or invalid. Clearing token.");
                this.removeToken();
                throw new Error('Session expired. Please log in again.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Upload failed');
            }
            return response.json();
        } catch (error) {
            console.error("NodeAPI: Upload error", error);
            throw error;
        }
    },

    getToken() {
        // Check for standardized key first, then fallback to common 'token' key
        let token = localStorage.getItem('GTSA_SESSION_TOKEN') || localStorage.getItem('token');
        if (token === 'undefined' || token === 'null') token = null;
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
    },

    async _fetch(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (response.status === 401 || response.status === 403) {
            this.removeToken();
            if (!window.location.pathname.includes('log_in')) {
                window.location.href = `log_in_page_advertising_placeholder.html?redirect=${encodeURIComponent(window.location.pathname)}`;
            }
            throw new Error('Session expired');
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Request failed');
        }
        return response.json();
    },

    async getPosition() {
        return this._fetch('/user/position');
    },

    async getLeaderboard() {
        return this._fetch('/user/leaderboard');
    },

    async getBillboard() {
        return this._fetch('/user/billboard');
    },

    async updateBillboard(grid_state, completed_lines) {
        return this._fetch('/user/billboard', {
            method: 'POST',
            body: JSON.stringify({ grid_state, completed_lines })
        });
    },

    async registerCashDraw(data) {
        return this._fetch('/draws/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async searchBillboards(params) {
        const queryParams = new URLSearchParams(params).toString();
        return this._fetch(`/billboards/search?${queryParams}`);
    }
};

// Ensure it's available globally for non-module scripts
window.NodeAPI = NodeAPI;
