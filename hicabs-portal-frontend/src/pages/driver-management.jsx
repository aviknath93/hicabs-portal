import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import "animate.css";
import CustomTable from "../components/shared/ui-components/custom-table";

const DriverManagement = () => {
  const columns = [
    { id: "name", label: "Name" },
    { id: "id", label: "Driver ID" },
    { id: "mobile", label: "Mobile No" },
    { id: "address", label: "Address" },
    { id: "email", label: "Email" },
  ];

  const driverData = [
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
    {
      name: "John Doe",
      id: "DRV1234",
      mobile: "9876543210",
      address: "123 Street, City",
      email: "john@example.com",
    },
    {
      name: "Jane Smith",
      id: "DRV5678",
      mobile: "9123456780",
      address: "456 Avenue, Town",
      email: "jane@example.com",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid size={{ xs: 4, sm: 8, md: 12 }}>
          <Typography
            variant="h4"
            gutterBottom
            className="animate__animated animate__fadeInDown"
          >
            Driver Management
          </Typography>
        </Grid>
        <Grid size={{ xs: 4, sm: 8, md: 12 }}>
          <CustomTable columns={columns} data={driverData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DriverManagement;
