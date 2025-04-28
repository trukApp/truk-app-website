import React, { useEffect, useRef, useState } from "react";
import { Box, Collapse, IconButton, Paper, Typography, Grid, Button, useTheme, useMediaQuery, TextField, Modal, MenuItem, Backdrop, CircularProgress, List, ListItem, FormControl, InputLabel, Select, FormHelperText, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRouter } from 'next/navigation';
import { useEditAssignOrderOrderMutation, useGetAllDriversDataQuery, useGetAllProductsQuery, useGetAssignedOrderByIdQuery, useGetDeviceMasterQuery, useGetFilteredDriversQuery, useGetFilteredVehiclesQuery, useGetLocationMasterQuery, useGetOrderByIdQuery, useGetSingleVehicleMasterQuery, useGetVehicleMasterQuery, usePostAssignCarrierMutation, usePostAssignCarrierToOrderMutation, usePostAssignOrderMutation, usePostCarrierAssigningOrderConfirmMutation, usePostCarrierRejectigOrderMutation, usePostSingleVehicleMasterMutation } from "@/api/apiSlice";
import SnackbarAlert from "../ReusableComponents/SnackbarAlerts";
import { Driver } from "../BusinessPartnersForms/DriverForm";
import moment from 'moment';
import Image from "next/image";
import AdditionalInformation from '@/Components/CreatePackageTabs/AddtionalInformation';
import { DeviceInfoBE } from "../MasterDataComponents/DeviceMaster";
import { Location } from "../MasterDataComponents/Locations";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { VehicleDetails } from "../MasterDataComponents/Vehicles";
import { TruckFormDetails } from "@/app/vehicle/page";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "white",
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    width: { xs: "100%", md: "60%" },
};
interface RoutePoint {
    start: {
        address: string;
        latitude: number;
        longitude: number;
    };
    end: {
        address: string;
        latitude: number;
        longitude: number;
    };
    distance: string;
    duration: string;
}

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
    route: RoutePoint[]
}
interface AllocationsProps {
    allocations: Allocation[];
    orderId: string;
    allocatedPackageDetails: [];
    from: string
}
interface FormErrors {
    truckId?: string;
    driverId?: string;
    deviceId?: string;
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
export interface ProductDetails {
    product_ID: string;
    product_desc: string;
    product_name: string;
    weight: string;
}
interface carrierForOrder {
    carrier_ID: string,
    cost: string,
    cost_criteria_considered: string,
    rate: string
}

const Allocations: React.FC<AllocationsProps> = ({ allocations, orderId, allocatedPackageDetails, from }) => {
    const validationSchema = Yup.object({
        vehicleId: Yup.string().required("Vehicle id is required"),
        vehicleNumber: Yup.string().required("Vehicle number is required"),
        isAvailable: Yup.boolean(),
        costing: Yup.string().required("Cost is required"),
        insurance: Yup.string().required("Insurance is required"),
        registration: Yup.string().required("Registration number is required"),
        permit: Yup.string().required("Permit is required"),

    });
    const [carrierId, setCarrierId] = useState('')
    console.log("carrier id :", carrierId)
    console.log("fromm :", from)
    const [openReject, setOpenReject] = useState(false);
    const [carrierOptions, setCarrierOptions] = useState([])
    const [postVehicle, { isLoading: postVehicleLoading }] = usePostSingleVehicleMasterMutation();
    const { refetch: refetchOrderById } = useGetOrderByIdQuery({ orderId }, { skip: true });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openAcceptCarrier, setOpenAcceptCarrier] = useState(false);
    const [openAssignModal, setOpenAssignModal] = useState(false); 
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const { data, isLoading: driverLoading } = useGetAllDriversDataQuery({})
    const { data: allVehicleTrucks, isLoading: vehTrucksLoading } = useGetSingleVehicleMasterQuery({})
    // console.log('allveh trucks : ', allVehicleTrucks)
    const [searchKey, setSearchKey] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const driversData = data?.drivers.length > 0 ? data?.drivers : []
    const getAvailableDrivers = Array.isArray(driversData)
        ? driversData.reduce((acc: Driver[], eachDriver: Driver) => {
            if (Number(eachDriver?.driver_availability) === 1) {
                acc.push(eachDriver);
            }
            return acc;
        }, [])
        : [];
    const { data: filteredDrivers, isLoading: filteredDriversLoading } = useGetFilteredDriversQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });
    const displayDrivers = searchKey ? filteredDrivers?.results || [] : getAvailableDrivers;
    const { data: vehiclesTrucksData, isLoading: isVehiclesLoading } = useGetVehicleMasterQuery({});
    const getAllVehicles = vehiclesTrucksData?.vehicles
    const [searchKeyVehicle, setSearchKeyVehicle] = useState('');
    const [showSuggestionsVehicle, setShowSuggestionsVehicle] = useState(false);
    const vehiclesData = allVehicleTrucks?.data.length > 0 ? allVehicleTrucks?.data : []
    const { data: filteredVehicles, isLoading: filteredVehicleLoading } = useGetFilteredVehiclesQuery(searchKeyVehicle.length >= 3 ? searchKeyVehicle : null, { skip: searchKeyVehicle.length < 3 });
    const displayVehicles = searchKeyVehicle ? filteredVehicles?.results || [] : vehiclesData;
    // console.log("display vehicles :", displayVehicles)
    const [assignModal, setAssignModal] = useState(false);
    const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
    const [postRejectOrderByCarrier, { isLoading: isRejecting }] = usePostCarrierRejectigOrderMutation()
    const [postAssignOrderByCarrier, { isLoading: isAssignConfirm }] = usePostCarrierAssigningOrderConfirmMutation()
    const [postAssignOrder, { isLoading: isAssigning }] = usePostAssignOrderMutation()
    const [editAssignOrder, { isLoading: editAssignLoading }] = useEditAssignOrderOrderMutation()
    const [postAssignCarrier, { isLoading: carrierAssinLoading }] = usePostAssignCarrierMutation()
    const [postAssignCarrierToOrder, { isLoading: carrierToOrderLoading }] = usePostAssignCarrierToOrderMutation()
    const { data: assignedOrder } = useGetAssignedOrderByIdQuery({ order_ID: orderId })
    const { data: allDevices, isLoading: deviceLoading } = useGetDeviceMasterQuery({})
    const { data: productsData } = useGetAllProductsQuery({})
    const allProductsData = productsData?.products || [];
    const [loading,setLoading] = useState(false)
    const { data: locationsData } = useGetLocationMasterQuery({});
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : [];
    const getLocationDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        const details = [
            location.address_1,
            location.city,
            location.state,
            location.country,
            location.pincode,
            // location.loc_ID
        ].filter(Boolean);

        return details.length > 0 ? details.join(", ") : "Location details not available";
    };
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleAssignSubmit = async (values: TruckFormDetails, { resetForm }: { resetForm: () => void }) => {
        console.log('Form Values:', values);
        try {
            const body = {
                vehicles: [
                    {
                        vehicle_ID: values.vehicleId,
                        self_vehicle_num: values.vehicleNumber,
                        available: values.isAvailable,
                        costing: {
                            cost: values.costing,
                            cost_criteria_per: values.cost_criteria_per,
                        },
                        self_vehicle_docs: {
                            insurance: values.insurance,
                            registration: values.registration,
                            permit: values.permit
                        }
                    },
                ],
            };
            const response = await postVehicle(body).unwrap();
            console.log("post response :", response)
            if (response?.created_records) {
                setSnackbarMessage(`Vehicle ID ${response?.created_records[0]} created successfully!`);
                setSnackbarSeverity("success");
            }
        } catch (error) {
            console.error("API Error:", error);
            setSnackbarMessage("Something went wrong! please try again");
            setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
        handleClose();
        resetForm();
    };
    const unitsofMeasurement = useSelector((state: RootState) => state.auth.unitsofMeasurement);
 
const handleOpenAssignModal = (allocation: Allocation) => {
  setSelectedAllocation(allocation);
  setOpenAssignModal(true);
};

const handleCloseAssignModal = () => {
  setOpenAssignModal(false);
};

    const initialFormValues = {
        id: "",
        truckId: "",
        vehicleId: "",
        vehicleNumber: "",
        isAvailable: true,
        costing: "",
        cost_criteria_per: unitsofMeasurement[0],
        insurance: "",
        registration: "",
        permit: "",
    };
    useEffect(() => {
        if (!searchKey) {
            setShowSuggestions(false);

        }
    }, [searchKey]);

    const { data: order, refetch: fetchOrderById, isFetching, error } = useGetOrderByIdQuery(
        { orderId },
        { skip: !orderId }
    );

    const getProductDetails = (productID: string) => {
        const productInfo = allProductsData.find((product: ProductDetails) => product.product_ID === productID);
        if (!productInfo) return "Package details not available";
        const details = [productInfo.product_name, productInfo.product_ID].filter(Boolean);
        return details.length > 0 ? details.join("-") : "Product details not available";
    };
    const devicesData = allDevices?.devices.length > 0 ? allDevices?.devices : []
    if (driverLoading || vehTrucksLoading) {
        console.log("driver loading")
    }

    const [formData, setFormData] = useState({
        truckId: "",
        driverId: "",
        deviceId: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };


    const handleToggle = (vehicleId: string) => {
        setExpanded((prev) => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
    };
    // const handleTrack = (vehicle_ID: string) => {
    //     router.push(`/liveTracking?vehicle_ID=${vehicle_ID}`);
    // };
    // In your order details component
    const handleTrack = (allocation: Allocation) => {
        localStorage.setItem("allocationData", JSON.stringify(allocation));
        if (order) {
            localStorage.setItem("orderData", JSON.stringify(order));
        }
        setLoading(true)
        router.push(`/liveTracking`);
    };
    const handleRouteReply = (vehicle_ID: string) => {
        if (order) {
            localStorage.setItem("orderData", JSON.stringify(order));
        }
        setLoading(true)
        router.push(`/liveTracking/autoreply?vehicle_ID=${vehicle_ID}`);
    };
    const handleAssign = (allocation: Allocation) => {
        setSelectedAllocation(allocation);
        setAssignModal(true)
    };
    const handleCarrierAssign = async () => {
        try {
            const body = {
                order_ID: orderId,
                assigned_time: new Date().toISOString().slice(0, 16)
            };

            const response = await postAssignCarrier(body).unwrap();
            console.log("assign response:", response?.carrier_options);
            if (response.message === "Multiple valid contracted carriers found. Choose one for assignment.") {
                setOpenAcceptCarrier(true);
                setCarrierOptions(response?.carrier_options);
            }
            if (response?.message === "Carrier assignment initialized successfully.") {
                const assignedCarrier = response?.req_sent_to[0]
                setOpenAcceptCarrier(false)
                setSnackbarMessage(`Carrier assignment sent to carrier ${assignedCarrier} successfully!`);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            }

        } catch (error) {
            console.error("Error assigning carrier:", error);
        }
    };

    const handleCarrierSubmit = async () => {
        const body = {
            order_ID: orderId,
            carrier_ID: carrierId,
            assigned_time: new Date().toISOString().slice(0, 16)
        }
        console.log("body carr: ", body)
        const response = await postAssignCarrierToOrder(body).unwrap();
        if (response.message === 'Carrier assignment sent to selected carrier successfully.') {
            setSnackbarMessage(`Carrier assignment sent to carrier ${carrierId} successfully!`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setAssignModal(false)
        }

    }
    const handleSubmit = async () => { 
        let isValid = true;
        const newErrors: FormErrors = {};
        if (!formData.truckId) {
            newErrors.truckId = "Truck ID is required";
            isValid = false;
        }
        if (!formData.driverId) {
            newErrors.driverId = "Driver ID is required";
            isValid = false;
        }

        if (!formData.deviceId) {
            newErrors.deviceId = "Device ID is required";
            isValid = false;
        }

        setErrors(newErrors);
        if (isValid) {
            console.log("Form submitted:", formData);
            try {
                const vehicleSelfTruck = formData.truckId.split(',')
                if (assignedOrder?.data?.length === 0) {
                    if (!selectedAllocation) return;
                    const body = {
                        order_ID: orderId,
                        assigned_vehicle_data: [
                            // {
                            //     strk_ID: formData.truckId,
                            //     dri_ID: formData.driverId,
                            //     dev_ID: formData.deviceId,
                            //     vehicle_ID: selectedAllocation?.vehicle_ID
                            // },
                            {
                                strk_ID: vehicleSelfTruck[1],
                                self_vehicle_num: vehicleSelfTruck[0],
                                dri_ID: formData.driverId,
                                dev_ID: formData.deviceId
                            }
                        ],
                        self_transport: 1,
                        pod: {},
                        pod_doc: ""
                    };
                    console.log('assign body : ', body)
                    const response = await postAssignOrder(body).unwrap();
                    console.log("assign response :", response)
                    setAssignModal(false);
                    setSnackbarMessage(`Vehicle assined successfully!`);
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    console.log('response:', response)
                    setAssignModal(false);
                    setFormData({
                        truckId: "",
                        driverId: "",
                        deviceId: "",
                    })
                    await refetchOrderById();
                } else {
                    const newVehicle = {
                        strk_ID: vehicleSelfTruck[1],
                        dri_ID: formData.driverId,
                        dev_ID: formData.deviceId,
                        vehicle_ID: selectedAllocation?.vehicle_ID
                    }
                    const editBody = {
                        assigned_vehicle_data: [...assignedOrder?.data[0]?.assigned_vehicle_data, newVehicle]
                    }
                    console.log("edit API body:", editBody);
                    const response = await editAssignOrder(editBody).unwrap();
                    console.log("Edit Response: ", response)
                    setFormData({
                        truckId: "",
                        driverId: "",
                        deviceId: "",
                    })
                }

            } catch (error) {
                console.log("Getting error while assiging the vechile: ", error)
            }
        }

    }
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (orderId) {
            fetchOrderById();
        }
    }, [orderId, fetchOrderById]);

    if (isFetching) return <p>Loading...</p>
    if (error) return <p>Error fetching order details</p>;
    console.log('order by id:', order?.order?.order_status);

    const handleCreateVehicle = () => {
        setOpen(true)
    }
    // const handleOpenDialog = () => {
    //     setOpenReject(true);
    // };

    const handleCloseReject = () => {
        setOpenReject(false);
    };

    const handleYes = () => {
        handleRejectByCarrier();
        handleClose();
    };
    const handleRejectByCarrier = async () => {
        const carrierIdForOrder = from   // from is the carrier id which we are getting via params when comig from order req for carrier page
        try {
            const body = {
                carrier_ID: carrierIdForOrder,
                order_ID: orderId
            }
            console.log('bodyy:', body)
            const response = await postRejectOrderByCarrier(body).unwrap();
            console.log('Rejection response:', response);
            if (response) {
                setSnackbarMessage(`Order ${orderId} rejected !`);
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error rejecting:', error);
            setSnackbarMessage(`Unable to reject this order now , try after sometime.`);
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
        }
    };

    const initialValuesAccept = {
        vehicleNumAccept: '',
        driverNameAccept: '',
        driverNumberAccept: '',
        driverLicenseAccept: '',
        deviceIdAccept: '',

    };
    const validationSchemaAccept = Yup.object().shape({
        vehicleNumAccept: Yup.string().required('Vehicle Number is required'),
        driverNameAccept: Yup.string().required('Driver Name is required'),
        driverNumberAccept: Yup.string()
            .required('Driver Number is required')
            .matches(/^[0-9]{10}$/, 'Driver Number must be 10 digits'),
        driverLicenseAccept: Yup.string().required('Driver License is required'),
        deviceIdAccept: Yup.string().required('Device ID is required'),

    });


    const handleSubmitAccept = async (values: typeof initialValuesAccept) => {
        console.log('Submitted Accept Data:', values);
        const carrierIdForOrder = from
        try {
            const body = {
                carrier_ID: carrierIdForOrder,
                order_ID: orderId,
                vehicle_num: values.vehicleNumAccept,
                driver_data: {
                    c_driver_name: values.driverNameAccept,
                    c_driver_number: values.driverNumberAccept,
                    c_driver_license: values.driverLicenseAccept
                },
                device_ID: values.deviceIdAccept,
                confirmed_time: Date.now()
            }
            console.log('bodyy:', body)
            const response = await postAssignOrderByCarrier(body).unwrap();
            console.log('assign response:', response);
            if (response) {
                setSnackbarMessage(`Carrier ${carrierIdForOrder} assigned to Order ${orderId}  successfully!`);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error assigning:', error);
            setSnackbarMessage(`Unable to assign this order now , try after sometime.`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }

        setOpenAcceptCarrier(false);
    };
    return (
        <Box>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading || postVehicleLoading || isAssigning || isRejecting || isAssignConfirm || editAssignLoading || deviceLoading || carrierAssinLoading || carrierToOrderLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />

            <Typography variant="h6" gutterBottom color="#F08C24" style={{ fontWeight: 'bold' }}>
                Allocations
            </Typography>

            {allocations.map((allocation) => {
                const uniqueKey = `${allocation.vehicle_ID}_${allocation.route[0].end.address}`;
                return ( 
                    <>
                    <Dialog open={openAssignModal} onClose={handleCloseAssignModal}>
                            <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}
                            >Choose Assignment Type 
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseAssignModal}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                                >
                                <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                        <DialogContent>
                            <Typography>Select how you want to assign this order:</Typography>
                            <Box display="flex" flexDirection="column" gap={2} mt={2}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                if (selectedAllocation) {
                                    handleAssign(selectedAllocation);
                                    handleCloseAssignModal();
                                    }
                                }}
                            >
                                Self Transport
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCarrierAssign }
                            >
                                Carrier Assignment
                            </Button>
                            </Box>
                        </DialogContent>
                    </Dialog>

                    <Modal open={open} onClose={handleClose}>
                            <Box sx={{ ...style, position: 'relative', p: 3 }} >
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Assign Vehicle</Typography>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleClose}
                                    sx={{ color: (theme) => theme.palette.grey[500] }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                </Box>
                                <Formik
                                    initialValues={initialFormValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleAssignSubmit}
                                >
                                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue, resetForm }) => (
                                        <Form>
                                            <Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6} md={2.4}>
                                                        <FormControl
                                                            fullWidth
                                                            size="small"
                                                            error={touched.vehicleId && Boolean(errors.vehicleId)}
                                                        >
                                                            <InputLabel>Vehicle ID*</InputLabel>
                                                            <Select
                                                                label="Vehicle ID*"
                                                                name="vehicleId"
                                                                value={values.vehicleId}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            >
                                                                {isVehiclesLoading ? (
                                                                    <MenuItem disabled>
                                                                        <CircularProgress size={20} color="inherit" />
                                                                        <span style={{ marginLeft: "10px" }}>Loading...</span>
                                                                    </MenuItem>
                                                                ) : (
                                                                    getAllVehicles?.map((vehicle: VehicleDetails) => (
                                                                        <MenuItem key={vehicle?.vehicle_ID} value={String(vehicle.vehicle_ID)}>
                                                                            <span style={{ flex: 1 }}>{vehicle?.vehicle_ID}</span>
                                                                        </MenuItem>
                                                                    ))
                                                                )}
                                                            </Select>
                                                            {touched.vehicleId && errors.vehicleId && (
                                                                <FormHelperText>{errors.vehicleId}</FormHelperText>
                                                            )}
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={2.4}>
                                                        <TextField
                                                            fullWidth
                                                            label="Vehicle Number*"
                                                            name="vehicleNumber"
                                                            value={values.vehicleNumber}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.vehicleNumber && Boolean(errors.vehicleNumber)}
                                                            helperText={touched.vehicleNumber && errors.vehicleNumber}
                                                            size="small"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={2.4}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Cost (Rs.)*"
                                                            name="costing" type='number'
                                                            value={values.costing}
                                                            // onChange={handleChange}
                                                            onChange={(e) => {
                                                                const inputValue = e.target.value;
                                                                const numericValue = Number(inputValue);

                                                                if (numericValue > 0 || inputValue === "") {
                                                                    handleChange(e);
                                                                }
                                                            }}
                                                            onBlur={handleBlur}
                                                            error={touched.costing && Boolean(errors.costing)}
                                                            helperText={touched.costing && errors.costing}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={2.4}>
                                                        <TextField
                                                            fullWidth
                                                            select
                                                            onBlur={handleBlur}
                                                            name="cost_criteria_per"
                                                            value={values.cost_criteria_per || ""}
                                                            onChange={handleChange}
                                                            size="small"
                                                        >
                                                            {unitsofMeasurement.map((unit) => (
                                                                <MenuItem key={unit} value={unit}>
                                                                    {unit}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={2.4}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={values.isAvailable}
                                                                    onChange={(e) => {
                                                                        const checked = e.target.checked;
                                                                        setFieldValue("isAvailable", checked);
                                                                    }}
                                                                />
                                                            }
                                                            label="Is vehicle available"
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Typography variant="h6" mt={3} mb={1}>
                                                    Vehicle documents
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6} md={2.4}>
                                                        <TextField
                                                            fullWidth
                                                            label="Insurance*"
                                                            name="insurance"
                                                            value={values.insurance}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                touched.insurance &&
                                                                Boolean(errors.insurance)
                                                            }
                                                            helperText={
                                                                touched.insurance && errors.insurance
                                                            }
                                                            size="small"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={2.4}>
                                                        <TextField
                                                            fullWidth
                                                            label="Registration number*"
                                                            name="registration"
                                                            value={values.registration}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                touched.registration &&
                                                                Boolean(errors.registration)
                                                            }
                                                            helperText={
                                                                touched.registration && errors.registration
                                                            }
                                                            size="small"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={2.4}>
                                                        <TextField
                                                            fullWidth
                                                            label="Permit*"
                                                            name="permit"
                                                            value={values.permit}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                touched.permit &&
                                                                Boolean(errors.permit)
                                                            }
                                                            helperText={
                                                                touched.permit && errors.permit
                                                            }
                                                            size="small"
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Box mt={3} textAlign="center">
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        sx={{
                                                            backgroundColor: "#F08C24",
                                                            color: "#fff",
                                                            "&:hover": {
                                                                backgroundColor: "#fff",
                                                                color: "#F08C24"
                                                            }
                                                        }}
                                                    > Submit
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => {
                                                            resetForm();
                                                        }}
                                                        style={{ marginLeft: "10px" }}
                                                    >
                                                        Reset
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Form>
                                    )}
                                </Formik>
                            </Box>
                    </Modal>

                    <Dialog open={openReject}
                        onClose={handleCloseReject}
                    >
                            <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}
                            >Confirm Rejection
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseReject}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                                >
                                <CloseIcon />
                                </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to reject this order?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseReject} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleYes} color="error" autoFocus>
                                Yes, Reject
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openAcceptCarrier} onClose={() => setOpenAcceptCarrier(false)} maxWidth="xs" fullWidth
                        PaperProps={{
                            sx: { backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '20px', },
                        }}
                    >
                            <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>Confirm Carrier Assignment
                                <IconButton
                                aria-label="close"
                                onClick={() => setOpenAcceptCarrier(false)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                                >
                                <CloseIcon />
                                </IconButton>
                        </DialogTitle>
                        <Formik
                            initialValues={initialValuesAccept}
                            validationSchema={validationSchemaAccept}
                            onSubmit={handleSubmitAccept}
                        >
                            {({
                                values: valuesAccept,
                                handleChange: handleChangeAccept,
                                errors: errorsAccept,
                                touched: touchedAccept,
                            }) => (
                                <Form>
                                    <DialogContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth size='small'
                                                    label="Vehicle Number"
                                                    name="vehicleNumAccept"
                                                    value={valuesAccept.vehicleNumAccept}
                                                    onChange={handleChangeAccept}
                                                    error={touchedAccept.vehicleNumAccept && Boolean(errorsAccept.vehicleNumAccept)}
                                                    helperText={touchedAccept.vehicleNumAccept && errorsAccept.vehicleNumAccept}
                                                />
                                            </Grid>

                                            <Grid item xs={12}  >
                                                <TextField
                                                    fullWidth
                                                    label="Driver Name" size='small'
                                                    name="driverNameAccept"
                                                    value={valuesAccept.driverNameAccept}
                                                    onChange={handleChangeAccept}
                                                    error={touchedAccept.driverNameAccept && Boolean(errorsAccept.driverNameAccept)}
                                                    helperText={touchedAccept.driverNameAccept && errorsAccept.driverNameAccept}
                                                />
                                            </Grid>

                                            <Grid item xs={12} >
                                                <TextField
                                                    fullWidth
                                                    label="Driver Number" size='small'
                                                    name="driverNumberAccept"
                                                    value={valuesAccept.driverNumberAccept}
                                                    onChange={handleChangeAccept}
                                                    error={touchedAccept.driverNumberAccept && Boolean(errorsAccept.driverNumberAccept)}
                                                    helperText={touchedAccept.driverNumberAccept && errorsAccept.driverNumberAccept}
                                                />
                                            </Grid>

                                            <Grid item xs={12}  >
                                                <TextField
                                                    fullWidth
                                                    label="Driver License" size='small'
                                                    name="driverLicenseAccept"
                                                    value={valuesAccept.driverLicenseAccept}
                                                    onChange={handleChangeAccept}
                                                    error={touchedAccept.driverLicenseAccept && Boolean(errorsAccept.driverLicenseAccept)}
                                                    helperText={touchedAccept.driverLicenseAccept && errorsAccept.driverLicenseAccept}
                                                />
                                            </Grid>

                                            <Grid item xs={12}  >
                                                <TextField
                                                    fullWidth
                                                    label="Device ID" size='small'
                                                    name="deviceIdAccept"
                                                    value={valuesAccept.deviceIdAccept}
                                                    onChange={handleChangeAccept}
                                                    error={touchedAccept.deviceIdAccept && Boolean(errorsAccept.deviceIdAccept)}
                                                    helperText={touchedAccept.deviceIdAccept && errorsAccept.deviceIdAccept}
                                                />
                                            </Grid>
                                        </Grid>
                                    </DialogContent>

                                    <DialogActions>
                                        <Button onClick={() => setOpenAcceptCarrier(false)}>Cancel</Button>
                                        <Button variant="contained" type="submit">
                                            Submit
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </Dialog>
                        
                    <Modal open={assignModal} onClose={() => {
                        setAssignModal(false)
                        setFormData({ truckId: "", driverId: "", deviceId: "" });
                        setSelectedAllocation(null);
                        }}>
                        {from === 'order-overview' ? (
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
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{fontSize:'16px'}} gutterBottom>
                                    Assign Order ({orderId}) to self transport
                                </Typography>
                                <IconButton
                                        onClick={() => {
                                            setAssignModal(false);
                                            setFormData({ truckId: "", driverId: "", deviceId: "" });
                                            setSelectedAllocation(null);
                                        }}
                                        sx={{ color: 'grey.600' }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    </Box>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <Grid item xs={12} sm={6} md={2.4} style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                                        <Grid>
                                            <TextField
                                                fullWidth
                                                name="truckId"
                                                size="small"
                                                label="Search truck... "
                                                onFocus={() => {
                                                    if (!searchKey) {
                                                        setSearchKey(formData.truckId || "");
                                                        setShowSuggestionsVehicle(true);
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setSearchKeyVehicle(e.target.value);
                                                    setShowSuggestionsVehicle(true);
                                                }}
                                                error={Boolean(errors.truckId)}
                                                helperText={errors.truckId}
                                                value={searchKeyVehicle}
                                                InputProps={{
                                                    // endAdornment: filteredVehicleLoading ? <CircularProgress size={20} /> : null,
                                                }}
                                            />
                                            <div style={{ position: "relative" }}>
                                                {showSuggestionsVehicle && (
                                                    <Paper
                                                        style={{
                                                            maxHeight: 200,
                                                            overflowY: "auto",
                                                            position: "absolute",
                                                            zIndex: 10,
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <List>
                                                            {filteredVehicleLoading ? (
                                                                <ListItem>
                                                                    <CircularProgress size={20} />
                                                                </ListItem>
                                                            ) : displayVehicles.length === 0 ? (
                                                                <ListItem component="li">
                                                                    <Typography variant="body2" sx={{ color: "gray", textAlign: "center", width: "100%" }}>
                                                                        No results found
                                                                    </Typography>
                                                                </ListItem>
                                                            ) : (
                                                                displayVehicles.map((truck: { strk_ID: string, self_vehicle_num: string }) => (
                                                                    <ListItem
                                                                        key={truck?.strk_ID}
                                                                        component="li"
                                                                        onClick={() => {
                                                                            setShowSuggestionsVehicle(false);
                                                                            setSearchKeyVehicle(`${truck?.self_vehicle_num}, ${truck?.strk_ID}`);
                                                                            setFormData({ ...formData, truckId: `${truck?.self_vehicle_num}, ${truck?.strk_ID}`, });
                                                                        }}
                                                                        sx={{ cursor: "pointer" }}
                                                                    >
                                                                        <span style={{ fontSize: "13px" }}>
                                                                            {truck?.self_vehicle_num}, {truck?.strk_ID}
                                                                        </span>
                                                                    </ListItem>
                                                                ))
                                                            )}
                                                        </List>
                                                    </Paper>
                                                )}
                                            </div>
                                        </Grid>
                                        <Typography> OR </Typography>
                                        <Grid>
                                            <Typography
                                                onClick={handleCreateVehicle}
                                                sx={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: 2 }}
                                            >
                                                Create new Truck
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth
                                            name="driverId"
                                            size="small"
                                            label="Search drivers... "
                                            onFocus={() => {
                                                if (!searchKey) {
                                                    setSearchKey(formData.driverId || "");
                                                    setShowSuggestions(true);
                                                }
                                            }}
                                            onChange={(e) => {
                                                setSearchKey(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                            error={Boolean(errors.driverId)}
                                            helperText={errors.driverId}
                                            value={searchKey}
                                        />
                                        <div ref={wrapperRef} style={{ position: "relative" }}>
                                            {showSuggestions && (
                                                <Paper
                                                    style={{
                                                        maxHeight: 200,
                                                        overflowY: "auto",
                                                        position: "absolute",
                                                        zIndex: 10,
                                                        width: "100%",
                                                    }}
                                                >
                                                    <List>
                                                        {filteredDriversLoading ? (
                                                            <ListItem>
                                                                <CircularProgress size={20} />
                                                            </ListItem>
                                                        ) : displayDrivers.length === 0 ? (
                                                            <ListItem component="li">
                                                                <Typography variant="body2" sx={{ color: "gray", textAlign: "center", width: "100%" }}>
                                                                    No results found
                                                                </Typography>
                                                            </ListItem>
                                                        ) : (
                                                            displayDrivers.map((driver: Driver) => (
                                                                <ListItem
                                                                    key={driver?.dri_ID}
                                                                    component="li"
                                                                    onClick={() => {
                                                                        const selected = `${driver?.dri_ID}, ${driver?.driver_name}, ${driver?.driver_correspondence?.phone}`
                                                                        setShowSuggestions(false);
                                                                        setSearchKey(selected);
                                                                        setFormData({ ...formData, driverId: driver?.dri_ID });
                                                                    }}
                                                                    sx={{ cursor: "pointer" }}
                                                                >
                                                                    <span style={{ fontSize: "13px" }}>
                                                                        {driver?.dri_ID}, {driver?.driver_name}, {driver?.driver_correspondence?.phone}
                                                                    </span>
                                                                </ListItem>
                                                            ))
                                                        )}
                                                    </List>
                                                </Paper>
                                            )}
                                        </div>
                                    </Grid>
                                    <TextField
                                        label="Device ID"
                                        name="deviceId"
                                        select
                                        value={formData.deviceId}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        error={Boolean(errors.deviceId)}
                                        helperText={errors.deviceId}
                                    >
                                        {devicesData?.map((device: DeviceInfoBE) => (
                                            <MenuItem key={device?.device_id} value={device.dev_ID}>
                                                {device.dev_ID}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </Box>
                            </Box>) :
                            (
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
                                        Assign Order ({orderId}) to Carrier
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontSize: '14px' }} gutterBottom>
                                        The following are the multiple valid contracted carriers found. Choose one for assignment.
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        <TextField
                                            label="Carrier ID"
                                            name="carrierId"
                                            select
                                            value={carrierId}
                                            onChange={(e) => setCarrierId(e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        >
                                            {carrierOptions?.map((carrier: carrierForOrder) => (
                                                <MenuItem key={carrier?.carrier_ID} value={carrier.carrier_ID}>
                                                    {carrier.carrier_ID}, {carrier.rate}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <Button variant="contained" color="primary" onClick={handleCarrierSubmit}>
                                            Submit
                                        </Button>


                                    </Box>

                                </Box>
                            )}

                    </Modal>
                    <Paper key={uniqueKey} sx={{ p: 2, mb: 2 }}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item sx={{ width: '97.5%' }}>
                                <Grid item sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <Typography variant="subtitle1" color="#F08C24" style={{ fontWeight: 'bold' }}>
                                        Vehicle: {allocation.vehicle_ID}
                                        {(from === 'order-overview' || from === 'order-bidding') && (
                                            <> | Cost: ₹{allocation?.cost?.toFixed(2)}</>
                                        )}

                                    </Typography>
                                    <Typography variant="body2" color="#F08C24" sx={{ fontSize: 11, backgroundColor: '#FCF0DE', paddingLeft: 2, paddingRight: 2, paddingTop: 0.7, paddingBottom: 0.3, borderRadius: 1.5 }}>
                                        {order?.order?.order_status}
                                    </Typography>

                                </Grid>

                                <Typography variant="body2">
                                    Route: <strong>{allocation.route[0].start.address}</strong> → <strong>{allocation.route[0].end.address}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Distance: <strong>{allocation.route[0].distance}</strong> | Duration: <strong>{allocation.route[0].duration}</strong>
                                </Typography>
                            </Grid>
                            <Grid item sx={{ width: '2.5%' }}>
                                <IconButton onClick={() => handleToggle(uniqueKey)}>
                                    {expanded[uniqueKey] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Grid>
                        </Grid>

                        <Collapse in={expanded[uniqueKey]} timeout="auto" unmountOnExit>
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: "background.paper",
                                    boxShadow: 2
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }} color="#F08C24">
                                    Vehicle ID: {allocation.vehicle_ID}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="body2" >
                                            Total Weight Capacity: <strong> {allocation.totalWeightCapacity.toFixed(2)}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            Total Volume Capacity: <strong>  {allocation.totalVolumeCapacity.toFixed(2)}</strong>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="body2">
                                            Occupied Weight:<strong>{allocation.occupiedWeight.toFixed(2)}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            Occupied Volume: <strong>{allocation.occupiedVolume ? (allocation?.occupiedVolume).toFixed(2) : "0.00"}</strong>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Typography variant="body2">
                                            Leftover Weight: <strong> {allocation.leftoverWeight.toFixed(2)}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            Leftover Volume: <strong> {allocation.leftoverVolume.toFixed(2)}</strong>
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
                                        <Box key={pkg.pac_id} >
                                            <Grid key={pkg.pac_id} sx={{ mt: { xs: 1, md: 2 }, p: 2, backgroundColor: '#e9e7e7', borderRadius: 1, }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    <strong>Package ID: {pkg.pack_ID}</strong>
                                                </Typography>

                                                <Typography variant="body2">
                                                    <strong>Status:</strong> {pkg.package_status}
                                                </Typography>
                                                <Grid sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                                                    <Grid container spacing={2} sx={{ minWidth: '1000px', display: 'flex', justifyContent: 'space-between' }} item >
                                                        <Grid item >
                                                            <Typography color="#F08C24" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Billing Details</Typography>
                                                            <Grid  >
                                                                <Typography variant="body2">
                                                                    Ship From: <strong> {getLocationDetails(pkg.ship_from)}</strong>
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Ship To: <strong>  {getLocationDetails(pkg.ship_to)}</strong>
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Bill To: <strong> {getLocationDetails(pkg.bill_to)}</strong>
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item >
                                                            <Typography color="#F08C24" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Date & Timings</Typography>
                                                            <Grid >
                                                                <Typography variant="body2">
                                                                    Pickup Date:<strong>  {moment(pkg.pickup_date_time).format("DD MMM YYYY, hh:mm A")}</strong>
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Dropoff Date:<strong>  {moment(pkg.dropoff_date_time).format("DD MMM YYYY, hh:mm A")}</strong>
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item >
                                                            <Typography color="#F08C24" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Additional Info</Typography>
                                                            <Grid >
                                                                {pkg.additional_info?.reference_id && (
                                                                    <Typography variant="body2">
                                                                        Refernce ID: <strong>  {pkg.additional_info?.reference_id}</strong>
                                                                    </Typography>
                                                                )}

                                                                {pkg.additional_info?.invoice && (
                                                                    <Typography variant="body2">
                                                                        Invoice:<strong>  {pkg.additional_info?.invoice}</strong>
                                                                    </Typography>
                                                                )}

                                                                {pkg.additional_info?.department && (
                                                                    <Typography variant="body2">
                                                                        Department:<strong>  {pkg.additional_info?.department}</strong>
                                                                    </Typography>
                                                                )}

                                                                {pkg.additional_info?.sales_order_number && (
                                                                    <Typography variant="body2">
                                                                        Sales order number: <strong>  {pkg.additional_info?.sales_order_number}</strong>
                                                                    </Typography>
                                                                )}

                                                                {pkg.additional_info?.po_number && (
                                                                    <Typography variant="body2">
                                                                        Po number: <strong>  {pkg.additional_info?.po_number}</strong>
                                                                    </Typography>
                                                                )
                                                                }
                                                                {pkg?.additional_info?.attachment && (
                                                                    <div style={{ display: "flex" }}>
                                                                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                                                            Attachment:
                                                                        </Typography>
                                                                        <div style={{ position: 'relative', width: '50px', height: '45px', marginTop: '5px' }}>
                                                                            <Image
                                                                                src={pkg?.additional_info?.attachment}
                                                                                alt="Attachment"
                                                                                fill
                                                                                sizes="(max-width: 768px) 100vw, 300px"
                                                                                style={{ objectFit: 'contain' }}
                                                                            />

                                                                        </div>
                                                                    </div>
                                                                )}

                                                            </Grid>
                                                        </Grid>
                                                        <Grid item >
                                                            <Typography color="#F08C24" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Tax Info</Typography>
                                                            <Grid >
                                                                {pkg.tax_info?.sender_gst && (
                                                                    <Typography variant="body2">
                                                                        GSTN of sender:<strong>  {pkg.tax_info?.sender_gst}</strong>
                                                                    </Typography>
                                                                )}

                                                                {pkg.tax_info?.receiver_gst && (
                                                                    <Typography variant="body2">
                                                                        GSTN of receiver: <strong>  {pkg.tax_info?.receiver_gst}</strong>
                                                                    </Typography>
                                                                )}

                                                                {pkg.tax_info?.carrier_gst && (
                                                                    <Typography variant="body2">
                                                                        GSTN of carrier: <strong>  {pkg.tax_info?.carrier_gst}</strong>
                                                                    </Typography>
                                                                )}
                                                                {pkg.tax_info?.self_transport && (
                                                                    <Typography variant="body2">
                                                                        Is self transport: <strong>  {pkg.tax_info?.self_transport}</strong>
                                                                    </Typography>
                                                                )}
                                                                {pkg.tax_info?.tax_rate && (
                                                                    <Typography variant="body2">
                                                                        Tax rate: <strong>  {pkg.tax_info?.tax_rate}</strong>
                                                                    </Typography>
                                                                )}

                                                                {pkg.return_label && (
                                                                    <Typography variant="body2">
                                                                        Return Label:<strong>  {pkg.return_label ? "Yes" : "No"}</strong>
                                                                    </Typography>
                                                                )}

                                                            </Grid>
                                                        </Grid>
                                                        <Grid item >
                                                            <Typography color="#F08C24" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Product Details</Typography>
                                                            <Box sx={{ mt: 1 }}>
                                                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                                                    Products:
                                                                </Typography>
                                                                {pkg.product_ID.map((prod: Product, index: number) => (
                                                                    <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                                                                        - {getProductDetails(prod.prod_ID)} (Qty: {prod.quantity})
                                                                    </Typography>
                                                                ))}
                                                            </Box>
                                                        </Grid>
                                                    </Grid></Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                <Box sx={{ display: "flex", justifyContent: isMobile ? "center" : "flex-end", mt: 3, gap: 3 }}>
                                    {!assignedOrder?.data[0]?.allocated_vehicles?.some(
                                        (vehicle: string) => vehicle === allocation.vehicle_ID
                                    ) && (
                                            <>
                                                {from === 'order-overview' && (order?.order?.order_status === 'self assigned' || order?.order?.order_status === 'assignment pending') && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        // onClick={() => handleAssign(allocation)}
                                                        onClick={() => handleOpenAssignModal(allocation)}
                                                    >
                                                        Assign
                                                    </Button>
                                                )
                                                }
                                                {from === 'order-bidding' && order?.order?.order_status === 'assignment pending' && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={handleCarrierAssign}
                                                    >
                                                        Assign Carrier
                                                    </Button>
                                                )
                                                }

                                            </>

                                        )}

                                    {assignedOrder?.data[0]?.allocated_vehicles?.some(
                                        (vehicle: string) => vehicle === allocation.vehicle_ID
                                    ) && (
                                            <>
                                                {/* {order?.order?.order_status === "carrier assignment" && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="primary" 
                                                        onClick={() => setOpenAcceptCarrier(true)}
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleOpenDialog}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>

                                                )} */}
                                                {order?.order?.order_status === "finished" ? (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleRouteReply(allocation.vehicle_ID)}
                                                    >
                                                        Route Reply
                                                    </Button>
                                                ) : (order?.order?.order_status !== "carrier assignment") ? (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleTrack(allocation)}
                                                    >
                                                        View Track
                                                    </Button>
                                                ) : null}
                                            </>
                                        )}
                                </Box>
                            </Box>
                        </Collapse>
                    </Paper></>

                );
            })}

        </Box>
    );
};

export default Allocations;
