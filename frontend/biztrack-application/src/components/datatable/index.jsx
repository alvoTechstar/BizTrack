import React, { useEffect, useState } from "react";
import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "./table.css";
import {
  formatAmount,
  formatPaidDate,
  formatDate,
  formatDateLogs,
  formatPhoneNumber,
  formatString,
  formatValue,
  getFilteredTable,
  getFilters,
  searchFunction,
} from "../../utilities/SharedFunctions";
import TablePill from "./TablePill";
import TableActions from "./TableActions";
import CheckboxInput from "../input/CheckboxInput"
import TablePagination from "./TablePagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F3F4F6",
    color: "#353F50",
    fontFamily: `"Averta-Bolder", sans-serif`,
    fontSize: 12,
    lineHeight: "14px",
    padding: "10px 9px",
    fontWeight: "bold",

  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    fontFamily: `"Averta-Bold", sans-serif`,
    color: "#353F50",
    padding: "6px 9px",
  },
}));

export default function DataTable({
  type,
  clickable,
  color,
  data,
  all,
  searchFilter,
  openFilter,
  columnFilters,
  columnFilter,
  columnFilter2,
  headers,
  actions,
  selected,
  dates,
  selectedAction,
  selectedRow,
  selectAll,
  actionSelected,
  customRenderCell, // Add custom render prop
}) {
  const ROWS_PER_PAGE = type === "role-matrix" ? 3 : 6;

  const [page, setPage] = useState(1);
  const [prevData, setPrevData] = useState([]);
  const [filters, setFilters] = useState([]);

  const tableFilters =
    columnFilter || columnFilter2
      ? columnFilter2
        ? columnFilter.concat(columnFilter2)
        : columnFilter
      : [];

  // FIX: Add safe default functions for missing props
  const safeActionSelected = actionSelected || ((...args) => {
    console.warn('actionSelected function not provided', args);
  });

  const safeSelectedRow = selectedRow || ((...args) => {
    console.warn('selectedRow function not provided', args);
  });

  const safeSelectedAction = selectedAction || ((...args) => {
    console.warn('selectedAction function not provided', args);
  });

  const safeSelectAll = selectAll || ((...args) => {
    console.warn('selectAll function not provided', args);
  });

  // Add default for customRenderCell
  const safeCustomRenderCell = customRenderCell || ((column, header) => column[header.key]);

  const handleAction = (action, id) => {
    safeActionSelected(action, id);
  };

  const handleCheck = (event) => {
    const id = JSON.parse(event.target.id);
    const state = event.target.checked;
    safeSelectAll(false);

    if (id === "all") {
      const temp = [];
      if (state && data) {
        data.forEach(function (elem, index) {
          if (elem.status === "ACTIVE" || elem.id) {
            temp.push(elem.id);
          }
        });
        safeSelectAll(true);
      }
      safeSelectedAction(temp);
    } else {
      const index = selected.indexOf(id);
      if (index !== -1) {
        selected.splice(index, 1);
        safeSelectedAction([...selected]);
      } else {
        safeSelectedAction([...selected, id]);
      }
    }
  };

  const handleChange = (event, value) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPage(value);
  };

  // Fixed: Add proper null checks for rows
  const rows = Array.isArray(filters) && filters.length > 0
    ? prevData
    : searchFunction(data || [], searchFilter);

  const pages = Array.isArray(rows) ? Math.ceil(rows.length / ROWS_PER_PAGE) : 1;
  const currentRows = Array.isArray(rows)
    ? ROWS_PER_PAGE > 0
      ? rows.slice(
        (page - 1) * ROWS_PER_PAGE,
        (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE
      )
      : rows
    : [];

  useEffect(() => {
    if (!openFilter) {
      if (JSON.stringify(filters) !== JSON.stringify(tableFilters)) {
        setFilters(tableFilters);
        setPrevData(
          getFilteredTable(
            data || [],
            columnFilter,
            columnFilter2,
            columnFilters,
            type
          )
        );
        setPage(1);
      }
    }
  }, [openFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchFilter]);

  // Helper function to render cell content
  const renderCellContent = (column, header) => {
    // Use custom render if provided
    if (customRenderCell) {
      return safeCustomRenderCell(column, header);
    }

    // Handle debt management table specifically
    if (type === "debts") {
      if (header.key === "status") {
        return <TablePill state={column[header.key]} page="debts" />;
      }
      if (header.key === "paymentMethod") {
        return <TablePill state={column[header.key]} type="payment" />;
      }
    }

    // Original rendering logic
    if (type === "logs") {
      if (header.key === "dateCreated") {
        return formatDateLogs(column[header.key]);
      } else if (header.key === "userName") {
        return column.actionBy?.userName;
      } else if (header.key === "pin") {
        return column.cashPickUpOrder?.pin ? column.cashPickUpOrder.pin : "";
      } else if (header.key === "userRole") {
        return formatString(column.actionBy?.userRole);
      } else if (header.key === "action" || header.key === "details") {
        return formatValue(column[header.key]);
      } else if (header.key === "ipAddress") {
        return column.actionBy?.ipAddress;
      }
    } else if (type === "outbound") {
      if (header.key === "beneficiary") {
        return `${column.iswRiaCashBeneficiary?.firstName || ""} ${column.iswRiaCashBeneficiary?.middleName ||
          column.iswRiaCashBeneficiary?.thirdName || ""
          }`;
      } else if (header.key === "customer") {
        return `${column.iswRiaCashCustomer?.firstName || ""} ${column.iswRiaCashCustomer?.middleName ||
          column.iswRiaCashCustomer?.thirdName || ""
          }`;
      } else if (header.key === "create_date") {
        return formatDate(column[header.key]);
      } else if (header.key === "amount" || header.key === "paymentAmount") {
        return formatAmount(column[header.key]);
      } else if (header.key === "status" || header.key === "orderStatus") {
        return <TablePill state={column[header.key]} page={"outbound"} />;
      } else if (header.key === "action") {
        return <TableActions
          status={column.status || column.orderStatus}
          actions={
            column.orderStatus === "ReadyForPayout" ||
              column.status === "ReadyForPayout" ||
              column.status === "Paid" ||
              column.status === "Pending" ||
              column.orderStatus === "Pending" ||
              column.status === "Sent" ||
              column.orderStatus === "Sent" ||
              column.status === "Processing" ||
              column.orderStatus === "Processing"
              ? actions
              : [actions?.[0] || "View"]
          }
          id={column.id}
          action={handleAction}
        />;
      }
    }

    // Generic rendering
    if (header.key === "createDate" || header.key === "orderDate") {
      return formatPaidDate(column[header.key]);
    } else if (header.key === "responseDateTimeUTC") {
      return column.status === "PAID"
        ? column.paidDate
          ? formatPaidDate(column.paidDate)
          : formatPaidDate(column.responseDateTimeUTC)
        : "";
    } else if (header.key === "userRole" || header.key === "method") {
      return formatString(column[header.key]);
    } else if (header.key === "institution") {
      return column.institution?.institutionName;
    } else if (header.key === "phoneNumber") {
      return column[header.key] ? formatPhoneNumber(column[header.key]) : "N/A";
    } else if (header.key === "amount" || header.key === "beneficiaryAmount") {
      return formatAmount(column[header.key]);
    } else if (header.key === "status" || header.key === "orderStatus") {
      return <TablePill state={column[header.key]} />;
    } else if (header.key === "agent") {
      return column.searchedBy
        ? `${column.searchedBy.firstName} ${column.searchedBy.secondName}`
        : null;
    } else if (header.key === "countryFrom") {
      return column.countryFromDetails ? column.countryFromDetails.name : null;
    } else if (header.key === "action") {
      return <TableActions
        status={column.status}
        actions={actions || []}
        id={column.id}
        action={handleAction}
      />;
    } else if (header.key === "permissions") {
      return Array.isArray(column[header.key])
        ? column[header.key].map((permission, index) => (
          <Typography key={index} variant="body">
            {permission}
          </Typography>
        ))
        : null;
    }

    return column[header.key];
  };

  return (
    <div className="table-container">
      {Array.isArray(rows) && rows.length > 0 ? (
        <>
          <TableContainer className="table">
            <Table>
              <TableHead>
                <TableRow>
                  {Array.isArray(headers) && headers.map((header, index) => (
                    <StyledTableCell key={header.key || index}>
                      {index === 0 && header.key === "all" ? (
                        <CheckboxInput
                          checked={all}
                          handleCheck={handleCheck}
                          label={header.key}
                          color={color}
                        />
                      ) : (
                        header.title
                      )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((column, rowIndex) => (
                  <TableRow
                    key={column.id || column.orderNo || rowIndex}
                    style={
                      column.status === "PAID" ||
                        column.status === "PENDING" ||
                        column.status === "APPROVED" ||
                        column.status === "NOT_APPROVED" ||
                        (clickable &&
                          (column.status === "ACTIVE" ||
                            column.amount ||
                            type === "logs" ||
                            type === "debts")) // Add debts to clickable types
                        ? { cursor: "pointer" }
                        : null
                    }
                    onClick={(e) => {
                      if (
                        column.status === "PAID" ||
                        column.status === "PENDING" ||
                        column.status === "APPROVED" ||
                        column.status === "NOT_APPROVED" ||
                        (clickable &&
                          (column.status === "ACTIVE" ||
                            column.amount ||
                            type === "logs" ||
                            type === "bank deposit" ||
                            type === "debts")) // Add debts to clickable
                      ) {
                        e.preventDefault();
                        e.stopPropagation();
                        safeSelectedRow(e, column);
                      }
                    }}
                  >
                    {Array.isArray(headers) && headers.map((header, index) =>
                      index === 0 && header.key === "all" ? (
                        <StyledTableCell
                          component="th"
                          scope="row"
                          key={header.key || index}
                        >
                          {column.status === "ACTIVE" ||
                            column.amount ||
                            column.paymentAmount ||
                            type === "logs" ||
                            type === "bank deposit" ||
                            type === "debts" ? ( // Add debts to checkbox condition
                            <CheckboxInput
                              checked={
                                all ||
                                selected.indexOf(
                                  column.id || column.orderNo
                                ) !== -1
                              }
                              handleCheck={handleCheck}
                              label={column.id || column.orderNo}
                              color={color}
                            />
                          ) : null}
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell key={header.key || index}>
                          {renderCellContent(column, header)}
                        </StyledTableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            page={page}
            pages={pages}
            color={color}
            handleChange={handleChange}
          />
        </>
      ) : (
        <span className="table-data-span">
          No results for {searchFilter || getFilters(filters || [])}
          {dates ? ` ${dates.startDate} to ${dates.endDate}` : null}
        </span>
      )}
    </div>
  );
}