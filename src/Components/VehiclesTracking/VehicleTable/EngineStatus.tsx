"use client";

import React from "react";

import { Chip } from "@mui/material";

import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

interface Props {
  engineOn: boolean;
}

export default function EngineStatus({ engineOn }: Props) {
  return (
    <Chip
      icon={<PowerSettingsNewIcon />}
      label={engineOn ? "Engine ON" : "Engine OFF"}
      sx={{
        bgcolor: engineOn ? "#dcfce7" : "#fee2e2",

        color: engineOn ? "#166534" : "#991b1b",

        fontWeight: 700,

        borderRadius: "8px",
      }}
    />
  );
}
