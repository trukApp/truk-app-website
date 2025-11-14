/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { GridColDef, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
// import { Box, Typography, IconButton, Backdrop, CircularProgress } from '@mui/material';
// import { Visibility } from '@mui/icons-material';
// import { useGetAllOrdersQuery } from '@/api/apiSlice';
// import moment from 'moment';

// interface Route {
//     start: { address: string; latitude: number; longitude: number };
//     end: { address: string; latitude: number; longitude: number };
//     distance: string;
//     duration: string;
// }

// interface Allocation {
//     vehicle_ID: string;
//     route: Route[];
//     leftoverVolume: number;
//     leftoverWeight: number;
//     occupiedVolume: number;
//     occupiedWeight: number;
//     totalVolumeCapacity: number;
//     totalWeightCapacity: number;
// }

// export interface Order {
//     updated_at: string;
//     created_at: string;
//     unallocated_packages: string[];
//     ord_id: number;
//     order_ID: string;
//     scenario_label: string;
//     total_cost: string;
//     allocations: Allocation[];
//     order_status: string
// }


// const TrackingOrder: React.FC = () => {
//     const [loading, setLoading] = useState(false)
//     const { data: allOrders, error, isLoading } = useGetAllOrdersQuery({});
//     const router = useRouter();
//     const ordersData = allOrders?.orders || [];
//     const getAllTrackingOrders = ordersData.filter((eachOrder: Order) => {
//         return eachOrder?.order_status === 'self assigned'
//     })
//     console.log("Tracking Orders:", getAllTrackingOrders);

//     if (error) {
//         return <Typography color="error">Failed to load data. Try after sometime.</Typography>;
//     }



//     const handleViewOrder = (orderId: string) => {
//         setLoading(true)
//         router.push(`/detailed-order-overview?order_ID=${orderId}&from=tracking`);
//     };

//     const ordersColumns: GridColDef[] = [
//         { field: 'order_ID', headerName: 'Order ID', width: 150 },
//         { field: 'scenario_label', headerName: 'Scenario', width: 150 },
//         { field: 'total_cost', headerName: 'Total Cost', width: 150 },
//         { field: 'unallocated_packages', headerName: 'Unallocated Packages', width: 250 },
//         { field: 'created_at', headerName: 'Created At', width: 200 },
//         { field: 'order_status', headerName: 'Order status', width: 200 },
//         {
//             field: 'view',
//             headerName: 'View',
//             width: 100,
//             sortable: false,
//             renderCell: (params: GridRenderCellParams) => (
//                 <IconButton onClick={() => handleViewOrder(params.row.order_ID)} sx={{ color: "#F08C24" }}>
//                     <Visibility />
//                 </IconButton>
//             ),
//         },
//     ];

//     return (
//         <Box sx={{ width: '100%', marginTop: 2 }}>
//             <Backdrop
//                 open={loading || isLoading}
//                 sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//             >
//                 <CircularProgress color="inherit" />
//             </Backdrop>
//             {/* <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center', fontWeight: 600 }}>
//                 Orders List
//             </Typography> */}
//             <Typography
//                 variant="h6"
//                 color="primary"
//                 sx={{ fontWeight: 'bold', mb: 1 }}
//             >
//                 Tracking Orders
//             </Typography>

//             <Typography
//                 variant="body1"
//                 sx={{ mb: 3, color: 'text.secondary' }}
//             >
//                 View and manage all self-assigned and completed orders. Click the eye icon to see detailed information for each order.
//             </Typography>
//             <DataGrid
//                 rows={getAllTrackingOrders.map((order: Order) => ({
//                     id: order.ord_id,
//                     order_ID: order?.order_ID,
//                     scenario_label: order?.scenario_label,
//                     total_cost: order?.total_cost,
//                     unallocated_packages: order?.unallocated_packages?.join(', ') || 'None',
//                     order_status: order?.order_status,
//                     created_at: moment(new Date(order?.created_at).toLocaleString()).format("DD MMM YYYY, hh:mm A"),


//                 }))}
//                 columns={ordersColumns}
//                 autoHeight
//                 disableRowSelectionOnClick
//                 pageSizeOptions={[10, 20, 30]}
//                 initialState={{
//                     pagination: { paginationModel: { pageSize: 10 } },
//                 }}
//             />
//         </Box>
//     );
// };

// export default TrackingOrder;



'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    // List,
    // ListItem,
    // ListItemText,
    IconButton,
    // Chip,
    Stack,
    Button,
    LinearProgress,
    TextField,
    InputAdornment,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { Visibility, DirectionsCar, Search } from '@mui/icons-material';
import { useGetAllOrdersQuery } from '@/api/apiSlice';
// import moment from 'moment';

import {
    GoogleMap,
    useJsApiLoader,
    Polyline,
    Marker,
} from '@react-google-maps/api';

import { motion } from 'framer-motion';

/* ---------- Types ---------- */
type RoutePoint = { lat: number; lng: number };

interface Route {
    start: { address: string; latitude: number; longitude: number };
    end: { address: string; latitude: number; longitude: number };
    distance?: string | number;
    duration?: string | number;
}

interface Allocation {
    vehicle_ID?: string;
    route?: Route[];
    leftoverVolume?: number;
    leftoverWeight?: number;
    occupiedVolume?: number;
    occupiedWeight?: number;
    totalVolumeCapacity?: number;
    totalWeightCapacity?: number;
    sampledRoutePoints?: RoutePoint[];
    truckCapacity?: { usableM3?: number };
    bill_of_lading?: { self_bill_url?: string }[];
    vehicleDimensions?: {
        interiorWidthM?: number;
        interiorHeightM?: number;
        interiorLengthM?: number;
    };
    occupiedPercent?: number;
}

export interface Order {
    updated_at?: string;
    created_at?: string;
    unallocated_packages?: string[];
    ord_id: number;
    order_ID: string;
    scenario_label?: string;
    total_cost?: string;
    allocations?: Allocation[];
    order_status?: string;
    total_distance?: string;
    total_weight?: string;
    bill_of_lading?: any[];
}

/* ---------- Constants ---------- */
const COLORS = [
    '#2E7D32',
    '#1565C0',
    '#D84315',
    '#6A1B9A',
    '#FDD835',
    '#00897B',
    '#6D4C41',
    '#1E88E5',
    '#C2185B',
    '#FF8A65',
];

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const DEFAULT_CENTER = {
    lat: 12.9716,
    lng: 77.5946,
};

const libraries: ('places' | 'drawing' | 'geometry')[] = ['places'];

/* ---------- Main Component ---------- */
const TrackingPage: React.FC = () => {
    const router = useRouter();
    const { data: allOrders, error, isLoading } = useGetAllOrdersQuery({});
    const [loadingAction, setLoadingAction] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedAlloc, setSelectedAlloc] = useState<{ orderID: string; allocIndex: number } | null>(null);
    const [focusedAlloc, setFocusedAlloc] = useState<{ orderID: string; allocIndex: number } | null>(null);

    const { isLoaded: mapsLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const ordersData: Order[] = allOrders?.orders || [];
    const trackingOrders = useMemo(() => {
        return ordersData.filter((o) => o.order_status === 'self assigned' || o.order_status === 'assigned');
    }, [ordersData]);

    console.log('Tracking Orders:', trackingOrders);

    const allocationList = useMemo(() => {
        const list: {
            orderID: string;
            ord_id: number;
            allocIndex: number;
            allocation: Allocation;
            color: string;
            summary?: string;
        }[] = [];
        trackingOrders.forEach((order, oIdx) => {
            (order.allocations || []).forEach((alloc, aIdx) => {
                const color = COLORS[(oIdx + aIdx) % COLORS.length];
                const routeStart = alloc.route?.[0]?.start?.address;
                const routeEnd = alloc.route?.[alloc.route.length - 1]?.end?.address;
                const summary = routeStart && routeEnd ? `${routeStart} → ${routeEnd}` : undefined;
                list.push({
                    orderID: order.order_ID,
                    ord_id: order.ord_id,
                    allocIndex: aIdx,
                    allocation: alloc,
                    color,
                    summary,
                });
            });
        });
        return list;
    }, [trackingOrders]);

    const filteredList = useMemo(() => {
        if (!searchText) return allocationList;
        const s = searchText.toLowerCase();
        return allocationList.filter((a) =>
            a.orderID.toLowerCase().includes(s) ||
            (a.allocation.vehicle_ID ?? '').toLowerCase().includes(s) ||
            (a.summary ?? '').toLowerCase().includes(s)
        );
    }, [searchText, allocationList]);

    const handleFocus = (pts?: RoutePoint[]) => {
        if (!pts || pts.length === 0) return;
        const mid = pts[Math.floor(pts.length / 2)];
        const zoom = 10;
        // Use window.google.maps
        window.google.maps.Map.prototype.panTo({ lat: mid.lat, lng: mid.lng });
        window.google.maps.Map.prototype.setZoom(zoom);
    };

    const handleViewOrder = (orderID: string) => {
        setLoadingAction(true);
        router.push(`/detailed-order-overview?order_ID=${orderID}&from=tracking`);
    };

    if (error) {
        return <Typography color="error">Failed to load data. Please try again later.</Typography>;
    }

    return (
        <Box sx={{ width: '100%', height: '100vh', p: 2 }}>
            <Backdrop open={loadingAction || isLoading || !mapsLoaded} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                Tracking Orders
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Hover over a vehicle card or click a route to highlight and focus.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 2, height: 'calc(100% - 48px)' }}>
                {/* Sidebar */}
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Card variant="outlined">
                        <CardContent sx={{ p: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Search vehicle / order / address..."
                                fullWidth
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
                        </CardContent>
                    </Card>

                    <Box sx={{ flex: 1, mt: 1, overflowY: 'auto' }}>
                        {filteredList.map((a, idx) => {
                            const pts = a.allocation.sampledRoutePoints || [];
                            const first = pts[0];
                            const last = pts[pts.length - 1];
                            const occupiedVol = a.allocation.occupiedVolume ?? 0;
                            const totalVol = a.allocation.totalVolumeCapacity ?? a.allocation.truckCapacity?.usableM3 ?? 0;
                            const progress = totalVol ? Math.min(100, Math.round((occupiedVol / totalVol) * 100)) : 0;
                            const bolUrl = a.allocation.bill_of_lading?.[0]?.self_bill_url;

                            return (
                                <motion.div key={`${a.orderID}-${a.allocIndex}-${idx}`} whileHover={{ scale: 1.02 }}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            mb: 1,
                                            cursor: 'pointer',
                                            borderLeft: `5px solid ${a.color}`,
                                            boxShadow:
                                                selectedAlloc?.orderID === a.orderID && selectedAlloc.allocIndex === a.allocIndex
                                                    ? `0 0 0 2px ${a.color}`
                                                    : undefined,
                                        }}
                                        onClick={() => {
                                            setSelectedAlloc({ orderID: a.orderID, allocIndex: a.allocIndex });
                                            setFocusedAlloc({ orderID: a.orderID, allocIndex: a.allocIndex });
                                            handleFocus(pts);
                                        }}
                                    >
                                        <CardContent sx={{ p: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {a.allocation.vehicle_ID ?? 'Vehicle'}
                                                </Typography>
                                                <Box sx={{ width: 12, height: 12, bgcolor: a.color, borderRadius: '50%' }} />
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary">
                                                {a.orderID} • {a.summary || '–'}
                                            </Typography>

                                            <Divider sx={{ my: 0.5 }} />

                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {first && last
                                                    ? `${first.lat.toFixed(2)},${first.lng.toFixed(2)} → ${last.lat.toFixed(2)},${last.lng.toFixed(2)}`
                                                    : 'Location data unavailable'}
                                            </Typography>

                                            <LinearProgress
                                                variant="determinate"
                                                value={progress}
                                                sx={{ mt: 1, height: 6, borderRadius: 2 }}
                                            />

                                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<DirectionsCar />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFocusedAlloc({ orderID: a.orderID, allocIndex: a.allocIndex });
                                                        handleFocus(pts);
                                                    }}
                                                >
                                                    Focus
                                                </Button>

                                                <Button
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedAlloc({ orderID: a.orderID, allocIndex: a.allocIndex });
                                                    }}
                                                >
                                                    Details
                                                </Button>

                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewOrder(a.orderID);
                                                    }}
                                                    title="View Order"
                                                >
                                                    <Visibility />
                                                </IconButton>

                                                <Button
                                                    size="small"
                                                    disabled={!bolUrl}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (bolUrl) window.open(bolUrl, '_blank');
                                                    }}
                                                >
                                                    {bolUrl ? 'BOL' : 'No BOL'}
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </Box>
                </Box>

                {/* Map Panel */}
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    {mapsLoaded && (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={DEFAULT_CENTER}
                            zoom={6}
                        >
                            {allocationList.map((a) => {
                                const pts = a.allocation.sampledRoutePoints || [];
                                if (pts.length < 2) return null;
                                const path = pts.map((p) => ({ lat: p.lat, lng: p.lng }));
                                const isFocused =
                                    focusedAlloc?.orderID === a.orderID && focusedAlloc.allocIndex === a.allocIndex;

                                return (
                                    <React.Fragment key={`${a.orderID}-${a.allocIndex}`}>
                                        <Polyline
                                            path={path}
                                            options={{
                                                strokeColor: a.color,
                                                strokeWeight: isFocused ? 6 : 3,
                                                strokeOpacity: isFocused ? 0.9 : 0.5,
                                            }}
                                            onClick={() => {
                                                setSelectedAlloc({ orderID: a.orderID, allocIndex: a.allocIndex });
                                                setFocusedAlloc({ orderID: a.orderID, allocIndex: a.allocIndex });
                                                handleFocus(pts);
                                            }}
                                        />
                                        <Marker
                                            position={path[0]}
                                            icon={{
                                                path: google.maps.SymbolPath.CIRCLE,
                                                scale: 8,
                                                fillColor: a.color,
                                                fillOpacity: 1,
                                                strokeColor: '#ffffff',
                                                strokeWeight: 1.5,
                                            }}
                                        />
                                        <Marker
                                            position={path[path.length - 1]}
                                            icon={{
                                                path: google.maps.SymbolPath.CIRCLE,
                                                scale: 8,
                                                fillColor: a.color,
                                                fillOpacity: 1,
                                                strokeColor: '#ffffff',
                                                strokeWeight: 1.5,
                                            }}
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </GoogleMap>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default TrackingPage;
