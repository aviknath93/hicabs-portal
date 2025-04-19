import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import useStore from "../../utils/store";
import consts from "../../utils/constants.json";
import { useNavigate } from "react-router-dom";

const Header = ({ handleDrawerToggle }) => {
  const navigate = useNavigate();
  const navigateTo = useStore((state) => state.navigateTo);
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");
  const logout = useStore((state) => state.logout);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (action) => {
    setAnchorEl(null);
    if (action === "logout") {
      logout();
    } else if (action === "profile") {
      navigateTo(navigate, consts["paths"]["my-profile"]);
    } else if (action === "changePassword") {
      navigateTo(navigate, consts["paths"]["change-password"]);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }} // Ensure AppBar is above the Drawer
    >
      <Toolbar>
        {isMobileOrTablet && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          hicabs Portal
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={handleAvatarClick}>
            <Avatar sx={{ width: 32, height: 32 }}>H</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => handleMenuClose("profile")}>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => handleMenuClose("changePassword")}>
              Change Password
            </MenuItem>
            <MenuItem onClick={() => handleMenuClose("logout")}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
