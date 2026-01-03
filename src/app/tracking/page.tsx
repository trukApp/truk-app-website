'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    IconButton,
    Stack,
    LinearProgress,
    TextField,
    InputAdornment,
    Backdrop,
    CircularProgress,
    Chip,
    Avatar,
} from '@mui/material';
import {
    Visibility,
    Search,
    Phone,
    Person,
    AccessTime,
    LocationOn,
    CheckCircle,
    HourglassBottom,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
    GoogleMap,
    Polyline,
    Marker,
    useJsApiLoader,
} from '@react-google-maps/api';
import { useGetAllAssignedOrdersDataQuery } from '@/api/apiSlice';

/* ---------------- TYPES ---------------- */

type RoutePoint = { lat: number; lng: number };

interface Driver {
    driver_name?: string;
    driver_correspondence?: { phone?: string };
}

interface VehicleAssignment {
    self_vehicle_num?: string;
    driver?: Driver;
}

interface PODStop {
    stopIndex: number;
    status: string;
    location: string;
}

interface Assignment {
    a_order_status?: string;
    pod?: { stops?: PODStop[] };
    vehicles?: VehicleAssignment[];
}

interface RouteLeg {
    start: { address: string };
    end: { address: string };
    distance?: string;
    duration?: string;
}

interface Allocation {
    sampledRoutePoints?: RoutePoint[];
    occupiedPercentUsable?: number;
    route?: RouteLeg[];
}

interface Order {
    order_ID: string;
    allocations?: Allocation[];
    assignments?: Assignment[];
}

/* ---------------- CONSTANTS ---------------- */

const COLORS = [
    '#2E7D32',
    '#1565C0',
    '#D84315',
    '#6A1B9A',
    '#00897B',
    '#C2185B',
];

const DEFAULT_CENTER = { lat: 16.0, lng: 80.6 };
const mapContainerStyle = { width: '100%', height: '100%' };
const GOOGLE_MAP_LIBRARIES: ('places')[] = ['places'];

/* ---------------- HELPERS ---------------- */

const parseDurationToMs = (duration?: string) => {
    if (!duration) return 0;
    const h = duration.match(/(\d+)\s*hour/)?.[1];
    const m = duration.match(/(\d+)\s*min/)?.[1];
    return ((h ? +h : 0) * 60 + (m ? +m : 0)) * 60_000;
};

