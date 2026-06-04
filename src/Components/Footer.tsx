"use client";

// components/Footer.tsx
import React from "react";
import { Typography, Grid } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Grid
      component="footer"
      sx={{
        backgroundColor: "#f4f4f4",
        padding: "20px",
        textAlign: "center",
        borderTop: "1px solid #ccc",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      ></Grid>
      <Typography variant="body2" sx={{ color: "#010101" }}>
        © {new Date().getFullYear()} Trukapp. All rights reserved.
      </Typography>
    </Grid>
  );
};

export default Footer;
