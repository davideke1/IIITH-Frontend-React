import React, { useEffect, useState } from 'react';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Container, Box, Typography, Grid } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const parameters = ['PH', 'temperature', 'tds', 'do', 'humidity'];

const ParameterTrends = () => {
  const [chartData, setChartData] = useState(
    parameters.reduce((acc, param) => ({
      ...acc,
      [param]: { labels: [], data: [] },
      [`${param}_avg`]: { labels: [], data: [] }
    }), {})
  );

  useEffect(() => {
    const socket = new W3CWebSocket('ws://127.0.0.1:8000/ws/admin/sensor-data/');

    socket.onopen = () => {
      console.log("Successfully connected to the WebSocket.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);
      updateChartData(data);
    };

    return () => socket.close();
  }, []);

  const updateChartData = (data) => {
    setChartData(prevChartData => {
      const updatedData = { ...prevChartData };

      parameters.forEach(param => {
        if (data[param]) {
          const timestamp = data[param].timestamp;
          updatedData[param].labels.push(timestamp);
          updatedData[param].data.push({
            x: timestamp,
            y: data[param][param]
          });

          if (updatedData[param].labels.length > 20) {
            updatedData[param].labels.shift();
            updatedData[param].data.shift();
          }
        }

        const avgParam = `${param}_avg`;
        if (data[avgParam]) {
          const timestamp = data[avgParam].timestamp;
          updatedData[avgParam].labels.push(timestamp);
          updatedData[avgParam].data.push({
            x: timestamp,
            y: data[avgParam].average
          });

          if (updatedData[avgParam].labels.length > 20) {
            updatedData[avgParam].labels.shift();
            updatedData[avgParam].data.shift();
          }
        }
      });

      console.log("Updated chart data:", updatedData);
      return updatedData;
    });
  };

  const lineOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm:ss'
          }
        }
      },
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.y}`;
          }
        }
      }
    }
  };

  const barOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM dd'
          }
        }
      },
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.y}`;
          }
        }
      }
    }
  };

  const scatterOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Temperature'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Turbidity'
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Temperature: ${context.raw.x}, Turbidity: ${context.raw.y}`;
          }
        }
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Sensor Data Trends</Typography>
      <Grid container spacing={2}>
        {parameters.map(param => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={param}>
            <Box bgcolor="#fff" p={2} borderRadius={4} boxShadow={2} height={400}>
              <Typography variant="h6" gutterBottom>{param.toUpperCase()}</Typography>
              <Line
                data={{
                  labels: chartData[param].labels,
                  datasets: [
                    {
                      label: param.toUpperCase(),
                      data: chartData[param].data,
                      fill: false,
                      borderColor: 'rgba(75,192,192,1)',
                      backgroundColor: 'rgba(75,192,192,1)',
                      tension: 0.1
                    },
                    {
                      label: `${param.toUpperCase()} Avg`,
                      data: chartData[`${param}_avg`].data,
                      fill: false,
                      borderColor: 'rgba(255,99,132,1)',
                      backgroundColor: 'rgba(255,99,132,1)',
                      borderDash: [5, 5],
                      tension: 0.1
                    }
                  ]
                }}
                options={lineOptions}
              />
            </Box>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Box bgcolor="#fff" p={2} borderRadius={4} boxShadow={2} height={400}>
            <Typography variant="h6" gutterBottom>Daily Average pH Values</Typography>
            <Bar
              data={{
                labels: chartData['PH_avg'].labels,
                datasets: [
                  {
                    label: 'Average pH',
                    data: chartData['PH_avg'].data,
                    backgroundColor: 'rgba(75,192,192,1)',
                  }
                ]
              }}
              options={barOptions}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box bgcolor="#fff" p={2} borderRadius={4} boxShadow={2} height={400}>
            <Typography variant="h6" gutterBottom>Turbidity vs Temperature</Typography>
            <Scatter
              data={{
                datasets: [
                  {
                    label: 'Turbidity vs Temperature',
                    data: chartData['temperature'].data.map((dataPoint, index) => ({
                      x: dataPoint.y,
                      y: chartData['tds'].data[index]?.y
                    })),
                    backgroundColor: 'rgba(75,192,192,1)',
                  }
                ]
              }}
              options={scatterOptions}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ParameterTrends;
