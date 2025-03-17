'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRoutes } from '@/store/authSlice';
import { RootState } from '@/store';

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
    const dispatch = useDispatch();
    const selectedRoutes = useSelector((state: RootState) => state.auth.selectedRoutes);
    console.log('selectedRoutesFromRedux: ', selectedRoutes);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
    const [selectedTransport, setSelectedTransport] = useState('');
    const [transportOptions, setTransportOptions] = useState<string[]>([]);
    const [selectedRoutesData, setSelectedRoutesData] = useState<{ vehicle: string, route: any, routeIndex: number | null }[]>([]);

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
            setTransportOptions(transports);
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

    // const handleRouteSelection = (vehicleID: string, routeIndex: number | null) => {
    //     const vehicle = rootOptimization?.find(v => v.vehicle_ID === vehicleID);
    //     const selectedRoute = vehicle?.route?.[routeIndex ?? 0];

    //     if (selectedRoute) {
    //         setSelectedRoutesData(prevRoutes => {
    //             const updatedRoutes = prevRoutes?.filter(r => r.vehicle !== vehicleID);
    //             return [...updatedRoutes, { vehicle: vehicleID, route: selectedRoute, routeIndex }];
    //         });
    //     }
    // };
    const handleRouteSelection = (vehicleID: string, routeIndex: number | null) => {
        const vehicle = rootOptimization?.find(v => v.vehicle_ID === vehicleID);
        const selectedRoute = vehicle?.route?.[routeIndex ?? 0];

        if (selectedRoute) {
            setSelectedRoutesData(prevRoutes => {
                const updatedRoutes = prevRoutes?.filter(r => r.vehicle !== vehicleID);
                const newRoute = { vehicle: vehicleID, route: selectedRoute, routeIndex };
                dispatch(setSelectedRoutes([...updatedRoutes, newRoute]));
                return [...updatedRoutes, newRoute];
            });
        }
    };
    const handleVehicleSelection = (vehicleID: string) => {
        setSelectedTransport(vehicleID);
    };

    const currentSelectedRouteIndex = selectedRoutesData?.find(r => r.vehicle === selectedTransport)?.routeIndex ?? null;
    console.log('selected Routes:', selectedRoutesData);
    return (
        <div style={{ width: '100%' }}>
            {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}> */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap', margin: '1rem', width: '100%' }}>
                <FormControl sx={{ minWidth: 250 }} size="small">
                    <InputLabel>Vehicles</InputLabel>
                    <Select
                        value={selectedTransport}
                        onChange={(e) => handleVehicleSelection(e.target.value)}
                        label="Transport"
                    >
                        {transportOptions.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 250 }} size="small">
                    <InputLabel>Select Route</InputLabel>
                    <Select
                        value={currentSelectedRouteIndex !== null ? currentSelectedRouteIndex.toString() : 'all'}
                        label="Select Route"
                        onChange={(e) => handleRouteSelection(selectedTransport, e.target.value === 'all' ? null : Number(e.target.value))}
                        disabled={!selectedTransport}
                    >
                        <MenuItem value="all">All Routes</MenuItem>
                        {directionsResults.map((result, idx) => {
                            const route = result.routes[0];
                            const leg = route.legs[0];
                            return (
                                <MenuItem key={idx} value={idx} style={{ color: 'blue' }}>
                                    Route {idx + 1}: {leg.distance?.text} ({leg.duration?.text})
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <div
                    style={{
                        padding: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        gap: 1,
                    }}
                >
                    <p style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                        <img src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="Start" width="25" />
                        &nbsp; Start Location
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                        <img src="https://maps.google.com/mapfiles/ms/icons/green-dot.png" alt="End" width="25" />
                        &nbsp; End Location
                    </p>
                </div>
            </Box>
            {/* </div> */}

            <GoogleMap
                onClick={() => setActiveMarker(null)}
                mapContainerStyle={{ width: '100%', height: '30rem' }}
                center={startMarkers[0]?.position || { lat: 0, lng: 0 }}
                zoom={5}
            >
                {startMarkers.map(({ id, position }) => {
                    const endMarker = endMarkers.find(marker => marker.position.lat === position.lat && marker.position.lng === position.lng);
                    const adjustedPosition = endMarker
                        ? { lat: position.lat + 0.0001, lng: position.lng + 0.0001 }
                        : position;

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