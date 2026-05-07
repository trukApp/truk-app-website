// // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // /* eslint-disable @typescript-eslint/no-unused-vars */
// // // 'use client';

// // // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import {
// // // 	Box,
// // // 	Typography,
// // // 	Card,
// // // 	CardContent,
// // // 	Divider,
// // // 	IconButton,
// // // 	Stack,
// // // 	TextField,
// // // 	InputAdornment,
// // // 	Backdrop,
// // // 	CircularProgress,
// // // 	Chip,
// // // 	Button,
// // // } from '@mui/material';
// // // import {
// // // 	Visibility,
// // // 	Search,
// // // 	Phone,
// // // 	AccessTime,
// // // 	LocationOn,
// // // 	CheckCircle,
// // // 	HourglassBottom,
// // // } from '@mui/icons-material';
// // // import { motion } from 'framer-motion';
// // // import {
// // // 	GoogleMap,
// // // 	Polyline,
// // // 	Marker,
// // // 	useJsApiLoader,
// // // 	DirectionsRenderer,
// // // } from '@react-google-maps/api';
// // // import { useGetAllAssignedOrdersDataByStatusQuery, useGetAllAssignedOrdersDataQuery } from '@/api/apiSlice';
// // // type RoutePoint = { lat: number; lng: number };
// // // interface Driver {
// // // 	driver_name?: string;
// // // 	driver_correspondence?: { phone?: string };
// // // }

// // // interface VehicleAssignment {
// // // 	self_vehicle_num?: string;
// // // 	driver?: Driver;
// // // }

// // // interface PODStop {
// // // 	stopIndex: number;
// // // 	status: string;
// // // 	location: string;
// // // }

// // // interface Assignment {
// // // 	a_order_status?: string;
// // // 	pod?: { stops?: PODStop[] };
// // // 	vehicles?: VehicleAssignment[];
// // // }

// // // interface RouteLeg {
// // // 	start: { address: string; longitude: number; latitude: number };
// // // 	end: {
// // // 		longitude: number;
// // // 		latitude: number;
// // // 		address: string;
// // // 	};
// // // 	distance?: string;
// // // 	duration?: string;
// // // }

// // // interface Allocation {
// // // 	color(color: string, arg1: number): string | google.maps.Icon | google.maps.Symbol | undefined;
// // // 	key: any;
// // // 	sampledRoutePoints?: RoutePoint[];
// // // 	occupiedPercentUsable?: number;
// // // 	route?: RouteLeg[];
// // // }

// // // interface Order {
// // // 	order_ID: string;
// // // 	allocations?: Allocation[];
// // // 	assignments?: Assignment[];
// // // }
// // // interface LatLngPoint {
// // // 	latitude: number;
// // // 	longitude: number;
// // // 	address?: string;
// // // }

// // // interface Stop extends LatLngPoint {
// // // 	index: number;
// // // 	delivered: boolean;
// // // }
// // // type StopWithMeta = Stop & {
// // // 	allocationKey: string;
// // // 	allocationColor: string;
// // // 	stopNumber: number;
// // // 	position: { lat: number; lng: number };
// // // };

// // // const COLORS = [
// // // 	'#2E7D32',
// // // 	'#1565C0',
// // // 	'#D84315',
// // // 	'#6A1B9A',
// // // 	'#00897B',
// // // 	'#C2185B',
// // // ];

// // // const ORDER_STATUSES = [
// // // 	{ label: "Self Assigned", value: "self assigned" },
// // // 	{ label: "Assignment Pending", value: "assignment pending" },
// // // 	{ label: "CarrierAssignment", value: "carrier assignment" },
// // // 	{ label: "Carrier Confirmed", value: "carrier confirmed" },
// // // 	{ label: "Open Bidding", value: "open bidding" },
// // // 	{ label: "Bid Finalised", value: "bidding finalised" },
// // // 	{ label: "Completed", value: "completed" },
// // // ];

// // // const DEFAULT_CENTER = { lat: 16.0, lng: 80.6 };
// // // const mapContainerStyle = { width: '100%', height: '100%' };
// // // const GOOGLE_MAP_LIBRARIES: ('places')[] = ['places'];
// // // function parseDurationTime(duration: string = "0 mins"): number {
// // // 	const hoursMatch = duration.match(/(\d+)\s*hours?/);
// // // 	const minsMatch = duration.match(/(\d+)\s*mins?/);
// // // 	const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
// // // 	const mins = minsMatch ? Number(minsMatch[1]) : 0;
// // // 	return (hours * 60 + mins) * 60 * 1000;
// // // }

// // // const parseDurationToMs = (duration?: string) => {
// // // 	if (!duration) return 0;
// // // 	const h = duration.match(/(\d+)\s*hour/)?.[1];
// // // 	const m = duration.match(/(\d+)\s*min/)?.[1];
// // // 	return ((h ? +h : 0) * 60 + (m ? +m : 0)) * 60_000;
// // // };

