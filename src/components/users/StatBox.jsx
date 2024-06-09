
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const StatBox = ({ parameter }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  return (
    <Box width="100%" m="0 30px">
     
      <Box display="flex" justifyContent="space-between">
        <Box>
          
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {parameter.value}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {parameter.name}
        </Typography>
       
      </Box>
    </Box>
  );
};

export default StatBox;
