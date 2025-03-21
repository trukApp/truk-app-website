// 'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';

interface RoutePoint {
    address: string;
    latitude: number;
    longitude: number;
}

interface Route {
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
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' });
    const [selectedVehicle, setSelectedVehicle] = useState<string>(rootOptimization[0]?.vehicle_ID || '');
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
    const [showReturnRoute, setShowReturnRoute] = useState<boolean>(false);
    const [returnRoute, setReturnRoute] = useState<google.maps.DirectionsResult | null>(null);
    const [selectedStop, setSelectedStop] = useState<string | null>(null);
    const [matchedRoute, setMatchedRoute] = useState<Route | null>(null);
    // const [selectedRoutesData, setSelectedRoutesData] = useState<{ vehicle_ID: string; selectedRoutes: Route[] }[]>([]);

    const fetchDirections = useCallback(async () => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

        const directionsService = new google.maps.DirectionsService();
        const newDirectionsResults: google.maps.DirectionsResult[] = [];

        const vehicleRoutes = rootOptimization?.find(vehicle => vehicle?.vehicle_ID === selectedVehicle)?.route || [];

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

    const fetchReturnRoute = async () => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

        const directionsService = new google.maps.DirectionsService();
        const lastRoute = selectedVehicleData?.route[selectedVehicleData?.route.length - 1];
        const firstRoute = selectedVehicleData?.route[0];

        if (lastRoute && firstRoute) {
            try {
                const response = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
                    directionsService.route(
                        {
                            origin: { lat: lastRoute?.end?.latitude, lng: lastRoute?.end?.longitude },
                            destination: { lat: firstRoute?.start?.latitude, lng: firstRoute?.start?.longitude },
                            travelMode: google.maps.TravelMode.DRIVING,
                        },
                        (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK && result) {
                                resolve(result);
                            } else {
                                console.warn('Failed to fetch return route:', status);
                                resolve(null);
                            }
                        }
                    );
                });

