import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Lock, User, Mail, Phone, Shield, 
  Search, Filter, X, Check, AlertTriangle 
} from 'lucide-react';

const UserManagement = () => {
  // State for user data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // State for filters
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  
  // State for form
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'waiter',
    password: '',
    confirmPassword: ''
  });
  
  // State for current selected user (for actions)
  const [currentUser, setCurrentUser] = useState(null);
  
  // Available roles
  const roles = [
    { value: 'waiter', label: 'Waiter' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'chef', label: 'Chef' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'manager', label: 'Manager' }
  ];

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        username: 'jsmith',
        fullName: 'John Smith',
        role: 'waiter',
        email: 'jsmith@hotelexample.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        createdAt: '2025-02-15T08:30:00Z'
      },
      {
        id: 2,
        username: 'mgarcia',
        fullName: 'Maria Garcia',
        role: 'cashier',
        email: 'mgarcia@hotelexample.com',
        phone: '+1 (555) 234-5678',
        status: 'active',
        createdAt: '2025-01-20T14:15:00Z'
      },
      {
        id: 3,
        username: 'alee',
        fullName: 'Alex Lee',
        role: 'chef',
        email: 'alee@hotelexample.com',
        phone: '+1 (555) 345-6789',
        status: 'inactive',
        createdAt: '2024-11-10T10:45:00Z'
      },
      {
        id: 4,
        username: 'jdoe',
        fullName: 'Jane Doe',
        role: 'receptionist',
        email: 'jdoe@hotelexample.com',
        phone: '+1 (555) 456-7890',
        status: 'active',
        createdAt: '2024-12-05T09:00:00Z'
      },
      {
        id: 5,
        username: 'rwilson',
        fullName: 'Robert Wilson',
        role: 'manager',
        email: 'rwilson@hotelexample.com',
        phone: '+1 (555) 567-8901',
        status: 'active',
        createdAt: '2024-10-18T11:20:00Z'
      }
    ];
    
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...users];
    
    // Filter by role
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(term) ||
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(result);
  }, [users, roleFilter, statusFilter, searchTerm]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      username: formData.username,
      fullName: formData.fullName,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    // Add to users list
    setUsers([...users, newUser]);
    
    // Reset form and close modal
    setFormData({
      username: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'waiter',
      password: '',
      confirmPassword: ''
    });
    
    setIsModalOpen(false);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle user actions
  const handleResetPassword = () => {
    // In a real app, this would call an API endpoint
    console.log(`Reset password for user: ${currentUser.username}`);
    alert(`Password reset link has been sent to ${currentUser.email}`);
    setIsResetPasswordModalOpen(false);
  };

  const handleChangeRole = (newRole) => {
    // Update user role
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, role: newRole };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setIsChangeRoleModalOpen(false);
  };

  const handleToggleStatus = (userId) => {
    // Toggle user status
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { 
          ...user, 
          status: user.status === 'active' ? 'inactive' : 'active' 
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
  };

  const handleDeleteUser = () => {
    // Remove user
    const updatedUsers = users.filter(user => user.id !== currentUser.id);
    setUsers(updatedUsers);
    setIsDeleteModalOpen(false);
  };

  // Get role label from value
  const getRoleLabel = (roleValue) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  return (
    <div className="p-6 max-w-full mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">User Accounts</h1>
      
      {/* Filters and Search */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> 
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <button
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>
      
      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Username</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Full Name</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Role</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Email</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Status</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Created At</th>
              <th className="py-3 px-4 text-center text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.fullName}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button 
                      className="p-1 text-blue-600 hover:text-blue-800" 
                      title="Reset Password"
                      onClick={() => {
                        setCurrentUser(user);
                        setIsResetPasswordModalOpen(true);
                      }}
                    >
                      <Lock size={18} />
                    </button>
                    <button 
                      className="p-1 text-purple-600 hover:text-purple-800" 
                      title="Change Role"
                      onClick={() => {
                        setCurrentUser(user);
                        setFormData({ ...formData, role: user.role });
                        setIsChangeRoleModalOpen(true);
                      }}
                    >
                      <Shield size={18} />
                    </button>
                    <button 
                      className="p-1 text-gray-600 hover:text-gray-800" 
                      title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.status === 'active' ? (
                        <X size={18} className="text-red-600" />
                      ) : (
                        <Check size={18} className="text-green-600" />
                      )}
                    </button>
                    <button 
                      className="p-1 text-red-600 hover:text-red-800" 
                      title="Delete User"
                      onClick={() => {
                        setCurrentUser(user);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No users found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New User</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      required
                      className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Role</label>
                  <div className="relative">
                    <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="role"
                      required
                      className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reset Password</h2>
              <button 
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-4">
              Are you sure you want to reset the password for <strong>{currentUser.fullName}</strong>?
              A password reset link will be sent to their email address.
            </p>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setIsResetPasswordModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Change Role Modal */}
      {isChangeRoleModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Change Role</h2>
              <button 
                onClick={() => setIsChangeRoleModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-4">
              Change role for <strong>{currentUser.fullName}</strong>:
            </p>
            
            <div className="relative">
              <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.role}
                onChange={handleInputChange}
                name="role"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setIsChangeRoleModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleChangeRole(formData.role)}
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete User Modal */}
      {isDeleteModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Delete User</h2>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertTriangle size={24} className="text-red-500" />
              <p className="text-red-600">
                This action cannot be undone.
              </p>
            </div>
            
            <p className="mb-4">
              Are you sure you want to permanently delete user <strong>{currentUser.fullName}</strong>?
            </p>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleDeleteUser}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;