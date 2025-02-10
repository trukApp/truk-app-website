'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

type MarkerType = {
    id: number;
    name: string;
    position: { lat: number; lng: number };
};

const markers: MarkerType[] = [
    { id: 1, name: "Hyderabad", position: { lat: 17.385044, lng: 78.486671 } },
    { id: 2, name: "Bangalore", position: { lat: 12.971599, lng: 77.594566 } },
    { id: 3, name: "Mumbai", position: { lat: 19.076090, lng: 72.877426 } },
    { id: 4, name: "New Delhi", position: { lat: 28.613939, lng: 77.209023 } },
    { id: 5, name: "Kolkata", position: { lat: 22.572645, lng: 88.363892 } }
];

const GoogleMapComponent: React.FC = () => {
    const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    const handleActiveMarker = (markerId: number) => {
        setActiveMarker((prev) => (prev === markerId ? null : markerId));
    };

    useEffect(() => {
        if (!isLoaded || typeof google === 'undefined') return;

        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
            {
                origin: markers[0].position,
                destination: markers[markers.length - 1].position,
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: markers.slice(1, markers.length - 1).map((marker) => ({
                    location: marker.position,
                    stopover: true
                }))
            },
            (response, status) => {
                if (status === google.maps.DirectionsStatus.OK && response) {
                    setDirections(response);
                } else {
                    console.error('Directions request failed:', status);
                }
            }
        );
    }, [isLoaded]);

    if (!isLoaded) return <p>Loading Maps...</p>;

    return (
        <GoogleMap
            onClick={() => setActiveMarker(null)}
            mapContainerStyle={{ width: '100%', height: '100vh' }}
            center={markers[0].position}
            zoom={5}
        >
            {markers.map(({ id, name, position }) => (
                <Marker key={id} position={position} onClick={() => handleActiveMarker(id)}>
                    {activeMarker === id && (
                        <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                            <div>{name}</div>
                        </InfoWindow>
                    )}
                </Marker>
            ))}

            {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
    );
};

export default GoogleMapComponent;
