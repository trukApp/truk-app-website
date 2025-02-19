import React, { useState } from "react";
import { Box, Collapse, IconButton, Paper, Typography, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

    const handleToggle = (vehicleId: string) => {
        setExpanded((prev) => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Allocations
            </Typography>
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
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">Total Volume Capacity: {allocation.totalVolumeCapacity}</Typography>
                            <Typography variant="body2">Total Weight Capacity: {allocation.totalWeightCapacity}</Typography>
                            <Typography variant="body2">Occupied Volume: {allocation.occupiedVolume}</Typography>
                            <Typography variant="body2">Occupied Weight: {allocation.occupiedWeight}</Typography>
                            <Typography variant="body2">Leftover Volume: {allocation.leftoverVolume}</Typography>
                            <Typography variant="body2">Leftover Weight: {allocation.leftoverWeight}</Typography>
                            <Typography variant="body2">Packages: {allocation.packages.join(", ")}</Typography>
                        </Box>
                    </Collapse>
                </Paper>
            ))}
        </Box>
    );
};

export default Allocations;
