'use client';

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '500px',
};

interface VehicleLocation {
    latitude: number;
    longitude: number;
    timestamp: number;
}

const AutoReply = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
    const [vehicleType, setVehicleType] = useState('');

    const fetchData = async () => {
        try {
            // const vehicleId = 'TS02EY1313';
            const vehicleId = 'TS08JB3663';
            const fromDateUTC = '1742927400000';
            const toDateUTC = '1743003000000';
            const userId = process.env.NEXT_PUBLIC_VAMOSYS_USERID || '';
            console.log(userId)

            const response = await fetch(`https://gpsvtsprobend.vamosys.com/getVehicleHistory?vehicleId=${vehicleId}&fromDateUTC=${fromDateUTC}&toDateUTC=${toDateUTC}&interval=-1&userId=${userId}`);
            const data = await response.json();
            setVehicleType(data?.vehicleType);
            if (response.ok) {
                const locations = data?.vehicleLocations?.map((loc: { latitude: string; longitude: string; }) => ({
                    latitude: parseFloat(loc.latitude),
                    longitude: parseFloat(loc.longitude),
                }));
                setVehicleLocations(locations);
                if (locations?.length > 0) {
                    setCenter({ lat: locations?.[0].latitude, lng: locations?.[0].longitude });
                }
                setError(null);
            } else {
                setError(data.error || 'Failed to fetch data');
            }
        } catch (err) {
            console.log('Error fetching vehicle history:', err);
            setError('No vehicle locations available.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!isLoaded) return <div>Loading Maps...</div>;
    if (error) return <div>{error}</div>;
    return (
        <div>
            {error ? (
                <div>{error}</div>
            ) : vehicleLocations === undefined || vehicleLocations.length === 0 ? (
                <div>No vehicle locations available. Please check the vehicle status or try again later.</div>
            ) : (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={10}
                >
                    <Marker
                        position={{ lat: vehicleLocations?.[0]?.latitude, lng: vehicleLocations?.[0]?.longitude }}
                        icon={{
                            url: vehicleType === 'Bike' ? '/bike.svg' : '/car.svg',
                            scaledSize: new window.google.maps.Size(40, 40),
                        }}
                    />
                    <Polyline
                        path={vehicleLocations?.map(loc => ({ lat: loc.latitude, lng: loc.longitude }))}
                        options={{
                            strokeColor: '#0000FF',
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                    />
                </GoogleMap>
            )}
        </div>
    );
};

export default AutoReply;
