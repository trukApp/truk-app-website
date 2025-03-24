// 'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { Box, Button, FormControl, InputLabel, Typography, Select, MenuItem, } from '@mui/material';
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
    // const [selectedVehicle, setSelectedVehicle] = useState<string>(rootOptimization[0]?.vehicle_ID || '');
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
    const [selectedStop, setSelectedStop] = useState<string | null>(null);
    const [matchedRoute, setMatchedRoute] = useState<Route | null>(null);
    const [alternateRoutes, setAlternateRoutes] = useState<google.maps.DirectionsResult[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
    const [alternateSelectedRoute, setAlternateSelectedRoute] = useState<{
        distance: string;
        duration: string;
        start: {
            address: string;
            latitude: number;
            longitude: number;
        };
        end: {
            address: string;
            latitude: number;
            longitude: number;
        };
    } | null>(null);
    // const [selectedRoutesData, setSelectedRoutesData] = useState<{ vehicle_ID: string; selectedRoutes: Route[] }[]>([]);
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
                setAlternateRoutes(wrappedResults);
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

    // const selectedVehicleData = rootOptimization?.find(vehicle => vehicle?.vehicle_ID === selectedVehicle);
    const selectedVehicleData = rootOptimization?.find(
        (vehicle) =>
            vehicle.vehicle_ID === selectedVehicle?.vehicle_ID &&
            vehicle.route?.[0]?.start?.address === selectedVehicle?.startAddress &&
            vehicle.route?.[0]?.end?.address === selectedVehicle?.endAddress
    );

    const handleStopClick = (location: string) => {
        if (selectedStop === location) {
            setSelectedStop(null);
            setMatchedRoute(null);
            setAlternateRoutes([]);
            setSelectedRouteIndex(null);
            setAlternateSelectedRoute(null);
        } else {
            setSelectedStop(location);
            const matchedRoute = selectedVehicleData?.route.find(
                (route) => route?.start?.address === location || route?.end?.address === location
            );
            setMatchedRoute(matchedRoute || null);
            if (matchedRoute) {
                fetchAlternateRoutes(matchedRoute);
            }
        }
    };

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
    const handleRouteSelection = (index: number) => {
        setSelectedRouteIndex(index);
        const selectedRoute = alternateRoutes[index]?.routes[0];
        if (selectedRoute) {
            const transformedData = transformRouteData(selectedRoute);
            // setAlternateSelectedRoute(selectedRoute || null);
            setAlternateSelectedRoute(transformedData);
        } else {
            console.warn("Invalid route selected");
        }
    };
    const transformRouteData = (selectedRoute: google.maps.DirectionsRoute) => {
        if (!selectedRoute || !selectedRoute.legs || selectedRoute.legs.length === 0) {
            console.warn("Invalid route data");
            return null;
        }

        const leg = selectedRoute.legs[0];
        return {
            distance: leg?.distance?.text || 'N/A',
            duration: leg?.duration?.text || 'N/A',
            start: {
                address: leg?.start_address || 'N/A',
                latitude: leg?.start_location?.lat() || 0,
                longitude: leg?.start_location?.lng() || 0,
            },
            end: {
                address: leg?.end_address || 'N/A',
                latitude: leg?.end_location?.lat() || 0,
                longitude: leg?.end_location?.lng() || 0,
            },
        };
    };
    // const handleVehicleSelection = (vehicleId: string) => {
    //     setSelectedVehicle(vehicleId);
    //     setAlternateSelectedRoute(null);
    //     setAlternateRoutes([]);
    //     console.log(`Vehicle ${vehicleId} selected. Alternate routes and selection reset.`);
    // };
    const handleVehicleSelection = (vehicle_ID: string, startAddress: string, endAddress: string) => {
        setSelectedVehicle({ vehicle_ID, startAddress, endAddress });
        setAlternateSelectedRoute(null);
        setAlternateRoutes([]);
    };
    console.log('alternateSelectedRoute:', alternateSelectedRoute)
    return (
        <div>
            <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                {rootOptimization?.map((vehicle, index) => (
                    <Button
                        key={`${vehicle.vehicle_ID}_${index}`}
                        variant={
                            selectedVehicle?.vehicle_ID === vehicle.vehicle_ID &&
                                selectedVehicle?.startAddress === vehicle?.route?.[0]?.start?.address &&
                                selectedVehicle?.endAddress === vehicle?.route?.[0]?.end?.address
                                ? 'contained'
                                : 'outlined'
                        }
                        onClick={() =>
                            handleVehicleSelection(
                                vehicle.vehicle_ID,
                                vehicle?.route?.[0]?.start?.address,
                                vehicle?.route?.[0]?.end?.address
                            )
                        }
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
            {alternateRoutes.length > 0 && (
                <FormControl
                    sx={{
                        minWidth: 300,
                        width: { xs: '100%', sm: 'auto' },
                        ml: '10px',
                        mb: '10px',
                    }}
                    size="medium">
                    <InputLabel>Select a Route</InputLabel>
                    <Select
                        value={selectedRouteIndex ?? ''}
                        onChange={(e) => handleRouteSelection(Number(e.target.value))}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Select a Route
                        </MenuItem>
                        {alternateRoutes.map((result, index) => {
                            const route = result.routes[0];
                            const distance = route?.legs?.[0]?.distance?.text || 'N/A';
                            const duration = route?.legs?.[0]?.duration?.text || 'N/A';
                            return (
                                <MenuItem key={index} value={index}>
                                    Route {index + 1}: {distance} - {duration}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            )}
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '500px' }}
                zoom={6}
                center={{
                    lat: matchedRoute?.start?.latitude || selectedVehicleData?.route?.[0]?.start?.latitude || 16.5,
                    lng: matchedRoute?.start?.longitude || selectedVehicleData?.route?.[0]?.start?.longitude || 80.6,
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
                ) : selectedRouteIndex !== null ? (
                    <>
                        <Marker
                            position={{
                                lat: alternateRoutes[selectedRouteIndex]?.routes[0]?.legs[0]?.start_location?.lat() || 0,
                                lng: alternateRoutes[selectedRouteIndex]?.routes[0]?.legs[0]?.start_location?.lng() || 0,
                            }}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                        />
                        <Marker
                            position={{
                                lat: alternateRoutes[selectedRouteIndex]?.routes[0]?.legs[0]?.end_location?.lat() || 0,
                                lng: alternateRoutes[selectedRouteIndex]?.routes[0]?.legs[0]?.end_location?.lng() || 0,
                            }}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                        />
                        <DirectionsRenderer
                            directions={alternateRoutes[selectedRouteIndex]}
                            options={{
                                polylineOptions: {
                                    strokeColor: '#1A73E8',
                                    strokeWeight: 6,
                                },
                                suppressMarkers: true,
                            }}
                        />
                    </>
                ) : alternateRoutes.length > 0 ? (
                    <>
                        {alternateRoutes.map((routeResult, index) => {
                            const firstLeg = routeResult?.routes?.[0]?.legs?.[0];
                            const isShortest = index === 0;
                            return (
                                <React.Fragment key={index}>
                                    <Marker
                                        position={{
                                            lat: firstLeg?.start_location?.lat() || 0,
                                            lng: firstLeg?.start_location?.lng() || 0,
                                        }}
                                        icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                                    />
                                    <Marker
                                        position={{
                                            lat: firstLeg?.end_location?.lat() || 0,
                                            lng: firstLeg?.end_location?.lng() || 0,
                                        }}
                                        icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                                    />
                                    <DirectionsRenderer
                                        directions={routeResult}
                                        options={{
                                            polylineOptions: {
                                                strokeColor: isShortest ? 'blue' : '#1A73E8',
                                                strokeWeight: isShortest ? 6 : 4,
                                            },
                                            suppressMarkers: true,
                                        }}
                                    />
                                </React.Fragment>
                            );
                        })}
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
                        {/* <div
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
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
                                <div>
                                    {(() => {
                                        const totalDistance = selectedVehicleData?.route?.reduce((acc, route) => {
                                            const distanceValue = parseFloat(route?.distance?.replace(/[^\d.]/g, '') || '0');
                                            return acc + distanceValue;
                                        }, 0) ?? 0;

                                        const totalDurationMinutes = selectedVehicleData?.route?.reduce((acc, route) => {
                                            const durationText = route?.duration || '0h 0m';
                                            const [hours = 0, minutes = 0] = durationText.match(/\d+/g)?.map(Number) ?? [0, 0];
                                            return acc + (hours * 60 + minutes);
                                        }, 0) ?? 0;

                                        const totalHours = Math.floor(totalDurationMinutes / 60);
                                        const remainingMinutes = totalDurationMinutes % 60;

                                        return (
                                            <div>
                                                <div>🕒 {totalHours}h {remainingMinutes}m</div>
                                                <div>{totalDistance} km</div>
                                            </div>
                                        );
                                    })()}
                                </div>

                            </div>
                        </div>  */}
                    </>
                )}
            </GoogleMap>
        </div >
    );
};

export default RootOptimization;
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
{/* <GoogleMap
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
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
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
                                <div>
                                    {(() => {
                                        const totalDistance = selectedVehicleData?.route?.reduce((acc, route) => {
                                            const distanceValue = parseFloat(route?.distance?.replace(/[^\d.]/g, '') || '0');
                                            return acc + distanceValue;
                                        }, 0) ?? 0;

                                        const totalDurationMinutes = selectedVehicleData?.route?.reduce((acc, route) => {
                                            const durationText = route?.duration || '0h 0m';
                                            const [hours = 0, minutes = 0] = durationText.match(/\d+/g)?.map(Number) ?? [0, 0];
                                            return acc + (hours * 60 + minutes);
                                        }, 0) ?? 0;

                                        const totalHours = Math.floor(totalDurationMinutes / 60);
                                        const remainingMinutes = totalDurationMinutes % 60;

                                        return (
                                            <div>
                                                <div>🕒 {totalHours}h {remainingMinutes}m</div>
                                                <div>{totalDistance} km</div>
                                            </div>
                                        );
                                    })()}
                                </div>

                            </div>
                        </div>
                    </>
                )}
            </GoogleMap> */}
// const fetchDirections = useCallback(async () => {
//     if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

//     const directionsService = new google.maps.DirectionsService();
//     const newDirectionsResults: google.maps.DirectionsResult[] = [];

//     const vehicleRoutes = rootOptimization?.find(vehicle => vehicle?.vehicle_ID === selectedVehicle)?.route || [];

//     for (const route of vehicleRoutes) {
//         try {
//             const response = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
//                 directionsService.route(
//                     {
//                         origin: { lat: route?.start?.latitude, lng: route?.start?.longitude },
//                         destination: { lat: route?.end?.latitude, lng: route?.end?.longitude },
//                         travelMode: google.maps.TravelMode.DRIVING,
//                         provideRouteAlternatives: true,
//                     },
//                     (result, status) => {
//                         if (status === google.maps.DirectionsStatus.OK && result) {
//                             resolve(result);
//                         } else {
//                             console.warn('Directions request failed:', status);
//                             resolve(null);
//                         }
//                     }
//                 );
//             });

//             if (response) newDirectionsResults.push(response);
//         } catch (error) {
//             console.log('Error fetching directions:', error);
//         }
//     }

//     setDirectionsResults(newDirectionsResults);
// }, [isLoaded, selectedVehicle, rootOptimization]);