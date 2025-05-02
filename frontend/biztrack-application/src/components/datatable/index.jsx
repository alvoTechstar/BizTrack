import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, FormControl, InputLabel, Select, MenuItem, Box, IconButton
} from '@mui/material';
import TablePill from './TablePill';
import TablePagination from './TablePagination';
import TableModal from './TableModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DataTable({ transactions }) {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const itemsPerPage = 5;

  const handleCheckboxChange = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const filteredTransactions =
    statusFilter === 'All'
      ? transactions
      : transactions.filter((item) => item.status === statusFilter);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const paginatedData = filteredTransactions.slice(startIdx, startIdx + itemsPerPage);

  const handleView = () => setModalOpen(true);
  const handleEdit = () => alert('Edit clicked');
  const handleDelete = () => alert('Delete clicked');

  return (
    <Paper sx={{ p: 2 }}>
      {/* Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={handleStatusFilter}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Product</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell >Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.includes(startIdx + idx)}
                    onChange={() => handleCheckboxChange(startIdx + idx)}
                  />
                </TableCell>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.payment}</TableCell>
                <TableCell>
                  <TablePill status={item.status} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={handleView} size="small"><VisibilityIcon fontSize="small" /></IconButton>
                  <IconButton onClick={handleEdit} size="small"><EditIcon fontSize="small" /></IconButton>
                  <IconButton onClick={handleDelete} size="small"><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ mt: 2 }}>
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Box>

      {/* Modal */}
      <TableModal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Transaction Details"
        description="Detailed view of the transaction"
      >
        <p>This is where you can put more transaction details or edit forms.</p>
      </TableModal>
    </Paper>
  );
}
