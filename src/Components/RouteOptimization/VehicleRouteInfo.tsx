import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';

interface VehicleRouteInfoProps {
    routeData: any;
    totalDistance: number;
    totalDuration: string;
}

const VehicleRouteInfo: React.FC<VehicleRouteInfoProps> = ({ routeData, totalDistance, totalDuration }) => {
    return (
        <Box sx={{ marginBottom: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, border: '1px solid #ccc', marginBottom: 1, gap: '10px' }}>
                <Image src="/start.svg" alt="Start" width={25} height={25} unoptimized />
                <Typography variant="h6">Start: {routeData?.route[0]?.start.address}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, border: '1px solid #ccc', marginBottom: 1, gap: '10px' }}>
                <Image src="/drop.svg" alt="End" width={25} height={25} unoptimized />
                <Typography variant="h6">
                    End: {routeData?.route[routeData?.route.length - 1]?.end.address}
                </Typography>
            </Box>
            <Card variant="outlined" sx={{ minWidth: 200 }}>
                <CardContent>
                    <Typography variant="subtitle1">Duration: {totalDuration}</Typography>
                    <Typography variant="subtitle1">Distance: {totalDistance} km</Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default VehicleRouteInfo;
