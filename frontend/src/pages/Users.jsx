import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ContentCard from "../components/ui/ContentCard";
import PageHeader from "../components/ui/PageHeader";
import StatsCard from "../components/ui/StatsCard";
import { useAuth } from "../contexts/AuthContext";

// Users Management Component - Updated with Stats and Filtering
export default function Users() {
  const { getAuthHeaders } = useAuth();
  const [users, setUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [guides, setGuides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'admins', 'regular', 'guides', 'drivers'
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    contact: '',
    email: '',
    nic: '',
    role: 'GUIDE'
  });

  // API Configuration
  const API_BASE = 'http://localhost:8080';
  const USERS_API = `${API_BASE}/api/admin/users`;
  const NEW_USERS_API = `${API_BASE}/api/newusers`;

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [allUsersRes, adminUsersRes, regularUsersRes, guidesRes, driversRes] = await Promise.all([
        fetch(USERS_API, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        fetch(`${USERS_API}/admins`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        fetch(`${USERS_API}/regular-users`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        fetch(`${NEW_USERS_API}/guides`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        fetch(`${NEW_USERS_API}/drivers`, {
          method: 'GET',
          headers: getAuthHeaders(),
        })
      ]);

      if (allUsersRes.ok && adminUsersRes.ok && regularUsersRes.ok) {
        const [allUsers, adminUsers, regularUsers] = await Promise.all([
          allUsersRes.json(),
          adminUsersRes.json(),
          regularUsersRes.json()
        ]);

        setUsers(allUsers);
        setAdminUsers(adminUsers);
        setRegularUsers(regularUsers);
      } else {
        throw new Error('Failed to fetch users');
      }

      // Fetch guides and drivers
      if (guidesRes.ok) {
        const guidesData = await guidesRes.json();
        setGuides(guidesData);
      }
      
      if (driversRes.ok) {
        const driversData = await driversRes.json();
        setDrivers(driversData);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Add new user (guide or driver)
  const addNewUser = async () => {
    if (!newUserData.name || !newUserData.contact || !newUserData.email || !newUserData.nic) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      // Check if email already exists
      const checkEmailRes = await fetch(`${NEW_USERS_API}/checkEmail/${newUserData.email}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (checkEmailRes.ok) {
        const emailExists = await checkEmailRes.json();
        if (emailExists) {
          toast.error('Email already exists');
          return;
        }
      }

      // Add new user
      const response = await fetch(`${NEW_USERS_API}/addNewUser`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      });

      if (response.ok) {
        toast.success(`${newUserData.role === 'GUIDE' ? 'Guide' : 'Driver'} added successfully`);
        setShowAddUserModal(false);
        setNewUserData({
          name: '',
          contact: '',
          email: '',
          nic: '',
          role: 'GUIDE'
        });
        fetchUsers(); // Refresh the data
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('Failed to add user');
    }
  };

  // Delete guide or driver
  const deleteNewUser = async (userId, userType) => {
    if (!window.confirm(`Are you sure you want to delete this ${userType.toLowerCase()}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${NEW_USERS_API}/delete/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success(`${userType} deleted successfully`);
        fetchUsers(); // Refresh the data
      } else {
        throw new Error(`Failed to delete ${userType.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Failed to delete ${userType.toLowerCase()}:`, error);
      toast.error(`Failed to delete ${userType.toLowerCase()}`);
    }
  };

  // Toggle guide or driver status
  const toggleNewUserStatus = async (userId, userType, currentStatus) => {
    try {
      const response = await fetch(`${NEW_USERS_API}/toggleStatus/${userId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`${userType} status updated successfully`);
        fetchUsers(); // Refresh the data
      } else {
        throw new Error(`Failed to update ${userType.toLowerCase()} status`);
      }
    } catch (error) {
      console.error(`Failed to toggle ${userType.toLowerCase()} status:`, error);
      toast.error(`Failed to update ${userType.toLowerCase()} status`);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId) => {
    try {
      const response = await fetch(`${USERS_API}/${userId}/toggle-status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success('User status updated successfully');
        fetchUsers(); // Refresh the data
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${USERS_API}/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        fetchUsers(); // Refresh the data
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Show user details modal
  const showUserInfo = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get current users based on active tab
  const getCurrentUsers = () => {
    switch (activeTab) {
      case 'admins':
        return adminUsers;
      case 'regular':
        return regularUsers;
      case 'guides':
        return guides;
      case 'drivers':
        return drivers;
      case 'all':
      default:
        // Combine all user types for "All Users" view
        return [...users, ...guides, ...drivers];
    }
  };

  // Get user display name
  const getUserDisplayName = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else {
      return 'Unknown User';
    }
  };

  // Get user initials
  const getUserInitials = (user) => {
    const name = getUserDisplayName(user);
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get role display name
  const getRoleDisplayName = (user) => {
    if (user.roles?.includes('ROLE_ADMIN')) {
      return 'Administrator';
    } else if (user.roles?.includes('ROLE_USER')) {
      return 'Customer';
    } else {
      return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="p-6 space-y-8">
        {/* Header */}
        <PageHeader
          title="Users Management"
          subtitle="Manage users, guides, and administrators"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v0z" />
            </svg>
          )}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
          <div onClick={() => setActiveTab('all')} className="cursor-pointer">
            <StatsCard
              title="Total Users"
              value={users.length + guides.length + drivers.length}
              color="blue"
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            />
          </div>
          <div onClick={() => setActiveTab('all')} className="cursor-pointer">
            <StatsCard
              title="Active Users"
              value={
                users.filter(user => user.enabled).length + 
                guides.filter(guide => guide.enabled !== false).length + 
                drivers.filter(driver => driver.enabled !== false).length
              }
              color="green"
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            />
          </div>
          <div onClick={() => setActiveTab('admins')} className="cursor-pointer">
            <StatsCard
              title="Administrators"
              value={adminUsers.length}
              color="purple"
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
            />
          </div>
          <div onClick={() => setActiveTab('regular')} className="cursor-pointer">
            <StatsCard
              title="Regular Users"
              value={regularUsers.length}
              color="yellow"
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
            />
          </div>
          <div onClick={() => setActiveTab('guides')} className="cursor-pointer">
            <StatsCard
              title="Guides"
              value={guides.length}
              color="green"
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            />
          </div>
          <div onClick={() => setActiveTab('drivers')} className="cursor-pointer">
            <StatsCard
              title="Drivers"
              value={drivers.length}
              color="red"
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            />
          </div>
        </div>

        {/* Users Table */}
        <ContentCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'admins'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Administrators
              </button>
              <button
                onClick={() => setActiveTab('regular')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'regular'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Regular Users
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'guides'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Guides
              </button>
              <button
                onClick={() => setActiveTab('drivers')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'drivers'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Drivers
              </button>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 font-medium text-white transition-all duration-300 rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                + Add Guide/Driver
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentUsers().map((user) => {
                    // Determine if this is a guide/driver or system user
                    const isGuideOrDriver = user.role === 'GUIDE' || user.role === 'DRIVER';
                    
                    return (
                    <tr key={user.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <span className="text-sm font-medium text-blue-600">
                              {isGuideOrDriver || activeTab === 'guides' || activeTab === 'drivers' 
                                ? user.name?.charAt(0)?.toUpperCase() || 'U'
                                : getUserInitials(user)
                              }
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {isGuideOrDriver || activeTab === 'guides' || activeTab === 'drivers' 
                                ? user.name || 'Unknown User'
                                : getUserDisplayName(user)
                              }
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                              {isGuideOrDriver || activeTab === 'guides' || activeTab === 'drivers' ? (
                                <span className="ml-2">NIC: {user.nic || 'N/A'}</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          isGuideOrDriver || activeTab === 'guides' || activeTab === 'drivers'
                            ? user.role === 'GUIDE' 
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-orange-100 text-orange-800'
                            : user.roles?.includes('ROLE_ADMIN') 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isGuideOrDriver || activeTab === 'guides' || activeTab === 'drivers' 
                            ? user.role || 'Unknown'
                            : getRoleDisplayName(user)
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isGuideOrDriver || activeTab === 'guides' || activeTab === 'drivers' ? (
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            (user.enabled !== false) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {(user.enabled !== false) ? 'Active' : 'Inactive'}
                          </span>
                        ) : (
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.enabled ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {isGuideOrDriver || activeTab === 'guides' || activeTab === 'drivers' 
                          ? user.contact || 'No contact'
                          : user.phone || 'No phone'
                        }
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => showUserInfo(user)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 transition-all duration-300 rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 hover:shadow-md"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          {isGuideOrDriver || activeTab === 'guides' || activeTab === 'drivers' ? (
                            <>
                              <button 
                                onClick={() => toggleNewUserStatus(user.id, user.role, user.enabled !== false)}
                                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                                  (user.enabled !== false)
                                    ? 'text-red-600 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200'
                                    : 'text-green-600 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {(user.enabled !== false) ? 'Disable' : 'Enable'}
                              </button>
                              <button 
                                onClick={() => deleteNewUser(user.id, user.role)}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-300 rounded-lg shadow-sm bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 hover:shadow-md"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => toggleUserStatus(user.id)}
                                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                                  user.enabled
                                    ? 'text-red-600 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200'
                                    : 'text-green-600 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {user.enabled ? 'Disable' : 'Enable'}
                              </button>
                              <button 
                                onClick={() => deleteUser(user.id)}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-300 rounded-lg shadow-sm bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 hover:shadow-md"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
              
              {getCurrentUsers().length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  No users found in this category.
                </div>
              )}
            </div>
          )}
        </ContentCard>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* User Avatar and Name */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <span className="text-xl font-bold text-blue-600">
                      {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : getUserInitials(selectedUser)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedUser.name || getUserDisplayName(selectedUser)}
                    </h4>
                    <p className="text-sm text-gray-500">User ID: {selectedUser.id}</p>
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-3">
                  <div className="pt-4 border-t">
                    <h5 className="mb-2 text-sm font-medium text-gray-500">Contact Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-900">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-sm text-gray-900">{selectedUser.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h5 className="mb-2 text-sm font-medium text-gray-500">Account Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedUser.roles?.includes('ROLE_ADMIN') 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {getRoleDisplayName(selectedUser)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedUser.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.enabled ? 'Active Account' : 'Inactive Account'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedUser.firstName && (
                    <div className="pt-4 border-t">
                      <h5 className="mb-2 text-sm font-medium text-gray-500">Personal Information</h5>
                      <div className="space-y-2">
                        {selectedUser.firstName && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm text-gray-900">
                              First Name: {selectedUser.firstName}
                            </span>
                          </div>
                        )}
                        {selectedUser.lastName && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm text-gray-900">
                              Last Name: {selectedUser.lastName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => toggleUserStatus(selectedUser.id)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedUser.enabled
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedUser.enabled ? 'Disable User' : 'Enable User'}
                  </button>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="flex-1 px-4 py-2 font-medium text-gray-800 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Guide/Driver</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Contact Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newUserData.contact}
                    onChange={(e) => setNewUserData({...newUserData, contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact number"
                  />
                </div>

                {/* NIC Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    NIC Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUserData.nic}
                    onChange={(e) => setNewUserData({...newUserData, nic: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter NIC number"
                  />
                </div>

                {/* Role Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="GUIDE">Guide</option>
                    <option value="DRIVER">Driver</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 px-4 py-2 font-medium text-gray-800 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNewUser}
                    className="flex-1 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Add {newUserData.role === 'GUIDE' ? 'Guide' : 'Driver'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
  
}
