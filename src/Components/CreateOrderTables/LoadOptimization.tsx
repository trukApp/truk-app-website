// import { useAppSelector } from '@/store';
// import React from 'react';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { Box, Typography, Paper } from '@mui/material';

// const LoadOptimization = () => {
//     const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);
//     console.log("selectedTrucksFromLoad: ", selectedTrucks);

//     // Ensure selectedTrucks has data before accessing allocations
//     if (!selectedTrucks.length || !selectedTrucks[0].allocations) {
//         return <Typography variant="h6">No vehicle data available.</Typography>;
//     }

//     const getVechiles = selectedTrucks[0].allocations;
//     console.log("getVechiles: ", getVechiles);

//     return (
//         <Box sx={{ p: 2 }}>
//             <Typography variant="h5" gutterBottom>
//                 Load Optimization Details
//             </Typography>

//             {getVechiles.map((vehicle: any, index: number) => {
//                 // Define columns for the DataGrid
//                 const columns: GridColDef[] = [
//                     { field: 'id', headerName: 'Stop No', width: 100 },
//                     { field: 'location', headerName: 'Load Address', width: 400 },
//                     { field: 'packages', headerName: 'Packages', width: 250 },
//                 ];

//                 // Prepare row data for the DataGrid
//                 const rows = vehicle.loadArrangement.map((item: any, i: number) => ({
//                     id: item.stop || i + 1,
//                     location: item.location || 'N/A',
//                     packages: item.packages ? item.packages.join(', ') : 'N/A',
//                 }));

//                 return (
//                     <Paper key={index} sx={{ my: 3, p: 3, borderRadius: 2, boxShadow: 3, width: '75%', }}>
//                         <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
//                             Vehicle ID: {vehicle.vehicle_ID}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Total Weight Capacity:</strong> {vehicle.totalWeightCapacity} kg
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Leftover Weight:</strong> {vehicle.leftoverWeight} kg
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Total Volume Capacity:</strong> {vehicle.totalVolumeCapacity} m³
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Leftover Volume:</strong> {vehicle.leftoverVolume} m³
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Cost:</strong> ₹{vehicle.cost}
//                         </Typography>

//                         {rows.length === 0 ? (
//                             <Typography variant="body1" sx={{ mt: 2 }}>No load arrangement data available.</Typography>
//                         ) : (
//                             <Box sx={{ mt: 2, height: 300, backgroundColor: 'white' }}>
//                                 <DataGrid
//                                     rows={rows}
//                                     columns={columns}
//                                     pageSizeOptions={[5, 10]}
//                                     initialState={{
//                                         pagination: { paginationModel: { pageSize: 5 } },
//                                     }}
//                                     disableRowSelectionOnClick
//                                 />
//                             </Box>
//                         )}
//                     </Paper>
//                 );
//             })}
//         </Box>
//     );
// };

// export default LoadOptimization;


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

interface Vehicle {
    vehicle_ID: string;
    totalWeightCapacity: number;
    leftoverWeight: number;
    totalVolumeCapacity: number;
    leftoverVolume: number;
    cost: number;
    loadArrangement: LoadArrangement[];
}

const LoadOptimization = () => {
    const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);
    console.log("selectedTrucksFromLoad: ", selectedTrucks);

    if (!selectedTrucks.length || !selectedTrucks[0].allocations) {
        return <Typography variant="h6">No vehicle data available.</Typography>;
    }

    const getVechiles: Vehicle[] = selectedTrucks[0].allocations;
    console.log("getVechiles: ", getVechiles);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Load Optimization Details
            </Typography>

            {getVechiles.map((vehicle, index) => {
                // Define columns for the DataGrid
                const columns: GridColDef[] = [
                    { field: 'id', headerName: 'Stop No', width: 100 },
                    { field: 'location', headerName: 'Load Address', width: 400 },
                    { field: 'packages', headerName: 'Packages', width: 250 },
                ];

                // Prepare row data for the DataGrid
                const rows = vehicle.loadArrangement.map((item, i) => ({
                    id: item.stop || i + 1,
                    location: item.location || 'N/A',
                    packages: item.packages ? item.packages.join(', ') : 'N/A',
                }));

                return (
                    <Paper key={index} sx={{ my: 3, p: 3, borderRadius: 2, boxShadow: 3, width: '75%' }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                            Vehicle ID: {vehicle.vehicle_ID}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Total Weight Capacity:</strong> {vehicle.totalWeightCapacity} kg
                        </Typography>
                        <Typography variant="body1">
                            <strong>Leftover Weight:</strong> {vehicle.leftoverWeight} kg
                        </Typography>
                        <Typography variant="body1">
                            <strong>Total Volume Capacity:</strong> {vehicle.totalVolumeCapacity} m³
                        </Typography>
                        <Typography variant="body1">
                            <strong>Leftover Volume:</strong> {vehicle.leftoverVolume} m³
                        </Typography>
                        <Typography variant="body1">
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
        </Box>
    );
};

export default LoadOptimization;
