// src/components/DataTable/TablePagination.jsx
import React from "react";
import { Pagination as MuiPagination, Stack } from "@mui/material";
import { useTheme } from "../theme/ThemeContext";

const TablePagination = ({
  count,
  page,
  onPageChange,
  rowsPerPage = 5, // Fixed at 5 rows per page
}) => {
  const theme = useTheme();
  const PrimaryColor = theme.primaryColor;

  // Calculate total pages (always showing exactly 5 rows per page)
  const totalPages = Math.ceil(count / rowsPerPage);

  // Define colors
  const buttonBgColor = "#F0F0F0";
  const buttonHoverBgColor = "#F0F0F0";
  const selectedButtonBgColor = PrimaryColor;
  const textColor = "#333333";

  const handlePageChange = (event, newPage) => {
    // MUI Pagination uses 1-based index, but we need 0-based for API
    onPageChange(event, newPage - 1);
  };

  return (
    <Stack
      direction="row"
      justifyContent="flex-end" // Changed from 'center' to 'flex-end'
      alignItems="center"
      sx={{
        py: 2,
        mt: 1.25, // 10px margin top (MUI uses 8px units, 1.25*8=10px)
        mr: 2.5, // 20px margin right (2.5*8=20px)
      }}
    >
      <MuiPagination
        count={totalPages}
        page={page + 1} // Convert to 1-based index
        onChange={handlePageChange}
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "4px",
            color: textColor,
            backgroundColor: buttonBgColor,
            "&:hover": {
              backgroundColor: buttonHoverBgColor,
              color: textColor,
            },
            "&.Mui-disabled": {
              backgroundColor: buttonBgColor,
              opacity: 0.5,
              color: textColor,
            },
            minWidth: "32px",
            height: "32px",
            margin: "0 2px",
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: selectedButtonBgColor,
            color: textColor,
            "&:hover": {
              backgroundColor: selectedButtonBgColor,
            },
          },
        }}
      />
    </Stack>
  );
};

export default TablePagination;
