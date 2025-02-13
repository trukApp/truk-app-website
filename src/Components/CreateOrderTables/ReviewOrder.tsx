import { useAppSelector } from '@/store';
import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DataGrid, } from '@mui/x-data-grid';

// Define types
interface Allocation {
    vehicle_ID: string;
    totalWeightCapacity: number;
    leftoverWeight: number;
    totalVolumeCapacity: number;
    leftoverVolume: number;
    cost: number;
    loadArrangement?: LoadArrangement[];
}

interface LoadArrangement {
    stop: number;
    location: string;
    packages: string[];
}

const ReviewCreateOrder = () => {
    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);
    const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);

    console.log("selectedPackages: ", selectedPackages);
    console.log("selectTrucks: ", selectedTrucks);

    return (
        <Box sx={{ p: 3 }}>
            {/* Selected Packages Section */}
            {/* <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Selected Packages</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Package ID</TableCell>
                                <TableCell>Ship From</TableCell>
                                <TableCell>Ship To</TableCell>
                                <TableCell>Products</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedPackages.map((pkg) => (
                                <TableRow key={pkg.pac_id}>
                                    <TableCell>{pkg.pack_ID}</TableCell>
                                    <TableCell>{pkg.ship_from}</TableCell>
                                    <TableCell>{pkg.ship_to}</TableCell>
                                    <TableCell>{pkg.product_ID.join(', ')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper> */}
            <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Selected Packages</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Package ID</TableCell>
                                <TableCell>Ship From</TableCell>
                                <TableCell>Ship To</TableCell>
                                <TableCell>Products</TableCell>
                                <TableCell>Invoice</TableCell>
                                <TableCell>Reference ID</TableCell>
                                <TableCell>Pickup Date & Time</TableCell>
                                <TableCell>Dropoff Date & Time</TableCell>
                                <TableCell>Tax Info</TableCell>
                                <TableCell>Return Label</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedPackages.map((pkg) => (
                                <TableRow key={pkg.pac_id}>
                                    <TableCell>{pkg.pack_ID}</TableCell>
                                    <TableCell>{pkg.ship_from}</TableCell>
                                    <TableCell>{pkg.ship_to}</TableCell>
                                    <TableCell>
                                        {pkg.product_ID.map((product) => (
                                            <div key={product.prod_ID}>
                                                {product.prod_ID} (Qty: {product.quantity})
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>{pkg.additional_info?.invoice || 'N/A'}</TableCell>
                                    <TableCell>{pkg.additional_info?.reference_id || 'N/A'}</TableCell>
                                    <TableCell>{pkg.pickup_date_time}</TableCell>
                                    <TableCell>{pkg.dropoff_date_time}</TableCell>
                                    <TableCell>{pkg.tax_info?.tax_rate || 'N/A'}</TableCell>
                                    <TableCell>{pkg.return_label ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Selected Truck Details Section */}
            {selectedTrucks.length > 0 && (
                <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h6" gutterBottom>Selected Truck Details</Typography>
                    <Typography><strong>Label:</strong> {selectedTrucks[0].label}</Typography>
                    <Typography><strong>Total Cost:</strong> ₹{selectedTrucks[0].totalCost}</Typography>
                </Paper>
            )}

            {/* Route Optimization Section */}
            <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Route Optimization</Typography>
                {selectedTrucks[0]?.allocations?.map((allocation: Allocation, index: number) => (
                    <Typography key={index}>
                        Stop {index + 1}: {allocation.loadArrangement?.map((stop) => stop.location).join(', ') || "N/A"}
                    </Typography>
                ))}
            </Paper>

            {/* Load Optimization Section */}
            <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Load Optimization</Typography>
                {selectedTrucks[0]?.allocations?.map((vehicle: Allocation, index: number) => (
                    <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom><strong>Vehicle ID:</strong> {vehicle.vehicle_ID}</Typography>
                        <Typography>Total Weight Capacity: {vehicle.totalWeightCapacity} kg</Typography>
                        <Typography>Leftover Weight: {vehicle.leftoverWeight} kg</Typography>
                        <Typography>Total Volume Capacity: {vehicle.totalVolumeCapacity} m³</Typography>
                        <Typography>Leftover Volume: {vehicle.leftoverVolume} m³</Typography>
                        <Typography>Cost: ₹{vehicle.cost}</Typography>

                        {/* Data Grid for Load Arrangement */}
                        {vehicle.loadArrangement && vehicle.loadArrangement.length > 0 ? (
                            <Box sx={{ mt: 2, height: 300, backgroundColor: 'white' }}>
                                <DataGrid
                                    rows={vehicle.loadArrangement.map((item, i) => ({
                                        id: item.stop || i + 1,
                                        location: item.location || 'N/A',
                                        packages: item.packages ? item.packages.join(', ') : 'N/A',
                                    }))}
                                    columns={[
                                        { field: 'id', headerName: 'Stop No', width: 100 },
                                        { field: 'location', headerName: 'Load Address', width: 400 },
                                        { field: 'packages', headerName: 'Packages', width: 250 },
                                    ]}
                                    pageSizeOptions={[5, 10]}
                                    initialState={{
                                        pagination: { paginationModel: { pageSize: 5 } },
                                    }}
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        ) : (
                            <Typography>No load arrangement data available.</Typography>
                        )}
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};

export default ReviewCreateOrder;
