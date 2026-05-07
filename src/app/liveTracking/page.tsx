/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

import {
  Box,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Paper,
  Stack,
  Chip,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import { useGetLiveTrackingQuery } from "@/api/apiSlice";
import { useSearchParams } from "next/navigation";


/* ---------------- TYPES ---------------- */

type Vehicle = {
  order_ID: string;
  tracking_status: string;
  device_id: string | null;
  last_updated: string | null;

  current_position: {
    latitude: string;
    longitude: string;
    speed: string;
    recorded_at: string;
  } | null;

  next_stop?: {
    loc_ID: string;
    radius_m: number;
    status: string;
    stop_no: number;
  };
};

type RoutePoint = {
  lat: number;
  lng: number;
};

type Allocation = {
  route: {
    start: {
      latitude: number;
      longitude: number;
      address: string;
    };

    end: {
      latitude: number;
      longitude: number;
      address: string;
    };

    distance: string;
    duration: string;
  }[];
};

/* ---------------- CONFIG ---------------- */

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

/* IMPORTANT:
   Use SAME libraries everywhere in app
*/
// const GOOGLE_LIBRARIES: ("places")[] = ["places"];
const GOOGLE_LIBRARIES: ("places")[] = ["places"];

/* ---------------- HELPERS ---------------- */

const getBearing = (a: RoutePoint, b: RoutePoint) => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const toDeg = (v: number) => (v * 180) / Math.PI;

  const y =
    Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));

  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.cos(toRad(b.lng - a.lng));

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

const lerp = (a: number, b: number, t: number) =>
  a + (b - a) * t;

/* ---------------- COMPONENT ---------------- */