// // // const formatTime = (date: number) =>
// // // 	new Date(date).toLocaleTimeString([], {
// // // 		hour: '2-digit',
// // // 		minute: '2-digit',
// // // 	});

// // // const TrackingPage: React.FC = () => {
// // // 	const router = useRouter();
// // // 	const mapRef = useRef<google.maps.Map | null>(null);
// // // 	const [searchText, setSearchText] = useState("");
// // // 	const [focusedKey, setFocusedKey] = useState<string | null>(null);
// // // 	const [orderStatus, setOrderStatus] = useState("self assigned");
// // // 	// const { data, isLoading } = useGetAllAssignedOrdersDataQuery({});
// // // 	const { data, isLoading } = useGetAllAssignedOrdersDataByStatusQuery({
// // // 		orderStatus,
// // // 		params: { page: 1 },
// // // 	});

// // // 	const [directionsMap, setDirectionsMap] = useState<
// // // 		Record<string, google.maps.DirectionsResult>
// // // 	>({});

// // // 	console.log("data: ", data)

// // // 	const { isLoaded } = useJsApiLoader({
// // // 		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
// // // 		libraries: GOOGLE_MAP_LIBRARIES,
// // // 	});
// // // 	const orders: Order[] = data?.orders ?? [];

// // // 	const allocationList = useMemo(() => {
// // // 		const now = Date.now();
// // // 		const list: any[] = [];

// // // 		orders.forEach((order, oIdx) => {
// // // 			const assignment = order.assignments?.[0];
// // // 			const vehicleData = assignment?.vehicles?.[0];
// // // 			const driver = vehicleData?.driver;

// // // 			order.allocations?.forEach((alloc, aIdx) => {
// // // 				if (!alloc.sampledRoutePoints?.length) return;
// // // 				const firstLeg = alloc.route?.[0];
// // // 				const durationMs = parseDurationToMs(firstLeg?.duration);
// // // 				const totalDistance: number =
// // // 					alloc.route?.reduce((sum, leg) => {
// // // 						const distanceStr = leg.distance ?? "0 km";
// // // 						const km = Number(distanceStr.replace(/[^\d.]/g, ""));
// // // 						return sum + km;
// // // 					}, 0) ?? 0;
// // // 				const totalDurationMs: number =
// // // 					alloc.route?.reduce((sum, leg) => {
// // // 						return sum + parseDurationTime(leg.duration ?? "0 mins");
// // // 					}, 0) ?? 0;
// // // 				const totalHours = Math.floor(totalDurationMs / (1000 * 60 * 60));
// // // 				const remainingMins = Math.floor((totalDurationMs / (1000 * 60)) % 60);
// // // 				const now = Date.now();
// // // 				const etaTimeMs = now + totalDurationMs;
// // // 				const etaDate = new Date(etaTimeMs);
// // // 				const options: Intl.DateTimeFormatOptions = {
// // // 					day: "2-digit",
// // // 					month: "short",
// // // 					year: "numeric",
// // // 					hour: "2-digit",
// // // 					minute: "2-digit",
// // // 					hour12: true,
// // // 				};
// // // 				const etaFormatted = new Intl.DateTimeFormat("en-GB", options).format(
// // // 					etaDate
// // // 				);
// // // 				const delayed = Date.now() > etaTimeMs;
// // // 				const podStops = assignment?.pod?.stops ?? [];
// // // 				const stops =
// // // 					alloc.route?.map((leg, idx) => {
// // // 						const pod = podStops.find((s) => s.stopIndex === idx);
// // // 						return {
// // // 							index: idx,
// // // 							address: leg.end.address,
// // // 							latitude: leg.end.latitude,
// // // 							longitude: leg.end.longitude,
// // // 							delivered: pod?.status === "completed",
// // // 						};
// // // 					}) ?? [];
// // // 				const startLatLn =
// // // 					alloc.route?.length && alloc.route[0]?.start
// // // 						? {
// // // 							latitude: alloc.route[0].start.latitude,
// // // 							longitude: alloc.route[0].start.longitude,
// // // 							address: alloc.route[0].start.address,
// // // 						}
// // // 						: null;

// // // 				list.push({
// // // 					key: `${order.order_ID}-${aIdx}`,
// // // 					orderID: order.order_ID,
// // // 					vehicle: vehicleData?.self_vehicle_num ?? "Vehicle",
// // // 					driverName: driver?.driver_name ?? "Not assigned",
// // // 					driverPhone: driver?.driver_correspondence?.phone ?? "",
// // // 					orderStatus: assignment?.a_order_status ?? "Not Yet Started",
// // // 					color: COLORS[(oIdx + aIdx) % COLORS.length],
// // // 					progress: alloc.occupiedPercentUsable ?? 0,
// // // 					startAddress: firstLeg?.start?.address ?? "—",
// // // 					distance: totalDistance ? `${totalDistance} km` : "N/A",
// // // 					duration: totalDurationMs
// // // 						? `${totalHours} hours ${remainingMins} mins`
// // // 						: "N/A",
// // // 					etaTime: etaFormatted,
// // // 					delayed,
// // // 					points: alloc.sampledRoutePoints,
// // // 					stops,
// // // 					startLatLn,
// // // 				});
// // // 			});
// // // 		});

