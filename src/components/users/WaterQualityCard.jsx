import React from "react";
import { Card, CardContent, Typography, Grid, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const WaterQualityCard = ({ parameter,name }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Card sx={{ minWidth: 275, margin: 2, padding: 2, boxShadow: 4,
    borderRadius: 3 }} backgroundColor={colors.primary[500]}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="div"   sx={{ color: colors.grey[100] }}>
              {name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: colors.greenAccent[500]}}>
              {parameter} 
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WaterQualityCard;
