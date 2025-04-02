'use client';
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
// import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import Image from "next/image";

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};
interface Vehicle {
    regNo: string;
    status: string;
    speed: number;
    lastSeen: string;
    latitude: string;
    longitude: string;
    vehicleId: string;
    vehicleType: string;
    deviceId: string;
}
type Location = {
    address: string;
    latitude: number;
    longitude: number;
};

type Route = {
    distance: string;
    duration: string;
    start: Location;
    end: Location;
    loadAfterStop: number;
};

type Allocation = {
    cost: number;
    leftoverVolume: number;
    leftoverWeight: number;
    occupiedVolume: number;
    occupiedWeight: number;
    totalVolumeCapacity: number;
    totalWeightCapacity: number;
    vehicle_ID: string;
    packages: string[];
    route: Route[];
    loadArrangement: {
        location: string;
        packages: string[];
        stop: number;
    }[];
    sampledRoutePoints: { lat: number; lng: number }[];
};

const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const liveUrl: string = process.env.NEXT_PUBLIC_LIVE_TRACK_URL ?? '';

const LiveTracking: React.FC = () => {
    const [allocation, setAllocation] = useState<Allocation | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [vehiclePath, setVehiclePath] = useState<{ [key: string]: { lat: number, lng: number }[] }>({});
    const [trackedPath, setTrackedPath] = useState<{ lat: number; lng: number }[]>([]);
    const [isTracking, setIsTracking] = useState(false);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [orderId, setOrderId] = useState(null);
    const [vehicleId, setVehicleId] = useState(null);

    const vehicleSuggestRoute = allocation?.route;
    const allocations = allocation?.sampledRoutePoints
    const routeData = {
        sampledRoutePoints: allocations
    };
    const suggestedRoute: { lat: number; lng: number }[] = routeData?.sampledRoutePoints ?? [];
    // const router = useRouter();
    // const vehicleId = "TS08JB3663";
    const deviceId = "867232055767934";

    const selectedVehicleRef = useRef<Vehicle | null>(null);
    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: mapsKey });

    useEffect(() => {
        const storedData = localStorage.getItem("allocationData");
        const storedOrder = localStorage.getItem("orderData");
        if (storedData) {
            const allocation = JSON.parse(storedData);
            // console.log('allocation:', allocation)
            setAllocation(allocation)
            setVehicleId(allocation?.vehicle_ID);
        }
        if (storedOrder) {
            const parsedOrder = JSON.parse(storedOrder);
            setOrderId(parsedOrder?.order?.order_ID);
        }
    }, []);
    console.log('orderid:', orderId);
    console.log('vehicleid:', vehicleId);
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(liveUrl);
                const data: Vehicle[] = await response.json();
                // console.log('data', data);
                if (Array.isArray(data)) {
                    const validVehicles = data.filter(vehicle => vehicle.latitude && vehicle.longitude);
                    setVehicles(validVehicles);

                    validVehicles.forEach(vehicle => {
                        const newPoint = { lat: parseFloat(vehicle.latitude), lng: parseFloat(vehicle.longitude) };

                        // setVehiclePath(prevPath => ({
                        //     ...prevPath,
                        //     [vehicle.deviceId]: [...(prevPath[vehicle.deviceId] || []), newPoint].slice(-50),
                        // }));
                        setVehiclePath(prevPath => ({
                            ...prevPath,
                            [vehicle.deviceId]: [...(prevPath[vehicle.deviceId] || []), newPoint]
                        }));

                    });

                    const dynamicVehicle = validVehicles.find(v => v.deviceId === deviceId);
                    if (dynamicVehicle) {
                        setSelectedVehicle(dynamicVehicle);
                        if (!mapCenter) {
                            setMapCenter({
                                lat: parseFloat(dynamicVehicle.latitude),
                                lng: parseFloat(dynamicVehicle.longitude),
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };

        fetchVehicles();
        const interval = setInterval(fetchVehicles, 5000);
        return () => clearInterval(interval);
    }, [deviceId, mapCenter]);

    useEffect(() => {
        selectedVehicleRef.current = selectedVehicle;
    }, [selectedVehicle]);

    useEffect(() => {
        selectedVehicleRef.current = selectedVehicle;

        if (selectedVehicle) {
            if (selectedVehicle.status === "moving" && !isTracking) {
                setIsTracking(true);

                // Store lat/lng every 5 minutes
                const trackingInterval = setInterval(() => {
                    setTrackedPath(prevPath => [
                        ...prevPath,
                        { lat: parseFloat(selectedVehicle.latitude), lng: parseFloat(selectedVehicle.longitude) },
                    ]);
                }, 5 * 60 * 1000);

                return () => clearInterval(trackingInterval);
            }

            if (selectedVehicle.status === "stopped" && isTracking) {
                setIsTracking(false);
            }
        }
    }, [isTracking, selectedVehicle]);

    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6378137;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const checkRouteDeviation = () => {
        if (!selectedVehicle) return;
        const vehicleLat = parseFloat(selectedVehicle.latitude);
        const vehicleLng = parseFloat(selectedVehicle.longitude);
        // Haversine Formula // Distance Matrix API.
        const isDeviated = suggestedRoute.every((point) => {
            const distance = calculateDistance(vehicleLat, vehicleLng, point.lat, point.lng);
            return distance > 500;
        });
        // console.log('isDeviated:', isDeviated)
        const distances = suggestedRoute.map((point) =>
            calculateDistance(vehicleLat, vehicleLng, point.lat, point.lng)
        );
        const minDistance = Math.min(...distances);
        const minDistanceKm = minDistance / 1000;
        // console.log('Min Distance from Route (km):', minDistanceKm);
        if (isDeviated && minDistance > 500) {
            alert(`Alert: Vehicle is deviating from the suggested route by ${minDistanceKm.toFixed(2)} km!`);
        }
    };

    useEffect(() => {
        const deviationInterval = setInterval(() => {
            checkRouteDeviation();
        }, 5000);

        return () => clearInterval(deviationInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVehicle]);

    const getVehicleIcon = (vehicleType: string) => {
        switch (vehicleType.toLowerCase()) {
            case "car":
                return "/car.svg";
            case "bike":
                return "/bike.svg";
            case "truck":
                return "https://maps.google.com/mapfiles/kml/shapes/truck.png";
            default:
                return "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
        }
    };

    if (!isLoaded) return <p>Loading Maps...</p>;
    if (!mapCenter) return <p>Loading vehicle data...</p>;

    // const handleViewRouteDetails = () => {
    //     router.push('/route-details');
    // };

    return (
        <div>
            <p style={{ fontSize: '20px', color: "#83214F", textDecoration: 'underline', fontWeight: 'bold' }}>Suggested Vehicle Route</p>
            {vehicleSuggestRoute && vehicleSuggestRoute.length > 0 && (
                <Box sx={{ marginBottom: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, border: '1px solid #ccc', marginBottom: 1, gap: '10px' }}>
                        <Image
                            src="/start.svg"
                            alt="Start"
                            width={25}
                            height={25}
                            unoptimized
                        />
                        <Typography variant="h6">Start: {vehicleSuggestRoute[0]?.start?.address}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, border: '1px solid #ccc', marginBottom: 1, gap: '10px' }}>
                        <Image
                            src="/drop.svg"
                            alt="End"
                            width={25}
                            height={25}
                            unoptimized
                        />
                        <Typography variant="h6">End: {vehicleSuggestRoute[0]?.end?.address}</Typography>
                    </Box>
                </Box>
            )}

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={selectedVehicle ? { lat: parseFloat(selectedVehicle.latitude), lng: parseFloat(selectedVehicle.longitude) } : mapCenter}
            >
                {vehicles.map((vehicle) => (
                    <Marker
                        key={vehicle.deviceId}
                        position={{
                            lat: parseFloat(vehicle.latitude),
                            lng: parseFloat(vehicle.longitude),
                        }}
                        icon={{
                            url: getVehicleIcon(vehicle.vehicleType),
                            scaledSize: new window.google.maps.Size(60, 60),
                        }}
                    />
                ))}

                {selectedVehicle && vehiclePath[selectedVehicle.deviceId] && (
                    <Polyline
                        path={vehiclePath[selectedVehicle.deviceId]}
                        options={{
                            strokeColor: "#0000FF",
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                    />
                )}

                {trackedPath.length > 1 && (
                    <Polyline
                        path={trackedPath}
                        options={{
                            strokeColor: "#FF0000",
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                    />
                )}

            </GoogleMap>

            {selectedVehicle && (
                <div>
                    <h3 style={{ color: "#83214F", textDecoration: 'underline' }}>Vehicle Details</h3>
                    <p><strong>Registration:</strong> {selectedVehicle.regNo}</p>
                    <p><strong>Status:</strong> {selectedVehicle.status}</p>
                    <p><strong>Speed:</strong> {selectedVehicle.speed} km/h</p>
                    <p><strong>Last Seen:</strong> {selectedVehicle.lastSeen}</p>
                    <p><strong>Vehicle ID:</strong> {selectedVehicle.vehicleId}</p>
                </div>
            )}
            {trackedPath.length > 0 && (
                <div>
                    <h3>Tracked Route (5-min intervals)</h3>
                    <ul>
                        {trackedPath.map((point, index) => (
                            <li key={index}>
                                Lat: {point.lat}, Lng: {point.lng}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* <Button
                variant="contained"
                color="primary"
                onClick={handleViewRouteDetails}
            >
                View Route Details
            </Button> */}
        </div>
    );
};

export default LiveTracking;