// // // 		return list;
// // // 	}, [orders]);

// // // 	useEffect(() => {
// // // 		if (!isLoaded) return;
// // // 		if (!window.google) return;
// // // 		const service = new google.maps.DirectionsService();
// // // 		const map: Record<string, google.maps.DirectionsResult> = {};
// // // 		allocationList.forEach((alloc) => {
// // // 			const request = buildDirectionsRequest(alloc.startLatLn, alloc.stops);
// // // 			if (!request) return;
// // // 			service.route(request, (result, status) => {
// // // 				if (status === "OK" && result) {
// // // 					map[alloc.key] = result;
// // // 					setDirectionsMap((prev) => ({ ...prev, [alloc.key]: result }));
// // // 				}
// // // 			});
// // // 		});
// // // 	}, [allocationList]);

// // // 	const filteredList = useMemo(() => {
// // // 		if (!searchText) return allocationList;
// // // 		const s = searchText.toLowerCase();
// // // 		return allocationList.filter(
// // // 			(a) =>
// // // 				a.vehicle.toLowerCase().includes(s) ||
// // // 				a.driverName.toLowerCase().includes(s) ||
// // // 				a.orderID.toLowerCase().includes(s)
// // // 		);
// // // 	}, [searchText, allocationList]);

// // // 	if (!isLoaded || isLoading) {
// // // 		return (
// // // 			<Backdrop open>
// // // 				<CircularProgress />
// // // 			</Backdrop>
// // // 		);
// // // 	}
// // // 	const buildDirectionsRequest = (
// // // 		start: LatLngPoint,
// // // 		stops: Stop[]
// // // 	): google.maps.DirectionsRequest | null => {
// // // 		if (!start || !stops?.length) return null;

// // // 		return {
// // // 			origin: {
// // // 				lat: start.latitude,
// // // 				lng: start.longitude,
// // // 			},
// // // 			destination: {
// // // 				lat: stops[stops.length - 1].latitude,
// // // 				lng: stops[stops.length - 1].longitude,
// // // 			},
// // // 			waypoints: stops.slice(0, -1).map((s) => ({
// // // 				location: { lat: s.latitude, lng: s.longitude },
// // // 				stopover: true,
// // // 			})),
// // // 			travelMode: google.maps.TravelMode.DRIVING,
// // // 		};
// // // 	};

// // // 	const getNumberedPinIcon = (
// // // 		color: string,
// // // 		label: number,
// // // 		isStart: boolean = false
// // // 	): google.maps.Icon => {
// // // 		const displayText = isStart ? `S` : `${label}`;
// // // 		const svg = `
// // //     <svg width="36" height="46" viewBox="0 0 36 46" xmlns="http://www.w3.org/2000/svg">
// // //       <path
// // //         d="M18 0C8.6 0 1 7.4 1 16.5C1 29.5 18 46 18 46C18 46 35 29.5 35 16.5C35 7.4 27.4 0 18 0Z"
// // //         fill="${color}"
// // //         stroke="#000"
// // //         stroke-width="1"
// // //       />
// // //       <text
// // //         x="18"
// // //         y="22"
// // //         text-anchor="middle"
// // //         font-size="12"
// // //         font-weight="bold"
// // //         fill="#fff"
// // //         font-family="Arial"
// // //       >
// // //         ${displayText}
// // //       </text>
// // //     </svg>
// // //   `;

// // // 		return {
// // // 			url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
// // // 			scaledSize: new google.maps.Size(36, 46),
// // // 			anchor: new google.maps.Point(18, 46),
// // // 		};
// // // 	};
// // // 	return (
// // // 		<Box sx={{ height: "100vh", p: 2 }}>
// // // 			<Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap" }}>
// // // 				{ORDER_STATUSES.map((s) => (
// // // 					<Button
// // // 						key={s.value}
// // // 						size="small"
// // // 						variant={orderStatus === s.value ? "contained" : "outlined"}
// // // 						onClick={() => {
// // // 							setOrderStatus(s.value);
// // // 							setFocusedKey(null); // reset map focus
// // // 						}}
// // // 						sx={{
// // // 							textTransform: "capitalize",
// // // 							fontWeight: 600,
// // // 						}}
// // // 					>
// // // 						{s.label}
// // // 					</Button>
// // // 				))}
// // // 			</Stack>

