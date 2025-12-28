// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
// import { Box, Grid, Typography, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

// const mapContainerStyle = { width: "100%", height: "600px" };
// const liveUrl = process.env.NEXT_PUBLIC_LIVE_TRACK_URL ?? "";
// const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// type Vehicle = {
//   regNo: string;
//   status: string;
//   speed: number;
//   lastSeen: string;
//   latitude: string;
//   longitude: string;
//   vehicleId: string;
//   vehicleType: string;
//   deviceId: string;
// };

// type Allocation = {
//   vehicle_ID: string;
//   sampledRoutePoints: { lat: number; lng: number }[];
//   route: {
//     start: { address: string };
//     end: { address: string };
//   }[];
// };

// const LiveTracking: React.FC = () => {
//   const GOOGLE_MAP_LIBRARIES: ('places' | 'drawing' | 'geometry')[] = ['places'];
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: mapsKey,
//     // libraries: [] // no extra libraries
//     libraries: GOOGLE_MAP_LIBRARIES,
//   });

//   const [allocation, setAllocation] = useState<Allocation | null>(null);
//   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//   const [vehiclePath, setVehiclePath] = useState<{ lat: number; lng: number }[]>([]);
//   const [trackedPath, setTrackedPath] = useState<{ lat: number; lng: number }[]>([]);
//   const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
//   const [isDeviationPopupOpen, setIsDeviationPopupOpen] = useState(false);
//   const [deviationDistance, setDeviationDistance] = useState<number | null>(null);

//   const deviceId = "867232055767934"; // your test device
//   const suggestedRoute = allocation?.sampledRoutePoints ?? [];
//   console.log("suggestedRoute: ", suggestedRoute)
//   console.log("allocation: ", allocation)
//   const handleClosePopup = () => setIsDeviationPopupOpen(false);

//   // Load allocation from LocalStorage
//   useEffect(() => {
//     const storedData = localStorage.getItem("allocationData");
//     if (storedData) setAllocation(JSON.parse(storedData));
//   }, []);

//   // Fetch live vehicle data every 5 seconds
//   const fetchTracking = useCallback(async () => {
//     try {
//       const res = await fetch(liveUrl);
//       const data: Vehicle[] = await res.json();
//       const vehicle = data.find(v => v.deviceId === deviceId);
//       if (!vehicle) return;

//       setSelectedVehicle(vehicle);

//       const newPoint = { lat: parseFloat(vehicle.latitude), lng: parseFloat(vehicle.longitude) };
//       setVehiclePath(prev => [...prev.slice(-100), newPoint]); // keep last 100 points
//       if (!mapCenter) setMapCenter(newPoint);
//     } catch (err) {
//       console.error("Tracking API Error:", err);
//     }
//   }, [mapCenter]);

//   useEffect(() => {
//     fetchTracking();
//     const interval = setInterval(fetchTracking, 5000);
//     return () => clearInterval(interval);
//   }, [fetchTracking]);

//   // Store snapshots every 5 mins if moving
//   useEffect(() => {
//     if (!selectedVehicle || selectedVehicle.status !== "moving") return;
//     const interval = setInterval(() => {
//       setTrackedPath(prev => [
//         ...prev,
//         { lat: parseFloat(selectedVehicle.latitude), lng: parseFloat(selectedVehicle.longitude) }
//       ]);
//     }, 300000);
//     return () => clearInterval(interval);
//   }, [selectedVehicle]);

//   // Haversine distance
//   const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
//     const toRad = (v: number) => (v * Math.PI) / 180;
//     const R = 6371000; // meters
//     const dLat = toRad(lat2 - lat1);
//     const dLng = toRad(lng2 - lng1);
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
//     return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   };

//   // Route deviation check
//   useEffect(() => {
//     if (!selectedVehicle || suggestedRoute.length === 0) return;
//     const vLat = parseFloat(selectedVehicle.latitude);
//     const vLng = parseFloat(selectedVehicle.longitude);
//     const minDist = Math.min(...suggestedRoute.map(p => calculateDistance(vLat, vLng, p.lat, p.lng)));
//     if (minDist > 500) {
//       setDeviationDistance(minDist);
//       setIsDeviationPopupOpen(true);
//     }
//   }, [selectedVehicle, suggestedRoute]);

