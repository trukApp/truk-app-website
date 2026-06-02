"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Grid, Chip, LinearProgress, Tabs, Tab, CircularProgress, Dialog, DialogContent, IconButton, Button, } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { Shipment, ShipmentRow, AlertItem, Insight } from "@/types/shipment";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useShipmentDashoardQuery } from "@/api/apiSlice";
import { useRouter } from "next/navigation";
import { useTheme, alpha } from "@mui/material/styles";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RouteIcon from "@mui/icons-material/Route";
import TrafficIcon from "@mui/icons-material/Traffic";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import TrainIcon from "@mui/icons-material/Train";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import BoltIcon from "@mui/icons-material/Bolt";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

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
	const theme = useTheme();
	const router = useRouter();
	const [tab, setTab] = useState("ALL");
	const [selectedOrderId, setSelectedOrderId] = useState<string | false>(false);
	const [statusFilter, setStatusFilter] = useState<string>("Active");
	const { data, isLoading } = useShipmentDashoardQuery({});
	const [openMap, setOpenMap] = useState(false);
	const [trackedShipment, setTrackedShipment] = useState<ShipmentRow | null>(null);
	const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
	const [mapZoom, setMapZoom] = useState<number>(7);
	const [mapCenter, setMapCenter] = useState({ lat: 17.385, lng: 78.4867 });
	const GOOGLE_MAPS_LIBRARIES: "places"[] = ["places"];
	const { isLoaded } = useJsApiLoader({ id: "google-map-script", googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", libraries: GOOGLE_MAPS_LIBRARIES, });
	const summary = data?.summary || {};
	console.log("Fetched Shipments:", data?.shipments.length)
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
				vehicle: item.assignment?.assigned_vehicle_data?.[0]?.self_vehicle_num || "N/A",
				trackingStatus: item?.tracking?.tracking_status || "created",
				current_position: item.current_position || null,
			})) || []
		);
	}, [data]);

	const filteredShipments = useMemo(() => {
		if (statusFilter === "ALL") return shipments;

		return shipments.filter(
			(item: ShipmentRow) =>
				item.status?.toLowerCase() === statusFilter.toLowerCase()
		);
	}, [shipments, statusFilter]);

	useEffect(() => {
		if (shipments.length > 0 && !selectedOrderId) { setSelectedOrderId(shipments[0].id); }
	}, [shipments, selectedOrderId]);

	const orderAlerts = useMemo(() => {
		const alertList: AlertItem[] = [];
		data?.shipments?.forEach((shipment: Shipment) => {
			shipment?.insights?.forEach((insight: Insight) => {
				const level = insight.tag || "LOW";
				alertList.push({
					orderId: shipment.id,
					text: insight.insight,
					level: level === "HIGH" ? "CRITICAL" : level === "MEDIUM" ? "WARNING" : "INFO",
					color: level === "HIGH" ? "#7f1d1d" : level === "MEDIUM" ? "#78350f" : "#1e3a8a",
					icon: level === "HIGH" ? (
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
	const handleTrackShipment = (shipment: ShipmentRow) => {
		setTrackedShipment(shipment);
		setOpenMap(true);
	};
	return (
		<Box sx={{ p: 2, minHeight: "100%", bgcolor: "#f4f6f8" }}
		>
			<Typography
				variant="h5"
				fontWeight="bold"
				color="primary.main"
				mb={2}
				sx={{ letterSpacing: 0.5 }}
			>
				Orders Tracking Dashboard
			</Typography>

			<Grid container spacing={2} mb={2}>
				{[
					{
						title: "Active Shipments",
						value: summary.activeShipments || 0,
						filter: "Active",
						icon: <LocalShippingIcon fontSize="small" />,
					},
					{
						title: "On Track shipments",
						value: summary.onTrackShipments || 0,
						filter: "In Transit",
						icon: <CheckCircleIcon fontSize="small" />,
					},
					{
						title: "Delayed shipments",
						value: summary.delayedShipments || 0,
						filter: "Delayed",
						icon: <WarningAmberIcon fontSize="small" />,
					},
					{
						title: "Critical shipments",
						value: summary.criticalShipments || 0,
						filter: "Critical",
						icon: <ErrorOutlineIcon fontSize="small" />,
					},
					{
						title: "Planned shipments",
						value: summary.plannedShipments || 0,
						filter: "Planned",
						icon: <RouteIcon fontSize="small" />,
					},
				].map((item, i) => {
					const active = statusFilter === item.filter;

					return (
						<Grid item xs={12} md={2.4} key={i}>
							<Box
								onClick={() => {
									setStatusFilter(item.filter);

									// RESET ROUTE SELECTION
									setSelectedRouteId(null);

									setMapZoom(7);

									setMapCenter({
										lat: 17.385,
										lng: 78.4867,
									});
								}}
								sx={{
									p: 2,
									borderRadius: 3,
									bgcolor: active
										? theme.palette.primary.main
										: "#ffffff",
									color: active ? "#fff" : "#111827",
									cursor: "pointer",
									transition: "0.25s",
									border: active
										? `1px solid ${theme.palette.primary.main}`
										: "1px solid #e5e7eb",
									boxShadow: active
										? "0 6px 18px rgba(240,140,36,0.25)"
										: "0 2px 10px rgba(0,0,0,0.06)",

									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
									},
								}}>
								{/* <Typography fontSize={12} color={active ? "#fde7cf" : "text.secondary"}>
									{item.title}
								</Typography> */}
								<Box
									display="flex"
									alignItems="center"
									justifyContent="space-between"
									mb={1}
								>
									<Typography
										fontSize={12}
										color={active ? "#fde7cf" : "text.secondary"}
									>
										{item.title}
									</Typography>

									<Box
										sx={{
											width: 32,
											height: 32,
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											bgcolor: active
												? "rgba(255,255,255,0.18)"
												: alpha(theme.palette.primary.main, 0.12),
											color: active
												? "#fff"
												: theme.palette.primary.main,
										}}
									>
										{item.icon}
									</Box>
								</Box>

								<Typography variant="h5" fontWeight="bold">
									{item.value}
								</Typography>
							</Box>
						</Grid>
					);
				})}
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
							borderRadius: 3,
							overflow: "hidden",
							position: "relative",
							bgcolor: "#fff",
							border: "1px solid #e5e7eb",
							boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
						}}
					>
						{filteredShipments.length === 0 ? (
							<Box
								sx={{
									height: "100%",
									minHeight: 420,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									bgcolor: "#111827",
									borderRadius: 2,
								}}
							>
								<Typography
									color="#9ca3af"
									fontSize={18}
									fontWeight={600}
									textTransform="capitalize"
								>
									There are no {statusFilter.toLowerCase()} shipments
								</Typography>
							</Box>
						) : (
							isLoaded && (
								<GoogleMap
									mapContainerStyle={{
										width: "100%",
										height: "100%",
									}}
									center={mapCenter}
									zoom={mapZoom}
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

										return filteredShipments.map(
											(route: ShipmentRow, i: number) => {
												const isSelected =
													selectedRouteId === null ||
													selectedRouteId === route.id;


												const color =
													routeColors[i % routeColors.length];

												const startPoint = route.path?.[0];

												const endPoint =
													route.path?.[
													route.path.length - 1
													];

												return (
													<React.Fragment key={route.id}>
														<Polyline
															path={route.path}
															options={{
																strokeColor: color,
																strokeOpacity: isSelected
																	? 1
																	: 0.15,
																strokeWeight: isSelected
																	? 7
																	: 4,
																zIndex: isSelected
																	? 999
																	: 1,
															}}
														/>

														{startPoint && (
															<Marker
																position={startPoint}
																opacity={
																	isSelected ? 1 : 0.2
																}
																label={{
																	text: `S${i + 1}`,
																	color: "#fff",
																	fontWeight: "bold",
																}}
																title={`${route.id} Start`}
																icon={{
																	path: window.google
																		.maps.SymbolPath
																		.CIRCLE,
																	fillColor: color,
																	fillOpacity: 1,
																	strokeColor: "#fff",
																	strokeWeight: 2,
																	scale: 10,
																}}
															/>
														)}

														{endPoint && (
															<Marker
																position={endPoint}
																opacity={
																	isSelected ? 1 : 0.2
																}
																label={{
																	text: `E${i + 1}`,
																	color: "#fff",
																	fontWeight: "bold",
																}}
																title={`${route.id} End`}
																icon={{
																	path: window.google
																		.maps.SymbolPath
																		.CIRCLE,
																	fillColor: color,
																	fillOpacity: 1,
																	strokeColor: "#fff",
																	strokeWeight: 2,
																	scale: 10,
																}}
															/>
														)}

														{route.current_position && (
															<Marker
																opacity={
																	isSelected ? 1 : 0.2
																}
																position={{
																	lat: Number(
																		route.current_position
																			.latitude
																	),
																	lng: Number(
																		route.current_position
																			.longitude
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
											}
										);
									})()}
								</GoogleMap>
							)
						)}
						{/* MAP LEGEND */}
						{/* <Box
							sx={{
								position: "absolute",
								top: 10,
								right: 10,
								bgcolor: "rgba(255,255,255,0.96)",
								p: 1.5,
								borderRadius: 2,
								minWidth: 180,
								maxHeight: "75%",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Typography
								color="#111827"
								fontSize={13}
								fontWeight={700}
								mb={1}
							>
								Shipment Routes
							</Typography>

							<Typography
								// color="#9ca3af"
								color="#111827"
								fontSize={11}
								mb={1}
							>
								{statusFilter === "ALL"
									? "Showing all routes"
									: `Filtered: ${statusFilter}`}
							</Typography>

							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								mb={1.5}
							>
								<Box
									onClick={() => {
										setSelectedRouteId(null);
										setMapZoom(7);
										setMapCenter({
											lat: 17.385,
											lng: 78.4867,
										});
									}}
									sx={{
										px: 1,
										py: 0.5,
										borderRadius: 1,
										// bgcolor: "#2563eb",
										bgcolor: "primary.main",
										color: "#fff",
										fontSize: 11,
										cursor: "pointer",
										"&:hover": {
											bgcolor: "#d97706",
										}
									}}
								>
									View All
								</Box>
							</Box>

							<Box
								sx={{
									overflowY: "auto",
									pr: 0.5,
									maxHeight: "100%",
									"&::-webkit-scrollbar": {
										width: "6px",
									},
									"&::-webkit-scrollbar-thumb": {
										background: "#374151",
										borderRadius: "10px",
									},
									"&::-webkit-scrollbar-track": {
										background: "transparent",
									},

								}}
							>
								{filteredShipments.map(
									(route: ShipmentRow, i: number) => {
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
												onClick={() => {
													setSelectedRouteId(route.id);

													const firstPoint =
														route.path?.[0];

													if (firstPoint) {
														setMapCenter(firstPoint);
														setMapZoom(10);
													}
												}}
												sx={{
													cursor: "pointer",
													p: 0.8,
													borderRadius: 1,
													transition: "0.2s",
													// bgcolor:
													// 	selectedRouteId ===
													// 	route.id
													// 		? "rgba(37,99,235,0.25)"
													// 		: "transparent",
													bgcolor:
														selectedRouteId === route.id
															? alpha(theme.palette.primary.main, 0.12)
															: "transparent",
													// "&:hover": {
													// 	bgcolor:
													// 		"rgba(255,255,255,0.08)",
													// },
													"&:hover": {
														bgcolor: "#f3f4f6",
													},
												}}
											>
												<Box
													sx={{
														width: 14,
														height: 14,
														borderRadius: "50%",
														bgcolor:
															routeColors[
															i %
															routeColors.length
															],
													}}
												/>

												<Typography
													// color="#fff"
													color="#111827"
													fontSize={12}
												>
													{route.id}
												</Typography>
											</Box>
										);
									}
								)}
							</Box>
						</Box> */}
					</Box>
				</Grid>
				{/* ALERTS */}
				<Grid item xs={12} md={3}>
					<Box
						sx={{
							// bgcolor: "#111827",
							bgcolor: "#fff",
							p: 2,
							borderRadius: 2,
							height: "100%",
							display: "flex",
							flexDirection: "column",
							border: "1px solid #e5e7eb",
							boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
						}}
					>
						{/* HEADER */}
						<Box display="flex" alignItems="center" gap={1} mb={1.5}>
							<WarningAmberIcon
								sx={{
									color: "#f59e0b",
									fontSize: 20,
								}}
							/>

							<Typography
								fontWeight={700}
								color="#111827"
							>
								Live Alerts
							</Typography>
						</Box>
						{/* ORDER TABS */}
						<Tabs
							value={
								shipments.some((s: ShipmentRow) => s.id === selectedOrderId) ? selectedOrderId : false
							}
							onChange={(e, v) => {
								setSelectedOrderId(v);
								setTab("ALL");
							}}
							variant="scrollable"
							scrollButtons="auto"
							textColor="inherit"
							indicatorColor="primary"
							sx={{
								minHeight: 34,
								mb: 1.5,
								"& .MuiTabs-flexContainer": { gap: 1 },
								"& .MuiTab-root": {
									minHeight: 34,
									minWidth: "auto",
									fontSize: 11,
									fontWeight: 600,
									textTransform: "none",
									color: "#6b7280",
									borderRadius: "8px",
									bgcolor: "#f3f4f6",
									px: 1.5,
								},

								"& .Mui-selected": {
									color: "#fff !important",
									bgcolor: theme.palette.primary.main,
								},
								"& .MuiTabs-indicator": { display: "none" },
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
									color: `${theme.palette.primary.main} !important`,
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
							sx={{ overflowY: "auto", flex: 1, pr: 0.5 }}
						>
							{filteredAlerts.length > 0 ? (
								filteredAlerts.map((a: AlertItem, i: number) => (
									<Box
										key={i}
										sx={{
											mb: 1.2,
											p: 1.2,
											borderRadius: 1.5,
											// background: a.color,
											background:
												a.level === "CRITICAL"
													? "#fee2e2"
													: a.level === "WARNING"
														? "#fef3c7"
														: "#dbeafe",
											borderLeft: `4px solid ${a.level === "CRITICAL" ? "#ef4444" : a.level === "WARNING"
												? "#f59e0b" : "#3b82f6"}`,
											display: "flex",
											flexDirection: "column",
											gap: 0.6,
										}}
									>
										{/* TOP */}
										<Box display="flex" alignItems="center" gap={1}>
											{a.icon}
											<Typography fontSize={11} fontWeight={600} color="#111827">
												{a.level}
											</Typography>
											<Chip
												label={a.orderId}
												size="small"
												sx={{
													height: 18,
													fontSize: 10,
													bgcolor: "#e5e7eb",
													color: "#111827",
												}}
											/>
											<Typography ml="auto" fontSize={10} color="#6b7280">
												{a.time}
											</Typography>
										</Box>
										{/* MESSAGE */}
										<Typography
											fontSize={12.5}
											color="#111827"
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
									<Typography color="#6b7280" fontSize={13}>
										No alerts available
									</Typography>
								</Box>
							)}
						</Box>
					</Box>
				</Grid>
			</Grid>

			<Grid container spacing={2} mt={2}>
				{insights.map((i: Insight, idx: number) => {
					const title = i.title?.toLowerCase() || "";

					const getInsightMeta = () => {
						if (title.includes("weather")) {
							return {
								icon: <CloudQueueIcon />,
								color: "#2563eb",
								bg: "#dbeafe",
								label: "Weather",
							};
						}

						if (title.includes("traffic")) {
							return {
								icon: <TrafficIcon />,
								color: "#dc2626",
								bg: "#fee2e2",
								label: "Traffic",
							};
						}

						if (title.includes("rail")) {
							return {
								icon: <TrainIcon />,
								color: "#7c3aed",
								bg: "#ede9fe",
								label: "Rail",
							};
						}

						if (title.includes("fuel")) {
							return {
								icon: <OilBarrelIcon />,
								color: "#ea580c",
								bg: "#ffedd5",
								label: "Fuel",
							};
						}

						if (title.includes("warehouse")) {
							return {
								icon: <WarehouseIcon />,
								color: "#059669",
								bg: "#d1fae5",
								label: "Warehouse",
							};
						}

						if (title.includes("port")) {
							return {
								icon: <DirectionsBoatIcon />,
								color: "#0891b2",
								bg: "#cffafe",
								label: "Port",
							};
						}

						if (title.includes("route")) {
							return {
								icon: <RouteIcon />,
								color: "#4f46e5",
								bg: "#e0e7ff",
								label: "Route",
							};
						}

						if (title.includes("delay")) {
							return {
								icon: <WarningAmberIcon />,
								color: "#d97706",
								bg: "#fef3c7",
								label: "Delay",
							};
						}

						return {
							icon: <BoltIcon />,
							color: "#16a34a",
							bg: "#dcfce7",
							label: "Operations",
						};
					};

					const meta = getInsightMeta();

					return (
						<Grid item xs={12} sm={6} md={4} lg={2.4} key={idx}>
							<Box
								sx={{
									p: 2,
									borderRadius: 3,
									bgcolor: "#fff",
									border: "1px solid #e5e7eb",
									boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
									height: "100%",
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-between",
									transition: "0.25s",

									"&:hover": {
										transform: "translateY(-4px)",
										boxShadow:
											"0 10px 24px rgba(0,0,0,0.08)",
									},
								}}
							>
								{/* TOP */}
								<Box
									display="flex"
									alignItems="center"
									justifyContent="space-between"
									mb={2}
								>
									<Box
										sx={{
											width: 46,
											height: 46,
											borderRadius: 2,
											bgcolor: meta.bg,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",

											"& svg": {
												fontSize: 24,
												color: meta.color,
											},
										}}
									>
										{meta.icon}
									</Box>

									<Box
										sx={{
											px: 1.2,
											py: 0.5,
											borderRadius: 2,
											bgcolor: meta.bg,
											color: meta.color,
											fontSize: 11,
											fontWeight: 700,
										}}
									>
										{meta.label}
									</Box>
								</Box>

								{/* TITLE */}
								<Typography
									fontSize={14}
									fontWeight={700}
									color="#111827"
									mb={1}
								>
									{i.title}
								</Typography>

								{/* DESCRIPTION */}
								<Typography
									fontSize={12}
									color="#6b7280"
									sx={{
										lineHeight: 1.6,
										flex: 1,
									}}
								>
									{i.insight}
								</Typography>

								{/* FOOTER */}
								<Box
									mt={2}
									pt={1.5}
									borderTop="1px solid #f3f4f6"
									display="flex"
									alignItems="center"
									justifyContent="space-between"
								>
									<Box
										display="flex"
										alignItems="center"
										gap={0.5}
									>
										<LocalShippingIcon
											sx={{
												fontSize: 15,
												color: meta.color,
											}}
										/>

										<Typography
											fontSize={11}
											fontWeight={600}
											color="#6b7280"
										>
											Control Tower
										</Typography>
									</Box>

									<Typography
										fontSize={11}
										fontWeight={700}
										sx={{
											color: meta.color,
										}}
									>
										{i.tag}
									</Typography>
								</Box>
							</Box>
						</Grid>
					);
				})}
			</Grid>

			<Box
				mt={3}
				p={2}
				borderRadius={3}
				bgcolor="#fff"
				border="1px solid #e5e7eb"
				boxShadow="0 2px 10px rgba(0,0,0,0.06)"
			>
				{/* HEADER */}
				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					mb={2}
				>
					<Box display="flex" alignItems="center" gap={1}>
						<LocalShippingIcon
							sx={{
								color: theme.palette.primary.main,
								fontSize: 22,
							}}
						/>

						<Typography
							color="#111827"
							fontWeight={700}
							fontSize={18}
						>
							Active Shipments
						</Typography>
					</Box>

					<Box
						sx={{
							px: 1.5,
							py: 0.5,
							borderRadius: 2,
							bgcolor: alpha(theme.palette.primary.main, 0.1),
							color: theme.palette.primary.main,
							fontSize: 12,
							fontWeight: 700,
						}}
					>
						{filteredShipments.length} Active
					</Box>
				</Box>

				{/* TABLE */}
				<Box
					sx={{
						width: "100%",
						overflowX: "auto",
						overflowY: "hidden",

						"&::-webkit-scrollbar": {
							height: 8,
						},

						"&::-webkit-scrollbar-thumb": {
							background: "#cbd5e1",
							borderRadius: 10,
						},

						"&::-webkit-scrollbar-track": {
							background: "#f1f5f9",
						},
					}}
				>
					<Box sx={{ minWidth: 1450 }}>
						{/* TABLE HEADER */}
						<Box
							display="grid"
							gridTemplateColumns="1.4fr 2.5fr 1.4fr 1.1fr 1.5fr 1.8fr 1fr 1.3fr 1.2fr 0.8fr"
							alignItems="center"
							columnGap={2}
							pb={1.5}
							mb={1}
							borderBottom="1px solid #e5e7eb"
							color="#374151"
							fontSize={12}
							fontWeight={700}
						>
							<Box display="flex" alignItems="center" gap={0.5}>
								<LocalShippingIcon sx={{ fontSize: 14 }} />
								<span>Shipment ID</span>
							</Box>

							<Box display="flex" alignItems="center" gap={0.5}>
								<RouteIcon sx={{ fontSize: 14 }} />
								<span>Route</span>
							</Box>

							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								gap={0.5}
							>
								<DirectionsCarIcon sx={{ fontSize: 14 }} />
								<span>Vehicle</span>
							</Box>

							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								gap={0.5}
							>
								<RouteIcon sx={{ fontSize: 14 }} />
								<span>Mode</span>
							</Box>

							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								gap={0.5}
							>
								<CheckCircleIcon sx={{ fontSize: 14 }} />
								<span>Status</span>
							</Box>

							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								gap={0.5}
							>
								<TrendingUpIcon sx={{ fontSize: 14 }} />
								<span>Progress</span>
							</Box>

							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								gap={0.5}
							>
								<WarningAmberIcon sx={{ fontSize: 14 }} />
								<span>Risk</span>
							</Box>

							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								gap={0.5}
							>
								<AccessTimeIcon sx={{ fontSize: 14 }} />
								<span>ETA</span>
							</Box>

							<Box justifyContent="center" display="flex">
								<span>Track</span>
							</Box>

							<Box justifyContent="center" display="flex">
								<span>View</span>
							</Box>
						</Box>

						{/* TABLE ROWS */}
						{filteredShipments.length > 0 ? (
							filteredShipments.map(
								(row: ShipmentRow, i: number) => (
									<Box
										key={i}
										display="grid"
										gridTemplateColumns="1.4fr 2.5fr 1.4fr 1.1fr 1.5fr 1.8fr 1fr 1.3fr 1.2fr 0.8fr"
										alignItems="center"
										columnGap={2}
										py={1.6}
										color="#374151"
										fontSize={12}
										borderBottom="1px solid #f3f4f6"
										sx={{
											transition: "0.2s",

											"&:hover": {
												bgcolor: "#f9fafb",
											},
										}}
									>
										{/* SHIPMENT ID */}
										<Typography
											fontWeight={700}
											fontSize={13}
											color="#111827"
										>
											{row.id}
										</Typography>

										{/* ROUTE */}
										<Typography
											fontSize={13}
											color="#374151"
										>
											{row.route}
										</Typography>

										{/* VEHICLE */}
										<Typography
											textAlign="center"
											fontSize={13}
											fontWeight={500}
										>
											{row.vehicle}
										</Typography>

										{/* MODE */}
										<Box
											display="flex"
											justifyContent="center"
										>
											<Chip
												size="small"
												label={row.mode}
												sx={{
													bgcolor: getModeColor(
														row.mode
													),
													color: "#fff",
													fontSize: 11,
													fontWeight: 600,
													minWidth: 70,
												}}
											/>
										</Box>

										{/* STATUS */}
										<Box
											display="flex"
											justifyContent="center"
										>
											<Chip
												size="small"
												label={row.status}
												sx={{
													bgcolor: getStatusColor(
														row.status
													),
													color: "#fff",
													fontSize: 11,
													fontWeight: 600,
													minWidth: 90,
												}}
											/>
										</Box>

										{/* PROGRESS */}
										<Box
											display="flex"
											flexDirection="column"
											alignItems="center"
											justifyContent="center"
										>
											<LinearProgress
												variant="determinate"
												value={row.progress}
												sx={{
													width: "100%",
													maxWidth: 120,
													height: 7,
													borderRadius: 5,
													mb: 0.5,
													backgroundColor:
														"#e5e7eb",

													"& .MuiLinearProgress-bar":
													{
														backgroundColor:
															row.progress >
																75
																? "#22c55e"
																: row.progress >
																	50
																	? "#f59e0b"
																	: "#ef4444",
													},
												}}
											/>

											<Typography
												fontSize={11}
												fontWeight={600}
											>
												{row.progress}%
											</Typography>
										</Box>

										{/* RISK */}
										<Typography
											textAlign="center"
											fontWeight={700}
											fontSize={12}
											sx={{
												color: getRiskColor(
													row.risk
												),
											}}
										>
											{row.risk}
										</Typography>

										{/* ETA */}
										<Typography
											textAlign="center"
											fontSize={12}
											whiteSpace="nowrap"
										>
											{row.eta}
										</Typography>

										{/* TRACK BUTTON */}
										<Box
											display="flex"
											alignItems="center"
											justifyContent="center"
											height="100%"
										>
											<Button
												size="small"
												variant="contained"
												startIcon={
													<MyLocationIcon />
												}
												onClick={() =>
													handleTrackShipment(
														row
													)
												}
												sx={{
													textTransform: "none",
													bgcolor:
														theme.palette
															.primary.main,
													fontSize: 11,
													fontWeight: 600,
													minWidth: 95,
													borderRadius: 2,
													boxShadow: "none",

													"&:hover": {
														bgcolor:
															theme
																.palette
																.primary
																.dark,
														boxShadow:
															"0 4px 12px rgba(0,0,0,0.12)",
													},
												}}
											>
												Track
											</Button>
										</Box>

										{/* VIEW BUTTON */}
										<Box
											display="flex"
											alignItems="center"
											justifyContent="center"
											height="100%"
										>
											<VisibilityIcon
												onClick={() =>
													router.push(
														`/detailed-order-overview?order_ID=${row.id}&from=tracking`
													)
												}
												sx={{
													cursor: "pointer",
													color: "#9ca3af",
													fontSize: 22,
													transition: "0.2s",

													"&:hover": {
														color: theme
															.palette
															.primary
															.main,
														transform:
															"scale(1.15)",
													},
												}}
											/>
										</Box>
									</Box>
								)
							)
						) : (
							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								height="220px"
							>
								<Typography
									color="#6b7280"
									fontSize={15}
									fontWeight={600}
								>
									No orders available
								</Typography>
							</Box>
						)}
					</Box>
				</Box>
			</Box>
			<Dialog
				open={openMap}
				onClose={() => setOpenMap(false)}
				maxWidth={false}
				PaperProps={{
					sx: {
						width: "75vw",
						height: "75vh",
						borderRadius: 3,
						overflow: "hidden",
						bgcolor: "#fff",
					},
				}}
			>
				<DialogContent
					sx={{ p: 0, position: "relative", height: "100%" }}
				>
					{/* HEADER */}
					<Box
						sx={{
							position: "absolute",
							top: 12,
							left: 12,
							zIndex: 1000,
							bgcolor: "rgba(255,255,255,0.95)",
							border: "1px solid #e5e7eb",
							px: 2,
							py: 1,
							borderRadius: 2,
						}}
					>
						<Typography
							// color="#fff"
							color="#111827"
							fontWeight={700}
							fontSize={15}
						>
							Live Shipment Tracking
						</Typography>
						{trackedShipment && (
							<Typography
								color="#9ca3af"
								fontSize={12}
							>
								{trackedShipment.id}
							</Typography>
						)}
					</Box>
					{/* CLOSE BUTTON */}
					<IconButton
						onClick={() => setOpenMap(false)}
						sx={{
							position: "absolute",
							top: 10,
							right: 10,
							zIndex: 1000,
							bgcolor: "#fff",
							color: "#111827",
							border: "1px solid #e5e7eb",
							"&:hover": {
								bgcolor: "#f3f4f6",
							},
						}}
					>
						<CloseIcon />
					</IconButton>

					{/* MAP */}
					{isLoaded && trackedShipment && (
						<GoogleMap
							mapContainerStyle={{
								width: "100%",
								height: "100%",
							}}
							center={{
								lat: trackedShipment.path?.[0]?.lat || 17.385,
								lng: trackedShipment.path?.[0]?.lng || 78.4867,
							}}
							zoom={8}
						>
							{/* ROUTE */}
							<Polyline
								path={trackedShipment.path}
								options={{
									strokeColor: "#2563eb",
									strokeOpacity: 1,
									strokeWeight: 6,
								}}
							/>
							{/* START POINT */}
							{trackedShipment.path?.[0] && (
								<Marker
									position={trackedShipment.path[0]}
									label={{
										text: "S",
										color: "#fff",
										fontWeight: "bold",
									}}
									title="Start Location"
									icon={{
										path: window.google.maps.SymbolPath
											.CIRCLE,
										fillColor: "#22c55e",
										fillOpacity: 1,
										strokeColor: "#fff",
										strokeWeight: 2,
										scale: 10,
									}}
								/>
							)}
							{/* END POINT */}
							{trackedShipment.path?.[
								trackedShipment.path.length - 1
							] && (
									<Marker
										position={
											trackedShipment.path[
											trackedShipment.path.length - 1
											]
										}
										label={{
											text: "E",
											color: "#fff",
											fontWeight: "bold",
										}}
										title="Destination"
										icon={{
											path: window.google.maps.SymbolPath
												.CIRCLE,
											fillColor: "#ef4444",
											fillOpacity: 1,
											strokeColor: "#fff",
											strokeWeight: 2,
											scale: 10,
										}}
									/>
								)}

							{/* LIVE VEHICLE */}
							{trackedShipment.current_position && (
								<Marker
									position={{
										lat: Number(trackedShipment.current_position.latitude),
										lng: Number(trackedShipment.current_position.longitude),
									}}
									title={`${trackedShipment.id} Vehicle`}
									icon={{
										url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
										scaledSize:
											new window.google.maps.Size(
												48,
												48,
											),
									}}
								/>
							)}
						</GoogleMap>
					)}
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default TrackingPage;
