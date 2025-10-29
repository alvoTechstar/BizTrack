// BusinessesPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Search, Edit, Power, Trash2, X } from 'lucide-react';
import BusinessHeader from './BusinessHeader';
import BusinessListControls from './BusinessControls';
import BusinessTable from '../BusinessTable';
import ContentLoader from '../../../../../components/Loader/ContentLoader';
import CreateBusinessForm from './CreateBusinessForm';
// Import API helper functions and URLs
import { GET, POST, PUT, DELETE } from "../../../../../services/DatabaseServiceImp";
import URLS from '../../../../../utilities/Endpoints';

// --- Data and Constants ---

const businessTypes = ['Hotel', 'Kiosk', 'Hospital', 'Retail', 'Other'];

// Update initialFormData with correct keys: 'phone', 'owner', AND 'description'
const initialFormData = {
    businessName: '',
    registrationNumber: '',
    address: '',
    businessType: '',
    email: '',
    phone: '', 
    website: '',
    description: '', // <-- Added 'description' (optional in schema)
    primaryColor: '#1976d2',
    status: 'NEW',
    logoFile: null, 
    logoUrl: null, 
    id: null, 
    owner: '', 
};

// ... Helper Functions (getStatusColor) ...
const getStatusColor = (status) => {
    switch (status) {
        case 'NEW': return 'text-orange-600';
        case 'ACTIVE': return 'text-green-600';
        case 'INACTIVE': return 'text-red-600';
        default: return 'text-gray-600';
    }
};

// --- Main Component ---

const BusinessesPage = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: '', type: '' });
    const [formData, setFormData] = useState(initialFormData);
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // --- API Handlers ---

    const fetchBusinesses = useCallback(async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await GET(URLS.BUSINESS.GET_ALL_BUSINESSES);

            const fetchedBusinesses = response.data.map(b => ({
                id: b.id,
                name: b.businessName, 
                registrationNumber: b.registrationNumber,
                address: b.address,
                type: b.businessType, 
                email: b.email,
                phone: b.phone, 
                website: b.website,
                primaryColor: b.primaryColor,
                description: b.description || '', // Map description
                status: b.status.toUpperCase(),
                createdAt: new Date(b.createdAt).toISOString().split('T')[0],
                logoUrl: b.logoUrl,
                owner: b.owner || '', 
            }));

            setBusinesses(fetchedBusinesses);
        } catch (error) {
            console.error('Error fetching businesses:', error);
            setErrorMessage('Failed to load businesses.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    // --- CRUD Modal/Form Handlers ---

    const openModalForNew = () => {
        setFormData(initialFormData);
        setIsEditing(false);
        setErrorMessage(null);
        setShowModal(true);
    };

    const openModalForEdit = (business) => {
        setFormData({
            id: business.id,
            businessName: business.name,
            registrationNumber: business.registrationNumber,
            address: business.address,
            businessType: business.type,
            email: business.email,
            phone: business.phone, 
            website: business.website || '',
            description: business.description || '', // Use mapped description
            primaryColor: business.primaryColor,
            status: business.status,
            logoFile: null,
            logoUrl: business.logoUrl,
            owner: business.owner || '', 
        });
        setIsEditing(true);
        setErrorMessage(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData(initialFormData);
        setErrorMessage(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage(null);

        // Prepare data for API - using FormData for file upload
        const payload = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'logoFile' && key !== 'logoUrl' && key !== 'id') {
                // Use || '' to ensure optional fields like description are sent as empty string if null
                payload.append(key, formData[key] || ''); 
            }
        });

        if (formData.logoFile) {
            // 'logo' must match the key expected by your server's file upload middleware (e.g., Multer)
            payload.append('logo', formData.logoFile);
        }

        try {
            if (isEditing) {
                const url = URLS.BUSINESS.UPDATE_BUSINESS.replace(':id', formData.id);
                await PUT(url, payload);
            } else {
                await POST(URLS.BUSINESS.CREATE_BUSINESS, payload);
            }

            await fetchBusinesses();
            closeModal();

        } catch (error) {
            console.error(isEditing ? 'Error updating business:' : 'Error creating business:', error);
            const serverError = error.message || (error.data && error.data.error) || 'A server error occurred. Check backend logs.';
            setErrorMessage(`Failed: ${serverError}`);
        } finally {
            setSubmitting(false);
        }
    };

    // --- Other CRUD Handlers (unchanged) ---
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this business? This will archive the business and all associated users.')) {
            try {
                const url = URLS.BUSINESS.DELETE_BUSINESS.replace(':id', id);
                await DELETE(url);
                await fetchBusinesses();
            } catch (error) {
                console.error('Error deleting business:', error);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        const business = businesses.find(b => b.id === id);
        if (!business) return;

        const newStatus = business.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        try {
            const url = URLS.BUSINESS.TOGGLE_BUSINESS_STATUS.replace(':id', id);
            await PUT(url, { status: newStatus.toLowerCase() });
            await fetchBusinesses();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

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

    // filteredBusinesses MUST be defined before the return statement
    const filteredBusinesses = businesses.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filters.status || b.status === filters.status;
        const matchesType = !filters.type || b.type === filters.type;
        return matchesSearch && matchesStatus && matchesType;
    });

    // --- Render Logic (Fixed) ---

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <BusinessHeader
                    filteredCount={filteredBusinesses.length}
                    openModal={openModalForNew}
                />
                
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{errorMessage}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setErrorMessage(null)}>
                            <X size={18} />
                        </span>
                    </div>
                )}

                {loading ? (
                    <ContentLoader />
                ) : (
                    // Render Empty State only if there are NO businesses AND no active search/filters
                    businesses.length === 0 && filteredBusinesses.length === 0 && !searchTerm ? (
                        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <Building2 size={64} className="text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops! No Business</h3>
                            <p className="text-gray-500 mb-6">Get started by adding your first business</p>
                            <button
                                onClick={openModalForNew}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                <Plus size={20} />
                                Add Business
                            </button>
                        </div>
                    ) : (
                        // Render Controls and Table if there is data OR an active search/filter
                        <>
                            {/* <BusinessListControls ... /> (uncomment when ready) */}
                            
                            <BusinessTable
                                filteredBusinesses={filteredBusinesses}
                                selectedItems={selectedItems}
                                toggleSelectAll={() => toggleSelectAll(filteredBusinesses)}
                                toggleSelectItem={toggleSelectItem}
                                openModalForEdit={openModalForEdit}
                                handleToggleStatus={handleToggleStatus}
                                handleDelete={handleDelete}
                                getStatusColor={getStatusColor}
                                EditIcon={Edit}
                                PowerIcon={Power}
                                TrashIcon={Trash2}
                            />
                        </>
                    )
                )}

                {/* Modal is conditionally rendered */}
                <CreateBusinessForm
                    showModal={showModal}
                    setShowModal={closeModal}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    businessTypes={businessTypes}
                    isEditing={isEditing}
                    currentLogoUrl={formData.logoUrl}
                    submitting={submitting}
                />
            </div>
        </div>
    );
};

export default BusinessesPage;