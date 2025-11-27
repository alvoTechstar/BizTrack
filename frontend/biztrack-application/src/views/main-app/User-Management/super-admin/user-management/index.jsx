// src/components/users/UsersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus } from 'lucide-react';
import UsersTable from './UsersTable';
import CreateUserForm from './CreateUserForm';
import EnableUserView from './EnableUserView';
import { useTheme } from '../../../../../components/theme/ThemeContext';
import ContentLoader from '../../../../../components/Loader/ContentLoader';
import UsersControls from './UserControls';
import { useActionModal } from '../../../../../hooks/useActionModal';
import ActionModal from '../../../../../components/modal/ActionModal';
import { GET, POST, PUT, DELETE } from "../../../../../services/DatabaseServiceImp";
import URLS from '../../../../../utilities/Endpoints';
import { formatDate, getInitials } from '../../../../../utilities/SharedFunctions'; 
const UsersPage = () => {
  const theme = useTheme();

  // Data states
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: null,
    role: null,
    business: null
  });

  // View state
  const [currentView, setCurrentView] = useState('table');

  // Action modal loading states
  const [actionModalLoading, setActionModalLoading] = useState(false);
  const [actionLoadingText, setActionLoadingText] = useState('');

  // Form modal loading states
  const [formModalLoading, setFormModalLoading] = useState(false);
  const [formLoadingText, setFormLoadingText] = useState('');

  // Content Loader states
  const [loadingState, setLoadingState] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [loadedText, setLoadedText] = useState("");

  // Create operation loading state
  const [createLoading, setCreateLoading] = useState(false);
  const [createLoadingText, setCreateLoadingText] = useState("");

  // Reusable action modal hook
  const { modalState, openModal, closeModal, setReason, handleSubmit } = useActionModal();

  // Role-based access control mapping
  const rolesByType = {
    'Hotel': ['Hotel Admin', 'Hotel Cashier', 'Hotel Waiter'],
    'Kiosk': ['Kiosk Admin', 'Kiosk Shopkeeper'],
    'Hospital': ['Hospital Admin', 'Doctor', 'Nurse', 'Lab Technician', 'Receptionist', 'Pharmacist'],
    'Retail': ['Retail Admin', 'Cashier', 'Sales Associate'],
    'System': ['System Admin', 'Support Staff'],
    'Other': ['Admin', 'Manager', 'Staff']
  };

  // Safe date handling function
  const safeDateToString = (dateValue) => {
    if (!dateValue) return 'Never';
    
    // Handle various invalid date representations
    if (dateValue === 'Invalid Date' || dateValue === 'null' || dateValue === 'undefined') {
      return 'Never';
    }
    
    try {
      const date = new Date(dateValue);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Never';
      }
      
      // Check if date is within reasonable range
      const year = date.getFullYear();
      if (year < 1970 || year > 2100) {
        return 'Never';
      }
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Invalid date value:', dateValue, error);
      return 'Never';
    }
  };

  // Helper function to safely extract data from API response
  const extractDataFromResponse = (response) => {
    if (!response) return [];
    
    if (response.data !== undefined) {
      return Array.isArray(response.data) ? response.data : [response.data];
    }
    
    if (Array.isArray(response)) {
      return response;
    }
    
    if (response._doc) {
      return [response._doc];
    }
    
    if (typeof response === 'object' && response !== null) {
      return [response];
    }
    
    return [];
  };

  // Helper function to extract business data from MongoDB/Mongoose structure
  const extractBusinessData = (business) => {
    if (!business) return null;

    if (business._doc) {
      return {
        id: business._doc.id || business._doc._id?.toString(),
        _id: business._doc._id?.toString(),
        businessId: business._doc.businessId,
        businessName: business._doc.businessName,
        businessType: business._doc.businessType,
        status: business._doc.status,
        owner: business._doc.owner,
        email: business._doc.email,
        phone: business._doc.phone,
        address: business._doc.address,
        registrationNumber: business._doc.registrationNumber,
        logoUrl: business._doc.logoUrl,
        primaryColor: business._doc.primaryColor,
        website: business._doc.website,
        description: business._doc.description,
      };
    }
    
    return {
      id: business.id || business._id?.toString(),
      _id: business._id?.toString(),
      businessId: business.businessId,
      businessName: business.businessName,
      businessType: business.businessType,
      status: business.status,
      owner: business.owner,
      email: business.email,
      phone: business.phone,
      address: business.address,
      registrationNumber: business.registrationNumber,
      logoUrl: business.logoUrl,
      primaryColor: business.primaryColor,
      website: business.website,
      description: business.description,
    };
  };

  // Fetch users and businesses
  const fetchUsersAndBusinesses = useCallback(async () => {
    setLoading(true);
    setLoadingState(true);
    setLoadingText("Fetching users and businesses...");
    setErrorMessage(null);

    try {
      // Fetch businesses
      const businessesResponse = await GET(URLS.BUSINESS.GET_ALL_BUSINESSES);
      console.log('🔍 Raw Businesses API Response:', businessesResponse);
      
      let businessesData = extractDataFromResponse(businessesResponse);
      console.log('📦 Extracted businesses data:', businessesData);

      // Transform businesses
      const transformedBusinesses = businessesData
        .map(business => extractBusinessData(business))
        .filter(business => business !== null && business.businessName);

      console.log('✅ Transformed businesses:', transformedBusinesses);

      // Store RAW MongoDB business objects for the form
      setBusinesses(businessesData);

      // Fetch users
      let usersData = [];
      
      try {
        const usersResponse = await GET(URLS.USERS.GET_ALL_USERS);
        console.log('📥 Users API Response:', usersResponse);
        usersData = extractDataFromResponse(usersResponse);
        console.log('✅ Successfully fetched users:', usersData.length);
      } catch (usersError) {
        console.error('❌ Failed to fetch users:', usersError);
        setErrorMessage('Unable to load users. Please check if the server is running.');
        usersData = [];
      }

      // Format users for display with safe date handling
      const formattedUsers = usersData.map(user => {
        const userBusiness = transformedBusinesses.find(business => {
          const businessId = business.id || business._id;
          const userIdBusiness = user.businessId || user.associatedBusinessId || user.institutionId;
          return businessId === userIdBusiness || 
                 businessId?.toString() === userIdBusiness?.toString();
        });

        return {
          id: user.id || user._id,
          firstName: user.firstName || user.firstname || '',
          lastName: user.lastName || user.lastname || '',
          email: user.email || '',
          institutionId: user.businessId || user.associatedBusinessId || user.institutionId || '',
          institutionName: userBusiness?.businessName || user.businessName || user.institutionName || 'No Business',
          role: user.role || user.userRole || '',
          username: user.username || '',
          phoneNumber: user.phone || user.phoneNumber || '',
          status: (user.status || 'active').toUpperCase(),
          lastLogin: safeDateToString(user.lastLogin), // Safe date handling
          businessType: userBusiness?.businessType || '',
          password: '',
          confirmPassword: ''
        };
      });

      console.log('✅ Formatted users:', formattedUsers.length);
      setUsers(formattedUsers);

      setLoadingState(true);
      setLoadedText("Data loaded successfully");
      setTimeout(() => {
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setErrorMessage('Failed to load data. Please check if the server is running.');
      setUsers([]);
      setBusinesses([]);
      setLoadingState(false);
      setLoadedText("Failed to load data");
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    fetchUsersAndBusinesses();
  }, [fetchUsersAndBusinesses]);

  // Modal Handlers
  const openActionModalWithLoader = async (actionType, user) => {
    setActionModalLoading(true);

    switch (actionType) {
      case 'disable':
        setActionLoadingText('Preparing to disable user...');
        break;
      case 'enable':
        setActionLoadingText('Preparing to enable user...');
        break;
      case 'delete':
        setActionLoadingText('Preparing to delete user...');
        break;
      default:
        setActionLoadingText('Loading...');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const userName = `${user.firstName} ${user.lastName}`;

    switch (actionType) {
      case 'disable':
        openModal(
          'disable',
          user.id,
          userName,
          'user',
          (id, reason) => handleToggleStatus(id, 'inactive', reason),
          `You are about to disable "${userName}". By disabling, this user will no longer have access to the BizTrack application.`
        );
        break;
      case 'enable':
        openModal(
          'enable',
          user.id,
          userName,
          'user',
          (id, reason) => handleToggleStatus(id, 'active', reason),
          `You are about to enable "${userName}". This will restore their access to the BizTrack application.`
        );
        break;
      case 'delete':
        openModal(
          'delete',
          user.id,
          userName,
          'user',
          (id, reason) => handleDeleteUser(id, reason),
          `You are about to delete "${userName}". This will permanently remove the user account and all associated data.`
        );
        break;
      default:
        console.warn('Unknown action type:', actionType);
    }

    setActionModalLoading(false);
  };

  const openFormModalWithLoader = async (modalType, user = null) => {
    setFormModalLoading(true);

    switch (modalType) {
      case 'create':
        setFormLoadingText('Loading create form...');
        break;
      case 'edit':
        setFormLoadingText('Loading edit form...');
        break;
      case 'enable':
        setFormLoadingText('Loading user details...');
        break;
      default:
        setFormLoadingText('Loading...');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    setEditingUser(user);
    setIsEditing(modalType === 'edit');
    setCurrentView(modalType);
    setFormModalLoading(false);
  };

  const closeAllModals = () => {
    setCurrentView('table');
    setEditingUser(null);
    setErrorMessage(null);
    closeModal();
  };

  const openCreateModal = () => openFormModalWithLoader('create');
  const openEditModal = (user) => openFormModalWithLoader('edit', user);
  const openEnableViewModal = (user) => openFormModalWithLoader('enable', user);
  const openEnableModal = (user) => openActionModalWithLoader('enable', user);
  const openDisableModal = (user) => openActionModalWithLoader('disable', user);
  const openDeleteModal = (user) => openActionModalWithLoader('delete', user);

  // Form Submission with Content Loader
  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    setCreateLoading(true);
    setCreateLoadingText(isEditing ? "Updating user..." : "Creating user...");
    setErrorMessage(null);

    try {
      console.log('📤 Submitting user data:', values);

      // Prepare user data for backend
      const userData = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        username: values.username.trim(),
        phoneNumber: values.phoneNumber.trim(),
        role: values.role,
        businessId: values.institutionId
      };

      // Include password for new users
      if (!isEditing && values.password) {
        userData.password = values.password;
      }

      console.log('📦 Prepared userData for API:', userData);

      let response;
      if (isEditing && editingUser) {
        console.log(`🔄 Updating user with ID: ${editingUser.id}`);
        response = await PUT(URLS.USERS.UPDATE_USER.replace(':id', editingUser.id), userData);
        console.log('✅ Update response:', response);
      } else {
        console.log('➕ Creating new user');
        response = await POST(URLS.USERS.CREATE_USER, userData);
        console.log('✅ Create response:', response);
      }

      // Show success state briefly before refreshing
      setCreateLoadingText(isEditing ? "User updated successfully!" : "User created successfully!");
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Refresh data
      await fetchUsersAndBusinesses();
      closeAllModals();

    } catch (error) {
      console.error('❌ Error submitting user form:', error);
      let serverError = 'A server error occurred. Please try again.';

      if (error.response?.data?.message) {
        serverError = error.response.data.message;
      } else if (error.message) {
        serverError = error.message;
      }

      setErrorMessage(`Failed: ${serverError}`);
      setCreateLoading(false);
    } finally {
      setSubmitting(false);
      setCreateLoading(false);
    }
  };

  // Action Handlers
  const handleDeleteUser = async (userId, reason) => {
    setSubmitting(true);
    try {
      const response = await DELETE(URLS.USERS.DELETE_USER.replace(':id', userId), { reason });
      console.log('Delete user response:', response);
      await fetchUsersAndBusinesses();
      closeModal();
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Failed to delete user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, newStatus, reason) => {
    setSubmitting(true);
    try {
      const response = await PUT(URLS.USERS.TOGGLE_USER_STATUS.replace(':id', userId), { 
        status: newStatus,
        reason: reason 
      });
      console.log('Toggle status response:', response);
      await fetchUsersAndBusinesses();
      closeModal();
    } catch (error) {
      console.error('Error toggling user status:', error);
      setErrorMessage('Failed to update user status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnableUser = async (userId) => {
    setSubmitting(true);
    try {
      await handleToggleStatus(userId, 'active', 'Enabled via EnableUserView');
      closeAllModals();
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectUser = () => {
    closeAllModals();
  };

  // Selection Handlers
  const toggleSelectAll = (filteredList) => {
    if (selectedItems.length === filteredList.length && filteredList.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredList.map(u => u.id));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtering
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.institutionName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || u.status === filters.status;
    const matchesRole = !filters.role || u.role === filters.role;
    const matchesBusiness = !filters.business || u.institutionName === filters.business;

    return matchesSearch && matchesStatus && matchesRole && matchesBusiness;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600';
      case 'INACTIVE': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Show content loader during create/update operations
  if (createLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className='main-app-view'>
            <div className="main-app-content-container">
              <ContentLoader
                state={true}
                loading={true}
                loadingText={createLoadingText}
                loadedText=""
                color={theme.primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show content loader during initial loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className='main-app-view'>
            <div className="main-app-content-container">
              <ContentLoader
                state={loadingState}
                loading={true}
                loadingText={loadingText}
                loadedText={loadedText}
                color={theme.primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show content loader during form modal loading
  if (formModalLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className='main-app-view'>
            <div className="main-app-content-container">
              <ContentLoader
                state={true}
                loading={true}
                loadingText={formLoadingText}
                loadedText=""
                color={theme.primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show content loader during action modal loading
  if (actionModalLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className='main-app-view'>
            <div className="main-app-content-container">
              <ContentLoader
                state={true}
                loading={true}
                loadingText={actionLoadingText}
                loadedText=""
                color={theme.primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
      case 'edit':
        return (
          <CreateUserForm
            showModal={true}
            setShowModal={closeAllModals}
            initialFormData={editingUser || {}}
            handleSubmit={handleFormSubmit}
            businesses={businesses}
            rolesByType={rolesByType}
            isEditing={isEditing}
            submitting={submitting}
          />
        );

      case 'enable':
        return (
          <EnableUserView
            user={editingUser}
            onClose={closeAllModals}
            onEnable={() => handleEnableUser(editingUser?.id)}
            onReject={handleRejectUser}
            submitting={submitting}
          />
        );

      case 'table':
      default:
        return (
          <>
            {users.length === 0 && filteredUsers.length === 0 && !searchTerm ? (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <Users size={64} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops! No Users</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first user</p>
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Plus size={20} />
                  Add User
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <span className="text-2xl font-bold text-gray-900">Users</span>
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-800">{errorMessage}</p>
                    </div>
                  )}
                  <UsersControls
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    openModal={openCreateModal}
                  />

                  <UsersTable
                    filteredUsers={filteredUsers}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    toggleSelectAll={() => toggleSelectAll(filteredUsers)}
                    toggleSelectItem={toggleSelectItem}
                    openModalForEdit={openEditModal}
                    openEnableView={openEnableViewModal}
                    openEnableModal={openEnableModal}
                    openDisableModal={openDisableModal}
                    openDeleteModal={openDeleteModal}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                    submitting={submitting}
                    formatDate={formatDate}
                    getInitials={getInitials}
                  />
                </div>
              </>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {modalState.isOpen && (
          <ActionModal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            entityName={modalState.entityName}
            actionType={modalState.actionType}
            reason={modalState.reason}
            setReason={setReason}
            onSubmit={handleSubmit}
            submitting={submitting}
            customDescription={modalState.customDescription}
          />
        )}

        {!modalState.isOpen && renderCurrentView()}
      </div>
    </div>
  );
};

export default UsersPage;