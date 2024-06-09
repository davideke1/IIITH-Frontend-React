import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import PlaceIcon from '@mui/icons-material/Place';
import ReactDOMServer from 'react-dom/server';
import 'leaflet/dist/leaflet.css';
import LayoutAdmin from '../components/admin/layout copy';
import Plot from 'react-plotly.js';
import axiosService from '../helpers/axios';

const createCustomIcon = () => {
  return new L.DivIcon({
    html: ReactDOMServer.renderToString(<PlaceIcon style={{ color: 'red', fontSize: '24px' }} />),
    className: 'custom-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

const FitMapToMarkers = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(marker => [marker.latitude, marker.longitude]));
      map.fitBounds(bounds);
    }
  }, [markers, map]);

  return null;
};

const LargerLeafletMap = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const wsRef = useRef(null);

  useEffect(() => {
    axiosService.get('sensor-locations')
      .then(response => {
        setMarkers(response.data);
      })
      .catch(error => {
        console.error('Error fetching marker data:', error);
      });
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setOpen(true);
    if (wsRef.current) {
      wsRef.current.close();
    }
    wsRef.current = new W3CWebSocket(`ws://127.0.0.1:8000/ws/user-sensor-data/admin/${marker.latitude}/${marker.longitude}/`);
    wsRef.current.onopen = () => {
      console.log("Successfully connected to the WebSocket.");
    };
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSensorData(prevData => [...prevData, data]);
      console.log(data);
    };
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMarker(null);
    setSensorData([]);
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const plotData = (parameter, label, color) => ({
    x: sensorData.map(data => new Date(data.timestamp).toLocaleTimeString()),
    y: sensorData.map(data => data[parameter]),
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color },
    line: { color },
    name: label,
  });

  const plotLayout = (title) => ({
    title,
    xaxis: { title: 'Time', tickfont: { color: 'white' } },
    yaxis: { title: 'Value', tickfont: { color: 'white' } },
    paper_bgcolor: 'rgba(0,0,0,0.6)',
    plot_bgcolor: 'rgba(0,0,0,0.6)',
    font: { color: 'white' },
  });

  return (
    <>
      <LayoutAdmin>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <FitMapToMarkers markers={markers} />
          {markers.map(marker => (
            <Marker
              key={marker.username}
              position={[marker.latitude, marker.longitude]}
              icon={createCustomIcon()}
              eventHandlers={{
                click: () => handleMarkerClick(marker),
              }}
            >
              <Popup>
                Latitude: {marker.latitude}<br /> Longitude: {marker.longitude}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="sensor-data-modal"
          aria-describedby="sensor-data-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 1200,
            height: '90%',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography id="sensor-data-modal" variant="h6" component="h2">
              Sensor Data for {selectedMarker?.username}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', mb: 2 }}>
              <Typography variant="body1">Temperature: {sensorData[sensorData.length - 1]?.temperature}°C</Typography>
              <Typography variant="body1">Humidity: {sensorData[sensorData.length - 1]?.humidity}%</Typography>
              <Typography variant="body1">PH: {sensorData[sensorData.length - 1]?.ph}</Typography>
              <Typography variant="body1">TDS: {sensorData[sensorData.length - 1]?.tds}</Typography>
              <Typography variant="body1">DO: {sensorData[sensorData.length - 1]?.do}</Typography>
            </Box>
            {sensorData && sensorData.length > 0 ? (
              <Box sx={{ height: '70vh', width: '100%', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: isMediumScreen ? '100%' : 'calc(50% - 8px)', height: '60%' }}>
                  <Plot data={[plotData('temperature', 'Temperature', 'rgba(75,192,192,1)')]} layout={plotLayout('Temperature')} useResizeHandler style={{ width: '100%', height: '100%' }} />
                </Box>
                <Box sx={{ width: isMediumScreen ? '100%' : 'calc(50% - 8px)', height: '60%' }}>
                  <Plot data={[plotData('humidity', 'Humidity', 'rgba(153,102,255,1)')]} layout={plotLayout('Humidity')} useResizeHandler style={{ width: '100%', height: '100%' }} />
                </Box>
                <Box sx={{ width: isMediumScreen ? '100%' : 'calc(50% - 8px)', height: '60%' }}>
                  <Plot data={[plotData('ph', 'PH', 'rgba(255,159,64,1)')]} layout={plotLayout('PH')} useResizeHandler style={{ width: '100%', height: '100%' }} />
                </Box>
                <Box sx={{ width: isMediumScreen ? '100%' : 'calc(50% - 8px)', height: '60%' }}>
                  <Plot data={[plotData('tds', 'TDS', 'rgba(54,162,235,1)')]} layout={plotLayout('TDS')} useResizeHandler style={{ width: '100%', height: '100%' }} />
                </Box>
                <Box sx={{ width: 'calc(100% - 8px)', height: '60%' }}>
                  <Plot data={[plotData('do', 'DO', 'rgba(255,206,86,1)')]} layout={plotLayout('DO')} useResizeHandler style={{ width: '100%', height: '100%' }} />
                </Box>
              </Box>
            ) : (
              <Typography id="sensor-data-description" sx={{ mt: 2 }}>
                Loading...
              </Typography>
            )}
          </Box>
        </Modal>
      </LayoutAdmin>
    </>
  );
};

export default LargerLeafletMap;
