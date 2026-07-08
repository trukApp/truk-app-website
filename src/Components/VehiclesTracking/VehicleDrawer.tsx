"use client";

import React from "react";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  Close,
  DirectionsCar,
  Person,
  Phone,
  Speed,
  LocationOn,
  LocalGasStation,
  Route,
  AccessTime,
  PowerSettingsNew,
  PlayArrow,
  Stop,
  Update,
} from "@mui/icons-material";

import { Vehicle } from "@/types/vehicle";

interface Props {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

const statusColor = (status: string) => {
  switch (status) {
    case "Moving":
      return "#22c55e";

    case "Idle":
      return "#F08C24";

    default:
      return "#ef4444";
  }
};

const InfoCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) => (
  <Grid
    sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: "#F8FAFC",
      border: "1px solid #e5e7eb",
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        sx={{
          bgcolor: "#F08C24",
        }}
      >
        {icon}
      </Avatar>

      <Grid>
        <Typography fontSize={13} color="text.secondary">
          {title}
        </Typography>

        <Typography fontWeight={700}>{value}</Typography>
      </Grid>
    </Stack>
  </Grid>
);

export default function VehicleDrawer({ open, onClose, vehicle }: Props) {
  if (!vehicle) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Grid
        sx={{
          width: 430,
          height: "100%",
          bgcolor: "#fff",
          overflowY: "auto",
        }}
      >
        {/* Header */}

        <Grid
          sx={{
            bgcolor: "#0f172a",
            color: "#fff",
            p: 3,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight={700}>
              Vehicle Details
            </Typography>

            <IconButton
              onClick={onClose}
              sx={{
                color: "#fff",
              }}
            >
              <Close />
            </IconButton>
          </Stack>

          <Typography mt={2} fontSize={28} fontWeight={700}>
            {vehicle.vehicleNumber}
          </Typography>

          <Chip
            label={vehicle.status}
            sx={{
              mt: 2,
              bgcolor: statusColor(vehicle.status),
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </Grid>

        {/* Body */}

        <Stack spacing={2} p={3}>
          <InfoCard
            icon={<DirectionsCar />}
            title="Vehicle Number"
            value={vehicle.vehicleNumber}
          />

          {/* <InfoCard
            icon={<Person />}
            title="Driver"
            value={vehicle.driverName}
          />

          <InfoCard
            icon={<Phone />}
            title="Driver Phone"
            value={vehicle.driverPhone}
          /> */}

          <InfoCard
            icon={<Speed />}
            title="Current Speed"
            value={`${vehicle.speed} km/h`}
          />

          <InfoCard
            icon={<LocationOn />}
            title="Current Location"
            value={vehicle.location}
          />

          <InfoCard
            icon={<Route />}
            title="Today's Distance"
            value={`${vehicle.todayDistance} km`}
          />

          <InfoCard
            icon={<AccessTime />}
            title="Current Idle Time"
            value={`${vehicle.idleTime} mins`}
          />

          <InfoCard
            icon={<PlayArrow />}
            title="Last Started"
            value={vehicle.lastStartedAt}
          />

          <InfoCard
            icon={<Stop />}
            title="Power Status"
            value={vehicle.powerStatus}
          />

          <InfoCard
            icon={<Update />}
            title="Last Updated"
            value={vehicle.lastUpdated}
          />

          {/* Fuel */}

          <Grid
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "#F8FAFC",
              border: "1px solid #e5e7eb",
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "#F08C24",
                    }}
                  >
                    <LocalGasStation />
                  </Avatar>

                  <Typography fontWeight={700}>Fuel Level</Typography>
                </Stack>

                <Typography fontWeight={700}>{vehicle.fuelLevel}%</Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={vehicle.fuelLevel}
                sx={{
                  height: 10,
                  borderRadius: 10,
                }}
              />
            </Stack>
          </Grid>

          {/* Engine */}

          <Grid
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "#F8FAFC",
              border: "1px solid #e5e7eb",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: vehicle.engineOn ? "#22c55e" : "#ef4444",
                }}
              >
                <PowerSettingsNew />
              </Avatar>

              <Grid>
                <Typography fontSize={13} color="text.secondary">
                  Engine Status
                </Typography>

                <Typography fontWeight={700}>
                  {vehicle.engineOn ? "Engine ON" : "Engine OFF"}
                </Typography>
              </Grid>
            </Stack>
          </Grid>

          <Divider />

          <Typography color="text.secondary" textAlign="center" fontSize={13}>
            AI Logistics Control Tower • Live Vehicle Monitoring
          </Typography>
        </Stack>
      </Grid>
    </Drawer>
  );
}
