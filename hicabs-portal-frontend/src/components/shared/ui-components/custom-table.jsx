import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  TablePagination,
} from "@mui/material";
import "animate.css";

const CustomTable = ({ columns, data }) => {
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(search)
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!orderBy) return 0;
    const valA = a[orderBy];
    const valB = b[orderBy];
    return (valA < valB ? -1 : 1) * (order === "asc" ? 1 : -1);
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              onChange={handleSearch}
              fullWidth
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row, idx) => (
                    <TableRow key={idx} hover>
                      {columns.map((col) => (
                        <TableCell key={col.id}>{row[col.id]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomTable;