//   if (!isLoaded || !mapCenter) return <p>Loading map...</p>;
//   const deviationKm = deviationDistance ? (deviationDistance / 1000).toFixed(2) : null;

//   return (
//     <>
//       <Dialog open={isDeviationPopupOpen} onClose={handleClosePopup}>
//         <DialogTitle>⚠️ Route Deviation Detected</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Vehicle deviated by <strong>{deviationKm} km</strong>
//           </Typography>
//           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
//             <Button variant="contained" onClick={handleClosePopup}>OK</Button>
//           </Box>
//         </DialogContent>
//       </Dialog>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={5}>
//           <Typography variant="h6" sx={{ color: "#F08C24", mb: 1 }}>Suggested Route</Typography>
//           {allocation?.route?.[0] && (
//             <>
//               <Typography><strong>Start:</strong> {allocation.route[0].start.address}</Typography>
//               <Typography><strong>End:</strong> {allocation.route[0].end.address}</Typography>
//             </>
//           )}
//           {selectedVehicle && (
//             <Box sx={{ mt: 2 }}>
//               <Typography><strong>Vehicle:</strong> {selectedVehicle.regNo}</Typography>
//               <Typography><strong>Status:</strong> {selectedVehicle.status}</Typography>
//               <Typography><strong>Speed:</strong> {selectedVehicle.speed} km/h</Typography>
//             </Box>
//           )}
//         </Grid>

//         <Grid item xs={12} md={7}>
//           <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={14}>
//             {/* Vehicle marker with car.svg */}
//             <Marker
//               position={mapCenter}
//               icon={{
//                 url: "/car.svg",
//                 scaledSize: new window.google.maps.Size(50, 50)
//               }}
//             />
//             {/* Live path */}
//             {vehiclePath.length > 1 && (
//               <Polyline path={vehiclePath} options={{ strokeColor: "#4287f5", strokeWeight: 4 }} />
//             )}
//             {/* Snapshot path */}
//             {trackedPath.length > 1 && (
//               <Polyline path={trackedPath} options={{ strokeColor: "#f54242", strokeWeight: 4 }} />
//             )}
//           </GoogleMap>
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default LiveTracking;



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
//   Card,
//   CardContent,
//   Stack,
//   Chip,
// } from "@mui/material";

// const mapContainerStyle = { width: "100%", height: "600px" };
// const liveUrl = process.env.NEXT_PUBLIC_LIVE_TRACK_URL ?? "";
// const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

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
//   sampledRoutePoints: RoutePoint[];
//   route: {
//     start: {
//       latitude: number;
//       longitude: number;
//       address: string;
//     };
//     end: {
//       latitude: number;
//       longitude: number;
//       address: string;
//     };
//   }[];
// };

// /* ---------------- HELPERS ---------------- */

// // Haversine distance (meters)
// const getDistanceMeters = (
//   lat1: number,
//   lng1: number,
//   lat2: number,
//   lng2: number
// ) => {
//   const toRad = (v: number) => (v * Math.PI) / 180;
//   const R = 6371000;
//   const dLat = toRad(lat2 - lat1);
//   const dLng = toRad(lng2 - lng1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) *
//     Math.cos(toRad(lat2)) *
//     Math.sin(dLng / 2) ** 2;
//   return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// };

// /* ---------------- COMPONENT ---------------- */

// const LiveTracking: React.FC = () => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: mapsKey,
//     libraries: ["places"],
//   });

//   const [allocation, setAllocation] = useState<Allocation | null>(null);
//   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//   const [vehiclePath, setVehiclePath] = useState<RoutePoint[]>([]);
//   const [mapCenter, setMapCenter] = useState<RoutePoint | null>(null);

//   /* ---------- Modify Route ---------- */
//   const [openModify, setOpenModify] = useState(false);
//   const [directions, setDirections] =
//     useState<google.maps.DirectionsResult | null>(null);
//   const [selectedRouteIndex, setSelectedRouteIndex] =
//     useState<number | null>(null);

