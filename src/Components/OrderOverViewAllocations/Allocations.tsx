import React, { useState } from "react";
import { Box, Collapse, IconButton, Paper, Typography, Grid, Button, useTheme, useMediaQuery, TextField, Modal, FormControlLabel, Checkbox } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRouter } from 'next/navigation';
// import { usePostAssignOrderMutation } from "@/api/apiSlice";
// import SnackbarAlert from "../ReusableComponents/SnackbarAlerts";
// import { useGetAllAssignedOrdersQuery } from "@/api/apiSlice";

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
    orderId :string
}

const Allocations: React.FC<AllocationsProps> = ({ allocations, orderId }) => {
    // const [snackbarOpen, setSnackbarOpen] = useState(false);
    // const [snackbarMessage, setSnackbarMessage] = useState("");
    // const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    console.log('allocations :', allocations)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [assignModal, setAssignModal] = useState(false); 
    const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
    // const [postAssignOrder] = usePostAssignOrderMutation()

      const [formData, setFormData] = useState({
            vehicleNumber: "",
            driverId: "",
            selfTransport:false
        });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    // const {data: assignedOrders} = useGetAllAssignedOrdersQuery({})
    // console.log("assigned orders :", assignedOrders)

    const handleToggle = (vehicleId: string) => {
        setExpanded((prev) => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
    };
    const handleTrack = (vehicle_ID: string) => {
        router.push(`/liveTracking?vehicle_ID=${vehicle_ID}`);
    };
    const handleAssign = (allocation: Allocation) => {
        setSelectedAllocation(allocation);
        setAssignModal(true)
    };
   
    const handleSubmit = async() => {
        if (!selectedAllocation) return;
        const body = {
            order_ID: orderId,
            assigned_vehicle_data: {
                vehicle_number: formData.vehicleNumber,
                // vehicle_type: "Truck"
            },
            vehicle_docs: {
                insurance: "Valid",
                registration: "XYZ123456789",
                permit: "Valid till 2025"
            },
            self_transport: formData.selfTransport ,
            dri_ID: formData.driverId,
            pod: {
                status: "",
                timestamp: Date.now(),
                delivery_image: "",
                digital_signature: ""
            },
            pod_doc: "https://example.com/pod-doc.jpg"
        };

        console.log("Posting to API:", body);
        // const response = await postAssignOrder(body).unwrap();
        // setAssignModal(false);
        // setSnackbarMessage(`Assined successfully!`);
        // setSnackbarSeverity("success");
        // setSnackbarOpen(true);
        // console.log('response:',response)
        // setAssignModal(false);
    };
    return (
        <Box>
            {/* <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            /> */}
            <Typography variant="h6" gutterBottom>
                Allocations
            </Typography>
            <Modal open={assignModal} onClose={() => setAssignModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 3,
                        borderRadius: 2,
                        width: {xs:'100%', md:'30%'}
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Typography variant="h6" gutterBottom>
                        Assign Order ({orderId}) to {selectedAllocation?.vehicle_ID}
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Vehicle number"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Driver ID"
                            name="driverId"
                            value={formData.driverId}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.selfTransport}
                                    onChange={(e) =>
                                        setFormData({ ...formData, selfTransport: e.target.checked })
                                    }
                                    name="selfTransport"
                                    color="primary"
                                />
                            }
                            label="Self Transport"
                        />
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>

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
                                    onClick={() => handleAssign(allocation)}
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
