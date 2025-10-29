// src/components/business/CreateBusinessForm.jsx (UPDATED)

import React from 'react';
import { X, Building2 } from 'lucide-react';

const CreateBusinessForm = ({ 
    showModal, 
    setShowModal, 
    formData, 
    setFormData, 
    handleSubmit, 
    businessTypes, 
    isEditing,
    currentLogoUrl,
    submitting 
}) => {
    if (!showModal) return null;

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        
        if (type === 'file') {
            setFormData(prev => ({ 
                ...prev, 
                logoFile: files[0] || null
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const fileDisplayName = formData.logoFile 
        ? formData.logoFile.name 
        : (currentLogoUrl ? 'Current logo' : 'No file selected');

    const hasLogo = formData.logoFile || currentLogoUrl;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit Business' : 'Add New Business'}
                    </h3>
                    <button 
                        onClick={() => setShowModal(false)} 
                        className="text-gray-400 hover:text-gray-600 transition"
                        disabled={submitting}
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Required Fields Section */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Required Information</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="businessName"
                                    required
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., Grand Hotel Plaza"
                                    disabled={submitting}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registration Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="registrationNumber"
                                    required
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., BRN001234"
                                    disabled={isEditing || submitting}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Owner Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="owner" // <-- Synced with schema: 'owner'
                                    required
                                    value={formData.owner}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., Jane Doe"
                                    disabled={submitting}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="businessType"
                                    required
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    disabled={submitting}
                                >
                                    <option value="">Select type</option>
                                    {businessTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Full business address"
                                disabled={submitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="business@example.com"
                                    disabled={submitting}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone" // <-- Synced with schema: 'phone'
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="+1-234-567-8900"
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Optional Fields Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Optional Information</h4>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://example.com"
                                disabled={submitting}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description || ''} 
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Business description..."
                                disabled={submitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleChange}
                                        className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                                        disabled={submitting}
                                    />
                                    <input
                                        type="text"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleChange}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="#1976d2"
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    disabled={submitting}
                                >
                                    {/* The server schema uses lowercase: "active", "inactive" */}
                                    <option value="NEW">NEW</option> 
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Logo 
                                <span className="text-gray-400 font-normal ml-2 text-xs">
                                    (Default used if none selected)
                                </span>
                            </label>
                            <div className="flex items-center space-x-4 border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                                    {hasLogo ? (
                                        <Building2 size={32} className="text-blue-500" />
                                    ) : (
                                        <Building2 size={32} className="text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700 truncate">{fileDisplayName}</p>
                                    <p className="text-xs text-gray-500">
                                        {isEditing && currentLogoUrl && !formData.logoFile ? 'Current logo in use' : 'Max 2MB, JPG/PNG'}
                                    </p>
                                </div>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        name="logoFile"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleChange}
                                        className="hidden"
                                        disabled={submitting}
                                    />
                                    <span className={`inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        Choose File
                                    </span>
                                </label>
                                
                                {(formData.logoFile) && (
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData(prev => ({ ...prev, logoFile: null }))}
                                        className="text-red-500 hover:text-red-700 transition"
                                        title="Remove selected file"
                                        disabled={submitting}
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Business')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBusinessForm;