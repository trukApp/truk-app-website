import { useAppSelector } from '@/store';
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Paper } from '@mui/material';

// Define the Vehicle and LoadArrangement types
interface LoadArrangement {
    stop: number;
    location: string;
    packages: string[];
}

interface Allocation {
    vehicle_ID: string;
    totalWeightCapacity: number;
    leftoverWeight: number;
    totalVolumeCapacity: number;
    leftoverVolume: number;
    cost: number;
    loadArrangement?: LoadArrangement[];
}


const LoadOptimization = () => {
    const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);
    console.log("selectedTrucksFromLoad: ", selectedTrucks);

    if (!selectedTrucks.length || !selectedTrucks[0].allocations) {
        return <Typography variant="h6">No vehicle data available.</Typography>;
    }

    const getVechiles: Allocation[] = selectedTrucks[0].allocations;
    console.log("getVechiles: ", getVechiles);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom color='#83214F' sx={{ fontWeight: 'bold', marginTop: '30px' }}>
                Load Optimization Details
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                {getVechiles.map((vehicle, index) => {
                    // Define columns for the DataGrid
                    const columns: GridColDef[] = [
                        { field: 'id', headerName: 'Load Arrangement', width: 100 },
                        { field: 'location', headerName: 'Load Address', width: 400 },
                        { field: 'packages', headerName: 'Packages', width: 250 },
                    ];

                    const rows = (vehicle.loadArrangement ?? []).map((item, i) => ({
                        id: item.stop || i + 1,
                        location: item.location || 'N/A',
                        packages: item.packages ? item.packages.join(', ') : 'N/A',
                    }));

                    return (
                        <Paper key={index} sx={{ my: 3, p: 3, borderRadius: 2, boxShadow: 3, width: '75%' }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold', }} color='#83214F'>
                                Vehicle ID: {vehicle.vehicle_ID}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Total Weight Capacity:</strong> {vehicle.totalWeightCapacity} kg
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Leftover Weight:</strong> {vehicle.leftoverWeight} kg
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Total Volume Capacity:</strong> {vehicle.totalVolumeCapacity} m³
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Leftover Volume:</strong> {vehicle.leftoverVolume} m³
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Cost:</strong> ₹{vehicle.cost}
                            </Typography>

                            {rows.length === 0 ? (
                                <Typography variant="body1" sx={{ mt: 2 }}>No load arrangement data available.</Typography>
                            ) : (
                                <Box sx={{ mt: 2, height: 300, backgroundColor: 'white' }}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSizeOptions={[5, 10]}
                                        initialState={{
                                            pagination: { paginationModel: { pageSize: 5 } },
                                        }}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                            )}
                        </Paper>
                    );
                })}
            </div>

        </Box>
    );
};

export default LoadOptimization;
