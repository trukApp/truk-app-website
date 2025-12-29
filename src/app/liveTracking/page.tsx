/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   GoogleMap,
//   Marker,
//   Polyline,
//   useJsApiLoader,
//   DirectionsService,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import {
//   Box,
//   Grid,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Button,
//   Paper,
//   Stack,
//   Chip,
//   Card,
//   CardContent,
// } from "@mui/material";

// /* ---------------- TYPES ---------------- */

// type Vehicle = {
//   regNo: string;
//   status: string;
//   speed: number;
//   latitude: string;
//   longitude: string;
//   deviceId: string;
// };

// type RoutePoint = { lat: number; lng: number };

// type Allocation = {
//   route: {
//     start: { latitude: number; longitude: number; address: string };
//     end: { latitude: number; longitude: number; address: string };
//     distance: string;
//     duration: string;
//   }[];
// };

// /* ---------------- CONSTANTS ---------------- */

// const mapContainerStyle = { width: "100%", height: "600px" };
// const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
// const liveUrl = process.env.NEXT_PUBLIC_LIVE_TRACK_URL ?? "";
// const DEVIATION_THRESHOLD = 500; // meters

// /* ---------------- HELPERS ---------------- */

// const getDistanceMeters = (a: RoutePoint, b: RoutePoint) => {
//   const R = 6371000;
//   const toRad = (v: number) => (v * Math.PI) / 180;
//   const dLat = toRad(b.lat - a.lat);
//   const dLng = toRad(b.lng - a.lng);
//   const x =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(a.lat)) *
//     Math.cos(toRad(b.lat)) *
//     Math.sin(dLng / 2) ** 2;
//   return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
// };

// /* ---------------- COMPONENT ---------------- */

// const LiveTracking: React.FC = () => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: mapsKey,
//     libraries: ["places"],
//   });

//   const mapRef = useRef<google.maps.Map | null>(null);
//   const deviationTriggeredRef = useRef(false);

//   const [allocation, setAllocation] = useState<Allocation | null>(null);
//   const [vehicle, setVehicle] = useState<Vehicle | null>(null);
//   const [vehiclePath, setVehiclePath] = useState<RoutePoint[]>([]);
//   const [center, setCenter] = useState<RoutePoint | null>(null);

//   /* ---- Deviation ---- */
//   const [deviationOpen, setDeviationOpen] = useState(false);
//   const [deviationMeters, setDeviationMeters] = useState(0);

//   /* ---- Modify Route ---- */
//   const [modifyOpen, setModifyOpen] = useState(false);
//   const [directions, setDirections] =
//     useState<google.maps.DirectionsResult | null>(null);
//   const [selectedRouteIndex, setSelectedRouteIndex] =
//     useState<number | null>(0);

//   const deviceId = "867232055767934";

//   /* ---------- Load allocation ---------- */
//   useEffect(() => {
//     const stored = localStorage.getItem("allocationData");
//     if (stored) setAllocation(JSON.parse(stored));
//   }, []);

//   /* ---------- Live Tracking ---------- */
//   const fetchTracking = useCallback(async () => {
//     const res = await fetch(liveUrl);
//     const data: Vehicle[] = await res.json();
//     const v = data.find((d) => d.deviceId === deviceId);
//     if (!v) return;

//     const point = { lat: +v.latitude, lng: +v.longitude };
//     setVehicle(v);
//     setVehiclePath((p) => [...p.slice(-200), point]);
//     if (!center) setCenter(point);

//     if (directions?.routes?.[0]?.overview_path) {
//       const minDist = Math.min(
//         ...directions.routes[0].overview_path.map((p) =>
//           getDistanceMeters(point, { lat: p.lat(), lng: p.lng() })
//         )
//       );

//       if (minDist > DEVIATION_THRESHOLD && !deviationTriggeredRef.current) {
//         deviationTriggeredRef.current = true;
//         setDeviationMeters(minDist);
//         setDeviationOpen(true);
//       }
//     }
//   }, [center, directions]);

//   useEffect(() => {
//     fetchTracking();
//     const i = setInterval(fetchTracking, 5000);
//     return () => clearInterval(i);
//   }, [fetchTracking]);