                setReturnRoute(response);
                setShowReturnRoute(true);
            } catch (error) {
                console.log('Error fetching return route:', error);
            }
        }
    };

    const fetchAlternateRoutes = useCallback(async (matchedRoute: Route) => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

        const directionsService = new google.maps.DirectionsService();

        try {
            const response = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
                directionsService.route(
                    {
                        origin: { lat: matchedRoute.start.latitude, lng: matchedRoute.start.longitude },
                        destination: { lat: matchedRoute.end.latitude, lng: matchedRoute.end.longitude },
                        travelMode: google.maps.TravelMode.DRIVING,
                        provideRouteAlternatives: true,
                    },
                    (result, status) => {
                        if (status === google.maps.DirectionsStatus.OK && result) {
                            resolve(result);
                        } else {
                            console.warn('Failed to fetch alternate routes:', status);
                            resolve(null);
                        }
                    }
                );
            });

            if (response && response.routes) {
                const wrappedResults = response.routes.map((route) => ({
                    routes: [route],
                    request: response.request,
                } as google.maps.DirectionsResult));
                console.log('wrappedResults:', wrappedResults)
                // setDirectionsResults(wrappedResults);
            }
            if (response && response.routes) {
                response.routes.forEach((route, index) => {
                    const distance = route.legs[0]?.distance?.text || 'N/A';
                    const duration = route.legs[0]?.duration?.text || 'N/A';
                    console.log(`Route ${index + 1}: Distance - ${distance}, Duration - ${duration}`);
                });
            }

        } catch (error) {
            console.log('Error fetching alternate routes:', error);
        }
    }, [isLoaded]);


    const clearReturnRoute = () => {
        setReturnRoute(null);
        setShowReturnRoute(false);
    };

    useEffect(() => {
        fetchDirections();
    }, [fetchDirections]);

    const selectedVehicleData = rootOptimization?.find(vehicle => vehicle?.vehicle_ID === selectedVehicle);
    // console.log('selectedVehicleData', selectedVehicleData);
    const handleStopClick = (location: string) => {
        if (!selectedVehicleData || !selectedVehicleData.route || !selectedVehicleData.route.length) {
            console.warn('No selected vehicle data or invalid route.');
            return;
        }

        const startPoint = selectedVehicleData?.route?.[0]?.start;
        console.log('startPoint', startPoint);
        if (selectedStop === location) {
            setSelectedStop(null);
            setMatchedRoute(null);
        } else {
            setSelectedStop(location);
            const matchedRoute = selectedVehicleData?.route.find(
                (route) => route?.start?.address === location || route?.end?.address === location
            );
            setMatchedRoute(matchedRoute || null);
            if (matchedRoute) {
                fetchAlternateRoutes(matchedRoute);
                // setSelectedRoutesData((prev) => {
                //     const existingVehicle = prev.find((item) => item.vehicle_ID === selectedVehicle);

                //     if (existingVehicle) {
                //         const updatedRoutes = [...existingVehicle.selectedRoutes, matchedRoute];
                //         return prev.map((item) =>
                //             item.vehicle_ID === selectedVehicle
                //                 ? { ...item, selectedRoutes: updatedRoutes }
                //                 : item
                //         );
                //     } else {
                //         return [...prev, { vehicle_ID: selectedVehicle, selectedRoutes: [matchedRoute] }];
                //     }
                // });
            }
        }
    };

    // console.log('matchedRoute:', matchedRoute);
    // console.log('returnRoute:', returnRoute)
    // console.log('Selected Routes Data:', selectedRoutesData);

    if (loadError) {
        return <p>Error loading maps: {loadError.message}</p>;
    }

    if (!isLoaded) {
        return <p>Loading Maps...</p>;
    }

    if (!window.google || !window.google.maps) {
        console.warn('Google Maps API not available');
        return null;
    }

    return (
        <div>
            <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                {rootOptimization?.map(vehicle => (
                    <Button
                        key={vehicle.vehicle_ID}
                        variant={selectedVehicle === vehicle?.vehicle_ID ? 'contained' : 'outlined'}
                        onClick={() => setSelectedVehicle(vehicle?.vehicle_ID)}
                    >
                        {vehicle?.vehicle_ID}
                    </Button>
                ))}
            </Box>
            {selectedVehicleData && (
                <Box sx={{ marginBottom: 2, }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, border: '1px solid #ccc', marginBottom: 1, gap: '10px' }}>
                        <Image
                            src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                            alt="Start"
                            width={25}
                            height={25}
                            unoptimized
                        />
                        <Typography variant="h6">Start: {selectedVehicleData?.route[0]?.start.address}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, border: '1px solid #ccc', marginBottom: 1, gap: '10px' }}>
                        <Image
                            src="https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            alt="Start"
                            width={25}
                            height={25}
                            unoptimized
                        />
                        <Typography variant="h6">End: {selectedVehicleData?.route[selectedVehicleData?.route.length - 1]?.end.address}</Typography>
                    </Box>
                </Box>
            )}
            <h1 style={{ color: '#83214F', fontSize: '24px', fontWeight: 'bold', textDecorationLine: 'underline' }}>LoadArrangement</h1>
            {[...(selectedVehicleData?.loadArrangement || [])].reverse().map((stop, index) => (
                <Box
                    key={index}
                    sx={{
                        padding: 1,
                        border: '1px solid #ccc',
                        marginBottom: 1,
                        backgroundColor: selectedStop === stop.location ? '#83214F' : 'transparent',
                        color: selectedStop === stop.location ? '#fff' : '#000',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleStopClick(stop.location)}
                >
                    <strong>Stop {index + 1}</strong>: {stop.location}
                </Box>
            ))}
            <Button
                variant="contained"
                onClick={showReturnRoute ? clearReturnRoute : fetchReturnRoute}
                sx={{ marginBottom: 2 }}
            >
                {showReturnRoute ? 'Show All Routes' : 'Show Return Route to Starting Point'}
            </Button>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '500px' }}
                zoom={6}
                center={{
                    lat: matchedRoute?.start.latitude || selectedVehicleData?.route[0]?.start.latitude || 16.5,
                    lng: matchedRoute?.start.longitude || selectedVehicleData?.route[0]?.start.longitude || 80.6,
                }}
            >
                {showReturnRoute && returnRoute ? (
                    <>
                        <Marker
                            position={{
                                lat: selectedVehicleData?.route[selectedVehicleData?.route.length - 1]?.end.latitude || 0,
                                lng: selectedVehicleData?.route[selectedVehicleData?.route.length - 1]?.end.longitude || 0,
                            }}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                        />
                        <Marker
                            position={{
                                lat: selectedVehicleData?.route[0]?.start.latitude || 0,
                                lng: selectedVehicleData?.route[0]?.start.longitude || 0,
                            }}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                        />
                        <DirectionsRenderer
                            directions={returnRoute}
                            options={{
                                polylineOptions: {
                                    strokeColor: 'purple',
                                    strokeWeight: 5,
                                },
                                suppressMarkers: true,
                            }}
                        />
                    </>
                ) : matchedRoute ? (
                    <>
                        <Marker
                            position={{ lat: matchedRoute?.start?.latitude, lng: matchedRoute?.start?.longitude }}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                        />
                        <Marker
                            position={{ lat: matchedRoute?.end?.latitude, lng: matchedRoute?.end?.longitude }}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                        />
                        {matchedRoute && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: '#fff',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                }}
                            >
                                <div>
                                    <div>🕒 {matchedRoute?.duration}</div>
                                    <div>{matchedRoute?.distance}</div>
                                </div>
                            </div>
                        )}
                        {directionsResults
                            .filter((_, index) => index === selectedVehicleData?.route?.findIndex(route =>
                                route?.start?.latitude === matchedRoute?.start?.latitude &&
                                route?.start?.longitude === matchedRoute?.start?.longitude &&
                                route?.end?.latitude === matchedRoute?.end?.latitude &&
                                route?.end?.longitude === matchedRoute?.end?.longitude
                            ))
                            .map((result, index) => (
                                <DirectionsRenderer
                                    key={index}
                                    directions={result}
                                    options={{
                                        polylineOptions: {
                                            strokeColor: 'blue',
                                            strokeWeight: 5,
                                        },
                                        suppressMarkers: true,
                                    }}
                                />
                            ))}
                    </>
                ) : (
                    <>
                        {selectedVehicleData?.route[0] && (
                            <Marker
                                position={{
                                    lat: selectedVehicleData?.route[0]?.start?.latitude,
                                    lng: selectedVehicleData?.route[0]?.start?.longitude,
                                }}
                                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                            />
                        )}
                        {selectedVehicleData?.route[selectedVehicleData?.route?.length - 1] && (
                            <Marker
                                position={{
                                    lat: selectedVehicleData?.route[selectedVehicleData?.route?.length - 1].end?.latitude,
                                    lng: selectedVehicleData?.route[selectedVehicleData?.route?.length - 1].end?.longitude,
                                }}
                                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                            />
                        )}
                        {selectedVehicleData?.route?.slice(0, -1).map((route, index) => (
                            <Marker
                                key={index}
                                position={{ lat: route?.end?.latitude, lng: route?.end?.longitude }}
                                label={{
                                    text: `S${index + 1}`,
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            />
                        ))}
                        {directionsResults?.map((result, index) => (
                            <DirectionsRenderer
                                key={index}
                                directions={result}
                                options={{
                                    polylineOptions: {
                                        strokeColor: 'blue',
                                        strokeWeight: 5,
                                    },
                                    suppressMarkers: true,
                                }}
                            />
                        ))}
                    </>
                )}
                {/* {selectedRoutesData?.map((routeData, index) => (
                    <React.Fragment key={index}>
                        {routeData?.selectedRoutes[0] && (
                            <Marker
                                position={{
                                    lat: routeData?.selectedRoutes[0]?.start?.latitude,
                                    lng: routeData?.selectedRoutes[0]?.start?.longitude,
                                }}
                                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                            />
                        )}
                        <Marker
                            position={{
                                lat: routeData?.selectedRoutes[routeData?.selectedRoutes?.length - 1]?.end?.latitude,
                                lng: routeData?.selectedRoutes[routeData?.selectedRoutes?.length - 1]?.end?.longitude,
                            }}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                        />
                        {routeData?.selectedRoutes?.slice(0, -1).map((route, routeIndex) => (
                            <Marker
                                key={routeIndex}
                                position={{ lat: route?.end?.latitude, lng: route?.end?.longitude }}
                                label={{
                                    text: `S${routeIndex + 1}`,
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            />
                        ))}
                        {directionsResults?.map((result, dirIndex) => (
                            <DirectionsRenderer
                                key={dirIndex}
                                directions={result}
                                options={{
                                    polylineOptions: {
                                        strokeColor: 'blue',
                                        strokeWeight: 5,
                                    },
                                    suppressMarkers: true,
                                }}
                            />
                        ))}
                    </React.Fragment>
                ))} */}
            </GoogleMap>
        </div>
    );
};

export default RootOptimization;
