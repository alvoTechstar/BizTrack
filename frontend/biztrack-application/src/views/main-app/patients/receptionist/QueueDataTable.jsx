// src/components/QueueTable.jsx

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { STATUS_OPTIONS } from "./Constants";

const QueueDataTable = ({ queue, onUpdateStatus }) => {
  const getStatusPillClass = (status) => {
    switch (status) {
      case STATUS_OPTIONS.WAITING:
        return "bg-yellow-200 text-yellow-800";
      case STATUS_OPTIONS.IN_PROGRESS:
        return "bg-blue-200 text-blue-800";
      case STATUS_OPTIONS.DONE:
        return "bg-green-200 text-green-800";
      case STATUS_OPTIONS.CANCELLED:
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Paper elevation={2} className="mt-2">
      <TableContainer>
        <Table stickyHeader aria-label="patient queue table">
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="font-semibold text-gray-600">
                Queue #
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Name
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Phone/ID
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Visit Type
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Arrival Time
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Status
              </TableCell>
              <TableCell className="font-semibold text-gray-600 text-center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queue.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  className="py-10 text-gray-500"
                >
                  Queue is empty.
                </TableCell>
              </TableRow>
            )}
            {queue.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium text-gray-800">
                  {String(row.queueNumber).padStart(3, "0")}
                </TableCell>
                <TableCell>{row.patientName}</TableCell>
                <TableCell>{row.patientIdentifier}</TableCell>
                <TableCell>{row.visitType}</TableCell>
                <TableCell>{formatTime(row.arrivalTime)}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPillClass(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell align="center">
                  {row.status === STATUS_OPTIONS.WAITING && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ArrowForwardIcon />}
                      onClick={() =>
                        onUpdateStatus(row.id, STATUS_OPTIONS.IN_PROGRESS)
                      }
                      className="text-xs mr-1"
                    >
                      Start Consult
                    </Button>
                  )}
                  {row.status === STATUS_OPTIONS.IN_PROGRESS && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() =>
                        onUpdateStatus(row.id, STATUS_OPTIONS.DONE)
                      }
                      className="text-xs mr-1"
                    >
                      Mark Done
                    </Button>
                  )}
                  {(row.status === STATUS_OPTIONS.WAITING ||
                    row.status === STATUS_OPTIONS.IN_PROGRESS) && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        onUpdateStatus(row.id, STATUS_OPTIONS.CANCELLED)
                      }
                      title="Cancel Visit"
                    >
                      <CancelIcon color="error" />
                    </IconButton>
                  )}
                  {row.status === STATUS_OPTIONS.DONE && (
                    <CheckCircleIcon color="success" titleAccess="Completed" />
                  )}
                  {row.status === STATUS_OPTIONS.CANCELLED && (
                    <CancelIcon color="disabled" titleAccess="Cancelled" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default QueueDataTable;