//   /* ---------- Deviation ---------- */
//   const [deviationOpen, setDeviationOpen] = useState(false);
//   const [deviationMeters, setDeviationMeters] = useState(0);
//   const deviationTriggeredRef = useRef(false);

//   const deviceId = "867232055767934";
//   const suggestedRoute = allocation?.sampledRoutePoints ?? [];
//   const DEVIATION_THRESHOLD = 500; // meters

//   /* ---------- Load allocation ---------- */
//   useEffect(() => {
//     const stored = localStorage.getItem("allocationData");
//     if (stored) setAllocation(JSON.parse(stored));
//   }, []);

//   /* ---------- Live tracking ---------- */
//   const fetchTracking = useCallback(async () => {
//     const res = await fetch(liveUrl);
//     const data: Vehicle[] = await res.json();
//     const v = data.find((d) => d.deviceId === deviceId);
//     if (!v) return;

//     const point = { lat: +v.latitude, lng: +v.longitude };
//     setSelectedVehicle(v);
//     setVehiclePath((p) => [...p.slice(-100), point]);
//     if (!mapCenter) setMapCenter(point);

//     /* --------- Deviation check --------- */
//     if (suggestedRoute.length > 0) {
//       const minDist = Math.min(
//         ...suggestedRoute.map((rp) =>
//           getDistanceMeters(point.lat, point.lng, rp.lat, rp.lng)
//         )
//       );

//       if (minDist > DEVIATION_THRESHOLD && !deviationTriggeredRef.current) {
//         deviationTriggeredRef.current = true;
//         setDeviationMeters(minDist);
//         setDeviationOpen(true);
//       }

//       if (minDist <= DEVIATION_THRESHOLD) {
//         deviationTriggeredRef.current = false;
//       }
//     }
//   }, [mapCenter, suggestedRoute]);

//   useEffect(() => {
//     fetchTracking();
//     const i = setInterval(fetchTracking, 5000);
//     return () => clearInterval(i);
//   }, [fetchTracking]);

//   if (!isLoaded || !mapCenter) return <p>Loading map...</p>;

//   const start = allocation?.route?.[0]?.start;
//   const end = allocation?.route?.[allocation.route.length - 1]?.end;

//   const origin =
//     start && { lat: start.latitude, lng: start.longitude };
//   const destination =
//     end && { lat: end.latitude, lng: end.longitude };

//   return (
//     <>
//       {/* 🚨 DEVIATION ALERT */}
//       <Dialog open={deviationOpen} onClose={() => setDeviationOpen(false)}>
//         <DialogTitle>⚠️ Route Deviation Detected</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Vehicle deviated by{" "}
//             <strong>{(deviationMeters / 1000).toFixed(2)} km</strong>
//           </Typography>
//           <Box mt={2} textAlign="right">
//             <Button
//               variant="contained"
//               onClick={() => setDeviationOpen(false)}
//             >
//               OK
//             </Button>
//           </Box>
//         </DialogContent>
//       </Dialog>

//       {/* MODIFY ROUTE */}
//       <Dialog
//         open={openModify}
//         onClose={() => setOpenModify(false)}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>🔁 Modify Route</DialogTitle>
//         <DialogContent>
//           {directions?.routes.map((r, idx) => {
//             const leg = r.legs[0];
//             return (
//               <Card
//                 key={idx}
//                 sx={{
//                   mb: 1,
//                   cursor: "pointer",
//                   border:
//                     selectedRouteIndex === idx
//                       ? "2px solid orange"
//                       : "1px solid #ddd",
//                 }}
//                 onClick={() => setSelectedRouteIndex(idx)}
//               >
//                 <CardContent>
//                   <Stack direction="row" spacing={1}>
//                     <Chip label={`Route ${idx + 1}`} />
//                     <Chip label={`🛣 ${leg.distance.text}`} />
//                     <Chip label={`⏱ ${leg.duration.text}`} />
//                     <Chip label="🌦 Clear (mock)" />
//                   </Stack>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </DialogContent>
//       </Dialog>

//       <Grid container spacing={2}>
//         {/* LEFT */}
//         <Grid item xs={12} md={5}>
//           <Typography variant="h6">Suggested Route</Typography>
//           {start && end && (
//             <>
//               <Typography><b>Start:</b> {start.address}</Typography>
//               <Typography><b>End:</b> {end.address}</Typography>
//             </>
//           )}

