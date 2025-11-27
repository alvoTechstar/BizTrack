// src/components/business/BusinessTable.jsx
import React from 'react';
import { Building2 } from 'lucide-react';
import { useTheme } from '../../../../../components/theme/ThemeContext';
import DataTable from '../../../../../components/datatable';

const BUSINESS_TABLE_HEADERS = [
  { title: '', key: 'all' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Business ID', key: 'businessId' },
  { title: 'Registration Number', key: 'registrationNumber' },
  { title: 'Business Name', key: 'name' },
  { title: 'Address', key: 'address' },
  { title: 'Phone Number', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Status', key: 'status' },
  { title: 'Action', key: 'action' },
];

const BusinessTable = ({
  filteredBusinesses,
  selectedItems,
  setSelectedItems,
  toggleSelectAll,
  toggleSelectItem,
  openModalForEdit, // ✅ Opens CreateBusinessForm in edit mode
  openEnableView, // ✅ Opens CreateBusinessForm in view mode
  openEnableModal, // ✅ Opens ActionModal with enable configuration
  openDisableModal, // ✅ Opens ActionModal with disable configuration
  openDeleteModal, // ✅ Opens ActionModal with delete configuration
}) => {
  const theme = useTheme();

  // No Results State
  if (filteredBusinesses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-4">
        <Building2 size={48} className="text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No businesses found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  const getActionsForStatus = (status) => {
    const upperStatus = status?.toUpperCase();

    if (upperStatus === 'ACTIVE') {
      return ['View', 'Edit', 'Disable', 'Delete'];
    } else if (upperStatus === 'INACTIVE') {
      return ['View', 'Edit', 'Enable', 'Delete'];
    } else if (upperStatus === 'PENDING' || upperStatus === 'NEW') {
      return ['View', 'Edit', 'Enable', 'Delete'];
    }
    return ['View', 'Edit', 'Delete'];
  };

  const handleActionSelected = (action, id) => {
    const business = filteredBusinesses.find(b => b.id === id);
    if (!business) {
      console.error('Business not found with id:', id);
      return;
    }

    console.log('Action selected:', action, 'for business:', business.name);

    switch (action.toLowerCase()) {
      case 'view':
        console.log('Opening CreateBusinessForm in view mode for business:', business);
        openEnableView(business); // ✅ Opens CreateBusinessForm in read-only view mode
        break;
      case 'edit':
        console.log('Opening CreateBusinessForm in edit mode for business:', business);
        openModalForEdit(business); // ✅ Opens CreateBusinessForm in edit mode
        break;
      case 'enable':
        console.log('Opening enable action modal for business:', business);
        openEnableModal(business); // ✅ Opens ActionModal with enable configuration
        break;
      case 'disable':
        console.log('Opening disable action modal for business:', business);
        openDisableModal(business); // ✅ Opens ActionModal with disable configuration
        break;
      case 'delete':
        console.log('Opening delete action modal for business:', business);
        openDeleteModal(business); // ✅ Opens ActionModal with delete configuration
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const handleRowClick = (column) => {
    console.log('Row clicked:', column);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <DataTable
        data={filteredBusinesses}
        headers={BUSINESS_TABLE_HEADERS}
        type="business-table"
        selected={selectedItems}
        selectedAction={setSelectedItems}
        selectAll={toggleSelectAll}
        all={selectedItems.length === filteredBusinesses.length && filteredBusinesses.length > 0}
        actionSelected={handleActionSelected}
        selectedRow={handleRowClick}
        actions={getActionsForStatus}
        clickable={true}
        color={theme.primaryColor}
      />
    </div>
  );
};

export default BusinessTable;