//   /* ---------- Fit bounds ---------- */
//   const fitBounds = useCallback(
//     (map: google.maps.Map) => {
//       const bounds = new google.maps.LatLngBounds();
//       vehiclePath.forEach((p) => bounds.extend(p));
//       directions?.routes?.[0]?.overview_path.forEach((p) =>
//         bounds.extend(p)
//       );
//       if (!bounds.isEmpty()) map.fitBounds(bounds);
//     },
//     [vehiclePath, directions]
//   );

//   if (!isLoaded || !center || !allocation) return <p>Loading map…</p>;

//   const origin = allocation.route[0].start;
//   const destination = allocation.route[allocation.route.length - 1].end;

//   return (
//     <>
//       {/* 🚨 Deviation Alert */}
//       <Dialog open={deviationOpen} onClose={() => setDeviationOpen(false)}>
//         <DialogTitle>⚠️ Route Deviation</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Vehicle deviated by{" "}
//             <strong>{(deviationMeters / 1000).toFixed(2)} km</strong>
//           </Typography>
//           <Box mt={2} textAlign="right">
//             <Button variant="contained" onClick={() => setDeviationOpen(false)}>
//               OK
//             </Button>
//           </Box>
//         </DialogContent>
//       </Dialog>

//       {/* 🔁 Modify Route */}
//       <Dialog open={modifyOpen} onClose={() => setModifyOpen(false)} fullWidth>
//         <DialogTitle>Modify Route</DialogTitle>
//         <DialogContent>
//           {directions?.routes.map((r, idx) => (
//             <Card
//               key={idx}
//               sx={{
//                 mb: 1,
//                 cursor: "pointer",
//                 border:
//                   selectedRouteIndex === idx
//                     ? "2px solid #f57c00"
//                     : "1px solid #ddd",
//               }}
//               onClick={() => setSelectedRouteIndex(idx)}
//             >
//               <CardContent>
//                 <Stack direction="row" spacing={1}>
//                   <Chip label={`Route ${idx + 1}`} />
//                   <Chip label={r.legs[0].distance?.text ?? "—"} />
//                   <Chip label={r.legs[0].duration?.text ?? "—"} />
//                 </Stack>
//               </CardContent>
//             </Card>
//           ))}
//         </DialogContent>
//       </Dialog>

//       <Grid container spacing={2}>
//         {/* LEFT PANEL */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6">Tracking Details</Typography>

//             {vehicle && (
//               <>
//                 <Typography><b>Vehicle:</b> {vehicle.regNo}</Typography>
//                 <Typography><b>Status:</b> {vehicle.status}</Typography>
//                 <Typography><b>Speed:</b> {vehicle.speed} km/h</Typography>
//               </>
//             )}

//             <Box mt={2}>
//               <Typography fontWeight={600}>Stops</Typography>
//               {allocation.route.map((r, i) => (
//                 <Stack key={i} direction="row" spacing={1} mt={1}>
//                   <Chip label={`Stop ${i + 1}`} />
//                   <Typography variant="body2">{r.end.address}</Typography>
//                 </Stack>
//               ))}
//             </Box>

//             <Button
//               sx={{ mt: 2 }}
//               fullWidth
//               variant="contained"
//               color="warning"
//               onClick={() => {
//                 setDirections(null);
//                 setSelectedRouteIndex(0);
//                 setModifyOpen(true);
//               }}
//             >
//               Modify Route
//             </Button>
//           </Paper>
//         </Grid>

//         {/* MAP */}
//         <Grid item xs={12} md={8}>
//           <GoogleMap
//             mapContainerStyle={mapContainerStyle}
//             center={center}
//             zoom={8}
//             onLoad={(map) => {
//               mapRef.current = map;
//               fitBounds(map);
//             }}
//           >
//             {/* START PIN */}
//             <Marker
//               position={{
//                 lat: origin.latitude,
//                 lng: origin.longitude,
//               }}
//               label="S"
//               icon={{
//                 url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
//               }}
//             />

