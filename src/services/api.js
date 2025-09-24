// API service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('vocab_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(username, password, email = '') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email })
    });
  }

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  async verifyToken(token) {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Progress endpoints
  async updateQuizProgress(phase, score) {
    return this.request('/progress/update-quiz', {
      method: 'POST',
      body: JSON.stringify({ phase, score })
    });
  }

  async getUserProgress() {
    return this.request('/progress/me');
  }

  async getLeaderboard(limit = 10, page = 1) {
    return this.request(`/progress/leaderboard?limit=${limit}&page=${page}`);
  }

  async addAchievement(achievementId, name, description, icon = '🏆') {
    return this.request('/progress/achievement', {
      method: 'POST',
      body: JSON.stringify({ achievementId, name, description, icon })
    });
  }

  // User profile endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserSettings(settings) {
    return this.request('/user/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings)
    });
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    });
  }

  async deleteAccount() {
    return this.request('/user/account', {
      method: 'DELETE'
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;