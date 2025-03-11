import React, { useState } from "react";
import { Box, Collapse, IconButton, Paper, Typography, Grid, Button, useTheme, useMediaQuery, TextField, Modal, FormControlLabel, Checkbox, MenuItem, Backdrop, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRouter } from 'next/navigation';
import { useGetAllDriversDataQuery, usePostAssignOrderMutation } from "@/api/apiSlice";
import SnackbarAlert from "../ReusableComponents/SnackbarAlerts";
import { Driver } from "../BusinessPartnersForms/DriverForm";
import moment from 'moment';
import Image from "next/image";

// import { useGetAllAssignedOrdersQuery } from "@/api/apiSlice";
import AdditionalInformation from '@/Components/CreatePackageTabs/AddtionalInformation';

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
    orderId: string;
    allocatedPackageDetails: []
}

interface Product {
    prod_ID: string;
    quantity: number;
    package_info: string
}

interface AdditionalInformation {
    reference_id: string;
    invoice: string;
    department: string;
    sales_order_number: string;
    po_number: string;
    attachment: string;

}

interface TaxInformation {
    sender_gst: string;
    receiver_gst: string;
    carrier_gst: string;
    self_transport: string;
    tax_rate: string;
}
interface PackageDetail {
    pac_id: string;
    pack_ID: string;
    package_status: string;
    ship_from: string;
    ship_to: string;
    pickup_date_time: string;
    dropoff_date_time: string;
    return_label: boolean;
    product_ID: Product[];
    bill_to: string;
    additional_info: AdditionalInformation;
    tax_info: TaxInformation;
}


const Allocations: React.FC<AllocationsProps> = ({ allocations, orderId, allocatedPackageDetails }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    // console.log('allocations :', allocations)
    console.log("allocatedPackageDetails: ", allocatedPackageDetails)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [assignModal, setAssignModal] = useState(false);
    const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
    const [postAssignOrder, { isLoading: isAssigning }] = usePostAssignOrderMutation()
    const { data, isLoading: driverLoading } = useGetAllDriversDataQuery({})
    const getAvailableDrivers = data.drivers.filter((eachDriver: Driver) => {
        return eachDriver?.driver_availability === true
    })
    console.log(getAvailableDrivers)
    const driversData = data?.drivers.length > 0 ? data?.drivers : []
    if (driverLoading) {
        console.log("driver loading")
    }
    const [formData, setFormData] = useState({
        vehicleNumber: "",
        driverId: "",
        selfTransport: false
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

    const handleSubmit = async () => {
        if (!selectedAllocation) return;
        const body = {
            order_ID: orderId,
            assigned_vehicle_data: {
                vehicle_number: formData.vehicleNumber,
                // vehicle_type: "Truck"
            },
            vehicle_docs: {
                insurance: "Valid",
                registration: "ABC9876543",
                permit: "Valid till 2026"
            },
            self_transport: formData.selfTransport,
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
        const response = await postAssignOrder(body).unwrap();
        console.log("assign response :", response)
        setAssignModal(false);
        setSnackbarMessage(`Assined successfully!`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        console.log('response:', response)
        setAssignModal(false);
    };
    return (
        <Box>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isAssigning}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
            <Typography variant="h6" gutterBottom color="#83214F" style={{ fontWeight: 'bold' }}>
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
                        width: { xs: "100%", md: "30%" },
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
                            select
                            value={formData.driverId}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {driversData.map((driver: Driver) => (
                                <MenuItem key={driver.dri_ID} value={driver.dri_ID}>
                                    {driver.dri_ID}
                                </MenuItem>
                            ))}
                        </TextField>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.selfTransport}
                                    onChange={(e) => setFormData({ ...formData, selfTransport: e.target.checked })}
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
                            <Typography variant="subtitle1" color="#83214F" style={{ fontWeight: 'bold' }}>
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
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }} color="#83214F">
                                Vehicle ID: {allocation.vehicle_ID}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Total Weight Capacity:</strong> {allocation.totalWeightCapacity}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Total Volume Capacity:</strong> {allocation.totalVolumeCapacity}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Occupied Weight:</strong> {allocation.occupiedWeight}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Occupied Volume:</strong> {allocation.occupiedVolume}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Leftover Weight:</strong> {allocation.leftoverWeight}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Leftover Volume:</strong> {allocation.leftoverVolume}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Packages:</strong> {allocation.packages.join(", ")}
                                </Typography>
                            </Box>

                            {allocatedPackageDetails
                                .filter((pkg: PackageDetail) => allocation.packages.includes(pkg.pack_ID))
                                .map((pkg: PackageDetail) => (
                                    <Paper key={pkg.pac_id} sx={{ mt: 2, p: 2, backgroundColor: "#f9f9f9" }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            <strong>Package ID: {pkg.pack_ID}</strong>
                                        </Typography>

                                        <Typography variant="body2">
                                            <strong>Status:</strong> {pkg.package_status}
                                        </Typography>
                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px', marginBottom: '5px' }}>Billing Details</Typography>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="body2">
                                                <strong>Ship From:</strong> {pkg.ship_from}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Ship To:</strong> {pkg.ship_to}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Bill To:</strong> {pkg.bill_to}
                                            </Typography>
                                        </Grid>

                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px', marginBottom: '5px' }}>Date & Timings</Typography>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="body2">
                                                <strong>Pickup Date:</strong> {moment(pkg.pickup_date_time).format("DD/MM/YYYY HH:mm")}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Dropoff Date:</strong> {moment(pkg.dropoff_date_time).format("DD/MM/YYYY HH:mm")}
                                            </Typography>
                                        </Grid>


                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px', marginBottom: '5px' }}>Additional Information</Typography>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="body2">
                                                <strong>Refernce ID:</strong> {pkg.additional_info?.reference_id}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Invoice:</strong> {pkg.additional_info?.invoice}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Department:</strong> {pkg.additional_info?.department}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Sales order number:</strong> {pkg.additional_info?.sales_order_number}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Po number:</strong> {pkg.additional_info?.po_number}
                                            </Typography>

                                            {pkg.additional_info?.attachment && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                                        Attachment:
                                                    </Typography>
                                                    <div style={{ position: 'relative', width: '300px', height: '200px', marginTop: '5px' }}>
                                                        <Image
                                                            src={pkg.additional_info.attachment}
                                                            alt="Attachment"
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, 300px"
                                                            style={{ objectFit: 'contain' }}
                                                        />

                                                    </div>
                                                </div>
                                            )}

                                        </Grid>

                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px', marginBottom: '5px' }}>Tax Information</Typography>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="body2">
                                                <strong>Refernce ID:</strong> {pkg.tax_info?.sender_gst}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Invoice:</strong> {pkg.tax_info?.receiver_gst}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Department:</strong> {pkg.tax_info?.carrier_gst}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Sales order number:</strong> {pkg.tax_info?.self_transport}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Po number:</strong> {pkg.tax_info?.tax_rate}
                                            </Typography>
                                        </Grid>

                                        <Typography variant="body2">
                                            <strong>Return Label:</strong> {pkg.return_label ? "Yes" : "No"}
                                        </Typography>

                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px', marginBottom: '5px' }}>Product Details</Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                                Products:
                                            </Typography>
                                            {pkg.product_ID.map((prod: Product, index: number) => (
                                                <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                                                    - {prod.prod_ID} (Qty: {prod.quantity}) {prod.package_info}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Paper>
                                ))}

                            <Box sx={{ display: "flex", justifyContent: isMobile ? "center" : "flex-end", mt: 3, gap: 3 }}>
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
