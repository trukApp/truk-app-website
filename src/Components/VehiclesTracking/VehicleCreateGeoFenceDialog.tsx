"use client";

import React, { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { Vehicle } from "@/types/vehicle";
import {
  useCreateNewGeofenchingMutation,
  useEditGeoFenchingByIDMutation,
} from "@/api/apiSlice";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   vehicle: Vehicle | null;
// }

interface FormData {
  vehicle_ID: string;
  vehicle_number: string;
  geofence_name: string;
  center_lat: string;
  center_lng: string;
  radius_m: string;
  handler_email: string;
  notify_on_entry: boolean;
  notify_on_exit: boolean;
}
interface GeoFence {
  geofence_id: number;
  geofence_code: string;
  vehicle_ID: string;
  vehicle_number: string;
  geofence_name: string;
  center_lat: string;
  center_lng: string;
  radius_m: number;
  handler_email: string;
  notify_on_entry: number;
  notify_on_exit: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  mode: "create" | "edit";
  initialData?: GeoFence | null;
}

export default function VehicleCreateGeoFenceDialog({
  open,
  onClose,
  vehicle,
  mode,
  initialData = null,
}: Props) {
  const [createGeoFence, { isLoading: creating }] =
    useCreateNewGeofenchingMutation();

  const [updateGeoFence, { isLoading: updating }] =
    useEditGeoFenchingByIDMutation();

  const isLoading = creating || updating;

  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    vehicle_ID: "",
    vehicle_number: "",
    geofence_name: "",
    center_lat: "",
    center_lng: "",
    radius_m: "500",
    handler_email: "",
    notify_on_entry: true,
    notify_on_exit: false,
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setForm({
        vehicle_ID: initialData.vehicle_ID,
        vehicle_number: initialData.vehicle_number,
        geofence_name: initialData.geofence_name,
        center_lat: initialData.center_lat,
        center_lng: initialData.center_lng,
        radius_m: initialData.radius_m.toString(),
        handler_email: initialData.handler_email,
        notify_on_entry: initialData.notify_on_entry === 1,
        notify_on_exit: initialData.notify_on_exit === 1,
      });

      return;
    }

    if (vehicle) {
      setForm({
        vehicle_ID: vehicle.vehicleNumber,
        vehicle_number: vehicle.vehicleNumber,
        geofence_name: "",
        center_lat: vehicle.latitude.toString(),
        center_lng: vehicle.longitude.toString(),
        radius_m: "500",
        handler_email: "",
        notify_on_entry: true,
        notify_on_exit: false,
      });
    }
  }, [open, vehicle, initialData, mode]);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.geofence_name.trim()) {
      setError("Geo Fence Name is required.");
      return;
    }

    if (!form.center_lat) {
      setError("Latitude is required.");
      return;
    }

    if (!form.center_lng) {
      setError("Longitude is required.");
      return;
    }

    if (!form.handler_email) {
      setError("Handler Email is required.");
      return;
    }

    try {
      //   await createGeoFence({
      //     vehicle_ID: form.vehicle_ID,
      //     vehicle_number: form.vehicle_number,
      //     geofence_name: form.geofence_name,
      //     center_lat: Number(form.center_lat),
      //     center_lng: Number(form.center_lng),
      //     radius_m: Number(form.radius_m),
      //     handler_email: form.handler_email,
      //     notify_on_entry: form.notify_on_entry ? 1 : 0,
      //     notify_on_exit: form.notify_on_exit ? 1 : 0,
      //   }).unwrap();
      const payload = {
        vehicle_ID: form.vehicle_ID,
        vehicle_number: form.vehicle_number,
        geofence_name: form.geofence_name,
        center_lat: Number(form.center_lat),
        center_lng: Number(form.center_lng),
        radius_m: Number(form.radius_m),
        handler_email: form.handler_email,
        notify_on_entry: form.notify_on_entry ? 1 : 0,
        notify_on_exit: form.notify_on_exit ? 1 : 0,
      };

      if (mode === "create") {
        await createGeoFence(payload).unwrap();
      } else {
        await updateGeoFence({
          geofenceId: initialData!.geofence_code,
          body: payload,
        }).unwrap();
      }
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to create or update Geo Fence.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>
          {mode === "create" ? "Create Geo Fence" : "Update Geo Fence"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle ID"
                value={form.vehicle_ID}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Number"
                value={form.vehicle_number}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Geo Fence Name"
                value={form.geofence_name}
                onChange={(e) => handleChange("geofence_name", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Latitude"
                value={form.center_lat}
                onChange={(e) => handleChange("center_lat", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Longitude"
                value={form.center_lng}
                onChange={(e) => handleChange("center_lng", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Radius (Meters)"
                value={form.radius_m}
                onChange={(e) => handleChange("radius_m", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Handler Email"
                value={form.handler_email}
                onChange={(e) => handleChange("handler_email", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.notify_on_entry}
                    onChange={(e) =>
                      handleChange("notify_on_entry", e.target.checked)
                    }
                  />
                }
                label="Notify on Entry"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.notify_on_exit}
                    onChange={(e) =>
                      handleChange("notify_on_exit", e.target.checked)
                    }
                  />
                }
                label="Notify on Exit"
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>

        {/* <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Geo Fence"}
        </Button> */}
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
              ? "Create Geo Fence"
              : "Update Geo Fence"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
