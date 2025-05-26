import React from "react";
import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, CheckCircle, XCircle } from 'lucide-react';

// Sample data for demonstration
const initialUsers = [
  { id: 1, username: 'john_doe', fullName: 'John Doe', role: 'Admin', phone: '+1234567890', email: 'john@example.com', business: 'Hilton Hotel', businessType: 'Hotel', status: 'Active' },
  { id: 2, username: 'jane_smith', fullName: 'Jane Smith', role: 'Admin', phone: '+0987654321', email: 'jane@example.com', business: 'Downtown Kiosk', businessType: 'Kiosk', status: 'Active' },
  { id: 3, username: 'robert_jones', fullName: 'Robert Jones', role: 'Admin', phone: '+1122334455', email: 'robert@example.com', business: 'Central Warehouse', businessType: 'Warehouse', status: 'Disabled' },
  { id: 4, username: 'lisa_wong', fullName: 'Lisa Wong', role: 'Admin', phone: '+6677889900', email: 'lisa@example.com', business: 'Seaside Restaurant', businessType: 'Restaurant', status: 'Active' },
  { id: 5, username: 'mike_wilson', fullName: 'Mike Wilson', role: 'Admin', phone: '+5544332211', email: 'mike@example.com', business: 'Corner Shop', businessType: 'Shop', status: 'Disabled' },
];

// const businesses = [
//   { id: 1, name: 'Hilton Hotel', type: 'Hotel' },
//   { id: 2, name: 'Downtown Kiosk', type: 'Kiosk' },
//   { id: 3, name: 'Central Warehouse', type: 'Warehouse' },
//   { id: 4, name: 'Seaside Restaurant', type: 'Restaurant' },
//   { id: 5, name: 'Corner Shop', type: 'Shop' },
// ];

// Business type options
const businessTypeOptions = [
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Kiosk', label: 'Kiosk' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Shop', label: 'Shop' },
];

const roleOptions = [
  { value: 'Admin', label: 'Admin' },
];

// Reusable Input Components
const TextInput = ({ label, name, value, onChange, required = false, disabled = false, placeholder = '' }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      required={required}
    />
  </div>
);

const PasswordInput = ({ label, name, value, onChange, required = false, placeholder = '' }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="password"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      required={required}
    />
  </div>
);

