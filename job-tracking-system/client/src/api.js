import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5500/api', // Your backend URL
  withCredentials: true // For cookies if using them
});

// Request interceptor to add auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle errors
API.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized errors (token expired)
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login
  }
  return Promise.reject(error);
});

// Auth API calls
export const loginWithGitHub = () => {
  window.location.href = `${API.defaults.baseURL}/auth/github`;
};

export const getCurrentUser = () => API.get('/auth/me');
export const logoutUser = () => API.post('/auth/logout');

// Pipeline API calls
export const fetchPipelines = () => API.get('/pipelines');
export const createPipeline = (newPipeline) => API.post('/pipelines', newPipeline);
export const updatePipeline = (id, updatedPipeline) => API.put(`/pipelines/${id}`, updatedPipeline);
export const deletePipeline = (id) => API.delete(`/pipelines/${id}`);

// Job API calls
export const fetchJobs = () => API.get('/jobs');
export const createJob = (newJob) => API.post('/jobs', newJob);
export const updateJob = (id, updatedJob) => API.put(`/jobs/${id}`, updatedJob);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Customer API calls
export const fetchCustomers = () => API.get('/customers');
export const createCustomer = (newCustomer) => API.post('/customers', newCustomer);
export const updateCustomer = (id, updatedCustomer) => API.put(`/customers/${id}`, updatedCustomer);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);