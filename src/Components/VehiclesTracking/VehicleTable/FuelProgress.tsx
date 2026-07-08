"use client";

import React from "react";

import { Grid, LinearProgress, Typography } from "@mui/material";

interface Props {
  value: number;
}

export default function FuelProgress({ value }: Props) {
  const color = value > 60 ? "#22c55e" : value > 30 ? "#F08C24" : "#ef4444";

  return (
    <Grid width="100%">
      <Typography variant="caption" fontWeight={700}>
        {value}%
      </Typography>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          mt: 0.5,
          height: 8,
          borderRadius: 5,

          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
          },
        }}
      />
    </Grid>
  );
}
