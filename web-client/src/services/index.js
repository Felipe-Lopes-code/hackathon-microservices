import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

export const materialService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/materials?${params}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },

  async create(materialData) {
    const response = await api.post('/materials', materialData);
    return response.data;
  },

  async update(id, materialData) {
    const response = await api.put(`/materials/${id}`, materialData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },
};

export const shareService = {
  async create(shareData) {
    const response = await api.post('/shares', shareData);
    return response.data;
  },

  async getMyShares() {
    const response = await api.get('/shares/my-orders');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/shares/${id}`);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/shares/${id}/status`, { status });
    return response.data;
  },
};
