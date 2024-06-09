// src/components/AdminSidebar.jsx
import React, { useState } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FaHome, FaUser, FaCog, FaBars } from 'react-icons/fa';
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';

const SidebarContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
}));

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <SidebarContainer>
      <ProSidebar collapsed={collapsed}>
        <Menu iconShape="square">
          <MenuItem icon={<FaHome />}>Dashboard</MenuItem>
          <MenuItem icon={<FaUser />}>Users</MenuItem>
          <SubMenu title="Settings" icon={<FaCog />}>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Logout</MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>
      <IconButton onClick={handleToggleSidebar} sx={{ alignSelf: 'center', m: 1 }}>
        <FaBars />
      </IconButton>
    </SidebarContainer>
  );
};

export default AdminSidebar;
