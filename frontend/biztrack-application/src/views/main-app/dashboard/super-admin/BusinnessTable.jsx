import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  IconButton,
  TablePagination,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";

const BusinessTable = ({ businesses }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(0);
  };

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm) ||
      business.type.toLowerCase().includes(searchTerm)
  );

  const sortedBusinesses = filteredBusinesses.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedBusinesses = sortedBusinesses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card className="shadow-md mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-bold text-gray-800">
            Businesses
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search businesses..."
            InputProps={{
              startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
            }}
            onChange={handleSearch}
            className="w-60"
          />
        </div>

        <TableContainer component={Paper} className="rounded-lg shadow-sm">
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="font-semibold text-gray-700">
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Business Name
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-semibold text-gray-700">
                  <TableSortLabel
                    active={orderBy === "type"}
                    direction={orderBy === "type" ? order : "asc"}
                    onClick={() => handleSort("type")}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="right"
                  className="font-semibold text-gray-700"
                >
                  <TableSortLabel
                    active={orderBy === "totalTransactions"}
                    direction={orderBy === "totalTransactions" ? order : "asc"}
                    onClick={() => handleSort("totalTransactions")}
                  >
                    Transactions
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="right"
                  className="font-semibold text-gray-700"
                >
                  <TableSortLabel
                    active={orderBy === "totalRevenue"}
                    direction={orderBy === "totalRevenue" ? order : "asc"}
                    onClick={() => handleSort("totalRevenue")}
                  >
                    Revenue
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-semibold text-gray-700">
                  Status
                </TableCell>
                <TableCell className="font-semibold text-gray-700">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBusinesses.map((business) => (
                <TableRow key={business.id} hover className="hover:bg-gray-50">
                  <TableCell className="text-sm font-medium text-gray-800">
                    {business.name}
                  </TableCell>
                  <TableCell className="capitalize text-sm text-gray-600">
                    {business.type}
                  </TableCell>
                  <TableCell align="right" className="text-sm text-gray-600">
                    {business.totalTransactions}
                  </TableCell>
                  <TableCell align="right" className="text-sm text-gray-600">
                    KSh {business.totalRevenue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        business.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {business.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <IconButton
                        color="primary"
                        size="small"
                        className="hover:scale-105 transition-transform"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        size="small"
                        className="hover:scale-105 transition-transform"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBusinesses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          className="mt-4"
        />
      </CardContent>
    </Card>
  );
};

export default BusinessTable;
