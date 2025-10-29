import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Power, Trash2, X, Building2 } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Role-based access control mapping
  const rolesByType = {
    'Hotel': ['Hotel Admin', 'Hotel Cashier', 'Hotel Waiter'],
    'Kiosk': ['Kiosk Admin', 'Kiosk Shopkeeper'],
    'Hospital': ['Hospital Admin', 'Doctor', 'Nurse', 'Lab Technician', 'Receptionist', 'Pharmacist'],
    'Retail': ['Retail Admin', 'Cashier', 'Sales Associate'],
    'Other': ['Admin', 'Manager', 'Staff']
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    institutionId: '',
    role: '',
    username: '',
    phoneNumber: ''
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Mock businesses data (ACTIVE only)
      setBusinesses([
        { id: 1, name: 'Grand Hotel Plaza', type: 'Hotel', status: 'ACTIVE' },
        { id: 3, name: 'City Medical Center', type: 'Hospital', status: 'ACTIVE' },
        { id: 5, name: 'SuperMart Retail', type: 'Retail', status: 'ACTIVE' },
        { id: 6, name: 'Downtown Kiosk', type: 'Kiosk', status: 'ACTIVE' }
      ]);

      // Mock users data
      setUsers([
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@grandhotel.com',
          institutionId: 1,
          institutionName: 'Grand Hotel Plaza',
          role: 'Hotel Admin',
          username: 'johndoe',
          phoneNumber: '+1-234-567-8910',
          status: 'ACTIVE',
          lastLogin: '2024-09-28'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@citymedical.com',
          institutionId: 3,
          institutionName: 'City Medical Center',
          role: 'Doctor',
          username: 'janesmith',
          phoneNumber: '+1-234-567-8911',
          status: 'ACTIVE',
          lastLogin: '2024-09-30'
        },
        {
          id: 3,
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.j@citymedical.com',
          institutionId: 3,
          institutionName: 'City Medical Center',
          role: 'Nurse',
          username: 'mjohnson',
          phoneNumber: '+1-234-567-8912',
          status: 'ACTIVE',
          lastLogin: '2024-09-29'
        },
        {
          id: 4,
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.w@grandhotel.com',
          institutionId: 1,
          institutionName: 'Grand Hotel Plaza',
          role: 'Hotel Waiter',
          username: 'swilliams',
          phoneNumber: '+1-234-567-8913',
          status: 'INACTIVE',
          lastLogin: '2024-09-15'
        },
        {
          id: 5,
          firstName: 'Robert',
          lastName: 'Brown',
          email: 'robert.b@supermart.com',
          institutionId: 5,
          institutionName: 'SuperMart Retail',
          role: 'Retail Admin',
          username: 'rbrown',
          phoneNumber: '+1-234-567-8914',
          status: 'ACTIVE',
          lastLogin: '2024-09-30'
        }
      ]);
      
      setLoading(false);
    }, 1500);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'text-green-600';
      case 'INACTIVE': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const openModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      institutionId: '',
      role: '',
      username: '',
      phoneNumber: ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedBusiness = businesses.find(b => b.id === parseInt(formData.institutionId));
    
    const newUser = {
      id: users.length + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      institutionId: parseInt(formData.institutionId),
      institutionName: selectedBusiness?.name || '',
      role: formData.role,
      username: formData.username,
      phoneNumber: formData.phoneNumber,
      status: 'ACTIVE',
      lastLogin: 'Never'
    };
    
    setUsers([...users, newUser]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This will archive the user account.')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u
    ));
  };

  const handleEdit = (user) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      institutionId: user.institutionId.toString(),
      role: user.role,
      username: user.username,
      phoneNumber: user.phoneNumber
    });
    setShowModal(true);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredUsers.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.institutionName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Get available roles based on selected business
  const availableRoles = formData.institutionId 
    ? rolesByType[businesses.find(b => b.id === parseInt(formData.institutionId))?.type] || []
    : [];

  const ContentLoader = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          {filteredUsers.length > 0 && (
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} />
              Add User
            </button>
          )}
        </div>

        {loading ? (
          <ContentLoader />
        ) : users.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Users size={64} className="text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops! No Users</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first user</p>
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} />
              Add User
            </button>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, username, or business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                <span className="text-blue-700 font-medium">
                  {selectedItems.length} user{selectedItems.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    Bulk Activate
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
                    Bulk Deactivate
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                    Bulk Delete
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedItems.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedItems.includes(user.id)}
                            onChange={() => toggleSelectItem(user.id)}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{user.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{user.institutionName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEdit(user)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" 
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleToggleStatus(user.id)}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition" 
                              title={user.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                            >
                              <Power size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" 
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* No Results */}
            {filteredUsers.length === 0 && searchTerm && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-4">
                <Users size={48} className="text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No users found</h3>
                <p className="text-gray-500">Try adjusting your search</p>
              </div>
            )}
          </>
        )}

        {/* Add/Edit User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">User Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="John"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution/Business <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.institutionId}
                      onChange={(e) => {
                        setFormData({...formData, institutionId: e.target.value, role: ''});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select business</option>
                      {businesses.filter(b => b.status === 'ACTIVE').map(business => (
                        <option key={business.id} value={business.id}>
                          {business.name} ({business.type})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Only ACTIVE businesses are shown</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      disabled={!formData.institutionId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select role</option>
                      {availableRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.institutionId 
                        ? 'Roles are filtered based on selected business type' 
                        : 'Please select a business first'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="johndoe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="+1-234-567-8900"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;