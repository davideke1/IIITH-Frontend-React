import React, { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";
import Layout from "../../components/users/Layout";
import Header from "../../components/users/Header";
import { getUser } from "../../hooks/user.actions";
import RadialChart from "../../components/users/RadialChart";
import Plot from "react-plotly.js";
import dayjs from "dayjs";
import styled, { keyframes } from "styled-components";

const parameters = ["temperature", "do", "tds", "humidity", "PH"];

const getGaugeOptions = (parameter, value) => {
  const ranges = {
    temperature: { min: 0, max: 50 },
    do: { min: 0, max: 14 },
    tds: { min: 0, max: 2000 },
    humidity: { min: 0, max: 100 },
    PH: { min: 0, max: 14 },
  };

  return {
    value,
    min: ranges[parameter].min,
    max: ranges[parameter].max,
    title: parameter,
  };
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Animation for bouncing droplets
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  } 
  40% {
    transform: scale(1);
  }
`;

// Styled component for the loading animation container
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

// Styled component for each droplet
const Droplet = styled.div`
  width: 15px;
  height: 15px;
  margin: 3px;
  background-color: #3498db;
  border-radius: 50%;
  display: inline-block;
  animation: ${bounce} 1.4s infinite ease-in-out both;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
  &:nth-child(3) {
    animation-delay: 0;
  }
`;

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const publicId = getUser().id;

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [colorMap, setColorMap] = useState({});

  useEffect(() => {
    const sensorDataSocket = new W3CWebSocket(
      `ws://127.0.0.1:8000/ws/sensor-data/user/${publicId}/`
    );

    sensorDataSocket.onopen = () => {
      console.log("Successfully connected to the WebSocket.");
    };

    sensorDataSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Received data:", data);

      if (Array.isArray(data)) {
        setSensorData((prevData) => [...prevData, ...data]);
      } else {
        setSensorData((prevData) => [...prevData, data]);
      }

      setColorMap((prevMap) => {
        const newMap = { ...prevMap };
        parameters.forEach((param) => {
          if (!newMap[param]) {
            newMap[param] = getRandomColor();
          }
        });
        return newMap;
      });
      setLoading(false);
    };

    sensorDataSocket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    sensorDataSocket.onclose = (e) => {
      console.error("Sensor data socket closed unexpectedly:", e);
    };

    return () => {
      sensorDataSocket.close();
    };
  }, [publicId]);

  if (loading) {
    return (
      <Layout>
        <LoadingContainer>
          <Droplet />
          <Droplet />
          <Droplet />
        </LoadingContainer>
      </Layout>
    );
  }

  const getValue = (parameter) => {
    return sensorData.length > 0
      ? parseFloat(sensorData[sensorData.length - 1][parameter])
      : "N/A";
  };

  const getDataForLineChart = (parameter) => {
    const lastFiveDataPoints = sensorData.slice(-5); // Get the last 5 data points
    let startTime, endTime;

    if (lastFiveDataPoints.length > 0) {
      startTime = dayjs(lastFiveDataPoints[0].timestamp); // Get the start time of the last 5 data points
      endTime = dayjs(lastFiveDataPoints[lastFiveDataPoints.length - 1].timestamp); // Get the end time of the last 5 data points
    } else {
      startTime = dayjs(); // Set a default start time if there are no data points
      endTime = dayjs(); // Set a default end time if there are no data points
    }

    return {
      x: lastFiveDataPoints.map((data) => dayjs(data.timestamp).format('h:mm:ss A')),
      y: lastFiveDataPoints.map((data) => parseFloat(data[parameter])),
      type: "scatter",
      mode: "lines+markers",
      marker: { color: colorMap[parameter] },
      name: parameter,
    };
  };

  return (
    <Layout>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title={"DASHBOARD"} />
        </Box>

        {/* Radial Indicators */}
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-evenly"
          sx={{
            mt: 3,
            width: isLargeScreen
              ? "100%"
              : isMediumScreen
              ? "90%"
              : "100%",
            mx: "auto",
          }}
        >
          {parameters.map((parameter) => (
            <Box
              key={parameter}
              mb={2}
              sx={{
                flexBasis: isLargeScreen
                  ? "18%"
                  : isMediumScreen
                  ? "48%"
                  : "50%",
                p: 2,
              }}
            >
              <RadialChart options={getGaugeOptions(parameter, getValue(parameter))} />
            </Box>
          ))}
        </Box>

        {/* Line Charts */}
        <Box mt={4} display="flex" flexWrap="wrap" justifyContent="space-evenly">
          {parameters.map((parameter, index) => {
            const { x, y, ...otherProps } = getDataForLineChart(parameter);
            return (
              <Box
                key={parameter}
                mb={2}
                sx={{
                  flexBasis: isLargeScreen
                    ? index < parameters.length - 1
                      ? "48%"
                      : "98%"
                    : "100%",
                  p: 2,
                  bgcolor: colors.primary[100],
                  borderRadius: 2,
                  width: "100%",
                }}
              >
                <Plot
                  data={[{ x, y, ...otherProps }]}
                  layout={{
                    title: parameter,
                    xaxis: {
                      title: "Time",
                      type: "category",
                      range: x.length > 0 ? [x[0], x[x.length - 1]] : undefined, // Set the x-axis range if there are data points
                      showgrid: true,
                      zeroline: false,
                      automargin: true,
                      autorange: true  // Enable autoscaling on y-axis
                    },
                    yaxis: {
                      title: "",
                      range: y.length > 0 ? [Math.min(...y), Math.max(...y)] : undefined, // Set the y-axis range if there are data points
                      showgrid: true,
                      zeroline: false,
                      automargin: true,
                      autorange: true  // Enable autoscaling on y-axis
                    },
                    margin: {
                      l: 0, // Left margin
                      r: 0, // Right margin
                      b: 50, // Bottom margin
                      t: 50, // Top margin
                      pad: 0, // Padding
                    },
                    showlegend: false,
                    autosize: true,
                    plot_bgcolor: "rgba(0,0,0,0)",
                    paper_bgcolor: "rgba(0,0,0,0)",
                  }}
                  style={{ width: "100%", height: "300px" }}
                  useResizeHandler={true}
                />
              </Box>

            );
          })}
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard;