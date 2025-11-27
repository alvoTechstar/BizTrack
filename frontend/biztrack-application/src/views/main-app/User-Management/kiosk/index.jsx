import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { Users, Plus } from 'lucide-react';
import { useTheme } from "../../../../components/theme/ThemeContext";

// Import the components
import StaffControls from "./StaffControls";
import StaffTable from "./StaffTable";
import StaffFormDialog from "./StaffFordmDialog";
import StaffViewDialog from "./StaffViewDialog";
import NotificationSnackbar from "./NotificationSnackbar";
import ContentLoader from "../../../../components/Loader/ContentLoader";
import { useActionModal } from "../../../../hooks/useActionModal";
import ActionModal from "../../../../components/modal/ActionModal";

// Example mock staff data
const initialStaff = [
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
    email: "john@example.com",
    phone: "(555) 123-4567",
    dateJoined: "2023-02-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Shopkeeper",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    dateJoined: "2023-03-20",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Alice Johnson",
    role: "Admin",
    email: "alice@example.com",
    phone: "(555) 111-2222",
    dateJoined: "2024-01-10",
    status: "Active",
  },
  {
    id: 4,
    name: "Bob Williams",
    role: "Shopkeeper",
    email: "bob@example.com",
    phone: "(555) 333-4444",
    dateJoined: "2024-03-01",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Brown",
    role: "Shopkeeper",
    email: "charlie@example.com",
    phone: "(555) 555-6666",
    dateJoined: "2023-11-20",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Diana Prince",
    role: "Admin",
    email: "diana@example.com",
    phone: "(555) 777-8888",
    dateJoined: "2025-01-05",
    status: "Active",
  },
];

