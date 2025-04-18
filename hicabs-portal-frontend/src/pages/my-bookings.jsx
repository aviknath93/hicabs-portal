import React from "react";
import { Box, Typography } from "@mui/material";
import "animate.css";

export default function MyBookings() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        variant="h4"
        gutterBottom
        className="animate__animated animate__fadeInDown"
      >
        My bookings
      </Typography>
    </Box>
  );
}
