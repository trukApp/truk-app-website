"use client";
import React, { useMemo, useRef, useState } from "react";
import { Backdrop, CircularProgress, Grid, Alert } from "@mui/material";
import DashboardHeader from "@/Components/VehiclesTracking/DashboardHeader";
import KPICards from "@/Components/VehiclesTracking/KPICards";
import SearchBar from "@/Components/VehiclesTracking/SearchBar";
import VehicleMap from "@/Components/VehiclesTracking/VehicleMap";
import VehicleTable from "@/Components/VehiclesTracking/VehicleTable";
import ActivityTimeline from "@/Components/VehiclesTracking/ActivityTimeline";

import { useGetVehicleTrackingQuery } from "@/api/apiSlice";
import { mapVehicleData } from "@/utils/mapVehicleData";
import { Vehicle } from "@/types/vehicle";

export default function TrackingPage() {
  const { data, isLoading, error } = useGetVehicleTrackingQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  console.log("data", data);

  const mapRef = useRef<HTMLDivElement>(null);

  const handleTrackVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);

    mapRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const vehicles = useMemo(() => {
    if (!data) return [];

    return mapVehicleData(data);
  }, [data]);

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Failed to fetch vehicle tracking data.
      </Alert>
    );
  }

  return (
    <>
      <Backdrop
        open={isLoading}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid
        sx={{
          mx: {
            xs: 1,
            md: 3,
          },
          my: 2,
        }}
      >
        <DashboardHeader totalVehicles={vehicles.length} />
        <KPICards vehicles={vehicles} />
        <SearchBar value="" onChange={() => {}} />
        {/* <VehicleMap
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={setSelectedVehicle}
        />

        <VehicleTable vehicles={vehicles} onTrackVehicle={setSelectedVehicle} /> */}
        <div ref={mapRef}>
          <VehicleMap
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={setSelectedVehicle}
          />
        </div>

        <VehicleTable vehicles={vehicles} onTrackVehicle={handleTrackVehicle} />
        <Grid mt={3}>
          <ActivityTimeline vehicles={vehicles} />
        </Grid>
      </Grid>
    </>
  );
}
