import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { getUser } from "../../hooks/user.actions";


const Header = ({ title }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = getUser();

  return (
    <Box mb="3px" mt="5px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]} mb="10px">
        {user ? `Welcome Back ${user.first_name}` : "Welcome"}
      </Typography>
    </Box>
  );
};

export default Header;