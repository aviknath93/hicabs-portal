import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        backgroundColor: "#f1f1f1",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} HiCarbs-Portal. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
