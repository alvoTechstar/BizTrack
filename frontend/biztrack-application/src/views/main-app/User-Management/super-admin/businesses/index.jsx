import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Plus } from 'lucide-react';
import { useTheme } from '../../../../../components/theme/ThemeContext';
import BusinessControls from "./BusinessControls";
import BusinessTable from './BusinessTable';
import CreateBusinessForm from './CreateBusinessForm';
import { useActionModal } from '../../../../../hooks/useActionModal';
import ContentLoader from "../../../../../components/Loader/ContentLoader";
import { GET, POST, PUT, DELETE } from "../../../../../services/DatabaseServiceImp";
import URLS from '../../../../../utilities/Endpoints';
import "../../../../../App.css";
import ActionModal from '../../../../../components/modal/ActionModal';

const businessTypes = ['Hotel', 'Kiosk', 'Hospital'];

// Update initialFormData with correct keys
const initialFormData = {
    businessName: '',
    registrationNumber: '',
    address: '',
    businessType: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    primaryColor: '#1976d2',
    status: 'NEW',
    logoFile: null,
    logoUrl: null,
    id: null,
    owner: '',
};

// Helper Functions
const getStatusColor = (status) => {
    switch (status) {
        case 'NEW': return 'text-orange-600';
        case 'ACTIVE': return 'text-green-600';
        case 'INACTIVE': return 'text-red-600';
        default: return 'text-gray-600';
    }
};

// Safe date handling function
const safeDateToString = (dateValue) => {
    if (!dateValue) return 'Never';
    
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
            return 'Never';
        }
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.warn('Invalid date value:', dateValue, error);
        return 'Never';
    }
};

// --- Main Component ---

