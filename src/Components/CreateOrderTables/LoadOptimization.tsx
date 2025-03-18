// import { useAppSelector } from '@/store';
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Paper } from '@mui/material';
import { Truck } from './TrucksTable';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

interface LoadArrangement {
    stop: number;
    location: string;
    packages: string[];
}

interface TrucksTableProps {
    trucks: Truck[];
}
const LoadOptimization: React.FC<TrucksTableProps> = ({ trucks }) => {
    const selectedTrucks = trucks
    const getVechiles = selectedTrucks;
    const selectedRoutes = useSelector((state: RootState) => state.auth.selectedRoutes);
    console.log('selectedRoutesFromRedux: ', selectedRoutes);
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom color='#83214F' sx={{ fontWeight: 'bold', marginTop: '30px' }}>
                Load Optimization Details
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                {getVechiles.map((vehicle, index) => {
                    const columns: GridColDef[] = [
                        { field: 'id', headerName: 'Load Arrangement', width: 100 },
                        { field: 'location', headerName: 'Delivery Address', width: 400 },
                        { field: 'packages', headerName: 'Packages', width: 250 },
                    ];

                    const rows = (vehicle.loadArrangement ?? []).map((item: LoadArrangement, i) => ({
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
                                Total Weight Capacity:  <strong>{vehicle.totalWeightCapacity} kg</strong>
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Leftover Weight: <strong>{vehicle.leftoverWeight} kg</strong>
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Total Volume Capacity: <strong>{vehicle.totalVolumeCapacity} m³</strong>
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Leftover Volume:   <strong>{vehicle.leftoverVolume} m³</strong>
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Estimated Cost:   <strong>₹{vehicle.cost}</strong>
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
