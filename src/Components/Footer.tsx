'use client';

// components/Footer.tsx
import React from "react";
import { Box, Typography } from "@mui/material";


const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f4f4f4",
        padding: "20px",
        textAlign: "center",
        borderTop: "1px solid #ccc",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
      </Box>
      <Typography variant="body2" sx={{ color: "#000000" }}>
        © {new Date().getFullYear()} Trukapp. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
