import React, { useState } from "react";
import { Box, Collapse, IconButton, Paper, Typography, Grid, Button, useTheme, useMediaQuery } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRouter } from 'next/navigation';
import { useGetAllAssignedOrdersQuery } from "@/api/apiSlice";

interface Allocation {
    vehicle_ID: string;
    cost: number;
    totalVolumeCapacity: number;
    totalWeightCapacity: number;
    occupiedVolume: number;
    occupiedWeight: number;
    leftoverVolume: number;
    leftoverWeight: number;
    packages: string[];
}

interface AllocationsProps {
    allocations: Allocation[];
}

const Allocations: React.FC<AllocationsProps> = ({ allocations }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [assignModal, setAssignModal] = useState(false);
    const {data: assignedOrders} = useGetAllAssignedOrdersQuery({})
    console.log("assigned orders :", assignedOrders)

    const handleToggle = (vehicleId: string) => {
        setExpanded((prev) => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
    };
    const handleTrack = (vehicle_ID: string) => {
        router.push(`/liveTracking?vehicle_ID=${vehicle_ID}`);
    };
    const handleAssign = () => {
        console.log("assign clicked ")
        setAssignModal(true)
    };
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Allocations
            </Typography>
            {assignModal && (
    <div 
        className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
        onClick={() => setAssignModal(false)} 
    >
        <div 
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
        >
            hiiii
        </div>
    </div>
)}


            {allocations.map((allocation) => (
                <Paper key={allocation.vehicle_ID} sx={{ p: 2, mb: 2 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle1">
                                Vehicle: {allocation.vehicle_ID} | Cost: ₹{allocation.cost}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={() => handleToggle(allocation.vehicle_ID)}>
                                {expanded[allocation.vehicle_ID] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>

                    <Collapse in={expanded[allocation.vehicle_ID]} timeout="auto" unmountOnExit>
                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "background.paper",
                                boxShadow: 2
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                Vehicle ID: {allocation.vehicle_ID}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2">
                                        <strong>Total Volume Capacity:</strong> {allocation.totalVolumeCapacity}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Total Weight Capacity:</strong> {allocation.totalWeightCapacity}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Occupied Volume:</strong> {allocation.occupiedVolume}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2">
                                        <strong>Occupied Weight:</strong> {allocation.occupiedWeight}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Leftover Volume:</strong> {allocation.leftoverVolume}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Leftover Weight:</strong> {allocation.leftoverWeight}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Packages:</strong> {allocation.packages.join(", ")}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: isMobile ? "center" : "flex-end", mt: 3, gap:3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAssign()}
                                >
                                    Assign 
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleTrack(allocation.vehicle_ID)}
                                >
                                    View Track
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </Paper>
            ))}
        </Box>
    );
};

export default Allocations;
