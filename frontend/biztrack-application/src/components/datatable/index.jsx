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

  const handleAction = (action, id) => {
    if (selectedAction) {
      selectedAction([id]);
    }
    actionSelected(1, action, id);
  };

  const handleCheck = (event) => {
    const id = JSON.parse(event.target.id);
    const state = event.target.checked;
    selectAll(false);

    if (id === "all") {
      const temp = [];
      if (state && data) {
        data.forEach(function (elem, index) {
          if (elem.status === "ACTIVE" || elem.id) {
            temp.push(elem.id);
          }
        });
        selectAll(true);
      }
      selectedAction(temp);
    } else {
      const index = selected.indexOf(id);
      if (index !== -1) {
        selected.splice(index, 1);
        selectedAction([...selected]);
      } else {
        selectedAction([...selected, id]);
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
                            type === "logs"))
                        ? { cursor: "pointer" }
                        : null
                    }
                    onClick={(e) =>
                      column.status === "PAID" ||
                        column.status === "PENDING" ||
                        column.status === "APPROVED" ||
                        column.status === "NOT_APPROVED" ||
                        (clickable &&
                          (column.status === "ACTIVE" ||
                            column.amount ||
                            type === "logs" ||
                            type === "bank deposit"))
                        ? selectedRow(e, column)
                        : null
                    }
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
                            type === "bank deposit" ? (
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
                          {type === "logs" ? (
                            header.key === "dateCreated" ? (
                              formatDateLogs(column[header.key])
                            ) : header.key === "userName" ? (
                              column.actionBy?.userName
                            ) : header.key === "pin" ? (
                              column.cashPickUpOrder?.pin ? (
                                column.cashPickUpOrder.pin
                              ) : (
                                ""
                              )
                            ) : header.key === "userRole" ? (
                              formatString(column.actionBy?.userRole)
                            ) : header.key === "action" ||
                              header.key === "details" ? (
                              formatValue(column[header.key])
                            ) : header.key === "ipAddress" ? (
                              column.actionBy?.ipAddress
                            ) : (
                              column[header.key]
                            )
                          ) : type === "outbound" ? (
                            header.key === "beneficiary" ? (
                              `${column.iswRiaCashBeneficiary?.firstName || ""} ${column.iswRiaCashBeneficiary?.middleName ||
                              column.iswRiaCashBeneficiary?.thirdName || ""
                              }`
                            ) : header.key === "customer" ? (
                              `${column.iswRiaCashCustomer?.firstName || ""} ${column.iswRiaCashCustomer?.middleName ||
                              column.iswRiaCashCustomer?.thirdName || ""
                              }`
                            ) : header.key === "create_date" ? (
                              formatDate(column[header.key])
                            ) : header.key === "amount" ||
                              header.key === "paymentAmount" ? (
                              formatAmount(column[header.key])
                            ) : header.key === "status" ||
                              header.key === "orderStatus" ? (
                              <TablePill
                                state={column[header.key]}
                                page={"outbound"}
                              />
                            ) : header.key === "action" ? (
                              <TableActions
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
                                    : [actions[0]]
                                }
                                id={column.id}
                                action={handleAction}
                              />
                            ) : (
                              column[header.key]
                            )
                          ) : header.key === "createDate" ||
                            header.key === "orderDate" ? (
                            formatPaidDate(column[header.key])
                          ) : header.key === "responseDateTimeUTC" ? (
                            column.status === "PAID" ? (
                              column.paidDate ? (
                                formatPaidDate(column.paidDate)
                              ) : (
                                formatPaidDate(column.responseDateTimeUTC)
                              )
                            ) : (
                              ""
                            )
                          ) : header.key === "userRole" ||
                            header.key === "method" ? (
                            formatString(column[header.key])
                          ) : header.key === "institution" ? (
                            column.institution?.institutionName
                          ) : header.key === "phoneNumber" ? (
                            column[header.key] ? formatPhoneNumber(column[header.key]) : "N/A"
                          ) : header.key === "amount" ||
                            header.key === "beneficiaryAmount" ? (
                            formatAmount(column[header.key])
                          ) : header.key === "status" ||
                            header.key === "orderStatus" ? (
                            <TablePill state={column[header.key]} />
                          ) : header.key === "agent" ? (
                            column.searchedBy ? (
                              `${column.searchedBy.firstName} ${column.searchedBy.secondName}`
                            ) : null
                          ) : header.key === "countryFrom" ? (
                            column.countryFromDetails ? (
                              column.countryFromDetails.name
                            ) : null
                          ) : header.key === "action" ? (
                            <TableActions
                              status={column.status}
                              actions={actions}
                              id={column.id}
                              action={handleAction}
                            />
                          ) : header.key === "permissions" ? (
                            Array.isArray(column[header.key]) ?
                              column[header.key].map((permission, index) => (
                                <Typography key={index} variant="body">
                                  {permission}
                                </Typography>
                              ))
                              : null
                          ) : (
                            column[header.key]
                          )}
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