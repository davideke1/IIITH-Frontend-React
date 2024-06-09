import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button, Box, Typography, TextField } from '@mui/material';
import { DatePicker } from '@mui/lab';
import { CSVLink } from 'react-csv';

const colorsArray = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#ff0000",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const LineChartComponent = ({ sensorData, parameters, colors }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const formattedData = sensorData
    .filter((dataPoint) => {
      if (!startDate || !endDate) return true;
      const timestamp = new Date(dataPoint.timestamp);
      return timestamp >= startDate && timestamp <= endDate;
    })
    .map((dataPoint) => {
      const newDataPoint = {
        timestamp: new Date(dataPoint.timestamp).toLocaleTimeString(),
      };
      parameters.forEach((parameter) => {
        newDataPoint[parameter] = dataPoint[parameter];
      });
      return newDataPoint;
    });

  const csvData = sensorData.map((dataPoint) => ({
    timestamp: new Date(dataPoint.timestamp).toLocaleString(),
    ...parameters.reduce((acc, param) => {
      acc[param] = dataPoint[param];
      return acc;
    }, {}),
  }));

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Sensor Data Chart
      </Typography>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                input: { color: 'white' },
                label: { color: 'white' },
                '.MuiInputBase-root': { backgroundColor: 'black' },
                marginRight: 2,
              }}
            />
          )}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                input: { color: 'white' },
                label: { color: 'white' },
                '.MuiInputBase-root': { backgroundColor: 'black' },
              }}
            />
          )}
        />
      </Box>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={formattedData}
          margin={{ top: 50, right: 50, left: 20, bottom: 100 }}
        >
          <XAxis dataKey="timestamp" stroke={colors.grey[100]} />
          <YAxis stroke={colors.grey[100]} />
          <Tooltip />
          <Legend />
          {parameters.map((parameter, index) => (
            <Line
              key={parameter}
              type="monotone"
              dataKey={parameter}
              stroke={colorsArray[index % colorsArray.length]}
              activeDot={{ r: 8 }}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <Button variant="contained" sx={{ mt: 1 }}>
        <CSVLink data={csvData}>Download CSV</CSVLink>
      </Button>
    </Box>
  );
};

export default LineChartComponent;