const BusinessesPage = () => {
    const theme = useTheme();

    // Data states
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        startDate: null,
        endDate: null
    });

    // Modal states
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    // Loading states
    const [modalLoading, setModalLoading] = useState(false);
    const [modalLoadingText, setModalLoadingText] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [createLoadingText, setCreateLoadingText] = useState("");

    // Content Loader states
    const [loadingState, setLoadingState] = useState(true);
    const [loadingText, setLoadingText] = useState("");
    const [loadedText, setLoadedText] = useState("");

    // Reusable action modal hook
    const { modalState, openModal, closeModal, setReason, handleSubmit } = useActionModal();

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

    // --- API Handlers ---

    const fetchBusinesses = useCallback(async () => {
        setLoading(true);
        setLoadingState(true);
        setLoadingText("Fetching businesses...");
        setErrorMessage(null);

        try {
            console.log('📋 Fetching businesses from:', URLS.BUSINESS.GET_ALL_BUSINESSES);
            const result = await GET(URLS.BUSINESS.GET_ALL_BUSINESSES);

            // Handle response format using the helper function
            let businessData = extractDataFromResponse(result);

            console.log('✅ Raw business API response:', result);
            console.log('📦 Extracted business data:', businessData);

            // Transform businesses for display
            const fetchedBusinesses = businessData.map(business => {
                // Handle different response structures
                const businessObj = business._doc || business;
                
                return {
                    id: businessObj.id || businessObj._id?.toString(),
                    businessId: businessObj.businessID || businessObj.businessId || '',
                    name: businessObj.businessName || businessObj.name || '',
                    registrationNumber: businessObj.registrationNumber || '',
                    address: businessObj.address || '',
                    type: businessObj.businessType || businessObj.type || '',
                    email: businessObj.email || '',
                    phone: businessObj.phone || '',
                    website: businessObj.website || '',
                    primaryColor: businessObj.primaryColor || '#1976d2',
                    description: businessObj.description || '',
                    status: (businessObj.status || 'NEW').toUpperCase(),
                    createdAt: safeDateToString(businessObj.createdAt),
                    logoUrl: businessObj.logoUrl || businessObj.logo || null,
                    owner: businessObj.owner || '',
                };
            });

            console.log('✅ Transformed businesses:', fetchedBusinesses);
            setBusinesses(fetchedBusinesses);

            setLoadingState(true);
            setLoadedText("Businesses loaded successfully");
            setTimeout(() => {
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.error('❌ Error fetching businesses:', error);
            setErrorMessage('Failed to load businesses. Please try again.');
            setBusinesses([]);

            setLoadingState(false);
            setLoadedText("Failed to load businesses");
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, []);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    // --- Modal Handlers with Loading ---

    const openModalWithLoader = async (modalType, business = null) => {
        setModalLoading(true);

        switch (modalType) {
            case 'create':
                setModalLoadingText("Loading create form...");
                break;
            case 'edit':
                setModalLoadingText("Loading edit form...");
                break;
            case 'view':
                setModalLoadingText("Loading business details...");
                break;
            default:
                setModalLoadingText("Loading...");
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (business) {
            const businessData = {
                id: business.id || null,
                businessName: business.name || '',
                registrationNumber: business.registrationNumber || '',
                address: business.address || '',
                businessType: business.type || '',
                email: business.email || '',
                phone: business.phone || '',
                website: business.website || '',
                description: business.description || '',
                primaryColor: business.primaryColor || '#1976d2',
                status: business.status || 'NEW',
                logoFile: null,
                logoUrl: business.logoUrl || null,
                owner: business.owner || '',
            };
            setSelectedBusiness(businessData);
        } else {
            setSelectedBusiness(null);
        }

        setModalLoading(false);

        // Set form mode and open modal
        setFormMode(modalType);
        setShowCreateForm(true);
    };

    const openActionModalWithLoader = async (actionType, business) => {
        setModalLoading(true);

        switch (actionType) {
            case 'enable':
                setModalLoadingText("Preparing to enable business...");
                break;
            case 'disable':
                setModalLoadingText("Preparing to disable business...");
                break;
            case 'delete':
                setModalLoadingText("Preparing to delete business...");
                break;
            default:
                setModalLoadingText("Loading...");
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        const businessName = business.name || 'this business';

        switch (actionType) {
            case 'enable':
                openModal(
                    'enable',
                    business.id,
                    businessName,
                    'business',
                    (id, reason) => handleToggleStatus(id, 'active', reason),
                    `You are about to enable "${businessName}". By enabling, all the users for that business will regain access to the BizTrack application.`
                );
                break;
            case 'disable':
                openModal(
                    'disable',
                    business.id,
                    businessName,
                    'business',
                    (id, reason) => handleToggleStatus(id, 'inactive', reason),
                    `You are about to disable "${businessName}". By disabling, all the users for that business will no longer have access to the BizTrack application.`
                );
                break;
            case 'delete':
                openModal(
                    'delete',
                    business.id,
                    businessName,
                    'business',
                    (id, reason) => handleDeleteBusiness(id, reason),
                    `You are about to delete "${businessName}". By deleting, all the users for that business will no longer have access to the BizTrack application and all data will be permanently removed.`
                );
                break;
            default:
                console.warn('Unknown action type:', actionType);
        }

        setModalLoading(false);
    };

    // Modal openers
    const openCreateModal = () => openModalWithLoader('create');
    const openEditModal = (business) => openModalWithLoader('edit', business);
    const openEnableView = (business) => openModalWithLoader('view', business);
    const openEnableModal = (business) => openActionModalWithLoader('enable', business);
    const openDisableModal = (business) => openActionModalWithLoader('disable', business);
    const openDeleteModal = (business) => openActionModalWithLoader('delete', business);

    const closeAllModals = () => {
        setShowCreateForm(false);
        setSelectedBusiness(null);
        setErrorMessage(null);
        closeModal();
    };

    // --- Form Submission with Content Loader ---

    const handleFormSubmit = async (values) => {
        setSubmitting(true);
        setCreateLoading(true);
        setCreateLoadingText(formMode === 'edit' ? "Updating business..." : "Creating business...");
        setErrorMessage(null);

        try {
            console.log('📤 Submitting business data:', values);

            // Create FormData object
            const formData = new FormData();

            // Append all form fields to FormData
            Object.keys(values).forEach(key => {
                if (key !== 'logoFile' && key !== 'logoUrl' && key !== 'id') {
                    let value = values[key];

                    // Convert status to lowercase for backend validation
                    if (key === 'status') {
                        value = value.toLowerCase();
                        if (value === 'new') {
                            value = 'active';
                        }
                    }

                    if (value !== null && value !== undefined) {
                        formData.append(key, value);
                    }
                }
            });

            // Append logo file if exists
            if (values.logoFile instanceof File) {
                formData.append('logo', values.logoFile);
                console.log('📎 Logo file appended:', values.logoFile.name);
            }

            let response;

            if (formMode === 'edit' && values.id) {
                console.log(`🔄 Updating business with ID: ${values.id}`);
                response = await PUT(URLS.BUSINESS.UPDATE_BUSINESS.replace(':id', values.id), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('✅ Update response:', response);
            } else {
                console.log('➕ Creating new business');
                response = await POST(URLS.BUSINESS.CREATE_BUSINESS, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('✅ Create response:', response);
            }

            // Show success state briefly before refreshing
            setCreateLoadingText(formMode === 'edit' ? "Business updated successfully!" : "Business created successfully!");
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Refresh data
            await fetchBusinesses();
            closeAllModals();

        } catch (error) {
            console.error('❌ Error submitting business form:', error);
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

    // --- Action Handlers ---

    const handleDeleteBusiness = async (businessId, reason) => {
        try {
            console.log('🗑️ Deleting business with ID:', businessId);
            const response = await DELETE(URLS.BUSINESS.DELETE_BUSINESS.replace(':id', businessId), { reason });
            console.log('✅ Delete response:', response);
        } catch (error) {
            console.error('Error deleting business:', error);
            throw error;
        }
    };

    const handleToggleStatus = async (businessId, newStatus, reason) => {
        try {
            console.log('🔄 Toggling business status:', businessId, 'New status:', newStatus);
            const response = await PUT(URLS.BUSINESS.TOGGLE_BUSINESS_STATUS.replace(':id', businessId), { 
                status: newStatus,
                reason: reason 
            });
            console.log('✅ Toggle status response:', response);
        } catch (error) {
            console.error('Error toggling status:', error);
            throw error;
        }
    };

    // --- Selection Handlers ---

    const toggleSelectAll = (filteredList) => {
        if (selectedItems.length === filteredList.length && filteredList.length > 0) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredList.map(b => b.id));
        }
    };

    const toggleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // --- Filtering ---

    const filteredBusinesses = businesses.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filters.status || b.status === filters.status;
        const matchesType = !filters.type || b.type === filters.type;
        return matchesSearch && matchesStatus && matchesType;
    });

    // --- Render Logic ---

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

    // Show loading state for initial page load
    if (loading) {
        return (
            <div className="min-h-screen bg-white p-8">
                <div className="max-w-7xl mx-auto">
                    <div className='main-app-view'>
                        <div className="main-app-content-container">
                            <ContentLoader
                                state={loadingState}
                                loading={loading}
                                loadingText={loadingText}
                                loadedText={loadedText}
                                color="#1976d2"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading state for modal loading
    if (modalLoading) {
        return (
            <div className="min-h-screen bg-white p-8">
                <div className="max-w-7xl mx-auto">
                    <div className='main-app-view'>
                        <div className="main-app-content-container">
                            <ContentLoader
                                state={true}
                                loading={true}
                                loadingText={modalLoadingText}
                                loadedText=""
                                color={theme.primaryColor}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-3">
            <div className="max-w-7xl mx-auto">
                {/* Action Modal for enable/disable/delete */}
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

                {/* Create/Edit Business Form Modal */}
                {showCreateForm && (
                    <CreateBusinessForm
                        showModal={showCreateForm}
                        setShowModal={closeAllModals}
                        initialFormData={selectedBusiness || initialFormData}
                        handleSubmit={handleFormSubmit}
                        businessTypes={businessTypes}
                        isEditing={formMode === 'edit'}
                        currentLogoUrl={selectedBusiness?.logoUrl || null}
                        submitting={submitting}
                        readOnly={formMode === 'view'}
                    />
                )}

                {/* Main Table View */}
                {!showCreateForm && !modalState.isOpen && !modalLoading && !createLoading && (
                    <>
                        {businesses.length === 0 && filteredBusinesses.length === 0 && !searchTerm ? (
                            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-300">
                                <Building2 size={64} className="text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops! No Businesses</h3>
                                <p className="text-gray-500 mb-6">Get started by adding your first business</p>
                                <button
                                    onClick={openCreateModal}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    <Plus size={20} />
                                    Add Business
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <span className="text-m font-bold text-gray-900">Businesses</span>
                                    {errorMessage && (
                                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                            <p className="text-red-800">{errorMessage}</p>
                                        </div>
                                    )}
                                    <BusinessControls
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        filters={filters}
                                        setFilters={setFilters}
                                        businessTypes={businessTypes}
                                        selectedItems={selectedItems}
                                        setSelectedItems={setSelectedItems}
                                        openModal={openCreateModal}
                                    />

                                    <BusinessTable
                                        filteredBusinesses={filteredBusinesses}
                                        selectedItems={selectedItems}
                                        setSelectedItems={setSelectedItems}
                                        toggleSelectAll={() => toggleSelectAll(filteredBusinesses)}
                                        toggleSelectItem={toggleSelectItem}
                                        openModalForEdit={openEditModal}
                                        openEnableView={openEnableView}
                                        openEnableModal={openEnableModal}
                                        openDisableModal={openDisableModal}
                                        openDeleteModal={openDeleteModal}
                                        getStatusColor={getStatusColor}
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
                )}
            </div>
        </div>
    );
};

export default BusinessesPage;