const KioskStaffManagement = () => {
  const theme = useTheme();
  const primaryColor = theme?.primaryColor || '#2563eb';

  // Data states
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    startDate: null,
    endDate: null
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // View state
  const [currentView, setCurrentView] = useState('table');
  const [currentStaff, setCurrentStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Modal loading states
  const [actionModalLoading, setActionModalLoading] = useState(false);
  const [actionLoadingText, setActionLoadingText] = useState('');
  const [formModalLoading, setFormModalLoading] = useState(false);
  const [formLoadingText, setFormLoadingText] = useState('');
  const [loadingState, setLoadingState] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [loadedText, setLoadedText] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createLoadingText, setCreateLoadingText] = useState("");

  // Reusable action modal hook
  const { modalState, openModal, closeModal, setReason, handleSubmit } = useActionModal();

  // Simulate initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setLoadingState(true);
      setLoadingText("Loading staff data...");

      await new Promise(resolve => setTimeout(resolve, 2000));

      setStaff(initialStaff);
      setLoadingState(true);
      setLoadedText("Staff data loaded successfully");

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    loadInitialData();
  }, []);

  // Helper Functions
  const getInitials = useCallback((name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  // Filtered staff list - ensures it's always an array
  const filteredStaff = useMemo(() => {
    if (!Array.isArray(staff)) return [];

    return staff.filter((member) => {
      if (!member) return false;

      const matchesSearch =
        (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status ||
        (filters.status === 'ACTIVE' && member.status === 'Active') ||
        (filters.status === 'INACTIVE' && member.status === 'Inactive');

      const matchesRole = !filters.role || member.role === filters.role;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [staff, searchTerm, filters]);

  // Selection handlers
  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === filteredStaff.length && filteredStaff.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredStaff.map(s => s.id));
    }
  }, [filteredStaff, selectedItems]);

  const toggleSelectItem = useCallback((id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  // Snackbar functions
  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Modal Handlers
  const openActionModalWithLoader = async (actionType, staffMember) => {
    setActionModalLoading(true);

    switch (actionType) {
      case 'disable':
        setActionLoadingText('Preparing to disable staff...');
        break;
      case 'enable':
        setActionLoadingText('Preparing to enable staff...');
        break;
      case 'delete':
        setActionLoadingText('Preparing to delete staff...');
        break;
      default:
        setActionLoadingText('Loading...');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const staffName = staffMember?.name || 'Staff Member';

    switch (actionType) {
      case 'disable':
        openModal(
          'disable',
          staffMember.id,
          staffName,
          'staff',
          (id, reason) => handleToggleStatus(id, 'inactive', reason),
          `You are about to disable "${staffName}". By disabling, this staff member will no longer have access.`
        );
        break;
      case 'enable':
        openModal(
          'enable',
          staffMember.id,
          staffName,
          'staff',
          (id, reason) => handleToggleStatus(id, 'active', reason),
          `You are about to enable "${staffName}". This will restore their access.`
        );
        break;
      case 'delete':
        openModal(
          'delete',
          staffMember.id,
          staffName,
          'staff',
          (id, reason) => handleDeleteStaff(id, reason),
          `You are about to delete "${staffName}". This will permanently remove the staff member account.`
        );
        break;
      default:
        console.warn('Unknown action type:', actionType);
    }

    setActionModalLoading(false);
  };

  const openFormModalWithLoader = async (modalType, staffMember = null) => {
    setFormModalLoading(true);

    switch (modalType) {
      case 'create':
        setFormLoadingText('Loading create form...');
        break;
      case 'edit':
        setFormLoadingText('Loading edit form...');
        break;
      case 'view':
        setFormLoadingText('Loading staff details...');
        break;
      default:
        setFormLoadingText('Loading...');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    setCurrentStaff(staffMember);
    setIsEditing(modalType === 'edit');
    setCurrentView(modalType);
    setFormModalLoading(false);
  };

  const closeAllModals = () => {
    setCurrentView('table');
    setCurrentStaff(null);
    setErrorMessage(null);
    closeModal();
  };

  // Modal openers
  const openCreateModal = () => openFormModalWithLoader('create');
  const openEditModal = (staffMember) => openFormModalWithLoader('edit', staffMember);
  const openViewModal = (staffMember) => openFormModalWithLoader('view', staffMember);
  const openEnableModal = (staffMember) => openActionModalWithLoader('enable', staffMember);
  const openDisableModal = (staffMember) => openActionModalWithLoader('disable', staffMember);
  const openDeleteModal = (staffMember) => openActionModalWithLoader('delete', staffMember);

  // Form Submission
  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    setCreateLoading(true);
    setCreateLoadingText(isEditing ? "Updating staff..." : "Creating staff...");
    setErrorMessage(null);

    try {
      if (isEditing && currentStaff) {
        setStaff((prevStaff) =>
          prevStaff.map((member) =>
            member.id === currentStaff.id
              ? {
                ...member,
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone.trim(),
                role: values.role,
                status: values.status,
              }
              : member
          )
        );
        showSnackbar("Staff member updated successfully", "success");
      } else {
        const newStaff = {
          id: staff.length > 0 ? Math.max(...staff.map((s) => s.id)) + 1 : 1,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          role: values.role,
          status: values.status,
          dateJoined: new Date().toISOString().split("T")[0],
        };
        setStaff((prevStaff) => [newStaff, ...prevStaff]);
        showSnackbar("New staff member added successfully", "success");
      }

      setCreateLoadingText(isEditing ? "Staff updated successfully!" : "Staff created successfully!");
      await new Promise(resolve => setTimeout(resolve, 1500));

      closeAllModals();

    } catch (error) {
      console.error('Error submitting staff form:', error);
      setErrorMessage('Failed to save staff member. Please try again.');
      setCreateLoading(false);
    } finally {
      setSubmitting(false);
      setCreateLoading(false);
    }
  };

  // Action Handlers
  const handleDeleteStaff = async (staffId, reason) => {
    setSubmitting(true);
    try {
      setStaff((prevStaff) => prevStaff.filter((member) => member.id !== staffId));
      showSnackbar("Staff member deleted", "warning");
      closeModal();
    } catch (error) {
      console.error('Error deleting staff:', error);
      setErrorMessage('Failed to delete staff member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (staffId, newStatus, reason) => {
    setSubmitting(true);
    try {
      setStaff((prevStaff) =>
        prevStaff.map((member) =>
          member.id === staffId
            ? {
              ...member,
              status: newStatus === 'active' ? 'Active' : 'Inactive',
            }
            : member
        )
      );
      showSnackbar("Staff status updated successfully", "success");
      closeModal();
    } catch (error) {
      console.error('Error toggling staff status:', error);
      setErrorMessage('Failed to update staff status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnableStaff = async (staffId) => {
    setSubmitting(true);
    try {
      await handleToggleStatus(staffId, 'active', 'Enabled via staff view');
      closeAllModals();
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectStaff = () => {
    closeAllModals();
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
                color={primaryColor}
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
                color={primaryColor}
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
                color={primaryColor}
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
                color={primaryColor}
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
          <StaffFormDialog
            show={true}
            onClose={closeAllModals}
            onSave={handleFormSubmit}
            staff={currentStaff}
            isEditing={isEditing}
            submitting={submitting}
          />
        );

      case 'view':
        return (
          <StaffViewDialog
            show={true}
            onClose={closeAllModals}
            staff={currentStaff}
            onEnable={() => handleEnableStaff(currentStaff?.id)}
            onReject={handleRejectStaff}
            submitting={submitting}
          />
        );

      case 'table':
      default:
        return (
          <>
            {staff.length === 0 && filteredStaff.length === 0 && !searchTerm ? (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <Users size={64} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops! No Staff Members</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first staff member</p>
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Plus size={20} />
                  Add Staff
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <span className="text-2xl font-bold text-gray-900">Staff Management</span>
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-800">{errorMessage}</p>
                    </div>
                  )}
                  <StaffControls
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    openModal={openCreateModal}
                  />

                  <StaffTable
                    filteredStaff={Array.isArray(filteredStaff) ? filteredStaff : []}
                    selectedItems={Array.isArray(selectedItems) ? selectedItems : []}
                    setSelectedItems={setSelectedItems}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelectItem={toggleSelectItem}
                    openModalForEdit={openEditModal}
                    openEnableView={openViewModal}
                    openEnableModal={openEnableModal}
                    openDisableModal={openDisableModal}
                    openDeleteModal={openDeleteModal}
                    getInitials={getInitials}
                    formatDate={formatDate}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                    submitting={submitting}
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

        <NotificationSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
        />
      </div>
    </div>
  );
};

export default KioskStaffManagement;