'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

type MarkerType = {
    id: number;
    name: string;
    position: { lat: number; lng: number };
};

type PackageID = string;

type LocationDetails = {
    address: string;
    latitude: number;
    longitude: number;
};

type LoadArrangement = {
    location: string;
    packages: PackageID[];
};

type Allocation = {
    route: any;
    cost: number;
    leftoverVolume: number;
    leftoverWeight: number;
    loadArrangement: LoadArrangement[];
    stop: number;
};

type Route = {
    start: LocationDetails;
    end: LocationDetails;
    distance: string;
    duration: string;
    loadAfterStop: number;
};

type RootOptimization = {
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
    rootOptimization: RootOptimization[];
}

const routeColors = ['#FF0000', '#0000FF', '#0096FF', '#00FF00', '#FF00FF', '#FFA500'];

const RootOptimization: React.FC<RootOptimizationProps> = ({ rootOptimization }) => {
    const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);

    const { startMarkers, endMarkers } = useMemo(() => {
        const startSet = new Map();
        const endSet = new Map();

        rootOptimization.forEach((vehicle, truckIndex) => {
            if (!vehicle.allocations || vehicle.allocations.length === 0) return;

            vehicle.allocations.forEach((allocation, allocationIndex) => {
                if (!allocation.route || allocation.route.length === 0) return;

                allocation.route.forEach((r: any, routeIndex: any) => {
                    if (!r.start || !r.end) return;

                    const startKey = `${r.start.latitude},${r.start.longitude}`;
                    const endKey = `${r.end.latitude},${r.end.longitude}`;

                    if (!startSet.has(startKey)) {
                        startSet.set(startKey, {
                            id: truckIndex * 1000 + allocationIndex * 100 + routeIndex * 2 + 1,
                            name: `Start Location`,
                            position: { lat: r.start.latitude, lng: r.start.longitude },
                        });
                    }

                    if (!endSet.has(endKey)) {
                        endSet.set(endKey, {
                            id: truckIndex * 1000 + allocationIndex * 100 + routeIndex * 2 + 2,
                            name: `End Location`,
                            position: { lat: r.end.latitude, lng: r.end.longitude },
                        });
                    }
                });
            });
        });

        return {
            startMarkers: Array.from(startSet.values()),
            endMarkers: Array.from(endSet.values()),
        };
    }, [rootOptimization]);

    console.log('startMarkers', startMarkers);
    console.log('endMarkers', endMarkers);
    const fetchDirections = useCallback(async () => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

        const directionsService = new google.maps.DirectionsService();
        const newDirectionsResults: google.maps.DirectionsResult[] = [];

        for (const start of startMarkers) {
            for (const end of endMarkers) {
                try {
                    const response = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
                        directionsService.route(
                            {
                                origin: start.position,
                                destination: end.position,
                                travelMode: google.maps.TravelMode.DRIVING,
                                provideRouteAlternatives: true
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
        }
        setDirectionsResults(newDirectionsResults);
    }, [isLoaded, startMarkers, endMarkers]);

    useEffect(() => {
        if (startMarkers.length > 0 && endMarkers.length > 0) {
            fetchDirections();
        }
    }, [fetchDirections]);

    if (!isLoaded) return <p>Loading Maps...</p>;

    return (
        <div style={{ width: '100%' }}>
            <GoogleMap
                onClick={() => setActiveMarker(null)}
                mapContainerStyle={{ width: '100%', height: '30rem' }}
                center={startMarkers[0]?.position || { lat: 0, lng: 0 }}
                zoom={5}
            >
                {startMarkers.map(({ id, name, position }) => (
                    <Marker key={id} position={position} onClick={() => setActiveMarker(id)}>
                        {activeMarker === id && (
                            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                <div>{name}</div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}

                {endMarkers.map(({ id, name, position }) => (
                    <Marker key={id} position={position} onClick={() => setActiveMarker(id)}>
                        {activeMarker === id && (
                            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                <div>{name}</div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}

                {directionsResults.map((result, index) =>
                    result.routes.map((route, routeIndex) => (
                        <DirectionsRenderer
                            key={`${index}-${routeIndex}`}
                            directions={{ ...result, routes: [route] }}
                            options={{
                                polylineOptions: {
                                    strokeColor: routeColors[(index + routeIndex) % routeColors.length],
                                    strokeWeight: 5,
                                },
                                suppressMarkers: false,
                            }}
                        />
                    ))
                )}
            </GoogleMap>
        </div>
    );
};

export default RootOptimization;
