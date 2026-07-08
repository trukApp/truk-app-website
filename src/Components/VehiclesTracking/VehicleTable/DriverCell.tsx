"use client";

import React from "react";

import {
 Grid,
  Stack,
  Typography,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";

import { Vehicle } from "@/types/vehicle";

interface Props {
  vehicle: Vehicle;
}

export default function DriverCell({
  vehicle,
}: Props) {
  return (
    <Grid>
      <Typography
        fontWeight={600}
        fontSize={14}
      >
        {vehicle.driverName}
      </Typography>

      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
      >
        <PhoneIcon
          sx={{
            fontSize: 14,
            color: "#9ca3af",
          }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {vehicle.driverPhone}
        </Typography>
      </Stack>
    </Grid>
  );
}