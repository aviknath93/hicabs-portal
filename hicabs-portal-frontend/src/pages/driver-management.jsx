import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import "animate.css";
import CustomTable from "../components/shared/ui-components/custom-table";
import useStore from "../utils/store";

const DriverManagement = () => {
  const columns = [
    { id: "name", label: "Name" },
    { id: "driver_id", label: "Driver ID" },
    { id: "mobile", label: "Mobile No" },
    { id: "address", label: "Address" },
    { id: "email", label: "Email" },
  ];

  const { driverList, fetchDriverList } = useStore();

  useEffect(() => {
    fetchDriverList();
  }, [fetchDriverList]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid size={{ xs: 12 }}>
          <Typography
            variant="h4"
            gutterBottom
            className="animate__animated animate__fadeInDown"
          >
            Driver Management
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CustomTable columns={columns} data={driverList} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DriverManagement;
