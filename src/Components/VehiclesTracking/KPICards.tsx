"use client";

import React from "react";
import { Card, Grid, Typography, alpha } from "@mui/material";
import {
  LocalShipping,
  DirectionsCarFilled,
  PauseCircleFilled,
  StopCircle,
} from "@mui/icons-material";
// import { Vehicle } from "../types/vehicle";
import { Vehicle } from "../../types/vehicle";

interface Props {
  vehicles: Vehicle[];
}

export default function KPICards({ vehicles }: Props) {
  const total = vehicles.length;

  const moving = vehicles.filter((v) => v.status === "Moving").length;

  const idle = vehicles.filter((v) => v.status === "Idle").length;

  const stopped = vehicles.filter((v) => v.status === "Stopped").length;

  const cards = [
    {
      title: "Total Vehicles",
      value: total,
      color: "#2563eb",
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
    },
    {
      title: "Moving",
      value: moving,
      color: "#16a34a",
      icon: <DirectionsCarFilled sx={{ fontSize: 40 }} />,
    },
    {
      title: "Idle",
      value: idle,
      color: "#F08C24",
      icon: <PauseCircleFilled sx={{ fontSize: 40 }} />,
    },
    {
      title: "Stopped",
      value: stopped,
      color: "#ef4444",
      icon: <StopCircle sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Grid
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          lg: "repeat(4,1fr)",
        },
        gap: 3,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.title}
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          <Grid
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <div>
              <Typography color="text.secondary" fontSize={14}>
                {card.title}
              </Typography>

              <Typography mt={1} fontWeight={800} fontSize={34}>
                {card.value}
              </Typography>
            </div>

            <Grid
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: alpha(card.color, 0.15),
                color: card.color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {card.icon}
            </Grid>
          </Grid>
        </Card>
      ))}
    </Grid>
  );
}