const LiveTracking: React.FC = () => {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_ID") || "";

  /* ---------------- GOOGLE MAPS ---------------- */

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_LIBRARIES,
  });

  /* ---------------- REFS ---------------- */

  const mapRef = useRef<google.maps.Map | null>(null);

  /* ---------------- STATES ---------------- */

  const [allocation, setAllocation] =
    useState<Allocation | null>(null);

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [vehiclePath, setVehiclePath] = useState<RoutePoint[]>([]);

  const [center, setCenter] =
    useState<RoutePoint | null>(null);

  const [animatedPos, setAnimatedPos] =
    useState<RoutePoint | null>(null);

  const [bearing, setBearing] = useState(0);

  const [autoCenter, setAutoCenter] = useState(true);

  const [stopReached, setStopReached] = useState(false);

  const [modifyOpen, setModifyOpen] = useState(false);

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const [selectedRouteIndex, setSelectedRouteIndex] =
    useState(0);

  /* ---------------- API ---------------- */

  const {
    data,
    isLoading,
    error,
  } = useGetLiveTrackingQuery(
    { orderId },
    {
      pollingInterval: 10000,
    }
  );

  console.log("LIVE TRACKING:", data);

  /* ---------------- LOAD ALLOCATION ---------------- */

  useEffect(() => {
    const stored = localStorage.getItem("allocationData");

    if (stored) {
      setAllocation(JSON.parse(stored));
    }
  }, []);

  /* ---------------- LIVE TRACKING EFFECT ---------------- */

  useEffect(() => {
    if (!data?.current_position) return;

    const point: RoutePoint = {
      lat: Number(data.current_position.latitude),
      lng: Number(data.current_position.longitude),
    };

    setVehicle(data);

    setVehiclePath((prev) => [
      ...prev.slice(-200),
      point,
    ]);

    /* FIRST LOAD */

    if (!center) {
      setCenter(point);

      if (mapRef.current) {
        mapRef.current.setZoom(14);
      }
    }

    /* FIRST MARKER */

    if (!animatedPos) {
      setAnimatedPos(point);
      return;
    }

    /* NO MOVEMENT */

    if (
      animatedPos.lat === point.lat &&
      animatedPos.lng === point.lng
    ) {
      return;
    }

    setBearing(getBearing(animatedPos, point));

    let t = 0;

    const animate = () => {
      t += 0.12;

      setAnimatedPos((prev) =>
        prev
          ? {
              lat: lerp(prev.lat, point.lat, t),
              lng: lerp(prev.lng, point.lng, t),
            }
          : point
      );

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    if (autoCenter && mapRef.current) {
      mapRef.current.panTo(point);
    }
  }, [animatedPos, autoCenter, center, data]);


  if (!isLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography>Loading Google Maps...</Typography>
      </Box>
    );
  }

  /* ---------------- ALLOCATION MISSING ---------------- */

  if (!allocation) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
        <Typography variant="h5">
          No Allocation Data Found
        </Typography>
      </Paper>
    );
  }

  /* ---------------- TRACKING NOT STARTED ---------------- */

  if (!data?.current_position) {
    return (
      <Paper
        sx={{
          p: 5,
          mt: 4,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Trip Not Started Yet
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Live vehicle tracking will appear once the
          driver starts the trip and GPS data becomes
          available.
        </Typography>

        <Box mt={3}>
          <Chip
            label={`Tracking Status: ${
              data?.tracking_status || "Pending"
            }`}
            color="warning"
          />
        </Box>
      </Paper>
    );
  }

  /* ---------------- ROUTE DATA ---------------- */

  const origin = allocation.route[0].start;

  const destination =
    allocation.route[allocation.route.length - 1].end;

  const waypoints: google.maps.DirectionsWaypoint[] =
    allocation.route.slice(0, -1).map((r) => ({
      location: {
        lat: r.end.latitude,
        lng: r.end.longitude,
      },
      stopover: true,
    }));

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* STOP DIALOG */}

      <Dialog
        open={stopReached}
        onClose={() => setStopReached(false)}
      >
        <DialogTitle>Stop Reached</DialogTitle>

        <DialogContent>
          Reached Stop {vehicle?.next_stop?.stop_no}
        </DialogContent>
      </Dialog>

      {/* ROUTE OPTIONS */}

      <Dialog
        open={modifyOpen}
        onClose={() => setModifyOpen(false)}
        fullWidth
      >
        <DialogTitle>
          Select Alternate Route
        </DialogTitle>

        <DialogContent>
          {directions?.routes.map((r, idx) => (
            <Card
              key={idx}
              sx={{
                mb: 2,
                cursor: "pointer",
                border:
                  selectedRouteIndex === idx
                    ? "2px solid #f57c00"
                    : "1px solid #ddd",
              }}
              onClick={() =>
                setSelectedRouteIndex(idx)
              }
            >
              <CardContent>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={`Route ${idx + 1}`}
                  />

                  <Chip
                    label={`${(
                      r.legs.reduce(
                        (a, l) =>
                          a + (l.distance?.value ?? 0),
                        0
                      ) / 1000
                    ).toFixed(1)} km`}
                  />

                  <Chip
                    label={`${(
                      r.legs.reduce(
                        (a, l) =>
                          a + (l.duration?.value ?? 0),
                        0
                      ) / 3600
                    ).toFixed(1)} hrs`}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
      </Dialog>

      {/* MAIN GRID */}

      <Grid container spacing={2}>
        {/* LEFT PANEL */}

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
              Trip Details
            </Typography>

            {/* START */}

            <Stack
              direction="row"
              spacing={1}
              mt={2}
            >
              <Chip
                color="success"
                label="START"
              />

              <Typography variant="body2">
                {origin.address}
              </Typography>
            </Stack>

            {/* STOPS */}

            <Typography
              variant="subtitle1"
              mt={2}
            >
              Stops
            </Typography>

            {allocation.route.map((r, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={1}
                mt={1}
              >
                <Chip label={`Stop ${i + 1}`} />

                <Typography variant="body2">
                  {r.end.address}
                </Typography>
              </Stack>
            ))}

            {/* DESTINATION */}

            <Stack
              direction="row"
              spacing={1}
              mt={2}
            >
              <Chip
                color="error"
                label="DESTINATION"
              />

              <Typography variant="body2">
                {destination.address}
              </Typography>
            </Stack>

            {/* CONTROLS */}

            <Box mt={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoCenter}
                    onChange={(e) =>
                      setAutoCenter(
                        e.target.checked
                      )
                    }
                  />
                }
                label="Auto Center"
              />

              <Button
                sx={{ mt: 2 }}
                fullWidth
                variant="contained"
                color="warning"
                onClick={() =>
                  setModifyOpen(true)
                }
              >
                Alternate Routes
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* MAP */}

        <Grid item xs={12} md={8}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center!}
            zoom={14}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {/* DIRECTIONS */}

            {!directions && (
              <DirectionsService
                options={{
                  origin: {
                    lat: origin.latitude,
                    lng: origin.longitude,
                  },

                  destination: {
                    lat: destination.latitude,
                    lng: destination.longitude,
                  },

                  waypoints,

                  travelMode:
                    google.maps.TravelMode.DRIVING,

                  provideRouteAlternatives: true,
                }}
                callback={(res) => {
                  if (res) {
                    setDirections(res);
                  }
                }}
              />
            )}

            {/* ROUTE RENDER */}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                routeIndex={selectedRouteIndex}
                options={{
                  suppressMarkers: true,
                }}
              />
            )}

            {/* STOP MARKERS */}

            {allocation.route.map((r, i) => (
              <Marker
                key={i}
                position={{
                  lat: r.end.latitude,
                  lng: r.end.longitude,
                }}
                label={`${i + 1}`}
              />
            ))}

            {/* START */}

            <Marker
              position={{
                lat: origin.latitude,
                lng: origin.longitude,
              }}
              icon="https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />

            {/* END */}

            <Marker
              position={{
                lat: destination.latitude,
                lng: destination.longitude,
              }}
              icon="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            />

            {/* PATH */}

            {vehiclePath.length > 1 && (
              <Polyline
                path={vehiclePath}
                options={{
                  strokeColor: "#d32f2f",
                  strokeWeight: 5,
                }}
              />
            )}

            {/* VEHICLE */}

            {animatedPos && (
              <Marker
                position={animatedPos}
                icon={{
                  url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
                  scaledSize:
                    new google.maps.Size(40, 40),
                }}
              />
            )}
          </GoogleMap>
        </Grid>
      </Grid>
    </>
  );
};

export default LiveTracking;