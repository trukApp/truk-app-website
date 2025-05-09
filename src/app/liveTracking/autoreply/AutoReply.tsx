'use client';

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { useSearchParams } from 'next/navigation';
import { Button, CircularProgress, Box, Typography, Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import { usePostValidateRouteMutation } from '@/api/apiSlice';
import { setDeviationData } from '@/store/authSlice';
import { useAppDispatch } from '@/store';

const mapContainerStyle = {
    width: '100%',
    height: '500px',
};

interface VehicleLocation {
    latitude: number;
    longitude: number;
    timestamp: number;
}
interface DeviationPoints {
    lat: number;
    lng: number;
}

const AutoReply = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [postValidateRoute] = usePostValidateRouteMutation();
    const dispatch = useAppDispatch();
    const vehicleId = searchParams.get('vehicle_ID') || '';

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([]);
    const [vehicleDeviatedLocations, setVehicleDeviatedLocations] = useState<DeviationPoints[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
    const [vehicleType, setVehicleType] = useState('');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [actualDistance, setActualDistance] = useState('');
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const storedOrder = localStorage.getItem("orderData");
        if (storedOrder) {
            const parsedOrder = JSON.parse(storedOrder);
            setOrderId(parsedOrder?.order?.order_ID);
        }
    }, []);

    const fetchData = async () => {
        try {
            const vehicleId = 'TS08JB3663';
            const fromDateUTC = '1743656612135';
            const toDateUTC = '1743674552135';
            const userId = process.env.NEXT_PUBLIC_VAMOSYS_USERID || '';

            const response = await fetch(`https://gpsvtsprobend.vamosys.com/getVehicleHistory?vehicleId=${vehicleId}&fromDateUTC=${fromDateUTC}&toDateUTC=${toDateUTC}&interval=-1&userId=${userId}`);
            const data = await response.json();

            setActualDistance(data?.tripDistance);
            setStartLocation(data?.startLocation);
            setEndLocation(data?.endLocation);
            setVehicleType(data?.vehicleType);

            if (response.ok) {
                const locations = data?.vehicleLocations?.map((loc: { latitude: string; longitude: string }) => ({
                    latitude: parseFloat(loc.latitude),
                    longitude: parseFloat(loc.longitude),
                }));

                setVehicleLocations(locations);

                const vehiclelocations = data?.vehicleLocations?.map((loc: { latitude: string; longitude: string }) => ({
                    lat: parseFloat(loc.latitude),
                    lng: parseFloat(loc.longitude),
                }));

                setVehicleDeviatedLocations(vehiclelocations);

                if (locations?.length > 0) {
                    setCenter({ lat: locations[0].latitude, lng: locations[0].longitude });
                }

                setError(null);
            } else {
                setError(data.error || 'Failed to fetch data');
            }
        } catch (err) {
            console.error('Error fetching vehicle history:', err);
            setError('No vehicle locations available. Please check the vehicle status or try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isLoaded) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="500px">
                <Typography variant="h6">Google Maps is loading...</Typography>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="500px">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Loading vehicle data...
                </Typography>
            </Box>
        );
    }

    if (error || vehicleLocations.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="500px">
                <Typography variant="h6" color="error">
                    No vehicle locations available. Please check the vehicle status or try again later.
                </Typography>
            </Box>
        );
    }

    const handleViewRouteDetails = async () => {
        setModalOpen(true);
        const postBody = {
            order_ID: orderId,
            vehicle_ID: vehicleId,
            start_lat: parseFloat(startLocation.split(",")[0]),
            start_lng: parseFloat(startLocation.split(",")[1]),
            end_lat: parseFloat(endLocation.split(",")[0]),
            end_lng: parseFloat(endLocation.split(",")[1]),
            actual_distance_traveled: Number(actualDistance),
            driverRoute: vehicleDeviatedLocations
        };

        try {
            const response = await postValidateRoute(postBody).unwrap();
            dispatch(setDeviationData(response));
            router.push('/route-details');
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setModalOpen(false);
        }
    };

    return (
        <Box>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
                <Marker
                    position={{ lat: vehicleLocations[0]?.latitude, lng: vehicleLocations[0]?.longitude }}
                    icon={{
                        url: vehicleType === 'Bike' ? '/bike.svg' : '/car.svg',
                        scaledSize: new window.google.maps.Size(40, 40),
                    }}
                />
                <Polyline
                    path={vehicleLocations.map(loc => ({ lat: loc.latitude, lng: loc.longitude }))}
                    options={{
                        strokeColor: '#0000FF',
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                    }}
                />
            </GoogleMap>

            <Box mt={3} textAlign="center">
                <Button variant="contained" color="primary" onClick={handleViewRouteDetails}>
                    View Route Details
                </Button>
            </Box>
            <Modal open={modalOpen} aria-labelledby="loading-modal">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <CircularProgress />
                </Box>
            </Modal>
        </Box>
    );
};

export default AutoReply;
