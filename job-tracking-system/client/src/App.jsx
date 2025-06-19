
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { 
  User, Plus, Settings, LogOut, Briefcase, Users, GitBranch, FileText, 
  Upload, MessageSquare, Calendar, ChevronRight, Search, Filter, Bell 
} from 'lucide-react';
import { 
  fetchPipelines, 
  fetchJobs, 
  fetchCustomers,
  getCurrentUser,
  loginWithGitHub,
  logoutUser,
  createJob,
  createCustomer,
  createPipeline
} from './api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [pipelines, setPipelines] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Authentication and data loading
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Handle GitHub callback
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          localStorage.setItem('token', token);
          window.location.href = '/'; // Clean the URL
        }
        
        // Verify existing token
        if (localStorage.getItem('token')) {
          const userRes = await getCurrentUser();
          setUser(userRes.data);
          setIsAuthenticated(true);
          
          // Load initial data
          const [pipelinesRes, jobsRes, customersRes] = await Promise.all([
            fetchPipelines(),
            fetchJobs(),
            fetchCustomers()
          ]);
          
          setPipelines(pipelinesRes.data);
          setJobs(jobsRes.data);
          setCustomers(customersRes.data);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        localStorage.removeItem('token');
      }
    };
    
    checkAuth();
  }, []);

  const handleGitHubLogin = () => {
    loginWithGitHub();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setPipelines([]);
      setJobs([]);
      setCustomers([]);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Create new items
  const handleCreateJob = async () => {
    try {
      const newJob = {
        title: "New Job",
        customer: "New Customer",
        pipeline: pipelines[0]?.name || "General",
        currentStep: "Initial Contact",
        status: "active",
        dueDate: new Date().toISOString().split('T')[0],
        progress: 0
      };
      const res = await createJob(newJob);
      setJobs([...jobs, res.data]);
    } catch (err) {
      console.error('Failed to create job:', err);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      const newCustomer = {
        name: "New Customer",
        email: "new@customer.com",
        phone: "+0000000000",
        activeJobs: 0,
        totalJobs: 0
      };
      const res = await createCustomer(newCustomer);
      setCustomers([...customers, res.data]);
    } catch (err) {
      console.error('Failed to create customer:', err);
    }
  };

  const handleCreatePipeline = async () => {
    try {
      const newPipeline = {
        name: "New Pipeline",
        description: "Description of the new pipeline",
        steps: ["Step 1", "Step 2", "Step 3"],
        jobCount: 0
      };
      const res = await createPipeline(newPipeline);
      setPipelines([...pipelines, res.data]);
    } catch (err) {
      console.error('Failed to create pipeline:', err);
    }
  };

  // Navigation Item Component
  const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600', 
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600'
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  // Job Item Component
  const JobItem = ({ job }) => (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">{job.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {job.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{job.customer} • {job.pipeline}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {job.currentStep}
            </span>
            <span className="text-xs text-gray-500">Due: {job.dueDate}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{width: `${job.progress}%`}}
                ></div>
              </div>
              <span className="text-xs text-gray-600">{job.progress}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <Upload className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Customer Item Component
  const CustomerItem = ({ customer }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{customer.email}</p>
          <p className="text-sm text-gray-600">{customer.phone}</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <Settings className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Active Jobs</span>
          <span className="font-medium text-gray-900">{customer.activeJobs}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Jobs</span>
          <span className="font-medium text-gray-900">{customer.totalJobs}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );

  // Pipeline Item Component
  const PipelineItem = ({ pipeline }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{pipeline.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{pipeline.description}</p>
          <p className="text-xs text-gray-500 mt-2">{pipeline.jobCount} active jobs</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Pipeline Steps:</p>
        <div className="flex flex-wrap gap-2">
          {pipeline.steps.map((step, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
              {step}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
          Edit Pipeline
        </button>
        <button className="flex-1 text-gray-600 hover:text-gray-700 text-sm font-medium">
          View Jobs
        </button>
      </div>
    </div>
  );

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pipeline Manager</h1>
            <p className="text-gray-600">Manage your job pipelines efficiently</p>
          </div>

          <button
            onClick={handleGitHubLogin}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            Continue with GitHub
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Secure authentication powered by GitHub
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar Component
  const Sidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Pipeline Manager</h1>
            <p className="text-sm text-gray-500">Job Tracking System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <NavItem icon={GitBranch} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <NavItem icon={Briefcase} label="Jobs" active={currentView === 'jobs'} onClick={() => setCurrentView('jobs')} />
          <NavItem icon={Users} label="Customers" active={currentView === 'customers'} onClick={() => setCurrentView('customers')} />
          <NavItem icon={FileText} label="Pipelines" active={currentView === 'pipelines'} onClick={() => setCurrentView('pipelines')} />
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <img src={user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">@{user?.githubUsername}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  // Dashboard View
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCreateJob}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Active Jobs" value={jobs.filter(j => j.status === 'active').length} icon={Briefcase} color="blue" />
        <StatCard title="Total Customers" value={customers.length} icon={Users} color="green" />
        <StatCard title="Pipelines" value={pipelines.length} icon={GitBranch} color="purple" />
        <StatCard title="Due This Week" value={jobs.filter(j => {
          const dueDate = new Date(j.dueDate);
          const today = new Date();
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          return dueDate >= today && dueDate <= nextWeek;
        }).length} icon={Calendar} color="orange" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {jobs.slice(0, 5).map(job => (
            <JobItem key={job._id || job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );

  // Jobs View
  const JobsView = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredJobs = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
            <p className="text-gray-600">Manage all your active jobs</p>
          </div>
          <button 
            onClick={handleCreateJob}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Job
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredJobs.map(job => (
              <JobItem key={job._id || job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Customers View
  const CustomersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <button 
          onClick={handleCreateCustomer}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <CustomerItem key={customer._id || customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );

  // Pipelines View
  const PipelinesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipelines</h1>
          <p className="text-gray-600">Manage your workflow pipelines</p>
        </div>
        <button 
          onClick={handleCreatePipeline}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Pipeline
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pipelines.map(pipeline => (
          <PipelineItem key={pipeline._id || pipeline.id} pipeline={pipeline} />
        ))}
      </div>
    </div>
  );

  // Main App Render
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'jobs' && <JobsView />}
          {currentView === 'customers' && <CustomersView />}
          {currentView === 'pipelines' && <PipelinesView />}
        </div>
      </main>
    </div>
  );
};

export default App;