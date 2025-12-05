import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CreditCard } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatCurrency } from "../../../../../utilities/SharedFunctions";

const TransactionDetailsModal = ({ open, onClose, transaction }) => {
  if (!transaction) return null;

  const transactionTime = new Date(transaction.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const transactionDate = new Date(transaction.timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const expectedPaymentDate = transaction.expectedPaymentDate
    ? new Date(transaction.expectedPaymentDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : null;

  const isDebtTransaction = transaction.paymentMethod === "Debt" || transaction.originalPaymentMethod === "Debt";
  const wasDebtPaid = transaction.debtPaid || (isDebtTransaction && transaction.status === "Completed");

  // Helper function for shortened items display
  const renderShortenedItems = (items) => {
    if (!items || items.length === 0) return "No items";

    const firstItem = items[0];
    const remainingCount = items.length - 1;
    const itemName = firstItem.name || firstItem.product?.name || "Unknown Product";
    const quantity = firstItem.quantity || 1;

    return (
      <div className="flex flex-col gap-0">
        <div className="text-sm">
          {quantity}x {itemName.length > 20 ? itemName.substring(0, 20) + '...' : itemName}
        </div>
        {remainingCount > 0 && (
          <div className="text-xs text-gray-500">
            +{remainingCount} more item{remainingCount > 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <div>
          <Typography variant="h6">
            {isDebtTransaction ? "Debt Transaction Details" : "Transaction Details"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            ID: {transaction.transactionId || transaction.id?.slice(0, 12)}...
          </Typography>
        </div>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Date & Time
              </Typography>
              <Typography variant="body1">
                {transactionDate} at {transactionTime}
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <StatusBadge status={transaction.status} />
            </div>
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Payment Method
              </Typography>
              <div className="flex items-center gap-2">
                <StatusBadge status={transaction.paymentMethod} type="payment" />
                {isDebtTransaction && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Debt
                  </span>
                )}
              </div>
            </div>
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Total Amount
              </Typography>
              <Typography variant="h6" className="font-bold">
                {formatCurrency(transaction.total)}
              </Typography>
            </div>
          </div>

          {/* Debt Information Box */}
          {isDebtTransaction && (
            <div className={`mb-4 p-4 rounded-lg ${wasDebtPaid ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className={`h-5 w-5 ${wasDebtPaid ? 'text-green-600' : 'text-red-600'}`} />
                <Typography variant="subtitle1" className={`font-semibold ${wasDebtPaid ? 'text-green-800' : 'text-red-800'}`}>
                  {wasDebtPaid ? '✓ Debt Recovered' : '⚠ Outstanding Debt'}
                </Typography>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {transaction.expectedPaymentDate && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Expected Payment Date
                    </Typography>
                    <Typography variant="body1">
                      {expectedPaymentDate}
                    </Typography>
                  </div>
                )}
                
                {wasDebtPaid && transaction.datePaid && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Date Paid
                    </Typography>
                    <Typography variant="body1">
                      {new Date(transaction.datePaid).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </div>
                )}
                
                {!wasDebtPaid && transaction.status === "Pending" && transaction.expectedPaymentDate && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Days Remaining
                    </Typography>
                    <Typography variant="body1" className={Math.ceil((new Date(transaction.expectedPaymentDate) - new Date()) / (1000 * 60 * 60 * 24)) < 0 ? 'text-red-600 font-semibold' : ''}>
                      {Math.ceil((new Date(transaction.expectedPaymentDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </Typography>
                  </div>
                )}
                
                {wasDebtPaid && transaction.debtPaymentMethod && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Payment Method Used
                    </Typography>
                    <Typography variant="body1">
                      {transaction.debtPaymentMethod}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          )}

          {(transaction.customerName || transaction.phone || transaction.customerPhone) && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <Typography variant="subtitle1" className="font-semibold mb-2">
                Customer Information
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                {transaction.customerName && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Customer Name
                    </Typography>
                    <Typography variant="body1">
                      {transaction.customerName}
                    </Typography>
                  </div>
                )}
                {(transaction.phone || transaction.customerPhone) && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {transaction.phone || transaction.customerPhone}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <Typography variant="subtitle1" className="font-semibold mb-2">
              Items Purchased ({transaction.items?.length || 0})
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transaction.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2">
                        {item.name || item.product?.name || "Unknown Product"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {item.quantity || 1}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.price || item.product?.price || 0)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        (item.quantity || 1) * (item.price || item.product?.price || 0)
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="body1" className="font-semibold">
                      Total:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" className="font-semibold">
                      {formatCurrency(transaction.total)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {transaction.paymentMethod === "Cash" && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <Typography variant="subtitle2" color="textSecondary">
                Cash Payment Details
              </Typography>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Amount Paid
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(transaction.amountPaid || transaction.total)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Change Given
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(transaction.change || 0)}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {transaction.notes && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <Typography variant="subtitle2" color="textSecondary">
                Additional Notes
              </Typography>
              <Typography variant="body2">{transaction.notes}</Typography>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal;