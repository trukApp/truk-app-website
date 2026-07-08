"use client";

import React, { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  NotificationsNone,
  Refresh,
  Download,
  Circle,
} from "@mui/icons-material";

interface DashboardHeaderProps {
  totalVehicles: number;
}

export default function DashboardHeader({
  totalVehicles,
}: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 4,
        mb: 3,
        bgcolor: "#fff",
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left */}

        <Grid sx={{ xs: 12, md: 6 }}>
          <Typography variant="h4" fontWeight={800} color="#111827">
            🚚 Live Vehicle Tracking
          </Typography>

          <Typography mt={1} color="text.secondary">
            AI Logistics Control Tower
          </Typography>

          <Stack direction="row" spacing={2} mt={2} alignItems="center">
            <Chip
              icon={
                <Circle
                  sx={{
                    fontSize: 12,
                    color: "#22c55e !important",
                  }}
                />
              }
              label="Live Tracking Active"
              sx={{
                bgcolor: "#dcfce7",
                color: "#166534",
                fontWeight: 700,
              }}
            />

            <Chip
              label={`${totalVehicles} Vehicles`}
              sx={{
                bgcolor: "#F08C24",
                color: "#fff",
                fontWeight: 700,
              }}
            />
          </Stack>
        </Grid>

        {/* Right */}

        <Grid
          sx={{ xs: 12, md: 6 }}
          display="flex"
          justifyContent={{
            xs: "flex-start",
            md: "flex-end",
          }}
          alignItems="center"
          gap={2}
          flexWrap="wrap"
        >
          <Grid textAlign="right">
            <Typography fontWeight={700}>
              {currentTime.toLocaleDateString()}
            </Typography>

            <Typography color="text.secondary">
              {currentTime.toLocaleTimeString()}
            </Typography>
          </Grid>

          <Button
            startIcon={<Refresh />}
            variant="contained"
            sx={{
              bgcolor: "#F08C24",

              "&:hover": {
                bgcolor: "#d97706",
              },
            }}
          >
            Refresh
          </Button>

          <Button startIcon={<Download />} variant="outlined">
            Export
          </Button>

          <IconButton>
            <NotificationsNone />
          </IconButton>

          <Avatar
            sx={{
              bgcolor: "#F08C24",
              fontWeight: 700,
            }}
          >
            M
          </Avatar>
        </Grid>
      </Grid>
    </Paper>
  );
}
