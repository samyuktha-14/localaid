import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// User APIs
export const userAPI = {
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getLeaderboard: (neighborhood, limit = 10) => 
    api.get(`/users/leaderboard/${neighborhood}?limit=${limit}`),
  getRatings: (userId) => api.get(`/users/ratings/${userId}`),
};

// Post APIs
export const postAPI = {
  create: (data) => api.post('/posts', data),
  getByNeighborhood: (neighborhood, params = {}) => 
    api.get(`/posts/neighborhood/${neighborhood}`, { params }),
  getNearby: (lng, lat, maxDistance = 5000) => 
    api.get('/posts/nearby', { params: { lng, lat, maxDistance } }),
  getById: (postId) => api.get(`/posts/${postId}`),
  respond: (postId, message) => api.post(`/posts/${postId}/respond`, { message }),
  assign: (postId, helperId) => api.post(`/posts/${postId}/assign/${helperId}`),
  complete: (postId) => api.post(`/posts/${postId}/complete`),
  rate: (postId, rating, comment) => api.post(`/posts/${postId}/rate`, { rating, comment }),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
};

// Emergency APIs
export const emergencyAPI = {
  createAlert: (data) => api.post('/emergency/alert', data),
  getByNeighborhood: (neighborhood) => api.get(`/emergency/neighborhood/${neighborhood}`),
  getNearby: (lng, lat, maxDistance = 3000) => 
    api.get('/emergency/nearby', { params: { lng, lat, maxDistance } }),
  respond: (emergencyId) => api.post(`/emergency/${emergencyId}/respond`),
  resolve: (emergencyId) => api.post(`/emergency/${emergencyId}/resolve`),
  getById: (emergencyId) => api.get(`/emergency/${emergencyId}`),
};

// Chat APIs
export const chatAPI = {
  getChat: (postId) => api.get(`/chat/post/${postId}`),
  sendMessage: (postId, content) => api.post(`/chat/post/${postId}/message`, { content }),
  markAsRead: (postId) => api.post(`/chat/post/${postId}/read`),
};

export default api;
