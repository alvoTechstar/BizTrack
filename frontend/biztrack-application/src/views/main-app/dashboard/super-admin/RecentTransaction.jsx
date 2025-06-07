import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Card, CardContent, Typography } from "@mui/material";
import {
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Error as FailedIcon,
} from "@mui/icons-material";

const RecentTransactions = ({ transactions }) => {
  const statusIcons = {
    Completed: <CompletedIcon className="text-green-500" />,
    Pending: <PendingIcon className="text-yellow-500" />,
    Failed: <FailedIcon className="text-red-500" />,
  };

  return (
    <Card className="shadow-md">
      <CardContent>
        <Typography variant="h6" className="font-semibold mb-4">
          Recent Transactions
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Business</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.slice(0, 5).map((txn) => (
                <TableRow key={txn.id} hover className="cursor-pointer">
                  <TableCell>
                    {new Date(txn.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{txn.businessName}</TableCell>
                  <TableCell align="right">
                    KSh {txn.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {statusIcons[txn.status]}
                      <span className="ml-2">{txn.status}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
