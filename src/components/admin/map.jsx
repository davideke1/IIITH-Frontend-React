import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlaceIcon from '@mui/icons-material/Place';
import ReactDOMServer from 'react-dom/server';
import 'leaflet/dist/leaflet.css';
import Chart from 'react-apexcharts';

// Custom DivIcon for the marker
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

const LeafletMap = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [open, setOpen] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Fetch marker data from the API
    axios.get('http://127.0.0.1:8000/api/user-locations') // Replace with your API endpoint
      .then(response => {
        setMarkers(response.data);
      })
      .catch(error => {
        console.error('Error fetching marker data:', error);
      });
  }, []);

  const fetchSensorData = (marker) => {
    axios.get(`http://127.0.0.1:8000/api/sensor-data-by-location?lat=${marker.latitude}&lng=${marker.longitude}`) // Replace with your API endpoint
      .then(response => {
        setSensorData(response.data);
      })
      .catch(error => {
        console.error('Error fetching sensor data:', error);
      });
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setOpen(true);
  };

  useEffect(() => {
    if (selectedMarker && open) {
      fetchSensorData(selectedMarker); // Fetch immediately when the modal opens

      // Set up interval to fetch data periodically
      const id = setInterval(() => {
        fetchSensorData(selectedMarker);
      }, 5000); // Fetch every 5 seconds

      intervalRef.current = id;
    } else {
      // Clear the interval when the modal is closed
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      // Cleanup interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedMarker, open]);

  const handleClose = () => {
    setOpen(false);
    setSelectedMarker(null);
    setSensorData([]);
  };

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    xaxis: {
      type: 'datetime',
      categories: sensorData ? sensorData.map(data => new Date(data.timestamp).getTime()) : [],
    },
  };

  const chartSeries = [
    {
      name: 'Temperature',
      data: sensorData ? sensorData.map(data => parseFloat(data.temperature)) : [],
    },
    {
      name: 'Humidity',
      data: sensorData ? sensorData.map(data => parseFloat(data.humidity)) : [],
    },
    {
      name: 'PH',
      data: sensorData ? sensorData.map(data => parseFloat(data.PH)) : [],
    },
    {
      name: 'TDS',
      data: sensorData ? sensorData.map(data => parseFloat(data.tds)) : [],
    },
    {
      name: 'DO',
      data: sensorData ? sensorData.map(data => parseFloat(data.do)) : [],
    }
  ];

  return (
    <>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }} // Fit the map to the screen
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FitMapToMarkers markers={markers} />
        {markers.map(marker => (
          <Marker
            position={[marker.latitude, marker.longitude]}
            key={marker.id}
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => handleMarkerClick(marker),
            }}
          >
            <Popup>
              Latitude: {marker.latitude}, Longitude: {marker.longitude}
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
          width: 600, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4 
        }}>
          <Typography id="sensor-data-modal" variant="h6" component="h2">
            Sensor Data for David {selectedMarker?.name}
          </Typography>
          {sensorData && sensorData.length > 0 ? (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={350}
            />
          ) : (
            <Typography id="sensor-data-description" sx={{ mt: 2 }}>
              Loading...
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default LeafletMap;


// import React, { useState, useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import axios from 'axios';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import PlaceIcon from '@mui/icons-material/Place';
// import ReactDOMServer from 'react-dom/server';
// import 'leaflet/dist/leaflet.css';
// import Chart from 'react-apexcharts';

// // Custom DivIcon for the marker
// const createCustomIcon = () => {
//   return new L.DivIcon({
//     html: ReactDOMServer.renderToString(<PlaceIcon style={{ color: 'red', fontSize: '24px' }} />),
//     className: 'custom-div-icon',
//     iconSize: [24, 24],
//     iconAnchor: [12, 24],
//   });
// };

// const FitMapToMarkers = ({ markers }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (markers.length > 0) {
//       const bounds = L.latLngBounds(markers.map(marker => [marker.latitude, marker.longitude]));
//       map.fitBounds(bounds);
//     }
//   }, [markers, map]);

//   return null;
// };

// const LeafletMap = () => {
//   const [markers, setMarkers] = useState([]);
//   const [selectedMarker, setSelectedMarker] = useState(null);
//   const [sensorData, setSensorData] = useState([]);
//   const [open, setOpen] = useState(false);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     // Fetch marker data from the API
//     axios.get('http://127.0.0.1:8000/api/user-locations') // Replace with your API endpoint
//       .then(response => {
//         setMarkers(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching marker data:', error);
//       });
//   }, []);

//   const fetchSensorData = (marker) => {
//     axios.get(`http://127.0.0.1:8000/api/sensor-data-by-location?lat=${marker.latitude}&lng=${marker.longitude}`) // Replace with your API endpoint
//       .then(response => {
//         setSensorData(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching sensor data:', error);
//       });
//   };

//   const handleMarkerClick = (marker) => {
//     setSelectedMarker(marker);
//     setOpen(true);
//   };

//   useEffect(() => {
//     if (selectedMarker && open) {
//       fetchSensorData(selectedMarker); // Fetch immediately when the modal opens

//       // Set up interval to fetch data periodically
//       const id = setInterval(() => {
//         fetchSensorData(selectedMarker);
//       }, 5000); // Fetch every 5 seconds

//       intervalRef.current = id;
//     } else {
//       // Clear the interval when the modal is closed
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     }

//     return () => {
//       // Cleanup interval on unmount
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [selectedMarker, open]);

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedMarker(null);
//     setSensorData([]);
//   };