// // // 			<Box
// // // 				sx={{
// // // 					display: "grid",
// // // 					gridTemplateColumns: "420px 1fr",
// // // 					gap: 2,
// // // 					height: "calc(100% - 64px)",
// // // 				}}
// // // 			>
// // // 				<Box sx={{ overflowY: "auto" }}>
// // // 					<TextField
// // // 						size="small"
// // // 						fullWidth
// // // 						placeholder="Search vehicle / driver / order"
// // // 						value={searchText}
// // // 						onChange={(e) => setSearchText(e.target.value)}
// // // 						InputProps={{
// // // 							startAdornment: (
// // // 								<InputAdornment position="start">
// // // 									<Search />
// // // 								</InputAdornment>
// // // 							),
// // // 						}}
// // // 					/>

// // // 					{filteredList.map((a) => (
// // // 						<motion.div key={a.key} whileHover={{ scale: 1.02 }}>
// // // 							<Card
// // // 								sx={{
// // // 									mt: 1,
// // // 									// cursor: "pointer",
// // // 									borderLeft: `6px solid ${a.color}`,
// // // 									boxShadow:
// // // 										focusedKey === a.key ? `0 0 0 2px ${a.color}` : undefined,
// // // 								}}
// // // 							>
// // // 								<CardContent>
// // // 									<Stack
// // // 										direction="row"
// // // 										justifyContent="space-between"
// // // 										alignItems="center"
// // // 									>
// // // 										<Chip
// // // 											size="small"
// // // 											sx={{ mt: 0.1 }}
// // // 											color={
// // // 												a.orderStatus === "In-transit" ? "info" : "success"
// // // 											}
// // // 											label={a.orderStatus}
// // // 										/>
// // // 										<Typography fontWeight={700}>{a.orderID}</Typography>
// // // 										<Typography fontWeight={700}>{a.vehicle}</Typography>

// // // 										<IconButton
// // // 											onClick={(e) => {
// // // 												e.stopPropagation();
// // // 												router.push(
// // // 													`/detailed-order-overview?order_ID=${a.orderID}&from=tracking`
// // // 												);
// // // 											}}
// // // 										>
// // // 											<Visibility />
// // // 										</IconButton>
// // // 									</Stack>
// // // 									<Stack
// // // 										direction="row"
// // // 										spacing={1.5}
// // // 										alignItems="center"
// // // 										mt={1}
// // // 									>
// // // 										<Stack direction="row" alignItems="center" spacing={4}>
// // // 											<Typography variant="body2">{a.driverName}</Typography>

// // // 											{a.driverPhone && (
// // // 												<Stack
// // // 													direction="row"
// // // 													spacing={0.2}
// // // 													alignItems="center"
// // // 												>
// // // 													<Phone sx={{ fontSize: 17 }} color="primary" />
// // // 													<Typography
// // // 														variant="caption"
// // // 														component="a"
// // // 														href={`tel:${a.driverPhone}`}
// // // 														sx={{
// // // 															textDecoration: "none",
// // // 															color: "primary.main",
// // // 															fontWeight: 600,
// // // 														}}
// // // 													>
// // // 														{a.driverPhone}
// // // 													</Typography>
// // // 												</Stack>
// // // 											)}
// // // 										</Stack>
// // // 									</Stack>

// // // 									<Divider sx={{ my: 1 }} />
// // // 									<Stack direction="column">
// // // 										{" "}
// // // 										<Typography variant="caption" fontWeight={600}>
// // // 											Start from :{" "}
// // // 											{a.startAddress.split(", ").slice(-3).join(", ")}
// // // 										</Typography>
// // // 										<Typography variant="caption" fontWeight={600}>
// // // 											Stops :
// // // 										</Typography>
// // // 									</Stack>

// // // 									{a.stops.map((s: any) => (
// // // 										<Stack
// // // 											key={s.index}
// // // 											direction="row"
// // // 											spacing={1}
// // // 											alignItems="center"
// // // 										>
// // // 											<LocationOn fontSize="small" />
// // // 											<Typography variant="caption" sx={{ flex: 1 }}>
// // // 												{s.address}
// // // 											</Typography>
// // // 											{s.delivered ? (
// // // 												<CheckCircle fontSize="small" color="success" />
// // // 											) : (
// // // 												<HourglassBottom fontSize="small" color="warning" />
// // // 											)}
// // // 										</Stack>
// // // 									))}

// // // 									<Stack direction="row" spacing={1} mt={1}>
// // // 										<Chip size="small" label={`🛣️ ${a.distance}`} />
// // // 										<Chip size="small" label={`⏰ ${a.duration}`} />
// // // 									</Stack>
// // // 									<Stack direction="row" spacing={1} alignItems="center" mt={1}>
// // // 										<AccessTime sx={{ fontSize: 18 }} />
// // // 										<Typography sx={{ fontWeight: 500, fontSize: 14 }}>
// // // 											ETA : {a.etaTime}
// // // 										</Typography>
// // // 										<Chip
// // // 											size="small"
// // // 											color={a.delayed ? "error" : "success"}
// // // 											label={a.delayed ? "Delayed" : "On Time"}
// // // 										/>
// // // 										<Button
// // // 											variant="contained"
// // // 											size="small"
// // // 											sx={{
// // // 												cursor: "pointer",
// // // 												fontSize: "12px",
// // // 												padding: "4px 8px",
// // // 												textTransform: "capitalize",
// // // 											}}
// // // 											onClick={() => {
// // // 												setFocusedKey((prev) =>
// // // 													prev === a.key ? null : a.key
// // // 												);

