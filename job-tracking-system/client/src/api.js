const axios = require('axios');  // For CommonJS

const API = axios.create({
  baseURL: 'http://localhost:5500/api'
});


// Attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});