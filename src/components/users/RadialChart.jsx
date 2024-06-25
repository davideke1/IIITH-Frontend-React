import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styled, { keyframes } from "styled-components";
import { Box, Typography, useTheme, Icon } from "@mui/material";
import { tokens } from "../../theme";
import WarningIcon from "@mui/icons-material/Warning";

const GlassmorphicBox = styled(Box)`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 100%;
  height: 180px;
  box-sizing: border-box;
  position: relative; // Add position relative for alert icon

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }
`;

const flashAnimation = keyframes`
  0% { background-color: rgba(255, 255, 255, 0.2); }
  50% { background-color: rgba(255, 0, 0, 0.2); }
  100% { background-color: rgba(255, 255, 255, 0.2); }
`;

const FlashingBox = styled(GlassmorphicBox)`
  animation: ${flashAnimation} 1s infinite;
`;

const getRangeColor = (parameter, value) => {
  const ranges = {
    temperature: { green: [0, 25], yellow: [25, 35], red: [35, 50] },
    do: { green: [0, 5], yellow: [5, 10], red: [10, 14] },
    tds: { green: [0, 500], yellow: [500, 1500], red: [1500, 2000] },
    humidity: { green: [0, 30], yellow: [30, 60], red: [60, 100] },
    PH: { green: [0, 6], yellow: [6, 8], red: [8, 14] },
  };

  const range = ranges[parameter];

  if (value >= range.red[0] && value <= range.red[1]) return "#FF6666"; // Bright red
  if (value >= range.yellow[0] && value <= range.yellow[1]) return "#FFA500"; // Orange
  return "#4CAF50"; // Green
};
const StatusIndicator = styled(Box)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.color === "green" ? "#4CAF50" : "#FF6666")};
`;
const RadialChart = ({ options }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const rangeColor = getRangeColor(options.title, options.value);
  const isRedRange = rangeColor === "#FF6666"; // Check if the parameter is in the red range

  return (
    <>
      {isRedRange ? (
        <FlashingBox>
          {isRedRange && (
            <Icon
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "#FF6666",
                fontSize: 30,
              }}
            >
              <WarningIcon />
            </Icon>
          )}
          <CircularProgressbar
            value={options.value}
            minValue={options.min}
            maxValue={options.max}
            text={`${options.value}`}
            styles={buildStyles({
              textSize: "24px",
              pathColor: rangeColor,
              textColor: "#FFFFFF",
              trailColor: "rgba(255, 255, 255, 0.2)",
              backgroundColor: "transparent",
            })}
          />
          <Typography
            variant="h5"
            sx={{ mt: 2, color: "#FFFFFF", fontWeight: "bold" }}
          >
            {options.title}
          </Typography>
        </FlashingBox>
      ) : (
        <GlassmorphicBox>
            <StatusIndicator color={isRedRange ? "red" : "green"} />
          <CircularProgressbar
            value={options.value}
            minValue={options.min}
            maxValue={options.max}
            text={`${options.value}`}
            styles={buildStyles({
              textSize: "24px",
              pathColor: rangeColor,
              textColor: "#FFFFFF",
              trailColor: "rgba(255, 255, 255, 0.2)",
              backgroundColor: "transparent",
            })}
          />
          <Typography
            variant="h5"
            sx={{ mt: 2, color: "#FFFFFF", fontWeight: "bold" }}
          >
            {options.title}
          </Typography>
        </GlassmorphicBox>
      )}
    </>
  );
};

export default RadialChart;