// // // 												mapRef.current?.panTo(
// // // 													a.points[Math.floor(a.points.length / 2)]
// // // 												);
// // // 												mapRef.current?.setZoom(8);
// // // 											}}
// // // 										>
// // // 											View Route
// // // 										</Button>
// // // 									</Stack>
// // // 								</CardContent>
// // // 							</Card>
// // // 						</motion.div>
// // // 					))}
// // // 				</Box>
// // // 				<GoogleMap
// // // 					mapContainerStyle={mapContainerStyle}
// // // 					center={DEFAULT_CENTER}
// // // 					zoom={10}
// // // 					onLoad={(map: google.maps.Map) => {
// // // 						mapRef.current = map;
// // // 					}}
// // // 				>
// // // 					{Object.entries(directionsMap)
// // // 						.filter(([key]) => !focusedKey || key === focusedKey)
// // // 						.map(([key, directions]) => {
// // // 							const allocation = allocationList.find((a) => a.key === key);
// // // 							return (
// // // 								<DirectionsRenderer
// // // 									key={key}
// // // 									directions={directions as google.maps.DirectionsResult}
// // // 									options={{
// // // 										suppressMarkers: true,
// // // 										polylineOptions: {
// // // 											strokeColor: allocation?.color,
// // // 											strokeWeight: focusedKey === key ? 6 : 3,
// // // 											strokeOpacity: focusedKey === key ? 0.9 : 0.4,
// // // 										},
// // // 									}}
// // // 								/>
// // // 							);
// // // 						})}

// // // 					{allocationList
// // // 						.filter((a) => !focusedKey || a.key === focusedKey)
// // // 						.flatMap((a) => {
// // // 							const startMarker = a.startLatLn
// // // 								? [
// // // 									<Marker
// // // 										key={`${a.key}-start`}
// // // 										position={{
// // // 											lat: a.startLatLn.latitude,
// // // 											lng: a.startLatLn.longitude,
// // // 										}}
// // // 										icon={getNumberedPinIcon(a.color, 1, true)}
// // // 									/>,
// // // 								]
// // // 								: [];
// // // 							const stopsMarkers = a.stops.map((stop: { latitude: number; longitude: number; }, idx: number) => (
// // // 								<Marker
// // // 									key={`${a.key}-stop-${idx}`}
// // // 									position={{ lat: stop.latitude, lng: stop.longitude }}
// // // 									icon={getNumberedPinIcon(a.color, idx + 1, false)}
// // // 								/>
// // // 							));
// // // 							return [...startMarker, ...stopsMarkers];
// // // 						})}
// // // 				</GoogleMap>
// // // 			</Box>
// // // 		</Box>
// // // 	);
// // // };

// // // export default TrackingPage;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import {Shipment,ShipmentRow, AlertItem, Insight,} from "@/types/shipment";

import {GoogleMap, Marker, Polyline, useJsApiLoader,} from "@react-google-maps/api";

import { useShipmentDashoardQuery } from "@/api/apiSlice";
import { useRouter } from "next/navigation";

const getRiskColor = (risk: string) => {
  switch (risk?.toLowerCase()) {
    case "high":
      return "#ef4444";
    case "medium":
      return "#f59e0b";
    default:
      return "#22c55e";
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "delayed":
      return "#7f1d1d";
    case "assigned":
      return "#1e3a8a";
    case "in transit":
      return "#78350f";
    default:
      return "#065f46";
  }
};

const getModeColor = (mode: string) => {
  switch (mode?.toLowerCase()) {
    case "road":
      return "#1e40af";
    case "rail":
      return "#065f46";
    case "air":
      return "#7c2d12";
    default:
      return "#4c1d95";
  }
};

const TrackingPage = () => {
  const router = useRouter();
  const [tab, setTab] = useState("ALL");
  // const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | false>(false);
  const { data, isLoading } = useShipmentDashoardQuery({});
//   const GOOGLE_LIBRARIES: "places"[] = ["places"];

const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];

const { isLoaded } = useJsApiLoader({
  id: "google-map-script",
  googleMapsApiKey:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  libraries: GOOGLE_MAPS_LIBRARIES,
});
  const summary = data?.summary || {};

