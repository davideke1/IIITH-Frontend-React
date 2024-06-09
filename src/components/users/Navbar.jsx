import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ toggleSidebar, isLargeScreen }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      bgcolor="primary.main"
      color="white"
    >
      <Typography variant="h5">Water Quality Measuring Dashboard</Typography>
      {!isLargeScreen && (
        <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default Navbar;
