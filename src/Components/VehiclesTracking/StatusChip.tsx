"use client";

import { Chip } from "@mui/material";
import { VehicleStatus } from "../../types/vehicle";

interface Props {
  status: VehicleStatus;
}

export default function StatusChip({ status }: Props) {
  const getColor = () => {
    switch (status) {
      case "Moving":
        return "#16a34a";

      case "Idle":
        return "#F08C24";

      default:
        return "#ef4444";
    }
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: getColor(),
        color: "#fff",
        fontWeight: 700,
        minWidth: 90,
      }}
    />
  );
}
