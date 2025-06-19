
 // src/App.jsx
import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import * as api from './api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          localStorage.setItem('token', token);
          window.history.replaceState({}, '', window.location.pathname);
        }

        if (localStorage.getItem('token')) {
          const userRes = await api.getCurrentUser();
          setUser(userRes.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    api.loginWithGitHub();
  };

  const handleLogout = async () => {
    await api.logoutUser();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pipeline Manager</h1>
            <p className="text-gray-600">Manage your job pipelines efficiently</p>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    );
  }

// WITH this debug version:
return (
  <div className="h-screen bg-gray-50 p-8">
    <h1 className="text-2xl font-bold">
      {isAuthenticated ? "Dashboard" : "Not Authenticated"}
    </h1>
    <pre className="mt-4 p-4 bg-gray-100 rounded">
      {JSON.stringify({ isAuthenticated, user }, null, 2)}
    </pre>
    
    {/* Optional: Add a logout button for testing */}
    <button 
      onClick={handleLogout}
      className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  </div>
);
}

export default App;