const formatTime = (date: number) =>
    new Date(date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

/* ---------------- COMPONENT ---------------- */

const TrackingPage: React.FC = () => {
    const router = useRouter();
    const mapRef = useRef<google.maps.Map | null>(null);
    const [searchText, setSearchText] = useState('');
    const [focusedKey, setFocusedKey] = useState<string | null>(null);

    const { data, isLoading } = useGetAllAssignedOrdersDataQuery({});

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: GOOGLE_MAP_LIBRARIES,
    });

    const orders: Order[] = data?.orders ?? [];

    /* ---------------- FLATTEN DATA ---------------- */

    const allocationList = useMemo(() => {
        const now = Date.now();
        const list: any[] = [];

        orders.forEach((order, oIdx) => {
            const assignment = order.assignments?.[0];
            const vehicleData = assignment?.vehicles?.[0];
            const driver = vehicleData?.driver;

            order.allocations?.forEach((alloc, aIdx) => {
                if (!alloc.sampledRoutePoints?.length) return;

                const firstLeg = alloc.route?.[0];
                const durationMs = parseDurationToMs(firstLeg?.duration);
                const etaTime = now + durationMs;
                const delayed = Date.now() > etaTime;

                const podStops = assignment?.pod?.stops ?? [];

                const stops =
                    alloc.route?.map((leg, idx) => {
                        const pod = podStops.find(s => s.stopIndex === idx);
                        return {
                            index: idx,
                            address: leg.end.address,
                            delivered: pod?.status === 'completed',
                        };
                    }) ?? [];

                list.push({
                    key: `${order.order_ID}-${aIdx}`,
                    orderID: order.order_ID,
                    vehicle: vehicleData?.self_vehicle_num ?? 'Vehicle',
                    driverName: driver?.driver_name ?? 'Not assigned',
                    driverPhone: driver?.driver_correspondence?.phone ?? '',
                    orderStatus: assignment?.a_order_status ?? 'Not Yet Started',
                    color: COLORS[(oIdx + aIdx) % COLORS.length],
                    progress: alloc.occupiedPercentUsable ?? 0,
                    startAddress: firstLeg?.start?.address ?? '—',
                    distance: firstLeg?.distance ?? 'N/A',
                    duration: firstLeg?.duration ?? 'N/A',
                    etaTime,
                    delayed,
                    points: alloc.sampledRoutePoints,
                    stops,
                });
            });
        });

        return list;
    }, [orders]);

    const filteredList = useMemo(() => {
        if (!searchText) return allocationList;
        const s = searchText.toLowerCase();
        return allocationList.filter(
            a =>
                a.vehicle.toLowerCase().includes(s) ||
                a.driverName.toLowerCase().includes(s) ||
                a.orderID.toLowerCase().includes(s)
        );
    }, [searchText, allocationList]);

    if (!isLoaded || isLoading) {
        return (
            <Backdrop open>
                <CircularProgress />
            </Backdrop>
        );
    }

    /* ---------------- UI ---------------- */

    return (
        <Box sx={{ height: '100vh', p: 2 }}>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                    mb: 1,
                    p: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg,#1e3c72,#2a5298)',
                    color: '#fff',
                }}
            >
                🚚 Fleet Tracking Dashboard
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '420px 1fr',
                    gap: 2,
                    height: 'calc(100% - 64px)',
                }}
            >
                {/* SIDEBAR */}
                <Box sx={{ overflowY: 'auto' }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Search vehicle / driver / order"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {filteredList.map(a => (
                        <motion.div key={a.key} whileHover={{ scale: 1.02 }}>
                            <Card
                                sx={{
                                    mt: 1,
                                    cursor: 'pointer',
                                    borderLeft: `6px solid ${a.color}`,
                                    boxShadow:
                                        focusedKey === a.key
                                            ? `0 0 0 2px ${a.color}`
                                            : undefined,
                                }}
                                onClick={() => {
                                    setFocusedKey(a.key);
                                    mapRef.current?.panTo(
                                        a.points[Math.floor(a.points.length / 2)]
                                    );
                                    mapRef.current?.setZoom(8);
                                }}
                            >
                                <CardContent>
                                    {/* HEADER */}
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography fontWeight={700}>{a.vehicle}</Typography>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(
                                                    `/detailed-order-overview?order_ID=${a.orderID}&from=tracking`
                                                );
                                            }}
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Stack>

                                    {/* ORDER STATUS */}
                                    <Chip
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                        color={
                                            a.orderStatus === 'In-transit'
                                                ? 'info'
                                                : 'success'
                                        }
                                        label={a.orderStatus}
                                    />

                                    {/* DRIVER */}
                                    <Stack direction="row" spacing={1.5} alignItems="center" mt={1}>
                                        <Avatar sx={{ width: 28, height: 28 }}>
                                            <Person fontSize="small" />
                                        </Avatar>

                                        <Box>
                                            <Typography variant="body2">
                                                {a.driverName}
                                            </Typography>

                                            {a.driverPhone && (
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Phone fontSize="small" color="primary" />
                                                    <Typography
                                                        variant="caption"
                                                        component="a"
                                                        href={`tel:${a.driverPhone}`}
                                                        sx={{
                                                            textDecoration: 'none',
                                                            color: 'primary.main',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {a.driverPhone}
                                                    </Typography>
                                                </Stack>
                                            )}
                                        </Box>
                                    </Stack>

                                    <Divider sx={{ my: 1 }} />

                                    {/* STOPS */}
                                    <Typography variant="caption" fontWeight={600}>
                                        Stops
                                    </Typography>

                                    {a.stops.map((s: any) => (
                                        <Stack
                                            key={s.index}
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <LocationOn fontSize="small" />
                                            <Typography variant="caption" sx={{ flex: 1 }}>
                                                {s.address}
                                            </Typography>
                                            {s.delivered ? (
                                                <CheckCircle fontSize="small" color="success" />
                                            ) : (
                                                <HourglassBottom fontSize="small" color="warning" />
                                            )}
                                        </Stack>
                                    ))}

                                    {/* ETA */}
                                    <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                                        <AccessTime fontSize="small" />
                                        <Typography fontWeight={600}>
                                            ETA: {formatTime(a.etaTime)}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            color={a.delayed ? 'error' : 'success'}
                                            label={a.delayed ? 'Delayed' : 'On Time'}
                                        />
                                    </Stack>

                                    <Stack direction="row" spacing={1} mt={1}>
                                        <Chip size="small" label={`🛣 ${a.distance}`} />
                                        <Chip size="small" label={`⏱ ${a.duration}`} />
                                    </Stack>

                                    <LinearProgress
                                        sx={{ mt: 1 }}
                                        value={a.progress}
                                        variant="determinate"
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </Box>

                {/* MAP */}
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={DEFAULT_CENTER}
                    zoom={6}
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                >
                    {allocationList.map(a => (
                        <Polyline
                            key={a.key}
                            path={a.points}
                            options={{
                                strokeColor: a.color,
                                strokeWeight: focusedKey === a.key ? 6 : 3,
                                strokeOpacity: focusedKey === a.key ? 0.9 : 0.3,
                            }}
                        />
                    ))}

                    {focusedKey &&
                        allocationList
                            .filter(a => a.key === focusedKey)
                            .map(a => (
                                <Marker
                                    key={`${a.key}-marker`}
                                    position={a.points[a.points.length - 1]}
                                />
                            ))}
                </GoogleMap>
            </Box>
        </Box>
    );
};