//             {/* GOOGLE SUGGESTED ROUTE */}
//             {!directions && (
//               <DirectionsService
//                 options={{
//                   origin: {
//                     lat: origin.latitude,
//                     lng: origin.longitude,
//                   },
//                   destination: {
//                     lat: destination.latitude,
//                     lng: destination.longitude,
//                   },
//                   travelMode: google.maps.TravelMode.DRIVING,
//                   provideRouteAlternatives: true,
//                 }}
//                 callback={(res) => res && setDirections(res)}
//               />
//             )}

//             {directions && (
//               <DirectionsRenderer
//                 directions={directions}
//                 routeIndex={selectedRouteIndex ?? 0}
//                 options={{
//                   suppressMarkers: true,
//                   polylineOptions: {
//                     strokeColor: "#1976d2",
//                     strokeWeight: 5,
//                   },
//                 }}
//               />
//             )}

//             {/* DEVIATED VEHICLE PATH */}
//             {vehiclePath.length > 1 && (
//               <Polyline
//                 path={vehiclePath}
//                 options={{
//                   strokeColor: "#d32f2f",
//                   strokeWeight: 6,
//                 }}
//               />
//             )}

//             {/* STOP MARKERS */}
//             {allocation.route.map((r, i) => (
//               <Marker
//                 key={i}
//                 position={{
//                   lat: r.end.latitude,
//                   lng: r.end.longitude,
//                 }}
//                 label={`${i + 1}`}
//               />
//             ))}

//             {/* VEHICLE MARKER */}
//             <Marker position={center} />
//           </GoogleMap>
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default LiveTracking;


"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
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
} from "@mui/material";

/* ---------------- TYPES ---------------- */

type Vehicle = {
  regNo: string;
  status: string;
  speed: number;
  latitude: string;
  longitude: string;
  deviceId: string;
};

type RoutePoint = { lat: number; lng: number };

type Allocation = {
  route: {
    start: { latitude: number; longitude: number; address: string };
    end: { latitude: number; longitude: number; address: string };
    distance: string;
    duration: string;
  }[];
};

/* ---------------- CONSTANTS ---------------- */

const mapContainerStyle = { width: "100%", height: "600px" };
const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const liveUrl = process.env.NEXT_PUBLIC_LIVE_TRACK_URL ?? "";
const DEVIATION_THRESHOLD = 500;

/* ---------------- HELPERS ---------------- */

const getDistanceMeters = (a: RoutePoint, b: RoutePoint) => {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) *
    Math.cos(toRad(b.lat)) *
    Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

/* ---------------- COMPONENT ---------------- */

