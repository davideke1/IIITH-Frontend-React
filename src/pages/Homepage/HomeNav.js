// src/components/Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerList = () => (
    <div
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      className="drawer-list"
    >
      <List>
        {['Home', 'About', 'Features', 'Team', 'Contact'].map((text) => (
          <ListItem button component={Link} to={`/${text.toLowerCase()}`} key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
        <Divider />
        {['Login', 'Register'].map((text) => (
          <ListItem button component={Link} to={`/${text.toLowerCase()}`} key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="fixed" className="navbar">
        <Toolbar className="toolbar">
          <Typography variant="h6" component={Link} to="/" className="title">
            Water Quality Monitoring
          </Typography>
          <div className="nav-links">
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/about">About</Button>
            <Button color="inherit" component={Link} to="/features">Features</Button>
            <Button color="inherit" component={Link} to="/team">Team</Button>
            <Button color="inherit" component={Link} to="/contact">Contact</Button>
            <Button color="inherit" component={Link} to="/login" className="highlight">Login</Button>
            <Button color="inherit" component={Link} to="/register" className="highlight">Register</Button>
          </div>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            className="menu-icon"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList()}
      </Drawer>
    </>
  );
};

export default Navbar;