export default TrackingPage;



// 'use client';

// import React, { useMemo, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//     Box,
//     Typography,
//     Card,
//     CardContent,
//     Divider,
//     IconButton,
//     Stack,
//     LinearProgress,
//     TextField,
//     InputAdornment,
//     Backdrop,
//     CircularProgress,
//     Chip,
//     Avatar,
// } from '@mui/material';
// import {
//     Visibility,
//     Search,
//     Phone,
//     Person,
//     AccessTime,
//     LocationOn,
//     CheckCircle,
//     HourglassBottom,
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import {
//     GoogleMap,
//     Polyline,
//     Marker,
//     useJsApiLoader,
// } from '@react-google-maps/api';
// import { useGetAllAssignedOrdersDataQuery } from '@/api/apiSlice';

// /* ---------------- TYPES ---------------- */

// type RoutePoint = { lat: number; lng: number };

// interface Driver {
//     driver_name?: string;
//     driver_correspondence?: { phone?: string };
// }

// interface VehicleAssignment {
//     self_vehicle_num?: string;
//     driver?: Driver;
// }

// interface PODStop {
//     stopIndex: number;
//     status: string;
//     location: string;
// }

// interface Assignment {
//     a_order_status?: string;
//     pod?: { stops?: PODStop[] };
//     vehicles?: VehicleAssignment[];
// }

// interface RouteLeg {
//     start: { address: string };
//     end: { address: string };
//     distance?: string;
//     duration?: string;
// }

// interface Allocation {
//     sampledRoutePoints?: RoutePoint[];
//     occupiedPercentUsable?: number;
//     route?: RouteLeg[];
// }

// interface Order {
//     order_ID: string;
//     allocations?: Allocation[];
//     assignments?: Assignment[];
// }

// /* ---------------- CONSTANTS ---------------- */

// const COLORS = [
//     '#2E7D32',
//     '#1565C0',
//     '#D84315',
//     '#6A1B9A',
//     '#00897B',
//     '#C2185B',
// ];

// const DEFAULT_CENTER = { lat: 16.0, lng: 80.6 };
// const mapContainerStyle = { width: '100%', height: '100%' };
// const GOOGLE_MAP_LIBRARIES: ('places')[] = ['places'];

// /* ---------------- HELPERS ---------------- */

// const parseDurationToMs = (duration?: string) => {
//     if (!duration) return 0;
//     const h = duration.match(/(\d+)\s*hour/)?.[1];
//     const m = duration.match(/(\d+)\s*min/)?.[1];
//     return ((h ? +h : 0) * 60 + (m ? +m : 0)) * 60_000;
// };

// const formatTime = (date: number) =>
//     new Date(date).toLocaleTimeString([], {
//         hour: '2-digit',
//         minute: '2-digit',
//     });

// /* ---------------- COMPONENT ---------------- */

// const TrackingPage: React.FC = () => {
//     const router = useRouter();
//     const mapRef = useRef<google.maps.Map | null>(null);
//     const [searchText, setSearchText] = useState('');
//     const [focusedKey, setFocusedKey] = useState<string | null>(null);

//     const { data, isLoading } = useGetAllAssignedOrdersDataQuery({});

//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
//         libraries: GOOGLE_MAP_LIBRARIES,
//     });

//     const orders: Order[] = data?.orders ?? [];
//     console.log("orders: ", orders)

//     /* ---------------- FLATTEN DATA ---------------- */

//     const allocationList = useMemo(() => {
//         const now = Date.now();
//         const list: any[] = [];

//         orders.forEach((order, oIdx) => {
//             const assignment = order.assignments?.[0];
//             const vehicleData = assignment?.vehicles?.[0];
//             const driver = vehicleData?.driver;

//             order.allocations?.forEach((alloc, aIdx) => {
//                 if (!alloc.sampledRoutePoints?.length) return;

//                 const firstLeg = alloc.route?.[0];
//                 const durationMs = parseDurationToMs(firstLeg?.duration);
//                 const etaTime = now + durationMs;
//                 const delayed = Date.now() > etaTime;

//                 const podStops = assignment?.pod?.stops ?? [];

//                 const stops =
//                     alloc.route?.map((leg, idx) => {
//                         const pod = podStops.find(s => s.stopIndex === idx);
//                         return {
//                             index: idx,
//                             address: leg.end.address,
//                             delivered: pod?.status === 'completed',
//                         };
//                     }) ?? [];

//                 list.push({
//                     key: `${order.order_ID}-${aIdx}`,
//                     orderID: order.order_ID,
//                     vehicle: vehicleData?.self_vehicle_num ?? 'Vehicle',
//                     driverName: driver?.driver_name ?? 'Not assigned',
//                     driverPhone: driver?.driver_correspondence?.phone ?? '',
//                     orderStatus: assignment?.a_order_status ?? 'Not Yet Started',
//                     color: COLORS[(oIdx + aIdx) % COLORS.length],
//                     progress: alloc.occupiedPercentUsable ?? 0,
//                     startAddress: firstLeg?.start?.address ?? '—',
//                     distance: firstLeg?.distance ?? 'N/A',
//                     duration: firstLeg?.duration ?? 'N/A',
//                     etaTime,
//                     delayed,
//                     points: alloc.sampledRoutePoints,
//                     stops,
//                 });
//             });
//         });

//         return list;
//     }, [orders]);

//     const filteredList = useMemo(() => {
//         if (!searchText) return allocationList;
//         const s = searchText.toLowerCase();
//         return allocationList.filter(
//             a =>
//                 a.vehicle.toLowerCase().includes(s) ||
//                 a.driverName.toLowerCase().includes(s) ||
//                 a.orderID.toLowerCase().includes(s)
//         );
//     }, [searchText, allocationList]);

//     if (!isLoaded || isLoading) {
//         return (
//             <Backdrop open>
//                 <CircularProgress />
//             </Backdrop>
//         );
//     }

//     /* ---------------- UI ---------------- */

//     return (
//         <Box sx={{ height: '100vh', p: 2 }}>
//             <Typography
//                 variant="h6"
//                 fontWeight="bold"
//                 sx={{
//                     mb: 1,
//                     p: 1.5,
//                     borderRadius: 2,
//                     background: 'linear-gradient(90deg,#1e3c72,#2a5298)',
//                     color: '#fff',
//                 }}
//             >
//                 🚚 Fleet Tracking Dashboard
//             </Typography>

//             <Box
//                 sx={{
//                     display: 'grid',
//                     gridTemplateColumns: '420px 1fr',
//                     gap: 2,
//                     height: 'calc(100% - 64px)',
//                 }}
//             >
//                 {/* SIDEBAR */}
//                 <Box sx={{ overflowY: 'auto' }}>
//                     <TextField
//                         size="small"
//                         fullWidth
//                         placeholder="Search vehicle / driver / order"
//                         value={searchText}
//                         onChange={(e) => setSearchText(e.target.value)}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <Search />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />

//                     {filteredList.map(a => (
//                         <motion.div key={a.key} whileHover={{ scale: 1.02 }}>
//                             <Card
//                                 sx={{
//                                     mt: 1,
//                                     cursor: 'pointer',
//                                     borderLeft: `6px solid ${a.color}`,
//                                     boxShadow:
//                                         focusedKey === a.key
//                                             ? `0 0 0 2px ${a.color}`
//                                             : undefined,
//                                 }}
//                                 onClick={() => {
//                                     setFocusedKey(a.key);
//                                     mapRef.current?.panTo(
//                                         a.points[Math.floor(a.points.length / 2)]
//                                     );
//                                     mapRef.current?.setZoom(8);
//                                 }}
//                             >
//                                 <CardContent>
//                                     {/* HEADER */}
//                                     <Stack direction="row" justifyContent="space-between">
//                                         <Typography fontWeight={700}>{a.vehicle}</Typography>
//                                         <IconButton
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 router.push(
//                                                     `/detailed-order-overview?order_ID=${a.orderID}&from=tracking`
//                                                 );
//                                             }}
//                                         >
//                                             <Visibility />
//                                         </IconButton>
//                                     </Stack>

//                                     {/* ORDER STATUS */}
//                                     <Chip
//                                         size="small"
//                                         sx={{ mt: 0.5 }}
//                                         color={
//                                             a.orderStatus === 'In-transit'
//                                                 ? 'info'
//                                                 : 'success'
//                                         }
//                                         label={a.orderStatus}
//                                     />

//                                     {/* DRIVER */}
//                                     <Stack direction="row" spacing={1.5} alignItems="center" mt={1}>
//                                         <Avatar sx={{ width: 28, height: 28 }}>
//                                             <Person fontSize="small" />
//                                         </Avatar>

//                                         <Box>
//                                             <Typography variant="body2">
//                                                 {a.driverName}
//                                             </Typography>

//                                             {a.driverPhone && (
//                                                 <Stack direction="row" spacing={0.5} alignItems="center">
//                                                     <Phone fontSize="small" color="primary" />
//                                                     <Typography
//                                                         variant="caption"
//                                                         component="a"
//                                                         href={`tel:${a.driverPhone}`}
//                                                         sx={{
//                                                             textDecoration: 'none',
//                                                             color: 'primary.main',
//                                                             fontWeight: 600,
//                                                         }}
//                                                     >
//                                                         {a.driverPhone}
//                                                     </Typography>
//                                                 </Stack>
//                                             )}
//                                         </Box>
//                                     </Stack>

//                                     <Divider sx={{ my: 1 }} />

//                                     {/* STOPS */}
//                                     <Typography variant="caption" fontWeight={600}>
//                                         Stops
//                                     </Typography>

//                                     {a.stops.map((s: any) => (
//                                         <Stack
//                                             key={s.index}
//                                             direction="row"
//                                             spacing={1}
//                                             alignItems="center"
//                                         >
//                                             <LocationOn fontSize="small" />
//                                             <Typography variant="caption" sx={{ flex: 1 }}>
//                                                 {s.address}
//                                             </Typography>
//                                             {s.delivered ? (
//                                                 <CheckCircle fontSize="small" color="success" />
//                                             ) : (
//                                                 <HourglassBottom fontSize="small" color="warning" />
//                                             )}
//                                         </Stack>
//                                     ))}

//                                     {/* ETA */}
//                                     <Stack direction="row" spacing={1} alignItems="center" mt={1}>
//                                         <AccessTime fontSize="small" />
//                                         <Typography fontWeight={600}>
//                                             ETA: {formatTime(a.etaTime)}
//                                         </Typography>
//                                         <Chip
//                                             size="small"
//                                             color={a.delayed ? 'error' : 'success'}
//                                             label={a.delayed ? 'Delayed' : 'On Time'}
//                                         />
//                                     </Stack>

//                                     <Stack direction="row" spacing={1} mt={1}>
//                                         <Chip size="small" label={`🛣 ${a.distance}`} />
//                                         <Chip size="small" label={`⏱ ${a.duration}`} />
//                                     </Stack>

//                                     <LinearProgress
//                                         sx={{ mt: 1 }}
//                                         value={a.progress}
//                                         variant="determinate"
//                                     />
//                                 </CardContent>
//                             </Card>
//                         </motion.div>
//                     ))}
//                 </Box>

//                 {/* MAP */}
//                 <GoogleMap
//                     mapContainerStyle={mapContainerStyle}
//                     center={DEFAULT_CENTER}
//                     zoom={6}
//                     onLoad={(map) => {
//                         mapRef.current = map;
//                     }}
//                 >
//                     {allocationList.map(a => (
//                         <Polyline
//                             key={a.key}
//                             path={a.points}
//                             options={{
//                                 strokeColor: a.color,
//                                 strokeWeight: focusedKey === a.key ? 6 : 3,
//                                 strokeOpacity: focusedKey === a.key ? 0.9 : 0.3,
//                             }}
//                         />
//                     ))}

//                     {focusedKey &&
//                         allocationList
//                             .filter(a => a.key === focusedKey)
//                             .map(a => (
//                                 <Marker
//                                     key={`${a.key}-marker`}
//                                     position={a.points[a.points.length - 1]}
//                                 />
//                             ))}
//                 </GoogleMap>
//             </Box>
//         </Box>
//     );
// };

// export default TrackingPage;