const shipments: ShipmentRow[] = useMemo(() => {
  return (
    data?.shipments?.map((item: Shipment) => ({
      id: item.id,
      route: `${item.start} → ${item.stop}`,
      mode: item.mode || "Road",
      status: item.status || "Assigned",
      eta: item?.stops?.[0]?.planned_eta || "Not Available",
      progress: item.progress || 0,
      risk: item.risk || "Low",
      path: item.path || [],
      vehicle:
        item.assignment?.assigned_vehicle_data?.[0]
          ?.self_vehicle_num || "N/A",
      trackingStatus:
        item?.tracking?.tracking_status || "created",

      current_position: item.current_position || null,
    })) || []
  );
}, [data]);

  useEffect(() => {
    if (shipments.length > 0 && !selectedOrderId) {
      setSelectedOrderId(shipments[0].id);
    }
  }, [shipments, selectedOrderId]);

  const orderAlerts = useMemo(() => {
    const alertList: AlertItem[] = [];

    data?.shipments?.forEach((shipment: Shipment) => {
      shipment?.insights?.forEach((insight: Insight) => {
        const level = insight.tag || "LOW";

        alertList.push({
          orderId: shipment.id,
          text: insight.insight,
          level:
            level === "HIGH"
              ? "CRITICAL"
              : level === "MEDIUM"
                ? "WARNING"
                : "INFO",
          color:
            level === "HIGH"
              ? "#7f1d1d"
              : level === "MEDIUM"
                ? "#78350f"
                : "#1e3a8a",
          icon:
            level === "HIGH" ? (
              <ErrorIcon fontSize="small" />
            ) : level === "MEDIUM" ? (
              <WarningAmberIcon fontSize="small" />
            ) : (
              <InfoIcon fontSize="small" />
            ),
          time: "Live",
        });
      });
    });

    return alertList;
  }, [data]);

  const filteredAlerts = orderAlerts.filter((alert: AlertItem) => {
    const matchesLevel = tab === "ALL" ? true : alert.level === tab;

    const matchesOrder = !selectedOrderId || alert.orderId === selectedOrderId;

    return matchesLevel && matchesOrder;
  });

  const insights = useMemo(() => {
    return data?.shipments?.[0]?.insights || [];
  }, [data]);

  if (isLoading) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#0b1220"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, bgcolor: "#0b1220", minHeight: "100%" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#fff"
        mb={2}
        sx={{
          letterSpacing: 1,
          textDecoration: "underline",
        }}
      >
        Orders Tracking Dashboard
      </Typography>

      <Grid container spacing={2} mb={2}>
        {[
          {
            title: "Active Shipments",
            value: summary.activeShipments || 0,
          },
          {
            title: "On-Time Delivery",
            value: `${summary.onTimeDelivery || 0}%`,
          },
          {
            title: "Active Alerts",
            // value: alerts.length,
            value: orderAlerts.length,
          },
          {
            title: "Avg Transit Time",
            value: `${summary.avgTransitTime || 0} hrs`,
          },
        ].map((item, i) => (
          <Grid item xs={12} md={3} key={i}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: "linear-gradient(135deg,#1e293b,#0f172a)",
                color: "#fff",
              }}
            >
              <Typography fontSize={12} color="gray">
                {item.title}
              </Typography>

              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          minHeight: 420,
          alignItems: "stretch",
        }}
      >
        {/* MAP */}
<Grid item xs={12} md={9}>
  <Box
    sx={{
      height: "100%",
      borderRadius: 2,
      overflow: "hidden",
      position: "relative",
    }}
  >
    {isLoaded && (
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        center={{
          lat: 17.385,
          lng: 78.4867,
        }}
        zoom={7}
      >
        {(() => {
          const routeColors = [
            "#ef4444",
            "#3b82f6",
            "#22c55e",
            "#f59e0b",
            "#a855f7",
            "#06b6d4",
            "#ec4899",
            "#84cc16",
          ];

          return shipments.map((route: ShipmentRow, i: number) => {
            const color =
              routeColors[i % routeColors.length];

            const startPoint = route.path?.[0];
            const endPoint =
              route.path?.[route.path.length - 1];

            return (
              <React.Fragment key={route.id}>
                {/* ROUTE LINE */}
                <Polyline
                  path={route.path}
                  options={{
                    strokeColor: color,
                    strokeOpacity: 0.9,
                    strokeWeight: 5,
                  }}
                />

                {/* START MARKER */}
                {startPoint && (
                  <Marker
                    position={startPoint}
                    label={{
                      text: `S${i + 1}`,
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                    title={`${route.id} Start`}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      fillColor: color,
                      fillOpacity: 1,
                      strokeColor: "#fff",
                      strokeWeight: 2,
                      scale: 10,
                    }}
                  />
                )}

                {/* END MARKER */}
                {endPoint && (
                  <Marker
                    position={endPoint}
                    label={{
                      text: `E${i + 1}`,
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                    title={`${route.id} End`}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      fillColor: color,
                      fillOpacity: 1,
                      strokeColor: "#fff",
                      strokeWeight: 2,
                      scale: 10,
                    }}
                  />
                )}

                {/* SHIPMENT ID LABEL */}
                {startPoint && (
                  <Marker
                    position={{
                      lat: startPoint.lat + 0.05,
                      lng: startPoint.lng,
                    }}
                    label={{
                      text: route.id,
                      color: color,
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 0,
                    }}
                  />
                )}

                {/* LIVE TRUCK */}
                {route.current_position && (
                  <Marker
                    position={{
                      lat: Number(
                        route.current_position.latitude
                      ),
                      lng: Number(
                        route.current_position.longitude
                      ),
                    }}
                    title={`${route.id} Vehicle`}
                    icon={{
                      url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
                      scaledSize:
                        new window.google.maps.Size(
                          42,
                          42
                        ),
                    }}
                  />
                )}
              </React.Fragment>
            );
          });
        })()}
      </GoogleMap>
    )}

    {/* MAP LEGEND */}
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        bgcolor: "rgba(17,24,39,0.95)",
        p: 1.5,
        borderRadius: 2,
        minWidth: 180,
      }}
    >
      <Typography
        color="#fff"
        fontSize={13}
        fontWeight={700}
        mb={1}
      >
        Shipment Routes
      </Typography>

      {shipments.map((route: ShipmentRow, i: number) => {
        const routeColors = [
          "#ef4444",
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#a855f7",
          "#06b6d4",
          "#ec4899",
          "#84cc16",
        ];

        return (
          <Box
            key={route.id}
            display="flex"
            alignItems="center"
            gap={1}
            mb={0.8}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                bgcolor:
                  routeColors[i % routeColors.length],
              }}
            />

            <Typography
              color="#fff"
              fontSize={12}
            >
              {route.id}
            </Typography>
          </Box>
        );
      })}
    </Box>
  </Box>
