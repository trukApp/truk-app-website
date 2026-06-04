"use client";
import React, { useState } from "react";
import {
  Typography,
  Card,
  Backdrop,
  CircularProgress,
  Grid,
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useRouter } from "next/navigation";
// import { Grid } from 'lucide-react';

const RatingsAndReviews = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path: string) => {
    setLoading(true);
    router.push(path);
  };
  const tiles = [
    {
      title: " KPI Dashboard",
      icon: <AnalyticsIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
      onClick: () => handleNavigation("/kpi-dashboard"),
    },
    {
      title: "Carrier Performance",
      icon: <LocalShippingIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
    },
    {
      title: "Cost Analysis",
      icon: <AttachMoneyIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
    },
  ];

  return (
    <>
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid>
        <Typography
          variant="h6"
          sx={{ mt: 4, mb: 1, color: "#F08C24", fontWeight: "bold" }}
        >
          Reviews & analytics
        </Typography>
        <Grid
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
              md: "repeat(6, 1fr)",
              lg: "repeat(8, 1fr)",
            },
          }}
        >
          {tiles.map((tile, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "#ffffff",
                boxShadow: 3,
                borderRadius: 5,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                  backgroundColor: "#FCF0DE",
                },
                cursor: "pointer",
              }}
              onClick={tile.onClick}
            >
              {tile.icon}
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                {tile.title}
              </Typography>
            </Card>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default RatingsAndReviews;
