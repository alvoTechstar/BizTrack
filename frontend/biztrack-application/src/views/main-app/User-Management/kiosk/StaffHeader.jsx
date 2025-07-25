import React from 'react';
import { Box } from '@mui/material'; // Keeping MUI Box for responsive layout flexibility
import AddIcon from '@mui/icons-material/Add'; // Still using MUI Icon for the button's visual

// Import your custom components
import SearchInput from '../../../../components/input/SearchInput';
import SelectInput from '../../../../components/input/SelectInput';
import AppFormButton from '../../../../components/buttons/AppFormButton';
import {useTheme} from "../../../../components/theme/ThemeContext";

const StaffHeader = ({ searchQuery, onSearchChange, roleFilter, onRoleFilterChange, onAddStaffClick }) => {

  const { primaryColor: PrimaryColor } = useTheme();
  // Options for your custom SelectInput component
  const roleOptions = [
    { value: "All", label: "All Roles" },
    { value: "Admin", label: "Admin" },
    { value: "Shopkeeper", label: "Shopkeeper" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Change to column so heading and controls are stacked
        alignItems: "flex-start", // Align items to the start (left)
        mb: 1,
        gap: 2, // Gap between the heading and the controls row
      }}
    >
      {/* Heading is now in its own Box, taking full width for left alignment */}
      <Box sx={{ width: "100%" }}>
        <h2 className="text-3xl font-bold text-gray-900">
          Kiosk Staff Management
        </h2>
      </Box>

      {/* This Box now contains the search, select, and button, aligned to the right */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          width: { xs: "100%", sm: "auto" }, // Take full width on small screens
          justifyContent: { xs: "flex-start", sm: "flex-end" }, // Align to end (right) on small/medium screens
          alignSelf: { xs: "flex-start", sm: "flex-end" } // Align this entire box to the right within the column layout
        }}
      >
        {/* Using your custom SearchInput component */}
       <div className="w-full mt-1 sm:w-64 mb-2 sm:mb-0">
         <SearchInput
          id="staff-search"
          placeholder="Search staff..."
          input={searchQuery}
          handleInput={(value) => onSearchChange({ target: { value } })}
          handleClear={(value) => onSearchChange({ target: { value } })}
        />
       </div>

    

        {/* Using your custom SelectInput component for role filtering */}
     <div className="w-full sm:w-48 mb-2 sm:mb-0">
         <SelectInput
          id="role-filter"
          value={roleFilter}
          onChange={onRoleFilterChange}
          options={roleOptions}
          fullWidth={window.innerWidth < 640}
        />
     </div>

        {/* Using your custom AppFormButton component */}
     <div className='w-full mt-1 sm:w-auto'>
         <AppFormButton
          text="Add Staff"
          color= {PrimaryColor}
          action={onAddStaffClick}
          icon={<AddIcon />}
          validation={true}
          isLoading={false}
        />
     </div>
      </Box>
    </Box>
  );
};

export default StaffHeader;