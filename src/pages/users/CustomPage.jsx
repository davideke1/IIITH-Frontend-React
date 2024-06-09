// src/pages/CustomPage.js

import React from "react";
import { Typography, Container } from "@mui/material";
import "../../styles/customPage.css"

function CustomPage() {

  return (
    <div className="customBackground">
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Custom Page
        </Typography>
        <Typography variant="h1" align="center">
          This page has a custom background color that overrides the default theme.
        </Typography>
      </Container>
    </div>
  );
}

export default CustomPage;
