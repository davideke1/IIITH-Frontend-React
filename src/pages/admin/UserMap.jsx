// src/pages/UserMap.js

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import axiosService from '../../helpers/axios';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to fit the map to the markers
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

const UserMap = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosService.get('sensor-locations/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ height: '500px' }}>
      <MapContainer center={[22.9734, 78.6569]} zoom={5} style={{ height: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {users.map(user => (
          <Marker key={user.id} position={[user.latitude, user.longitude]}>
            <Popup>
              {user.username} <br /> {user.email}
            </Popup>
          </Marker>
        ))}
        <FitMapToMarkers markers={users} />
      </MapContainer>
    </Box>
  );
};

export default UserMap;