//           <Button
//             variant="contained"
//             color="warning"
//             sx={{ mt: 2 }}
//             onClick={() => {
//               setDirections(null);
//               setSelectedRouteIndex(null);
//               setOpenModify(true);
//             }}
//           >
//             Modify Route
//           </Button>
//         </Grid>

//         {/* MAP */}
//         <Grid item xs={12} md={7}>
//           <GoogleMap
//             center={mapCenter}
//             zoom={14}
//             mapContainerStyle={mapContainerStyle}
//           >
//             <Marker position={mapCenter} />

//             {suggestedRoute.length > 1 && (
//               <Polyline
//                 path={suggestedRoute}
//                 options={{ strokeColor: "#1976d2", strokeWeight: 4 }}
//               />
//             )}

//             {vehiclePath.length > 1 && (
//               <Polyline
//                 path={vehiclePath}
//                 options={{ strokeColor: "#0d47a1", strokeWeight: 5 }}
//               />
//             )}

//             {openModify && origin && destination && !directions && (
//               <DirectionsService
//                 options={{
//                   origin,
//                   destination,
//                   travelMode: google.maps.TravelMode.DRIVING,
//                   provideRouteAlternatives: true,
//                 }}
//                 callback={(res) => res && setDirections(res)}
//               />
//             )}

//             {directions && selectedRouteIndex !== null && (
//               <DirectionsRenderer
//                 directions={directions}
//                 routeIndex={selectedRouteIndex}
//                 options={{
//                   polylineOptions: {
//                     strokeColor: "orange",
//                     strokeWeight: 6,
//                   },
//                   suppressMarkers: true,
//                 }}
//               />
//             )}
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
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";

const mapContainerStyle = { width: "100%", height: "600px" };
const liveUrl = process.env.NEXT_PUBLIC_LIVE_TRACK_URL ?? "";
const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

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
  sampledRoutePoints: RoutePoint[];
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
  }[];
};

/* ---------------- HELPERS ---------------- */

// Haversine distance (meters)
const getDistanceMeters = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ---------------- COMPONENT ---------------- */

