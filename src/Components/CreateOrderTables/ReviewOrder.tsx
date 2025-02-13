import { useAppSelector } from '@/store';
import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';
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
    window.scrollTo(0, 0)

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#83214F' }}>Selected Packages</Typography>
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
            <Grid>
                {selectedTrucks.length > 0 && (
                    <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#83214F' }}>Selected Truck Details</Typography>
                        <Typography>Label: <strong>{selectedTrucks[0].label}</strong> </Typography>
                        <Typography>Total Cost: <strong> ₹{selectedTrucks[0].totalCost}</strong></Typography>
                    </Paper>
                )}
            </Grid>
            {/* <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Route Optimization (Number of stops: {selectedTrucks[0]?.allocations.length}) </Typography>
                    {selectedTrucks[0]?.allocations?.map((allocation: Allocation, index: number) => (
                        <Grid key={index} sx={{display:'flex' , flexDirection:'row'}}>
                            <Typography sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Stop {index + 1} : </Typography>
                            <Typography  sx={{ ml: 1, flex: 1, display: "inline-block", wordBreak: "break-word" }}>
                                {allocation.loadArrangement?.map((stop) => stop.location).join(', ') || "N/A"}
                            </Typography>
                        </Grid>
                ))}
            </Paper> */}

            <Grid>


                {/* Load  and route Optimization Section */}
                <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#83214F' }}>
                        Load and Route Optimised vehicles : {selectedTrucks[0]?.allocations?.length}
                    </Typography>

                    <Grid container spacing={2}>
                        {selectedTrucks[0]?.allocations?.map((vehicle: Allocation, index: number) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        backgroundColor: "white",
                                        marginTop: 3
                                    }}
                                >
                                    <Typography variant="subtitle1" gutterBottom>
                                        Vehicle ID: <strong>{vehicle.vehicle_ID}</strong>
                                    </Typography>
                                    <Typography>
                                        Total Weight Capacity: <strong>{vehicle.totalWeightCapacity} kg</strong>
                                    </Typography>
                                    <Typography>
                                        Leftover Weight: <strong>{vehicle.leftoverWeight} kg</strong>
                                    </Typography>
                                    <Typography>
                                        Total Volume Capacity: <strong>{vehicle.totalVolumeCapacity} m³</strong>
                                    </Typography>
                                    <Typography>
                                        Leftover Volume: <strong>{vehicle.leftoverVolume} m³</strong>
                                    </Typography>
                                    <Typography>
                                        Cost: <strong>₹{vehicle.cost}</strong>
                                    </Typography>

                                    {/* Data Grid for Load Arrangement */}
                                    {vehicle.loadArrangement && vehicle.loadArrangement.length > 0 ? (
                                        <Box sx={{ mt: 2, height: 300, backgroundColor: "white", borderRadius: 1, overflow: "hidden" }}>
                                            <DataGrid
                                                rows={vehicle.loadArrangement.map((item, i) => ({
                                                    id: item.stop || i + 1,
                                                    location: item.location || "N/A",
                                                    packages: item.packages ? item.packages.join(", ") : "N/A",
                                                }))}
                                                columns={[
                                                    { field: "id", headerName: "Stop No", width: 100 },
                                                    { field: "location", headerName: "Load Address", width: 300 },
                                                    { field: "packages", headerName: "Packages", width: 200 },
                                                ]}
                                                pageSizeOptions={[5, 10]}
                                                disableRowSelectionOnClick
                                                sx={{
                                                    "& .MuiDataGrid-columnHeaders": {
                                                        backgroundColor: "#f5f5f5",
                                                        fontWeight: "bold",
                                                    },
                                                    "& .MuiDataGrid-cell": {
                                                        padding: "8px",
                                                    },
                                                    "& .MuiDataGrid-footerContainer": {
                                                        display: "none",
                                                    },
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Typography sx={{ mt: 1, fontStyle: "italic", color: "gray" }}>
                                            No load arrangement data available.
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

            </Grid>


        </Box>
    );
};

export default ReviewCreateOrder;
