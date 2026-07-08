"use client";

import React from "react";
import {
  Avatar,
  Card,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Grid,
} from "@mui/material";
import { DirectionsCar, Circle } from "@mui/icons-material";
import { Vehicle } from "@/types/vehicle";
interface FleetPanelProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle | null) => void;
}
const getStatusColor = (status: string) => {
  switch (status) {
    case "Moving":
      return "#22c55e";

    case "Idle":
      return "#F08C24";

    case "Stopped":
      return "#ef4444";

    default:
      return "#64748b";
  }
};

export default function FleetPanel({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}: FleetPanelProps) {
  const moving = vehicles.filter((v) => v.status === "Moving").length;

  const idle = vehicles.filter((v) => v.status === "Idle").length;

  const stopped = vehicles.filter((v) => v.status === "Stopped").length;

  return (
    <Card
      sx={{
        height: "75vh",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}

      <Grid
        sx={{
          p: 2,
          bgcolor: "#0F172A",
          color: "#fff",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Fleet
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
          }}
        >
          {vehicles.length} Vehicles
        </Typography>
      </Grid>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Chip
          label={`Moving ${moving}`}
          sx={{
            bgcolor: "#22C55E",
            color: "#fff",
            fontWeight: 700,
          }}
        />

        <Chip
          label={`Idle ${idle}`}
          sx={{
            bgcolor: "#F08C24",
            color: "#fff",
            fontWeight: 700,
          }}
        />

        <Chip
          label={`Stopped ${stopped}`}
          sx={{
            bgcolor: "#EF4444",
            color: "#fff",
            fontWeight: 700,
          }}
        />
      </Stack>

      <Divider />

      {/* Vehicle List */}

      <List
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 0,
        }}
      >
        {vehicles.map((vehicle) => {
          const isSelected = selectedVehicle?.id === vehicle.id;

          return (
            <ListItemButton
              key={vehicle.id}
              selected={isSelected}
              onClick={() => onSelectVehicle(vehicle)}
              sx={{
                py: 2,
                transition: "0.25s",

                "&.Mui-selected": {
                  bgcolor: "#FFF7ED",
                  borderLeft: "5px solid #F08C24",
                },

                "&.Mui-selected:hover": {
                  bgcolor: "#FFF7ED",
                },

                "&:hover": {
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              <ListItemIcon>
                <Avatar
                  sx={{
                    bgcolor: getStatusColor(vehicle.status),
                  }}
                >
                  <DirectionsCar />
                </Avatar>
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography fontWeight={700} fontSize={15}>
                    {vehicle.vehicleNumber}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {vehicle.driverName}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 0.5,
                      }}
                    >
                      {vehicle.location}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: getStatusColor(vehicle.status),
                        fontWeight: 700,
                        display: "block",
                        mt: 0.5,
                      }}
                    >
                      {vehicle.status}
                    </Typography>
                  </>
                }
              />

              <Circle
                sx={{
                  color: getStatusColor(vehicle.status),
                  fontSize: 14,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );
}