const LiveTracking: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapsKey,
    libraries: ["places"],
  });

  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehiclePath, setVehiclePath] = useState<RoutePoint[]>([]);
  const [mapCenter, setMapCenter] = useState<RoutePoint | null>(null);

  /* ---------- Modify Route ---------- */
  const [openModify, setOpenModify] = useState(false);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] =
    useState<number | null>(null);

  /* ---------- Deviation ---------- */
  const [deviationOpen, setDeviationOpen] = useState(false);
  const [deviationMeters, setDeviationMeters] = useState(0);
  const deviationTriggeredRef = useRef(false);

  const deviceId = "867232055767934";
  const suggestedRoute = allocation?.sampledRoutePoints ?? [];
  const DEVIATION_THRESHOLD = 500; // meters

  /* ---------- Load allocation ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("allocationData");
    if (stored) setAllocation(JSON.parse(stored));
  }, []);

  /* ---------- Live tracking ---------- */
  const fetchTracking = useCallback(async () => {
    const res = await fetch(liveUrl);
    const data: Vehicle[] = await res.json();
    const v = data.find((d) => d.deviceId === deviceId);
    if (!v) return;

    const point = { lat: +v.latitude, lng: +v.longitude };
    setSelectedVehicle(v);
    setVehiclePath((p) => [...p.slice(-100), point]);
    if (!mapCenter) setMapCenter(point);

    /* --------- Deviation check --------- */
    if (suggestedRoute.length > 0) {
      const minDist = Math.min(
        ...suggestedRoute.map((rp) =>
          getDistanceMeters(point.lat, point.lng, rp.lat, rp.lng)
        )
      );

      if (minDist > DEVIATION_THRESHOLD && !deviationTriggeredRef.current) {
        deviationTriggeredRef.current = true;
        setDeviationMeters(minDist);
        setDeviationOpen(true);
      }

      if (minDist <= DEVIATION_THRESHOLD) {
        deviationTriggeredRef.current = false;
      }
    }
  }, [mapCenter, suggestedRoute]);

  useEffect(() => {
    fetchTracking();
    const i = setInterval(fetchTracking, 5000);
    return () => clearInterval(i);
  }, [fetchTracking]);

  if (!isLoaded || !mapCenter) return <p>Loading map...</p>;

  const start = allocation?.route?.[0]?.start;
  const end = allocation?.route?.[allocation.route.length - 1]?.end;

  const origin = start && { lat: start.latitude, lng: start.longitude };
  const destination = end && { lat: end.latitude, lng: end.longitude };

  return (
    <>
      {/* 🚨 DEVIATION ALERT */}
      <Dialog open={deviationOpen} onClose={() => setDeviationOpen(false)}>
        <DialogTitle>⚠️ Route Deviation Detected</DialogTitle>
        <DialogContent>
          <Typography>
            Vehicle deviated by{" "}
            <strong>{(deviationMeters / 1000).toFixed(2)} km</strong>
          </Typography>
          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={() => setDeviationOpen(false)}>
              OK
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* MODIFY ROUTE */}
      <Dialog open={openModify} onClose={() => setOpenModify(false)} fullWidth maxWidth="md">
        <DialogTitle>🔁 Modify Route</DialogTitle>
        <DialogContent>
          {directions?.routes.map((r, idx) => {
            const leg = r.legs[0];
            const distanceText = leg.distance?.text ?? "N/A";
            const durationText = leg.duration?.text ?? "N/A";

            return (
              <Card
                key={idx}
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  border:
                    selectedRouteIndex === idx
                      ? "2px solid orange"
                      : "1px solid #ddd",
                }}
                onClick={() => setSelectedRouteIndex(idx)}
              >
                <CardContent>
                  <Stack direction="row" spacing={1}>
                    <Chip label={`Route ${idx + 1}`} />
                    <Chip label={`🛣 ${distanceText}`} />
                    <Chip label={`⏱ ${durationText}`} />
                    <Chip label="🌦 Clear (mock)" />
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </DialogContent>
      </Dialog>

      <Grid container spacing={2}>
        {/* LEFT */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6">Suggested Route</Typography>

          {start && end && (
            <>
              <Typography><b>Start:</b> {start.address}</Typography>
              <Typography><b>End:</b> {end.address}</Typography>
            </>
          )}

          {selectedVehicle && (
            <Box mt={2}>
              <Typography><b>Vehicle:</b> {selectedVehicle.regNo}</Typography>
              <Typography><b>Status:</b> {selectedVehicle.status}</Typography>
              <Typography><b>Speed:</b> {selectedVehicle.speed} km/h</Typography>
            </Box>
          )}

          <Button
            variant="contained"
            color="warning"
            sx={{ mt: 2 }}
            onClick={() => {
              setDirections(null);
              setSelectedRouteIndex(null);
              setOpenModify(true);
            }}
          >
            Modify Route
          </Button>
        </Grid>

        {/* MAP */}
        <Grid item xs={12} md={7}>
          <GoogleMap center={mapCenter} zoom={14} mapContainerStyle={mapContainerStyle}>
            <Marker position={mapCenter} />

            {suggestedRoute.length > 1 && (
              <Polyline
                path={suggestedRoute}
                options={{ strokeColor: "#1976d2", strokeWeight: 4 }}
              />
            )}

            {vehiclePath.length > 1 && (
              <Polyline
                path={vehiclePath}
                options={{ strokeColor: "#0d47a1", strokeWeight: 5 }}
              />
            )}

            {openModify && origin && destination && !directions && (
              <DirectionsService
                options={{
                  origin,
                  destination,
                  travelMode: google.maps.TravelMode.DRIVING,
                  provideRouteAlternatives: true,
                }}
                callback={(res) => res && setDirections(res)}
              />
            )}

            {directions && selectedRouteIndex !== null && (
              <DirectionsRenderer
                directions={directions}
                routeIndex={selectedRouteIndex}
                options={{
                  polylineOptions: {
                    strokeColor: "orange",
                    strokeWeight: 6,
                  },
                  suppressMarkers: true,
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
