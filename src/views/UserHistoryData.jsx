import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
  Grid,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import axiosService from "../helpers/axios";
import LayoutAdmin from "../components/admin/layout copy";
import CustomTextField from "../components/users/CustomStyledText";

function UserHistoryData() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [username, setUsername] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (username) {
      fetchHistoricalData(username);
    }
  }, [startDate, endDate]);

  const fetchHistoricalData = (username) => {
    const params = {
      username,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
    };

    axiosService
      .get(`history-sensor-data/historical_data/`, { params })
      .then((response) => {
        setHistoricalData(response.data);
        console.log("Fetched Data:", response.data);
      })
      .catch((error) => {
        let errorMessage = "There was an error fetching the historical data!";
        if (error.response) {
          // Backend responded with an error
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data) {
            // Try to get the first error message if it's an object of errors
            const data = error.response.data;
            errorMessage = data[Object.keys(data)[0]] || errorMessage;
          }
        } else if (error.response.data.message) {
          // General error message
          errorMessage = error.message;
        }
        setError(errorMessage);
        setOpenSnackbar(true);
        console.error(error.response.data.message);
      });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchHistoricalData(username);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const createPlotData = (parameter, color) => ({
    x: historicalData.map((data) => new Date(data.timestamp)),
    y: historicalData.map((data) => data[parameter]),
    type: "scatter",
    mode: "lines",
    name: parameter.charAt(0).toUpperCase() + parameter.slice(1),
    line: { color },
  });

  const plotLayout = (title) => ({
    title,
    xaxis: { title: "Timestamp" },
    yaxis: { title: "Value" },
    showlegend: false,
  });

  return (
    <LayoutAdmin>
      <Box sx={{ padding: theme.spacing(3) }}>
        <Paper
          elevation={3}
          sx={{ padding: theme.spacing(3), borderRadius: "15px" }}
        >
          <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <CustomTextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: isSmallScreen ? theme.spacing(2) : 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  customInput={
                    <CustomTextField
                      label="Start Date"
                      variant="outlined"
                      fullWidth
                    />
                  }
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
                  customInput={
                    <CustomTextField
                      label="End Date"
                      variant="outlined"
                      fullWidth
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
          <Box sx={{ height: isSmallScreen ? "100%" : "100%", width: "100%" }}>
            <Plot
              data={[createPlotData("temperature", "rgba(75,192,192,1)")]}
              layout={plotLayout("Temperature")}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
            <Plot
              data={[createPlotData("humidity", "rgba(153,102,255,1)")]}
              layout={plotLayout("Humidity")}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
            <Plot
              data={[createPlotData("PH", "rgba(255,159,64,1)")]}
              layout={plotLayout("PH")}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
            <Plot
              data={[createPlotData("tds", "rgba(54,162,235,1)")]}
              layout={plotLayout("TDS")}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
            <Plot
              data={[createPlotData("do", "rgba(255,206,86,1)")]}
              layout={plotLayout("DO")}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
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
    </LayoutAdmin>
  );
}

export default UserHistoryData;
