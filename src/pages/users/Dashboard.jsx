import React, { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";
import Layout from "../../components/users/Layout";
import Header from "../../components/users/Header";
import { getUser } from "../../hooks/user.actions";
import { Chart } from "react-google-charts";
import Plot from "react-plotly.js";

const parameters = ["temperature", "do", "tds", "humidity", "PH"];

const getGaugeOptions = (parameter) => {
  const ranges = {
    temperature: { min: 0, max: 50 },
    do: { min: 0, max: 14 },
    tds: { min: 0, max: 2000 },
    humidity: { min: 0, max: 100 },
    PH: { min: 0, max: 14 },
  };

  return {
    redFrom: ranges[parameter].max * 0.75,
    redTo: ranges[parameter].max,
    yellowFrom: ranges[parameter].max * 0.5,
    yellowTo: ranges[parameter].max * 0.75,
    minorTicks: 5,
    max: ranges[parameter].max,
    min: ranges[parameter].min,
    majorTicks: [
      ranges[parameter].min,
      ranges[parameter].max * 0.25,
      ranges[parameter].max * 0.5,
      ranges[parameter].max * 0.75,
      ranges[parameter].max,
    ],
  };
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const publicId = getUser().id;

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [sensorData, setSensorData] = useState([]);
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

      // Check if data is an array or a single object
      if (Array.isArray(data)) {
        setSensorData((prevData) => [...prevData, ...data]);
      } else {
        setSensorData((prevData) => [...prevData, data]);
      }
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

  if (!Array.isArray(sensorData) || sensorData.length === 0) {
    return <div>Loading...</div>;
  }

  const getValue = (parameter) => {
    return sensorData.length > 0
      ? parseFloat(sensorData[sensorData.length - 1][parameter])
      : "N/A";
  };

  const getDataForLineChart = (parameter) => {
    return {
      x: sensorData.map((data) => new Date(data.timestamp)),
      y: sensorData.map((data) => parseFloat(data[parameter])),
      type: "scatter",
      mode: "lines+markers",
      marker: { color: colors.primary[700] },
      name: parameter,
    };
  };

  return (
    <Layout>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title={"DASHBOARD"} />
        </Box>

        {/* Gauge Indicators */}
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-evenly"
          sx={{ mt: 3, width: isLargeScreen
            ? "100%"
            : isMediumScreen
            ? "90%"
            : "100%", mx: "auto" }}
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
                bgcolor: colors.primary[400],
                borderRadius: 2,
              }}
            >
              <Chart
                chartType="Gauge"
                width="100%"
                height="200px"
                data={[
                  ["Label", "Value"],
                  [parameter, getValue(parameter)],
                ]}
                options={getGaugeOptions(parameter)}
              />
            </Box>
          ))}
        </Box>

        {/* Line Charts */}
        <Box mt={4} display="flex" flexWrap="wrap" justifyContent="space-evenly">
          {parameters.map((parameter, index) => (
            <Box
              key={parameter}
              mb={2}
              sx={{
                flexBasis: isLargeScreen
                  ? index === parameters.length - 1
                    ? "100%"
                    : "48%"
                  : "100%",
                p: 2,
                bgcolor: colors.primary[100],
                borderRadius: 2,
                width: "100%", // Ensures the chart takes full width of its container
              }}
            >
              <Plot
                data={[getDataForLineChart(parameter)]}
                layout={{
                  title: parameter,
                  xaxis: { title: "Time" },
                  yaxis: { title: parameter },
                  showlegend: false,
                  autosize: true,
                }}
                style={{ width: "100%", height: "300px" }} // Ensures the chart is responsive
                useResizeHandler={true}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard;