const SelectInput = ({ label, name, value, onChange, options, required = false, disabled = false }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const AppFormButton = ({ onClick, color = 'blue', type = 'button', disabled = false, children }) => {
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    gray: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${colors[color]} text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

// Modal Component
const Modal = ({ isOpen, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0">
        <div className="border-b px-6 py-3">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0">
        <div className="border-b px-6 py-3">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <AppFormButton onClick={onClose} color="gray">
              Cancel
            </AppFormButton>
            <AppFormButton onClick={onConfirm} color="red">
              Confirm
            </AppFormButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Management Component
export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
//   const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // State for the Edit form for handling business related fields
  const [editForm, setEditForm] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    newPassword: '',
    business: '',
    businessType: '',
    role: 'Admin',
    status: ''
  });
  
  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    businessType: '',
    businessName: '',
    role: '',
    status: 'Active'
  });

  // Apply filters
  useEffect(() => {
    let result = [...users];
    
    if (statusFilter) {
      result = result.filter(user => user.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        user => 
          user.username.toLowerCase().includes(term) || 
          user.fullName.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(result);
  }, [users, statusFilter, searchTerm]);

  const handleAddUser = () => {
    const id = Math.max(...users.map(user => user.id), 0) + 1;
    
    // Make sure role is Admin
    const newUserData = {
      id, 
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      business: newUser.businessName,
      businessType: newUser.businessType,
      role: 'Admin', // Ensure role is always Admin
      status: 'Active'
    };
    
    setUsers([...users, newUserData]);
    
    // Reset form
    setNewUser({
      username: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      businessType: '',
      businessName: '',
      role: '',
      status: 'Active'
    });
    
    setIsAddModalOpen(false);
  };

  const handleEditUser = () => {
    // Update users with editForm data
    setUsers(
      users.map(user => 
        user.id === currentUser.id 
          ? { 
              ...user,
              username: editForm.username,
              fullName: editForm.fullName,
              email: editForm.email,
              phone: editForm.phone,
              // Only update password if a new one is provided
              ...(editForm.newPassword ? { password: editForm.newPassword } : {})
            } 
          : user
      )
    );
    
    setCurrentUser(null);
    setIsEditModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    setUsers(
      users.map(user =>
        user.id === id
          ? { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' }
          : user
      )
    );
    setIsConfirmModalOpen(false);
    setUserToToggle(null);
  };

  const openConfirmToggleModal = (user) => {
    setUserToToggle(user);
    setIsConfirmModalOpen(true);
  };

  // Handle business type change
  const handleBusinessTypeChange = (e) => {
    const businessType = e.target.value;
    
    // Set business type and automatically set role to "Admin"
    setNewUser({
      ...newUser,
      businessType: businessType,
      role: businessType ? 'Admin' : '' // Set role to Admin when business type is selected
    });
  };
  
  // Handle business name change
  const handleBusinessNameChange = (e) => {
    setNewUser({
      ...newUser,
      businessName: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      {/* Filter and Search Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <input
              type="text"
              placeholder="Search by username or full name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="w-full md:w-1/4">
            <AppFormButton 
              onClick={() => setIsAddModalOpen(true)}
              color="blue"
            >
              <div className="flex items-center gap-1">
                <Plus size={16} />
                <span>Add User</span>
              </div>
            </AppFormButton>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className={user.status === 'Disabled' ? 'opacity-60' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.business}</div>
                    <div className="text-xs text-gray-500">{user.businessType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        // Initialize edit form with current user data
                        setCurrentUser(user);
                        setEditForm({
                          username: user.username,
                          fullName: user.fullName,
                          email: user.email || '',
                          phone: user.phone || '',
                          newPassword: '',
                          business: user.business,
                          businessType: user.businessType,
                          role: user.role,
                          status: user.status
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => openConfirmToggleModal(user)}
                      className={`${
                        user.status === 'Active' 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.status === 'Active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No users found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
      >
        <div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Username"
              name="username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
            
            <TextInput
              label="Full Name"
              name="fullName"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              required
            />
            
            <TextInput
              label="Email"
              name="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            
            <TextInput
              label="Phone"
              name="phone"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
            
            <PasswordInput
              label="Password"
              name="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            
            {/* Business Type Selection */}
            <SelectInput
              label="Business Type"
              name="businessType"
              value={newUser.businessType}
              onChange={handleBusinessTypeChange}
              options={businessTypeOptions}
              required
            />
            
            {/* Business Name Input - Shows up after selecting Business Type */}
            {newUser.businessType && (
              <TextInput
                label="Business Name"
                name="businessName"
                value={newUser.businessName}
                onChange={handleBusinessNameChange}
                required
                placeholder={`Enter ${newUser.businessType} name`}
              />
            )}
            
            {/* Role field - Now automatically set to Admin when business type is selected */}
            {newUser.businessType && (
              <SelectInput
                label="Role"
                name="role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                options={roleOptions}
                required
                disabled={true} // Disable this since it's automatically set
              />
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <AppFormButton
              onClick={() => setIsAddModalOpen(false)}
              color="gray"
            >
              Cancel
            </AppFormButton>
            <AppFormButton
              onClick={handleAddUser}
              color="blue"
              disabled={!newUser.username || !newUser.fullName || !newUser.password || !newUser.businessType || !newUser.businessName}
            >
              Add User
            </AppFormButton>
          </div>
        </div>
      </Modal>
      
      {/* Confirmation Modal for Status Toggle */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => handleToggleStatus(userToToggle?.id)}
        title={`${userToToggle?.status === 'Active' ? 'Disable' : 'Enable'} User`}
        message={`Are you sure you want to ${userToToggle?.status === 'Active' ? 'disable' : 'enable'} ${userToToggle?.fullName}?`}
      />
      
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        {currentUser && (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Username"
                name="username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                required
              />
              
              <TextInput
                label="Full Name"
                name="fullName"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                required
              />
              
              <TextInput
                label="Email"
                name="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
              
              <TextInput
                label="Phone"
                name="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
              
              <TextInput
                label="Business"
                name="business"
                value={editForm.business}
                disabled={true}
              />
              
              <TextInput
                label="Business Type"
                name="businessType"
                value={editForm.businessType}
                disabled={true}
              />
              
              <SelectInput
                label="Role"
                name="role"
                value={editForm.role}
                options={roleOptions}
                required
                disabled={true} // Role is locked to Admin
              />
              
              <PasswordInput
                label="Password (leave blank to keep current)"
                name="password"
                value={editForm.newPassword}
                onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <AppFormButton
                onClick={() => setIsEditModalOpen(false)}
                color="gray"
              >
                Cancel
              </AppFormButton>
              <AppFormButton
                onClick={handleEditUser}
                color="blue"
                disabled={!editForm.username || !editForm.fullName}
              >
                Save Changes
              </AppFormButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}