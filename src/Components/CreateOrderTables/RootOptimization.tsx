/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';

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
    const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
    const [selectedTransport, setSelectedTransport] = useState('');
    const [transportOptions, setTransportOptions] = useState<string[]>([]);

    useEffect(() => {
        if (rootOptimization?.[0]?.allocations?.length > 0) {
            const transports = rootOptimization[0].allocations
                .map((allocation) => allocation.transportNumber)
                .filter((t): t is string => t !== undefined);

            setTransportOptions(transports);
            setSelectedTransport(transports[0] ?? '');
        }
    }, [rootOptimization]);

    const filteredRoutes = useMemo(() => {
        if (!selectedTransport) return [];
        return rootOptimization.flatMap(vehicle =>
            vehicle.allocations
                .filter(allocation => allocation.transportNumber === selectedTransport)
                .flatMap(allocation => allocation.route)
        );
    }, [selectedTransport, rootOptimization]);

    const { startMarkers, endMarkers } = useMemo(() => {
        const startSet = new Map();
        const endSet = new Map();

        // Decide which routes to use (all or single)
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
    }, [filteredRoutes, selectedRouteIndex]);


    console.log('startMarkers', startMarkers);
    console.log('endMarkers', endMarkers);

    const fetchDirections = useCallback(async () => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

        const directionsService = new google.maps.DirectionsService();
        const newDirectionsResults: google.maps.DirectionsResult[] = [];

        for (let i = 0; i < filteredRoutes.length; i++) {
            const route = filteredRoutes[i];
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
    }, [isLoaded, filteredRoutes]);

    useEffect(() => {
        if (filteredRoutes.length > 0) {
            fetchDirections();
        }
    }, [fetchDirections]);

    if (!isLoaded) return <p>Loading Maps...</p>;

    const handleRouteSelection = (value: string) => {
        setSelectedRouteIndex(value === 'all' ? null : Number(value));
    };

    return (
        <div style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', margin: '1rem' }}>
                <FormControl sx={{ minWidth: 250 }} size="small">
                    <InputLabel>Transport</InputLabel>
                    <Select
                        value={selectedTransport}
                        onChange={(e) => setSelectedTransport(e.target.value)}
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
                        value={selectedRouteIndex !== null ? selectedRouteIndex.toString() : 'all'}
                        label="Select Route"
                        onChange={(e) => handleRouteSelection(e.target.value)}
                        style={{ backgroundColor: '#f5f5f5' }}
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
            </Box>

            <GoogleMap
                onClick={() => setActiveMarker(null)}
                mapContainerStyle={{ width: '100%', height: '30rem' }}
                center={startMarkers[0]?.position || { lat: 0, lng: 0 }}
                zoom={5}
            >
                {startMarkers.map(({ id, position }) => (
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
                ))}

                {endMarkers.map(({ id, position }) => (
                    <Marker
                        key={id}
                        position={position}
                        onClick={() => setActiveMarker(id)}
                        icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                    >
                        {activeMarker === id && (
                            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                <div>End Location</div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}

                {selectedRouteIndex === null
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
                                        suppressMarkers: true, // Suppress default markers
                                    }}
                                />
                            </React.Fragment>
                        ))
                    )
                    : <DirectionsRenderer
                        directions={directionsResults[selectedRouteIndex]}
                        options={{
                            polylineOptions: {
                                strokeColor: routeColors[selectedRouteIndex % routeColors.length],
                                strokeWeight: 5,
                            },
                            suppressMarkers: true,
                        }}
                    />
                }
            </GoogleMap>
        </div>
    );
};

export default RootOptimization;