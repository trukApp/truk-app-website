"use client";

import React, { useMemo } from "react";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Chip,
  Grid,
} from "@mui/material";

import { PlayArrow, Pause, Stop } from "@mui/icons-material";

import { Vehicle } from "@/types/vehicle";

interface Props {
  vehicles: Vehicle[];
}

export default function ActivityTimeline({ vehicles }: Props) {
  const activities = useMemo(() => {
    return vehicles.map((vehicle) => {
      let event = "";
      let color = "";
      let icon = <Stop />;

      switch (vehicle.status) {
        case "Moving":
          event = "Started Moving";
          color = "#22C55E";
          icon = <PlayArrow />;
          break;

        case "Idle":
          event = "Vehicle Idle";
          color = "#F08C24";
          icon = <Pause />;
          break;

        default:
          event = "Vehicle Stopped";
          color = "#EF4444";
          icon = <Stop />;
      }

      return {
        id: vehicle.id,
        vehicleNumber: vehicle.vehicleNumber,
        // driverName: vehicle.driverName,
        location: vehicle.location,
        lastUpdated: vehicle.lastUpdated,
        event,
        color,
        icon,
      };
    });
  }, [vehicles]);

  return (
    <Card
      sx={{
        borderRadius: 4,
        p: 3,
        mt: 3,
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2}>
        Live Vehicle Activity
      </Typography>

      <List
        sx={{
          maxHeight: 500,
          overflowY: "auto",
        }}
      >
        {activities.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: item.color,
                  }}
                >
                  {item.icon}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Grid
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight={700}>
                      {item.vehicleNumber}
                    </Typography>

                    <Chip
                      size="small"
                      label={item.event}
                      sx={{
                        bgcolor: item.color,
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Grid>
                }
                secondary={
                  <>
                    {/* <Typography variant="body2" color="text.primary">
                      Driver : {item.driverName}
                    </Typography> */}

                    <Typography variant="body2" color="text.secondary">
                      📍 {item.location}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Last Updated : {item.lastUpdated}
                    </Typography>
                  </>
                }
              />
            </ListItem>

            {index !== activities.length - 1 && <Divider />}
          </React.Fragment>
        ))}

        {activities.length === 0 && (
          <Typography textAlign="center" py={5} color="text.secondary">
            No vehicle activity available.
          </Typography>
        )}
      </List>
    </Card>
  );
}
