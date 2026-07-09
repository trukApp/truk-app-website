/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Typography,
  Box,
} from "@mui/material";

import { Vehicle } from "@/types/vehicle";
import { useGetVehicleGeoFenchingDetailsQuery } from "@/api/apiSlice";
import VehicleCreateGeoFenceDialog from "./VehicleCreateGeoFenceDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export interface GeoFence {
  geofence_id: number;
  geofence_code: string;
  vehicle_ID: string;
  vehicle_number: string;
  geofence_name: string;
  center_lat: string;
  center_lng: string;
  radius_m: number;
  handler_email: string;
  active: number;
  notify_on_entry: number;
  notify_on_exit: number;
  last_inside: number;
  last_alert_sent_at: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export default function VehicleGeoFenceDialog({
  open,
  onClose,
  vehicle,
}: Props) {
  const { data, isLoading } = useGetVehicleGeoFenchingDetailsQuery(
    { vehicle_ID: vehicle?.vehicleNumber ?? "" },
    { skip: !open || !vehicle },
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [selectedGeoFence, setSelectedGeoFence] = useState<any>(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Grid
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Geo Fences - {vehicle?.vehicleNumber}
          <Button
            variant="contained"
            onClick={() => {
              setMode("create");
              setSelectedGeoFence(null);
              setCreateDialogOpen(true);
            }}
          >
            Create New
          </Button>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Grid display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Grid>
        ) : data?.geofences?.length ? (
          <Grid container spacing={2}>
            {data.geofences.map((fence) => (
              <Grid item xs={12} md={6} key={fence.geofence_id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                  }}
                >
                  <Typography color="text.primary" pl={2} mt={1}>
                    Geo Fence Name:{" "}
                    <Box component="span" fontWeight={600} color="#000">
                      {fence.geofence_name}
                    </Box>
                  </Typography>
                  <CardContent>
                    <Grid container spacing={0}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Vehicle
                        </Typography>
                        <Typography fontWeight={600}>
                          {fence.vehicle_number}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Radius
                        </Typography>
                        <Typography fontWeight={600}>
                          {fence.radius_m} m
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Latitude
                        </Typography>
                        <Typography fontWeight={600}>
                          {fence.center_lat}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Longitude
                        </Typography>
                        <Typography fontWeight={600}>
                          {fence.center_lng}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Handler Email
                        </Typography>
                        <Typography fontWeight={600}>
                          {fence.handler_email}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Entry Alert
                        </Typography>
                        <br />
                        <Chip
                          size="small"
                          label={fence.notify_on_entry ? "Enabled" : "Disabled"}
                          color={fence.notify_on_entry ? "success" : "default"}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Exit Alert
                        </Typography>
                        <br />
                        <Chip
                          size="small"
                          label={fence.notify_on_exit ? "Enabled" : "Disabled"}
                          color={fence.notify_on_exit ? "warning" : "default"}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Current Status
                        </Typography>
                        <br />
                        <Chip
                          size="small"
                          label={fence.last_inside ? "Inside" : "Outside"}
                          color={fence.last_inside ? "primary" : "error"}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Status
                        </Typography>
                        <br />
                        <Chip
                          size="small"
                          label={fence.active ? "Active" : "Inactive"}
                          color={fence.active ? "success" : "default"}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Created
                        </Typography>
                        <Typography variant="body2">
                          {new Date(fence.created_at).toLocaleString()}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Updated
                        </Typography>
                        <Typography variant="body2">
                          {new Date(fence.updated_at).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Divider />

                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        setMode("edit");
                        setSelectedGeoFence(fence);
                        setCreateDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" py={5}>
            No Geo Fences Found
          </Typography>
        )}
      </DialogContent>
      <VehicleCreateGeoFenceDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        vehicle={vehicle}
        mode={mode}
        initialData={selectedGeoFence}
      />
    </Dialog>
  );
}