const LiveTracking: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapsKey,
    libraries: ["places"],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const deviationTriggeredRef = useRef(false);

  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehiclePath, setVehiclePath] = useState<RoutePoint[]>([]);
  const [center, setCenter] = useState<RoutePoint | null>(null);

  /* ---- Deviation ---- */
  const [deviationOpen, setDeviationOpen] = useState(false);
  const [deviationMeters, setDeviationMeters] = useState(0);

  /* ---- Modify Route ---- */
  const [modifyOpen, setModifyOpen] = useState(false);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const deviceId = "867232055767934";

  /* ---------- Load allocation ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("allocationData");
    if (stored) setAllocation(JSON.parse(stored));
  }, []);

  /* ---------- Live Tracking ---------- */
  const fetchTracking = useCallback(async () => {
    const res = await fetch(liveUrl);
    const data: Vehicle[] = await res.json();
    const v = data.find((d) => d.deviceId === deviceId);
    if (!v) return;

    const point = { lat: +v.latitude, lng: +v.longitude };
    setVehicle(v);
    setVehiclePath((p) => [...p.slice(-200), point]);
    if (!center) setCenter(point);

    if (directions?.routes?.[0]?.overview_path) {
      const minDist = Math.min(
        ...directions.routes[0].overview_path.map((p) =>
          getDistanceMeters(point, { lat: p.lat(), lng: p.lng() })
        )
      );

      if (minDist > DEVIATION_THRESHOLD && !deviationTriggeredRef.current) {
        deviationTriggeredRef.current = true;
        setDeviationMeters(minDist);
        setDeviationOpen(true);
      }
    }
  }, [center, directions]);

  useEffect(() => {
    fetchTracking();
    const i = setInterval(fetchTracking, 5000);
    return () => clearInterval(i);
  }, [fetchTracking]);

  if (!isLoaded || !center || !allocation) return <p>Loading map…</p>;

  const origin = allocation.route[0].start;
  const destination = allocation.route[allocation.route.length - 1].end;

  /** 🔑 WAYPOINTS = ALL STOPS (except first start & final end) */
  const waypoints: google.maps.DirectionsWaypoint[] =
    allocation.route.slice(0, -1).map((r) => ({
      location: { lat: r.end.latitude, lng: r.end.longitude },
      stopover: true,
    }));

  return (
    <>
      {/* 🚨 Deviation Alert */}
      <Dialog open={deviationOpen} onClose={() => setDeviationOpen(false)}>
        <DialogTitle>⚠️ Route Deviation</DialogTitle>
        <DialogContent>
          <Typography>
            Deviated by{" "}
            <strong>{(deviationMeters / 1000).toFixed(2)} km</strong>
          </Typography>
          <Box mt={2} textAlign="right">
            <Button onClick={() => setDeviationOpen(false)} variant="contained">
              OK
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* 🔁 Modify Route */}
      <Dialog open={modifyOpen} onClose={() => setModifyOpen(false)} fullWidth>
        <DialogTitle>Modify Route (Touches All Stops)</DialogTitle>
        <DialogContent>
          {directions?.routes.map((r, idx) => (
            <Card
              key={idx}
              sx={{
                mb: 1,
                cursor: "pointer",
                border:
                  selectedRouteIndex === idx
                    ? "2px solid #f57c00"
                    : "1px solid #ddd",
              }}
              onClick={() => setSelectedRouteIndex(idx)}
            >
              <CardContent>
                <Stack direction="row" spacing={1}>
                  <Chip label={`Route ${idx + 1}`} />
                  <Chip label={r.legs.reduce((a, l) => a + (l.distance?.value ?? 0), 0) / 1000 + " km"} />
                  <Chip label={r.legs.reduce((a, l) => a + (l.duration?.value ?? 0), 0) / 3600 + " hrs"} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
      </Dialog>

      <Grid container spacing={2}>
        {/* LEFT PANEL */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Stops</Typography>
            {allocation.route.map((r, i) => (
              <Stack key={i} direction="row" spacing={1} mt={1}>
                <Chip label={`Stop ${i + 1}`} />
                <Typography variant="body2">{r.end.address}</Typography>
              </Stack>
            ))}

            <Button
              sx={{ mt: 2 }}
              fullWidth
              variant="contained"
              color="warning"
              onClick={() => {
                setDirections(null);
                setSelectedRouteIndex(0);
                setModifyOpen(true);
              }}
            >
              Modify Route
            </Button>
          </Paper>
        </Grid>

        {/* MAP */}
        <Grid item xs={12} md={8}>
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={8}>
            {!directions && (
              <DirectionsService
                options={{
                  origin: { lat: origin.latitude, lng: origin.longitude },
                  destination: {
                    lat: destination.latitude,
                    lng: destination.longitude,
                  },
                  waypoints,
                  optimizeWaypoints: false, // 🚨 important
                  travelMode: google.maps.TravelMode.DRIVING,
                  provideRouteAlternatives: true,
                }}
                callback={(res) => res && setDirections(res)}
              />
            )}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                routeIndex={selectedRouteIndex}
                options={{
                  suppressMarkers: true,
                  polylineOptions: { strokeColor: "#1976d2", strokeWeight: 5 },
                }}
              />
            )}

            {vehiclePath.length > 1 && (
              <Polyline
                path={vehiclePath}
                options={{ strokeColor: "#d32f2f", strokeWeight: 6 }}
              />
            )}

            {/* START */}
            <Marker
              position={{ lat: origin.latitude, lng: origin.longitude }}
              icon="https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />

            {/* STOPS */}
            {allocation.route.map((r, i) => (
              <Marker
                key={i}
                position={{ lat: r.end.latitude, lng: r.end.longitude }}
                label={`${i + 1}`}
              />
            ))}

            <Marker position={center} />
          </GoogleMap>
        </Grid>
      </Grid>
    </>
  );
};

export default LiveTracking;
