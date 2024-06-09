import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Outlet,useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, useTheme, useMediaQuery, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import { FiSettings, FiLogOut, FiUser, FiHome, FiDatabase, FiUsers, FiList, FiMapPin, FiBell } from 'react-icons/fi';
import { FaWater } from 'react-icons/fa';
import { FiThumbsUp } from 'react-icons/fi';
import axiosService from '../../helpers/axios';

const drawerWidth = 240;

const LayoutAdmin = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Adjust breakpoint to 1200px
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/adminprofile');
  };

  const handlePasswordChange = () => {
    handleMenuClose();
    navigate('/adminpasswordchange');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout()
  
  };

  const logout = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (auth && auth.refresh) {
        const response = await axiosService.post("user-auth/logout/", {
          refresh: auth.refresh,
        });

        if (response.status === 204) {
          console.log("Logged out successfully");
          localStorage.removeItem("auth");
          navigate("/login"); // Redirect to login page after logout
        }
      } else {
        console.error("No refresh token found");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[
          
          { text: 'Dashboard', path: '/admindashboard', icon: <FiHome /> },
          { text: 'Data Export', path: '/export', icon: <FiDatabase /> },
          { text: 'User Management', path: '/user-management', icon: <FiUsers /> },
          { text: 'User List', path: '/user-list', icon: <FiList /> },
          
          { text: 'History Data', path: '/userhistorydata', icon: <FiDatabase /> },
          { text: 'Map', path: '/mainmap', icon: <FiMapPin /> },
          { text: 'Notifications', path: '/adminnotification', icon: <FiBell /> },
          { text: 'WQI Status', path: '/wqistatus', icon: <FaWater /> },
          { text: 'User Feedback', path: '/userfeedback', icon: <FiThumbsUp /> },
        ].map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            to={item.path} 
            sx={{ 
              color: '#fff', 
              '&:hover': { backgroundColor: '#5c6bc0' }, 
              padding: '10px 20px' 
            }}
          >
            {item.icon}
            <ListItemText primary={item.text} sx={{ marginLeft: 2 }} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: '#1a237e', color: '#fff' }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h4" noWrap sx={{ flexGrow: 1 }}>
            Admin Panel 
          </Typography>
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Avatar src="/static/images/avatar/1.jpg" alt="profile picture" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleProfileClick}>
        <FiUser style={{ marginRight: 8 }} />
        Profile
      </MenuItem>
      <MenuItem onClick={handlePasswordChange}>
        <FiSettings style={{ marginRight: 8 }} />
        Change Password
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <FiLogOut style={{ marginRight: 8 }} />
        Logout
      </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#264e70', color: '#fff' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          marginLeft: isMobile ? 0 : `${drawerWidth}px`, 
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

LayoutAdmin.propTypes = {
  children: PropTypes.node,
};

export default LayoutAdmin;
