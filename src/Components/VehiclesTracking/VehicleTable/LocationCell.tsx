"use client";
import React from "react";
import { Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Props {
  location: string;
}

export default function LocationCell({ location }: Props) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <LocationOnIcon
        sx={{
          color: "#ef4444",
          fontSize: 18,
        }}
      />

      <Typography fontSize={13} noWrap>
        {location}
      </Typography>
    </Stack>
  );
}
