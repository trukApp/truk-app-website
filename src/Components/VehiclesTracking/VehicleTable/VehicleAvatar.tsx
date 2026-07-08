"use client";

import React from "react";
import { Avatar, Grid, Stack, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Vehicle } from "@/types/vehicle";

interface Props {
  vehicle: Vehicle;
}

export default function VehicleAvatar({ vehicle }: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        sx={{
          bgcolor: "#F08C24",
          width: 42,
          height: 42,
        }}
      >
        <LocalShippingIcon fontSize="small" />
      </Avatar>

      <Grid>
        <Typography fontWeight={700} fontSize={14}>
          {vehicle.vehicleNumber}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Truck
        </Typography>
      </Grid>
    </Stack>
  );
}
