'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRoutes } from '@/store/authSlice';
import { RootState } from '@/store';
import Image from 'next/image';

const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export type PackageID = string;

export type LocationDetails = {
    address: string;
    latitude: number;
    longitude: number;
};

export type LoadArrangement = {
    location: string;
    packages: PackageID[];
};

export type Allocation = {
    route: Route[];
    cost: number;
    leftoverVolume: number;
    leftoverWeight: number;
    loadArrangement: LoadArrangement[];
    stop: number;
    transportNumber?: string;
    vehicle_ID: string;
};

export type Route = {
    start: LocationDetails;
    end: LocationDetails;
    distance: string;
    duration: string;
    loadAfterStop: number;
};

export type RootOptimizationType = {
    id: string;
    isAllocation: boolean;
    label: string;
    totalCost: number;
    totalVolumeCapacity: number;
    totalWeightCapacity: number;
    unallocatedPackages: PackageID[];
    allocations: Allocation[];
    route: Route[];
    vehicle_ID: string;
};
interface RootOptimizationProps {
    rootOptimization: RootOptimizationType[];
}

const routeColors = ['#FF0000', '#0000FF', '#0096FF', '#00FF00', '#FF00FF', '#FFA500'];

const RootOptimization: React.FC<RootOptimizationProps> = ({ rootOptimization }) => {
    console.log('rootOptimization', rootOptimization);
    const dispatch = useDispatch();
    const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
    const selectedRoutes = useSelector((state: RootState) => state.auth.selectedRoutes);

    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
    const [selectedTransport, setSelectedTransport] = useState('');
    // const [transportOptions, setTransportOptions] = useState<string[]>([]);
    const [selectedRoutesData, setSelectedRoutesData] = useState<{ vehicle: string, route: Route, routeIndex: number | null }[]>([]);

    useEffect(() => {
        if (selectedRoutes && selectedRoutes.length > 0) {
            setSelectedRoutesData(selectedRoutes.map(route => ({
                vehicle: route.vehicle,
                route: route.route,
                routeIndex: route.routeIndex,
            })));
        } else {
            setSelectedRoutesData([]);
        }
    }, [selectedRoutes]);

    useEffect(() => {
        if (rootOptimization?.length > 0) {
            const transports = rootOptimization.map((allocation) => allocation.vehicle_ID)
                .filter((t): t is string => t !== undefined);
            // setTransportOptions(transports);
            setSelectedTransport(transports[0] ?? '');
        }
    }, [rootOptimization]);

    const filteredRoutes = useMemo(() => {
        if (!selectedTransport) return [];
        const vehicle = rootOptimization.find(vehicle => vehicle.vehicle_ID === selectedTransport);
        return vehicle ? vehicle.route : [];
    }, [selectedTransport, rootOptimization]);

    const { startMarkers, endMarkers } = useMemo(() => {
        const startSet = new Map();
        const endSet = new Map();
        const selectedRouteIndex = selectedRoutesData?.find(r => r.vehicle === selectedTransport)?.routeIndex ?? null;
        const routesToShow = selectedRouteIndex !== null
            ? [filteredRoutes[selectedRouteIndex]]
            : filteredRoutes;

        routesToShow.forEach((r, routeIndex) => {
            if (!r.start || !r.end) return;

            const startKey = `${r.start.latitude},${r.start.longitude}`;
            const endKey = `${r.end.latitude},${r.end.longitude}`;

            if (!startSet.has(startKey)) {
                startSet.set(startKey, {
                    id: routeIndex * 2 + 1,
                    name: `Start Location (Route ${routeIndex + 1})`,
                    position: { lat: r.start.latitude, lng: r.start.longitude },
                });
            }

            if (!endSet.has(endKey)) {
                endSet.set(endKey, {
                    id: routeIndex * 2 + 2,
                    name: `End Location (Route ${routeIndex + 1})`,
                    position: { lat: r.end.latitude, lng: r.end.longitude },
                });
            }
        });

        return {
            startMarkers: Array.from(startSet.values()),
            endMarkers: Array.from(endSet.values()),
        };
    }, [filteredRoutes, selectedRoutesData, selectedTransport]);

    const fetchDirections = useCallback(async () => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

        const directionsService = new google.maps.DirectionsService();
        const newDirectionsResults: google.maps.DirectionsResult[] = [];

        const vehicleRoutes = rootOptimization.find(vehicle => vehicle.vehicle_ID === selectedTransport)?.route || [];

        for (let i = 0; i < vehicleRoutes.length; i++) {
            const route = vehicleRoutes[i];
            try {
                const response = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
                    directionsService.route(
                        {
                            origin: { lat: route.start.latitude, lng: route.start.longitude },
                            destination: { lat: route.end.latitude, lng: route.end.longitude },
                            travelMode: google.maps.TravelMode.DRIVING,
                            // provideRouteAlternatives: true,
                        },
                        (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK && result) {
                                resolve(result);
                            } else {
                                console.warn('Directions request failed:', status);
                                resolve(null);
                            }
                        }
                    );
                });

                if (response) newDirectionsResults.push(response);
            } catch (error) {
                console.error('Error fetching directions:', error);
            }
        }

        setDirectionsResults(newDirectionsResults);
    }, [isLoaded, selectedTransport, rootOptimization]);

    useEffect(() => {
        if (filteredRoutes.length > 0) {
            fetchDirections();
        }
    }, [fetchDirections, filteredRoutes.length]);

    if (!isLoaded) return <p>Loading Maps...</p>;

    const handleRouteSelection = (vehicleID: string, routeIndex: number | null) => {
        const vehicle = rootOptimization?.find(v => v.vehicle_ID === vehicleID);

        if (routeIndex === null) {
            setSelectedRoutesData(prevRoutes => {
                const updatedRoutes = prevRoutes?.filter(r => r.vehicle !== vehicleID);
                dispatch(setSelectedRoutes(updatedRoutes));
                return updatedRoutes;
            });
        } else {
            const selectedRoute = vehicle?.route?.[routeIndex];
            if (selectedRoute) {
                setSelectedRoutesData(prevRoutes => {
                    const updatedRoutes = prevRoutes?.filter(r => r.vehicle !== vehicleID);
                    const newRoute = { vehicle: vehicleID, route: selectedRoute, routeIndex };
                    dispatch(setSelectedRoutes([...updatedRoutes, newRoute]));
                    return [...updatedRoutes, newRoute];
                });
            }
        }
    };

    const handleVehicleSelection = (vehicleID: string) => {
        setSelectedTransport(vehicleID);
    };

    const currentSelectedRouteIndex = selectedRoutesData?.find(r => r.vehicle === selectedTransport)?.routeIndex ?? null;
    return (
        <div style={{ width: '100%' }}>
            {rootOptimization.map((vehicle, vehicleIndex) => (
                <Box
                    key={vehicleIndex}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        gap: 2,
                        marginBottom: '1rem',
                    }}
                >
                    <Box
                        onClick={() => handleVehicleSelection(vehicle.vehicle_ID)}
                        sx={{
                            padding: '1rem',
                            border: '1px solid',
                            borderColor: selectedTransport === vehicle.vehicle_ID ? '#83214F' : '#ccc',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: selectedTransport === vehicle.vehicle_ID ? '#83214F' : 'transparent',
                            minWidth: '150px',
                            textAlign: 'center',
                            color: selectedTransport === vehicle.vehicle_ID ? '#fff' : '#000',
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        {vehicle.vehicle_ID}
                    </Box>

                    <FormControl
                        sx={{
                            minWidth: 250,
                            width: { xs: '100%', sm: 'auto' },
                        }}
                        size="medium"
                        disabled={selectedTransport !== vehicle.vehicle_ID}
                    >
                        <InputLabel>Select Route</InputLabel>
                        <Select
                            value={selectedRoutesData.find(r => r.vehicle === vehicle.vehicle_ID)?.routeIndex?.toString() ?? 'all'}
                            label="Select Route"
                            onChange={(e) =>
                                handleRouteSelection(
                                    vehicle.vehicle_ID,
                                    e.target.value === 'all' ? null : Number(e.target.value)
                                )
                            }
                        >
                            <MenuItem value="all">All Routes</MenuItem>
                            {vehicle.route.map((route, idx) => (
                                <MenuItem
                                    key={idx}
                                    value={idx}
                                    style={{
                                        color: selectedTransport === vehicle.vehicle_ID ? 'blue' : '#999',
                                    }}
                                >
                                    Route {idx + 1}: {route.distance} ({route.duration})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            ))}
            <Box
                sx={{
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    width: { xs: '100%', sm: '60%', md: '30%' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        alt="Start"
                        width={25}
                        height={25}
                        unoptimized
                    />
                    <Typography sx={{ ml: 1 }}>Start Location</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        src="https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        alt="End"
                        width={25}
                        height={25}
                        unoptimized
                    />
                    <Typography sx={{ ml: 1 }}>End Location</Typography>
                </Box>
            </Box>

            <GoogleMap
                onClick={() => setActiveMarker(null)}
                mapContainerStyle={{ width: '100%', height: '30rem' }}
                center={startMarkers[0]?.position || { lat: 0, lng: 0 }}
                zoom={5}
            >
                {startMarkers.map(({ id, position }) => {
                    // const endMarker = endMarkers.find(marker => marker.position.lat === position.lat && marker.position.lng === position.lng);
                    // const adjustedPosition = endMarker
                    //     ? { lat: position.lat + 0.0001, lng: position.lng + 0.0001 }
                    //     : position;

                    return (
                        <Marker
                            key={id}
                            position={position}
                            onClick={() => setActiveMarker(id)}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                        >
                            {activeMarker === id && (
                                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                    <div>Start Location</div>
                                </InfoWindow>
                            )}
                        </Marker>
                    );
                })}

                {endMarkers.map(({ id, position }) => {
                    const startMarker = startMarkers.find(marker => marker.position.lat === position.lat && marker.position.lng === position.lng);
                    const adjustedPosition = startMarker
                        ? { lat: position.lat - 0.0001, lng: position.lng - 0.0001 }
                        : position;

                    return (
                        <Marker
                            key={id}
                            position={adjustedPosition}
                            onClick={() => setActiveMarker(id)}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                        >
                            {activeMarker === id && (
                                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                    <div>End Location</div>
                                </InfoWindow>
                            )}
                        </Marker>
                    );
                })}

                {currentSelectedRouteIndex === null
                    ? directionsResults.map((result, index) =>
                        result.routes.map((route, routeIndex) => (
                            <React.Fragment key={`${index}-${routeIndex}`}>
                                <DirectionsRenderer
                                    directions={{ ...result, routes: [route] }}
                                    options={{
                                        polylineOptions: {
                                            strokeColor: routeColors[index % routeColors.length],
                                            strokeWeight: 5,
                                        },
                                        suppressMarkers: true,
                                    }}
                                />
                            </React.Fragment>
                        ))
                    )
                    : currentSelectedRouteIndex !== null &&
                    directionsResults[currentSelectedRouteIndex] && (
                        <DirectionsRenderer
                            directions={directionsResults[currentSelectedRouteIndex]}
                            options={{
                                polylineOptions: {
                                    strokeColor: routeColors[currentSelectedRouteIndex % routeColors.length],
                                    strokeWeight: 5,
                                },
                                suppressMarkers: true,
                            }}
                        />
                    )}
            </GoogleMap>
        </div>
    );
};

export default RootOptimization;