// src/hooks/useCustomBackground.js

import { makeStyles } from "@mui/styles";

const useCustomBackground = makeStyles((theme) => ({
  customBackground: {
    backgroundColor: "#f0f0f0", // Your custom background color
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default useCustomBackground;
