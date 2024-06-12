import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
import { Box, TextField, Button, Snackbar, Alert, Paper, Grid, useTheme, useMediaQuery } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Plot from 'react-plotly.js';
import { getUser } from "../../hooks/user.actions";
import Layout from "../../components/users/Layout";
import axiosService from '../../helpers/axios';

function HistoryData() {
    // const theme = useTheme();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
    // const isSmallScreen = useMediaQuery(theme.breakpoints.between("sm"));
    const publicId = getUser().id;

    useEffect(() => {
        
        if (publicId) {
            fetchHistoricalData(publicId);
        }
    }, [startDate, endDate]);

    const fetchHistoricalData = (userId) => {
        const params = {
            user_id: userId,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : "",
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : "",
        };

        axiosService.get(`user-sensor-data/user_historical_data/`, { params })
            .then(response => setHistoricalData(response.data))
            .catch(error => {
                setError('There was an error fetching the historical data!');
                setOpenSnackbar(true);
                console.error(error);
            });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const formatDate = (date) => {
        return date ? format(date, 'yyyy-MM-dd') : "";
      };
    

      const handleExportUserHistoryData = () => {
        const params = {
          publicId,
          start_date: formatDate(startDate),
          end_date: formatDate(endDate)
        };
      
        axiosService
          .get('user-sensor-data/export_sensor_data/', { params })
          .then(response => {
            // Handle the response from the server
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sensor_data.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
          })
          .catch(error => {
            // Handle the error
            console.error('Error exporting sensor data:', error);
          });
      };

    const formatPlotData = (parameter) => {
        return {
            x: historicalData.map(data => new Date(data.timestamp)),
            y: historicalData.map(data => data[parameter]),
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'blue' },
        };
    };

    return (
        <Layout>
            <Box sx={{ padding: 3 }}>
                <Paper elevation={3} sx={{ padding: 3, borderRadius: '15px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                customInput={<TextField label="Start Date" variant="outlined" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="End Date"
                                customInput={<TextField label="End Date" variant="outlined" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                        <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleExportUserHistoryData()}
                sx={{
                  backgroundColor: '#1a73e8',
                  '&:hover': {
                    backgroundColor: '#1558b0',
                  },
                  transition: 'background-color 0.3s ease',
                }}
              >
                Export Historical Data
              </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: '20px' }}>
                        {['temperature', 'humidity', 'PH', 'tds', 'do'].map((param, index) => (
                            <Box key={index} sx={{
                                flexBasis:"100%",
                                p: 2,
                                
                                borderRadius: 2,
                                width: "100%", // Ensures the chart takes full width of its container
                              }}>
                                <Plot
                                    data={[formatPlotData(param)]}
                                    layout={{
                                        title: param.toUpperCase(),
                                        xaxis: { title: 'Time' },
                                        yaxis: { title: param },
                                        autosize: true,
                                        margin: { l: 50, r: 30, t: 30, b: 50 },
                                    }}
                                    style={{ width: "100%", height: "100%" }} // Ensures the chart is responsive
                                    useResizeHandler={true}
                                />
                            </Box>
                        ))}
                    </Box>
                </Paper>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    );
}

export default HistoryData;