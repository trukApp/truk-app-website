/* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Box, Button, FormControl, InputLabel, Typography, Select, MenuItem, Card, CardContent, Grid, } from '@mui/material';
import Image from 'next/image';
import GoogleMapRenderer from './GoogleMapRenderer';


interface RoutePoint {
    address: string;
    latitude: number;
    longitude: number;
}

interface Route {
    loadAfterStop: number;
    distance: string;
    duration: string;
    start: RoutePoint;
    end: RoutePoint;
}

interface LoadArrangement {
    stop: number;
    location: string;
    packages: string[];
}

interface VehicleData {
    vehicle_ID: string;
    route: Route[];
    loadArrangement: LoadArrangement[];
}

interface Props {
    rootOptimization: VehicleData[];
}

export interface RootOptimizationType {
    vehicle_ID: string;
    route: Route[];
    loadArrangement: LoadArrangement[];
}


const RootOptimization: React.FC<Props> = ({ rootOptimization }) => {
    console.log('rootOptimization:', rootOptimization);
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' });
    const [selectedVehicle, setSelectedVehicle] = useState(() =>
        rootOptimization?.[0]
            ? {
                vehicle_ID: rootOptimization[0].vehicle_ID,
                startAddress: rootOptimization[0].route?.[0]?.start?.address || '',
                endAddress: rootOptimization[0].route?.[0]?.end?.address || '',
            }
            : null
    );
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
    const [showReturnRoute, setShowReturnRoute] = useState<boolean>(false);
    const [returnRoute, setReturnRoute] = useState<google.maps.DirectionsResult | null>(null);
    const [matchedRoute, setMatchedRoute] = useState<Route | null>(null);
    const [alternateRoutes, setAlternateRoutes] = useState<google.maps.DirectionsResult[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [routeSummary, setRouteSummary] = useState<any>(null);
    console.log("routeSummary: ", routeSummary)

    const fetchDirections = useCallback(async () => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps || !selectedVehicle) return;

        const directionsService = new google.maps.DirectionsService();
        const newDirectionsResults: google.maps.DirectionsResult[] = [];

        const vehicleRoutes = rootOptimization
            ?.find(
                (vehicle) =>
                    vehicle.vehicle_ID === selectedVehicle.vehicle_ID &&
                    vehicle.route?.[0]?.start?.address === selectedVehicle.startAddress &&
                    vehicle.route?.[0]?.end?.address === selectedVehicle.endAddress
            )?.route || [];
        for (const route of vehicleRoutes) {
            try {
                const response = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
                    directionsService.route(
                        {
                            origin: { lat: route?.start?.latitude, lng: route?.start?.longitude },
                            destination: { lat: route?.end?.latitude, lng: route?.end?.longitude },
                            travelMode: google.maps.TravelMode.DRIVING,
                            provideRouteAlternatives: true,
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
                console.log('Error fetching directions:', error);
            }
        }

        setDirectionsResults(newDirectionsResults);
    }, [isLoaded, selectedVehicle, rootOptimization]);



    useEffect(() => {
        fetchDirections();
    }, [fetchDirections]);

    const selectedVehicleData = rootOptimization?.find(
        (vehicle) =>
            vehicle.vehicle_ID === selectedVehicle?.vehicle_ID &&
            vehicle.route?.[0]?.start?.address === selectedVehicle?.startAddress &&
            vehicle.route?.[0]?.end?.address === selectedVehicle?.endAddress
    );

    if (loadError) {
        return <p>Error loading maps: {loadError.message}</p>;
    }

    if (!isLoaded) {
        return <p>Loading Maps...</p>;
    }

    if (!window.google || !window.google.maps) {
        // console.warn('Google Maps API not available');
        return null;
    }
    const handleVehicleSelection = (vehicle_ID: string, startAddress: string, endAddress: string) => {
        setSelectedVehicle({ vehicle_ID, startAddress, endAddress });
        setAlternateRoutes([]);
        setSelectedRouteIndex(null);
    };
    // Format distance in meters → km/m
    const formatDistance = (meters: number | undefined | null): string => {
        if (meters == null || Number.isNaN(meters)) return '—';
        if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
        return `${meters} m`;
    };

    // Format duration in seconds → hr min
    const formatDurationSeconds = (totalSeconds: number | undefined | null): string => {
        if (totalSeconds == null || Number.isNaN(totalSeconds)) return '—';

        let secs = Math.max(0, Math.floor(totalSeconds));

        const days = Math.floor(secs / 86400);
        secs -= days * 86400;

        const hours = Math.floor(secs / 3600);
        secs -= hours * 3600;

        const minutes = Math.round(secs / 60);

        const parts: string[] = [];
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hr`);
        if (minutes > 0) parts.push(`${minutes} min`);
        if (parts.length === 0) parts.push('0 min');

        return parts.join(' ');
    };



    return (
        <div>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            mb: 3,
                        }}
                    >
                        {rootOptimization?.map((vehicle, index) => {
                            const isSelected =
                                selectedVehicle?.vehicle_ID === vehicle.vehicle_ID &&
                                selectedVehicle?.startAddress === vehicle?.route?.[0]?.start?.address &&
                                selectedVehicle?.endAddress === vehicle?.route?.[0]?.end?.address;

                            return (
                                <Button
                                    key={`${vehicle.vehicle_ID}_${index}`}
                                    variant={isSelected ? 'contained' : 'outlined'}
                                    color={isSelected ? 'primary' : 'inherit'}
                                    onClick={() =>
                                        handleVehicleSelection(
                                            vehicle.vehicle_ID,
                                            vehicle?.route?.[0]?.start?.address,
                                            vehicle?.route?.[0]?.end?.address
                                        )
                                    }
                                    sx={{
                                        textTransform: 'none',
                                        px: 3,
                                        py: 1,
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                                    }}
                                >
                                    🚚 {vehicle?.vehicle_ID}
                                </Button>
                            );
                        })}
                    </Box>

                    {/* Route Details */}
                    {selectedVehicleData && (
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            {/* Start & End */}
                            <Grid item xs={12} md={6}>
                                <Card
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                                        background: 'linear-gradient(135deg, #fff 60%, #f9f9f9)',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#333',
                                            mb: 2,
                                        }}
                                    >
                                        Route Details
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1.2,
                                            borderRadius: 2,
                                            backgroundColor: '#f4f6f8',
                                            mb: 1.5,
                                            gap: 1,
                                        }}
                                    >
                                        <Image src="/start.svg" alt="Start" width={24} height={24} unoptimized />
                                        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                                            <b>Start:</b> {selectedVehicleData?.route[0]?.start.address}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1.2,
                                            borderRadius: 2,
                                            backgroundColor: '#f4f6f8',
                                            gap: 1,
                                        }}
                                    >
                                        <Image src="/drop.svg" alt="End" width={24} height={24} unoptimized />
                                        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                                            <b>End:</b>{' '}
                                            {selectedVehicleData?.route[selectedVehicleData?.route.length - 1]?.end.address}
                                        </Typography>
                                    </Box>
                                </Card>
                                {/* {routeSummary && (
                                    <Card sx={{ mt: 2, p: 2 }}>
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            Route Summary
                                        </Typography>

                                        <Typography variant="body1">
                                            Suggested Route Distance: {formatDistance(routeSummary.totalDistanceActual)},
                                            Suggested Time to reach: {formatDurationSeconds(routeSummary.totalDurationActual)}
                                        </Typography>

                                        {routeSummary.showReoptimized && (
                                            <>
                                                <Typography variant="body1">
                                                    Re-optimized Route Distance: {formatDistance(routeSummary.totalDistanceReroute)},
                                                    Suggested Time to reach: {formatDurationSeconds(routeSummary.totalDurationReroute)}
                                                </Typography>

                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    Difference: <br />
                                                    Distance: {routeSummary.distanceDiff !== 0 ? `+${formatDistance(routeSummary.distanceDiff)}` : '—'} <br />
                                                    Time: {routeSummary.durationDiff !== 0 ? `+${formatDurationSeconds(routeSummary.durationDiff)}` : '—'}
                                                </Typography>
                                            </>
                                        )}

                                    </Card>
                                )} */}




                            </Grid>


                            {/* Drop Points */}
                            <Grid item xs={12} md={6}>
                                <Card
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                                        background: 'linear-gradient(135deg, #fff 60%, #f9f9f9)',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#F08C24',
                                            mb: 2,
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        Drop Points
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            maxHeight: 200,
                                            overflowY: 'auto',
                                            pr: 1,
                                        }}
                                    >
                                        {[...(selectedVehicleData?.loadArrangement || [])].map((stop, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    p: 1.2,
                                                    border: '1px solid #ddd',
                                                    borderRadius: 2,
                                                    backgroundColor: '#fff',
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5',
                                                        cursor: 'pointer',
                                                    },
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 14 }}>
                                                    <strong>Stop {index + 1}:</strong> {stop.location}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* Map Section */}
                    <Card
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                    >
                        <GoogleMapRenderer
                            selectedVehicleData={selectedVehicleData}
                            matchedRoute={matchedRoute}
                            directionsResults={directionsResults}
                            showReturnRoute={showReturnRoute}
                            returnRoute={returnRoute}
                            alternateRoutes={alternateRoutes}
                            selectedRouteIndex={selectedRouteIndex}
                            onRouteSummaryChange={setRouteSummary}
                        />
                    </Card>
                </Grid>

            </Grid>
        </div >
    );
};

export default RootOptimization;