</Grid>
        {/* ALERTS */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              bgcolor: "#111827",
              p: 2,
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* HEADER */}
            <Typography color="#fff" fontWeight={600} mb={1.5}>
              Live Alerts
            </Typography>

            {/* ORDER TABS */}
            {/* <Tabs
							value={selectedOrderId}
							onChange={(e, v) => setSelectedOrderId(v)}
							variant="scrollable"
							scrollButtons="auto"
							textColor="inherit"
							indicatorColor="primary"
							sx={{
								minHeight: 34,
								mb: 1.5,

								"& .MuiTabs-flexContainer": {
									gap: 1,
								},

								"& .MuiTab-root": {
									minHeight: 34,
									minWidth: "auto",
									fontSize: 11,
									fontWeight: 600,
									textTransform: "none",
									color: "#9ca3af",
									borderRadius: "8px",
									bgcolor: "#1f2937",
									px: 1.5,
								},

								"& .Mui-selected": {
									color: "#fff !important",
									bgcolor: "#2563eb",
								},

								"& .MuiTabs-indicator": {
									display: "none",
								},
							}}
						>
							{shipments.map((shipment: any) => (
								<Tab
									key={shipment.id}
									label={shipment.id}
									value={shipment.id}
								/>
							))}
						</Tabs> */}
            <Tabs
              // value={selectedOrderId}
              value={
                shipments.some((s: ShipmentRow) => s.id === selectedOrderId)
                  ? selectedOrderId
                  : false
              }
              onChange={(e, v) => {
                setSelectedOrderId(v);
                setTab("ALL"); // RESET FILTER
              }}
              variant="scrollable"
              scrollButtons="auto"
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                minHeight: 34,
                mb: 1.5,

                "& .MuiTabs-flexContainer": {
                  gap: 1,
                },

                "& .MuiTab-root": {
                  minHeight: 34,
                  minWidth: "auto",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#9ca3af",
                  borderRadius: "8px",
                  bgcolor: "#1f2937",
                  px: 1.5,
                },

                "& .Mui-selected": {
                  color: "#fff !important",
                  bgcolor: "#2563eb",
                },

                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              {shipments.map((shipment: ShipmentRow) => (
                <Tab
                  key={shipment.id}
                  label={shipment.id}
                  value={shipment.id}
                />
              ))}
            </Tabs>

            {/* ALERT TYPE TABS */}
            <Tabs
              value={tab}
              onChange={(e, v) => setTab(v)}
              variant="fullWidth"
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                minHeight: 32,
                mb: 1.5,

                "& .MuiTab-root": {
                  fontSize: 11,
                  minHeight: 32,
                  color: "#9ca3af",
                  textTransform: "none",
                  fontWeight: 600,
                },

                "& .Mui-selected": {
                  color: "#fff",
                },
              }}
            >
              <Tab label="All" value="ALL" />
              <Tab label="Critical" value="CRITICAL" />
              <Tab label="Warning" value="WARNING" />
              <Tab label="Info" value="INFO" />
            </Tabs>

            {/* ALERT CARDS */}
            <Box
              sx={{
                overflowY: "auto",
                flex: 1,
                pr: 0.5,
              }}
            >
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((a: AlertItem, i: number) => (
                  <Box
                    key={i}
                    sx={{
                      mb: 1.2,
                      p: 1.2,
                      borderRadius: 1.5,
                      background: a.color,
                      borderLeft: `4px solid ${
                        a.level === "CRITICAL"
                          ? "#ef4444"
                          : a.level === "WARNING"
                            ? "#f59e0b"
                            : "#3b82f6"
                      }`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.6,
                    }}
                  >
                    {/* TOP */}
                    <Box display="flex" alignItems="center" gap={1}>
                      {a.icon}

                      <Typography fontSize={11} fontWeight={600} color="#fff">
                        {a.level}
                      </Typography>

                      <Chip
                        label={a.orderId}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 10,
                          bgcolor: "rgba(255,255,255,0.15)",
                          color: "#fff",
                        }}
                      />

                      <Typography ml="auto" fontSize={10} color="#d1d5db">
                        {a.time}
                      </Typography>
                    </Box>

                    {/* MESSAGE */}
                    <Typography
                      fontSize={12.5}
                      color="#fff"
                      sx={{
                        lineHeight: 1.4,
                      }}
                    >
                      {a.text}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography color="gray" fontSize={13}>
                    No alerts available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2}>
        {insights.map((i: Insight, idx: number) => (
          <Grid item xs={12} md={3} lg={2.4} key={idx}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#111827",
                color: "#fff",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography fontSize={12} color="gray" mb={0.5}>
                {i.title}
              </Typography>

              <Typography fontSize={13} mb={1}>
                {i.insight}
              </Typography>

              <Typography
                fontSize={11}
                fontWeight={600}
                sx={{
                  color:
                    i.tag === "HIGH"
                      ? "#ef4444"
                      : i.tag === "MEDIUM"
                        ? "#f59e0b"
                        : "#22c55e",
                }}
              >
                {i.tag}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box mt={3} bgcolor="#111827" p={2} borderRadius={2}>
        <Typography color="#fff" mb={2} fontWeight={600}>
          Active Shipments
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: 1100 }}>
            {/* HEADER */}

            <Box
              display="grid"
              gridTemplateColumns="1fr 2fr 1fr 1fr 1.5fr 1.5fr 1fr 1fr 0.6fr"
              alignItems="center"
              pb={1}
              mb={1}
              borderBottom="1px solid #1f2937"
              color="#9ca3af"
              fontSize={12}
            >
              <span>Shipment ID</span>
              <span>Route</span>
              <span style={{ textAlign: "center" }}>Vehicle</span>
              <span style={{ textAlign: "center" }}>Mode</span>
              <span style={{ textAlign: "center" }}>Status</span>
              <span style={{ textAlign: "center" }}>Progress</span>
              <span style={{ textAlign: "center" }}>Risk</span>
              <span style={{ textAlign: "center" }}>ETA</span>
              <span></span>
            </Box>

            {/* ROWS */}

            {shipments.map((row: ShipmentRow, i: number) => (
              <Box
                key={i}
                display="grid"
                gridTemplateColumns="1fr 2fr 1fr 1fr 1.5fr 1.5fr 1fr 1fr 0.6fr"
                alignItems="center"
                py={1.6}
                borderBottom="1px solid #1f2937"
                color="#fff"
              >
                <Typography fontWeight={600}>{row.id}</Typography>

                <Typography fontSize={13}>{row.route}</Typography>

                <Typography textAlign="center" fontSize={13}>
                  {row.vehicle}
                </Typography>

                <Box display="flex" justifyContent="center">
                  <Chip
                    size="small"
                    label={row.mode}
                    sx={{
                      bgcolor: getModeColor(row.mode),
                      color: "#fff",
                      fontSize: 11,
                    }}
                  />
                </Box>

                <Box display="flex" justifyContent="center">
                  <Chip
                    size="small"
                    label={row.status}
                    sx={{
                      bgcolor: getStatusColor(row.status),
                      color: "#fff",
                      fontSize: 11,
                    }}
                  />
                </Box>

                <Box textAlign="center">
                  <LinearProgress
                    variant="determinate"
                    value={row.progress}
                    sx={{
                      height: 6,
                      borderRadius: 5,
                      mb: 0.4,
                      backgroundColor: "#1f2937",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          row.progress > 75
                            ? "#22c55e"
                            : row.progress > 50
                              ? "#f59e0b"
                              : "#ef4444",
                      },
                    }}
                  />

                  <Typography fontSize={11}>{row.progress}%</Typography>
                </Box>

                <Typography
                  textAlign="center"
                  fontWeight={600}
                  sx={{
                    color: getRiskColor(row.risk),
                  }}
                >
                  {row.risk}
                </Typography>

                <Typography textAlign="center" fontSize={12}>
                  {row.eta}
                </Typography>

                <Box display="flex" justifyContent="center">
                  <Box display="flex" justifyContent="center">
                    <VisibilityIcon
                      onClick={() =>
                        router.push(
                          `/detailed-order-overview?order_ID=${row.id}&from=tracking`,
                        )
                      }
                      sx={{
                        cursor: "pointer",
                        color: "#9ca3af",
                        transition: "0.2s",
                        "&:hover": {
                          color: "#fff",
                          transform: "scale(1.15)",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TrackingPage;
