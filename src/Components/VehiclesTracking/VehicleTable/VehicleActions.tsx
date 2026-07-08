"use client";
import React from "react";
import { IconButton, Stack, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavigationIcon from "@mui/icons-material/Navigation";
import { Vehicle } from "@/types/vehicle";
interface Props {
  vehicle: Vehicle;
  onView: (vehicle: Vehicle) => void;
  onTrack: (vehicle: Vehicle) => void;
}

export default function VehicleActions({ vehicle, onView, onTrack }: Props) {
  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="View Details">
        <IconButton
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            onView(vehicle);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Track Vehicle">
        <IconButton
          size="small"
          color="success"
          onClick={(e) => {
            e.stopPropagation();
            onTrack(vehicle);
          }}
        >
          <NavigationIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