//   const chartOptions = {
//     chart: {
//       type: 'line',
//       height: 350,
//     },
//     xaxis: {
//       type: 'datetime',
//       categories: sensorData ? sensorData.map(data => new Date(data.timestamp).getTime()) : [],
//     },
//   };

//   const chartSeries = [
//     {
//       name: 'Temperature',
//       data: sensorData ? sensorData.map(data => parseFloat(data.temperature)) : [],
//     },
//     {
//       name: 'Humidity',
//       data: sensorData ? sensorData.map(data => parseFloat(data.humidity)) : [],
//     },
//     {
//       name: 'PH',
//       data: sensorData ? sensorData.map(data => parseFloat(data.PH)) : [],
//     },
//     {
//       name: 'TDS',
//       data: sensorData ? sensorData.map(data => parseFloat(data.tds)) : [],
//     },
//     {
//       name: 'DO',
//       data: sensorData ? sensorData.map(data => parseFloat(data.do)) : [],
//     }
//   ];

//   return (
//     <>
//       <MapContainer
//         center={[22.9734, 78.6569]} // Center of India
//         zoom={5}
//         style={{ height: '100vh', width: '100%' }} // Fit the map to the screen
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <FitMapToMarkers markers={markers} />
//         {markers.map(marker => (
//           <Marker
//             position={[marker.latitude, marker.longitude]}
//             key={marker.id} // Ensure unique key for each marker
//             icon={createCustomIcon()}
//             eventHandlers={{
//               click: () => handleMarkerClick(marker),
//             }}
//           >
//             <Popup>
//               Latitude: {marker.latitude}, Longitude: {marker.longitude}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>

//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="sensor-data-modal"
//         aria-describedby="sensor-data-description"
//       >
//         <Box sx={{ 
//           position: 'absolute', 
//           top: '50%', 
//           left: '50%', 
//           transform: 'translate(-50%, -50%)', 
//           width: 600, 
//           bgcolor: 'background.paper', 
//           boxShadow: 24, 
//           p: 4 
//         }}>
//           <Typography id="sensor-data-modal" variant="h6" component="h2">
//             Sensor Data for {selectedMarker?.name}
//           </Typography>
//           {sensorData && sensorData.length > 0 ? (
//             <Chart
//               options={chartOptions}
//               series={chartSeries}
//               type="line"
//               height={350}
//             />
//           ) : (
//             <Typography id="sensor-data-description" sx={{ mt: 2 }}>
//               Loading...
//             </Typography>
//           )}
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default LeafletMap;
