import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { getUser } from "../../hooks/user.actions";

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  font-size: 18px;
  margin: 5px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px;
  font-size: 16px;
  width: 100px;
`;

const StatusLight = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.status === "ON" ? "green" : "red"};
  display: inline-block;
  margin-left: 10px;
`;

const Flow = () => {
  const [flowRate, setFlowRate] = useState(0);
  const [totalFlow, setTotalFlow] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [solenoidStatus, setSolenoidStatus] = useState("OFF");
  const userId = getUser().id;

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/flow_data/${userId}/`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.flow_rate !== undefined) setFlowRate(data.flow_rate);
      if (data.total_flow !== undefined) setTotalFlow(data.total_flow);
      if (data.daily_limit !== undefined) setDailyLimit(data.daily_limit);
      if (data.command) setSolenoidStatus(data.command);
    };

    return () => {
      socket.close();
    };
  }, [userId]);

  const handleSolenoidControl = (status) => {
    axios.post('http://127.0.0.1:8000/api/control_solenoid/', { user_id: userId, command: status })
      .then(response => {
        setSolenoidStatus(response.data.command);
    });
  };

  const handleDailyLimitChange = (event) => {
    setDailyLimit(event.target.value);
  };

  const updateDailyLimit = () => {
    axios.post('http://127.0.0.1:8000/api/update_daily_limit/', { user_id: userId, daily_limit: dailyLimit })
      .then(response => {
        console.log("Daily limit updated");
      })
      .catch(error => {
        console.error("Error updating daily limit:", error);
      });
  };

  return (
    <Container>
      <Title>Sensor Data</Title>
      <Paragraph>Flow Rate: {flowRate} L/min</Paragraph>
      <Paragraph>Total Flow: {totalFlow} L</Paragraph>

      <Title>Solenoid Control</Title>
      <Button onClick={() => handleSolenoidControl("ON")}>Turn On</Button>
      <Button onClick={() => handleSolenoidControl("OFF")}>Turn Off</Button>
      <Paragraph>
        Solenoid Status: {solenoidStatus} 
        <StatusLight status={solenoidStatus} />
      </Paragraph>

      <Title>Daily Limit</Title>
      <Input type="number" value={dailyLimit} onChange={handleDailyLimitChange} />
      <Button onClick={updateDailyLimit}>Set Daily Limit</Button>
      <Paragraph>Daily Limit: {dailyLimit} L</Paragraph>
    </Container>
  );
};

export default Flow;
