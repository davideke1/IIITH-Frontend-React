import React from 'react';
import { IconButton } from '@mui/material';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'; // Import the WaterDropOutlinedIcon
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <IconButton className="droplet" sx={{ fontSize: '3rem' }}> {/* Adjust icon size */}
        <WaterDropOutlinedIcon />
      </IconButton>
      <IconButton className="droplet" sx={{ fontSize: '3rem' }}>
        <WaterDropOutlinedIcon />
      </IconButton>
      <IconButton className="droplet" sx={{ fontSize: '3rem' }}>
        <WaterDropOutlinedIcon />
      </IconButton>
    </div>
  );
};

export default LoadingScreen;
