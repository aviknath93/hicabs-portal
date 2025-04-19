import React, { useState } from "react";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./header";
import SideMenu from "./side-menu";
import Footer from "./footer";

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <SideMenu
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Box
          component="main"
          sx={{
            backgroundColor: "#f0f0f0",
            flexGrow: 1,
            p: 3,
            width: isMobileOrTablet ? "100%" : `calc(100% - ${drawerWidth}px)`,
            ml: isMobileOrTablet ? 0 : `${drawerWidth}px`, // Adjust margin-left for mobile/tablet
            mt: 8, // Add margin-top to offset the AppBar
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
