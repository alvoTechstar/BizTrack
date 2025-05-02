import React from 'react';
import { Pagination, Stack } from '@mui/material';

export default function TablePagination({ currentPage, totalPages, onPageChange }) {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
        color="primary"
        size="small"
        shape="rounded"
      />
    </Stack>
  );
}
