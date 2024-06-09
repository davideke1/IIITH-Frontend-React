import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import PlotlyBarChart from './PlotlyBarChart';
import { Grid, Typography } from '@mui/material';
import styles from './MainComponent.module.css'; // Import the CSS file

const MainComponent = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const socket = new W3CWebSocket('ws://127.0.0.1:8000/ws/admin/sensor-data/');

    socket.onopen = () => {
      console.log("Successfully connected to the WebSocket.");
    };

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
      console.log(newData);
    };

    return () => socket.close();
  }, []);

  const chartCount = Object.keys(data).length;
  const lgGridSize = chartCount % 6 === 0 ? 6 : 12;

  return (
    <div className={styles.mainContainer}>
      <Grid container spacing={2}>
        {Object.keys(data).map((param, index) => (
          <Grid item key={param} xs={12} sm={12} md={index === chartCount - 1 ? lgGridSize : 6} lg={index === chartCount - 1 ? lgGridSize : 6}>
            <div className={styles.chart} >
              <Typography variant="h5" className={styles.chartTitle} >
                {param.toUpperCase()}
              </Typography>
              <PlotlyBarChart data={data[param]} />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MainComponent;
