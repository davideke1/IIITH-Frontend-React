import React, { useState } from 'react';
import axiosService from '../helpers/axios';
import {
  Button, Container, Grid, TextField, Typography,
  Box, useTheme, useMediaQuery, Paper
} from '@mui/material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import LayoutAdmin from '../components/admin/layout copy';
const DataExport = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleExport = (endpoint, params = {}) => {
    const urlParams = new URLSearchParams(params).toString();
    axiosService
      .get(`admin/${endpoint}?${urlParams}`, { responseType: 'blob' })
      .then((response) => {
        console.log('Response Headers:', response.headers);

        
        let filename = `${endpoint}.csv`;
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error(`Error exporting ${endpoint}:`, error);
      });
  };

  const formatDate = (date) => {
    return date ? format(date, 'yyyy-MM-dd') : null;
  };

  const handleExportUserSensorData = () => {
    handleExport('export_user_sensor_data', {
      username,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate)
    });
  };

  const handleExportWithDateRange = (endpoint) => {
    handleExport(endpoint, {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate)
    });
  };

  return (
    <LayoutAdmin>
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#000000', borderRadius: '15px' }}>
        <Typography variant="h4" gutterBottom>Data Export</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleExport('export_users')}
              sx={{
                marginBottom: theme.spacing(2),
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1558b0',
                },
                transition: 'background-color 0.3s ease',
              }}
            >
              Export All Users
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              sx={{ marginBottom: theme.spacing(2) }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              customInput={<TextField label="Start Date" fullWidth sx={{ marginBottom: theme.spacing(2) }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              customInput={<TextField label="End Date" fullWidth sx={{ marginBottom: theme.spacing(2) }} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleExportUserSensorData}
              sx={{
                marginBottom: theme.spacing(2),
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1558b0',
                },
                transition: 'background-color 0.3s ease',
              }}
            >
              Export User Sensor Data
            </Button>
          </Grid>
          {['sensor_data', 'notifications', 'activities'].map((endpoint) => (
            <Grid item xs={12} key={endpoint}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleExportWithDateRange(`export_${endpoint}`)}
                sx={{
                  marginBottom: theme.spacing(2),
                  backgroundColor: '#1a73e8',
                  '&:hover': {
                    backgroundColor: '#1558b0',
                  },
                  transition: 'background-color 0.3s ease',
                }}
              >
                Export {endpoint.replace('_', ' ')}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
    </LayoutAdmin>
  );
};

export default DataExport;
