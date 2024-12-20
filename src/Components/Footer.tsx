'use client';

// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { Box, Typography, IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

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
        <Typography variant="body2" sx={{ color: "#555" }}>
          <Link href="/terms" passHref>
            Terms and Conditions
          </Link>{" "}
          |{" "}
          <Link href="/privacy" passHref>
            Privacy Policy
          </Link>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <IconButton
            href="https://wa.me/6380681455"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#25D366" }}
          >
            <WhatsAppIcon />
          </IconButton>
          <IconButton
            href="https://www.facebook.com/truckapp"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#1877F2" }}
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            href="https://www.instagram.com/komarajubablu"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#E4405F" }}
          >
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ color: "#777" }}>
        © {new Date().getFullYear()} Truckapp. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
