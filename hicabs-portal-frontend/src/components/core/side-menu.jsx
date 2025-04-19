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
  ListItemButton,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import consts from "./../..//utils/constants.json";

const drawerWidth = 240;

const menuItems = [
  {
    text: "Dashboard",
    path: consts["paths"]["dashboard"],
    icon: <DashboardIcon />,
  },
  {
    text: "Driver Management",
    path: consts["paths"]["driver-management"],
    icon: <PeopleIcon />,
  },
  {
    text: "Booking Management",
    icon: <ListIcon />,
    children: [
      { text: "All Bookings", path: consts["paths"]["all-bookings"] },
      { text: "My Bookings", path: consts["paths"]["my-bookings"] },
    ],
  },
];

const SideMenu = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");
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
            {item.icon && (
              <ListItemIcon sx={{ color: "#ffffff" }}>{item.icon}</ListItemIcon>
            )}
            <ListItemText primary={item.text} />
            {open ? (
              <ExpandLess sx={{ color: "#ffffff" }} />
            ) : (
              <ExpandMore sx={{ color: "#ffffff" }} />
            )}
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
          {item.icon && (
            <ListItemIcon sx={{ color: "#ffffff" }}>{item.icon}</ListItemIcon>
          )}
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box
      onClick={isMobileOrTablet ? handleDrawerToggle : undefined}
      sx={{ textAlign: "center", bgcolor: "#1e1e2f", color: "#ffffff" }}
    >
      <Box sx={{ my: 2, fontWeight: "bold" }}>Hibernate Dashboard</Box>
      <Divider sx={{ bgcolor: "#444" }} />
      <List>{menuItems.map(renderMenuItem)}</List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobileOrTablet ? "temporary" : "permanent"}
      open={isMobileOrTablet ? mobileOpen : true}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", sm: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          zIndex: (theme) => theme.zIndex.drawer,
          bgcolor: "#1e1e2f",
          color: "#ffffff",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SideMenu;
