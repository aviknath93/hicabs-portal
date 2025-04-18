import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider,
  Box,
  ListItemButton, // Import ListItemButton
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DirectionsCar as CarIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  {
    text: "Driver Management",
    icon: <PeopleIcon />,
    children: [
      { text: "All Drivers", path: "/drivers" },
      { text: "Add Driver", path: "/drivers/add" },
    ],
  },
  {
    text: "Vehicles",
    icon: <CarIcon />,
    children: [
      { text: "All Vehicles", path: "/vehicles" },
      { text: "Add Vehicle", path: "/vehicles/add" },
    ],
  },
];

const SideMenu = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [openItems, setOpenItems] = useState({});

  const handleClick = (itemText) => {
    setOpenItems((prev) => ({ ...prev, [itemText]: !prev[itemText] }));
  };

  const renderMenuItem = (item) => {
    if (item.children) {
      const open = openItems[item.text] || false;
      return (
        <React.Fragment key={item.text}>
          <ListItemButton onClick={() => handleClick(item.text)}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.text} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem key={child.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={child.path}
                    selected={location.pathname === child.path}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary={child.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem key={item.text} disablePadding>
        <ListItemButton
          component={Link}
          to={item.path}
          selected={location.pathname === item.path}
        >
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box
      onClick={isMobile ? handleDrawerToggle : undefined}
      sx={{ textAlign: "center" }}
    >
      <Box sx={{ my: 2, fontWeight: "bold" }}>Hibernate Dashboard</Box>
      <Divider />
      <List>{menuItems.map(renderMenuItem)}</List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SideMenu;
