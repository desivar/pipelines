// src/api.js
const API_BASE = 'http://localhost:5500/api'; // Adjust to your backend URL

export const fetchPipelines = async () => {
  const response = await fetch(`${API_BASE}/pipelines`);
  return response.json();
};

export const fetchJobs = async () => {
  const response = await fetch(`${API_BASE}/jobs`);
  return response.json();
};

export const fetchCustomers = async () => {
  const response = await fetch(`${API_BASE}/customers`);
  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

export const loginWithGitHub = () => {
  window.location.href = `${API_BASE}/auth/github`;
};

export const logoutUser = async () => {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// Add other CRUD operations as needed