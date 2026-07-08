"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { CircularProgress, Grid } from "@mui/material";
import { Vehicle } from "@/types/vehicle";
import MapMarkers from "./MapMarkers";

interface Props {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle | null) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];

const DEFAULT_CENTER = {
  lat: 17.385,
  lng: 78.4867,
};

export default function MapContainer({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "vehicle-tracking-map",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const defaultCenter = useMemo(() => {
    if (selectedVehicle) {
      return {
        lat: selectedVehicle.latitude,
        lng: selectedVehicle.longitude,
      };
    }

    if (vehicles.length) {
      return {
        lat: vehicles[0].latitude,
        lng: vehicles[0].longitude,
      };
    }

    return DEFAULT_CENTER;
  }, [selectedVehicle, vehicles]);

  useEffect(() => {
    if (!mapRef.current || !vehicles.length) return;

    // Vehicle selected
    if (selectedVehicle) {
      mapRef.current.panTo({
        lat: selectedVehicle.latitude,
        lng: selectedVehicle.longitude,
      });

      mapRef.current.setZoom(16);

      return;
    }

    // No vehicle selected -> Show all vehicles
    const bounds = new google.maps.LatLngBounds();

    vehicles.forEach((vehicle) => {
      bounds.extend({
        lat: vehicle.latitude,
        lng: vehicle.longitude,
      });
    });

    mapRef.current.fitBounds(bounds, 80);

    // Prevent excessive zoom if vehicles are close together
    google.maps.event.addListenerOnce(mapRef.current, "bounds_changed", () => {
      if (mapRef.current && mapRef.current.getZoom()! > 15) {
        mapRef.current.setZoom(15);
      }
    });
  }, [selectedVehicle, vehicles]);

  if (loadError) {
    return (
      <Grid
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        Failed to load Google Maps
      </Grid>
    );
  }

  if (!isLoaded) {
    return (
      <Grid
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      options={{
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: true,
        zoomControl: true,
        clickableIcons: false,
        gestureHandling: "greedy",
      }}
    >
      <MapMarkers
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={onSelectVehicle}
      />
    </GoogleMap>
  );
}
