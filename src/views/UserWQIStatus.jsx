import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LayoutAdmin from '../components/admin/layout copy';
import { getAccessToken } from '../hooks/user.actions';

const WQITable = () => {
  const [wqiData, setWqiData] = useState([]);

  useEffect(() => {
    const token = getAccessToken();
    console.log(token);
    const socket = new W3CWebSocket('ws://localhost:8000/ws/admin/wqi/');
    
    socket.onopen = () => {
      console.log("Successfully connected to the WebSocket.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setWqiData(data);
    };

    return () => socket.close();
  }, []);

  const getColor = (wqi) => {
    if (wqi >= 80) return 'green';
    if (wqi >= 60) return 'yellow';
    if (wqi >= 40) return 'orange';
    return 'red';
  };

  return (
    <LayoutAdmin>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>WQI</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Color</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wqiData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.user}</TableCell>
                <TableCell>{entry.wqi}</TableCell>
                <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <Avatar style={{ backgroundColor: getColor(entry.wqi) }}>
                    <WaterDropIcon />
                  </Avatar>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </LayoutAdmin>
  );
};

export default WQITable;