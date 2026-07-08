"use client";
import React from "react";
import { Card, Grid, Typography } from "@mui/material";
import FleetPanel from "./FleetPanel";
import MapContainer from "./MapContainer";
import { Vehicle } from "@/types/vehicle";

interface Props {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle | null) => void;
}

// export default function VehicleMap({ vehicles }: Props) {
export default function VehicleMap({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}: Props) {
  // const handleVehicleSelection = (vehicle: Vehicle) => {
  //   // Clicking the selected vehicle again deselects it
  //   if (selectedVehicle && selectedVehicle.id === vehicle.id) {
  //     setSelectedVehicle(null);
  //     return;
  //   }

  //   setSelectedVehicle(vehicle);
  // };

  if (!vehicles.length) {
    return (
      <Card
        sx={{
          mt: 3,
          p: 5,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6">No Vehicles Available</Typography>

        <Typography color="text.secondary" mt={1}>
          Waiting for live GPS data...
        </Typography>
      </Card>
    );
  }

  return (
    <Grid
      container
      spacing={3}
      sx={{
        mt: 2,
      }}
    >
      {/* Fleet */}

      <Grid item xs={12} lg={4}>
        {/* <FleetPanel
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={handleVehicleSelection}
        /> */}
        <FleetPanel
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={onSelectVehicle}
        />
      </Grid>

      {/* Map */}

      <Grid item xs={12} lg={8}>
        <Card
          sx={{
            height: "75vh",
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}

          <Grid
            sx={{
              p: 2,
              bgcolor: "#F8FAFC",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Live Vehicle Map
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Showing{" "}
              {selectedVehicle ? selectedVehicle.vehicleNumber : "All Vehicles"}
            </Typography>
          </Grid>

          {/* Google Map */}

          <Grid
            sx={{
              flex: 1,
            }}
          >
            {/* <MapContainer
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={handleVehicleSelection}
            /> */}
            <MapContainer
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={onSelectVehicle}
            />
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
