import React, { useEffect, useRef, useState } from "react";
import { Box, Collapse, IconButton, Paper, Typography, Grid, Button, useTheme, useMediaQuery, TextField, Modal, MenuItem, Backdrop, CircularProgress, List, ListItem, FormControl, InputLabel, Select, FormHelperText, FormControlLabel, Checkbox } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRouter } from 'next/navigation';
import { useEditAssignOrderOrderMutation, useGetAllDriversDataQuery, useGetAllProductsQuery, useGetAssignedOrderByIdQuery, useGetDeviceMasterQuery, useGetFilteredDriversQuery, useGetFilteredVehiclesQuery, useGetLocationMasterQuery, useGetOrderByIdQuery, useGetSingleVehicleMasterQuery, useGetVehicleMasterQuery, usePostAssignOrderMutation, usePostSingleVehicleMasterMutation } from "@/api/apiSlice";
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

import client from "@/lib/apollo-client";
import { GET_ALL_LOCATIONS, GET_ALL_PRODUCTS, GET_ASSIGNED_ORDER,GET_DEVICES,GET_VEHICLES, GET_ORDER_BY_ID,GET_DRIVERS, GET_ALL_SELF_VEHICLES, SEARCH_TRUCKS, SEARCH_DRIVERS, GET_ALL_DEVICES } from '../../api/graphqlApiSlice';
import { useQuery } from "@apollo/client";


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
    allocatedPackageDetails: []
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
const Allocations: React.FC<AllocationsProps> = ({ allocations, orderId, allocatedPackageDetails }) => {
    console.log(allocatedPackageDetails)
    const validationSchema = Yup.object({
        vehicleId: Yup.string().required("Vehicle id is required"),
        vehicleNumber: Yup.string().required("Vehicle number is required"),
        isAvailable: Yup.boolean(),
        costing: Yup.string().required("Cost is required"),
        insurance: Yup.string().required("Insurance is required"),
        registration: Yup.string().required("Registration number is required"),
        permit: Yup.string().required("Permit is required"),
    
    });
    // const { refetch: refetchOrderById } = useGetOrderByIdQuery({ orderId }, { skip: true });

    const {  refetch: refetchOrderById, } = useQuery(GET_ORDER_BY_ID, {
        variables: { order_ID: orderId },
        skip: !orderId, // Prevents query execution if `id` is undefined
      });
 
      const unitsofMeasurement = useSelector((state: RootState) => state.auth.unitsofMeasurement);
      const initialFormValues = {
          id: "",
          truckId: "",
          vehicleId: "",
          vehicleNumber: "",
          isAvailable: true,
          costing: "",
          cost_criteria_per:  unitsofMeasurement[0],
          insurance: "",
          registration: "",
          permit: "",
      };


    const wrapperRef = useRef<HTMLDivElement>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    // const { data, isLoading: driverLoading } = useGetAllDriversDataQuery({})
    const { data, loading:driverLoading } = useQuery(GET_DRIVERS, {
       // remove this object if you want all drivers without pagination
      });
      console.log(data)
    // const { data: allVehicleTrucks, isLoading: vehTrucksLoading } = useGetSingleVehicleMasterQuery({})
    const { loading:vehTrucksLoading,  data:allVehicleTrucks } = useQuery(GET_ALL_SELF_VEHICLES, {
		
	  });
    const [searchKey, setSearchKey] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const driversData = data?.getDrivers.drivers.length > 0 ? data?.getDrivers.drivers : []
    const getAvailableDrivers = Array.isArray(driversData)
        ? driversData.reduce((acc: Driver[], eachDriver: Driver) => {
            if (Number(eachDriver?.driver_availability) === 1) {
                acc.push(eachDriver);
            }
            return acc;
        }, [])
        : [];
    // const { data: filteredDrivers, isLoading: filteredDriversLoading } = useGetFilteredDriversQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });


  const { data:filteredDrivers, loading:filteredDriversLoading } = useQuery(SEARCH_DRIVERS, {
    variables: { searchKey: searchKey,},
    skip: !searchKey, // skip until searchKey is submitted
   
  });
    const displayDrivers = searchKey ? filteredDrivers?.searchDrivers.results || [] : getAvailableDrivers;

    const [searchKeyVehicle, setSearchKeyVehicle] = useState('');
    const [showSuggestionsVehicle, setShowSuggestionsVehicle] = useState(false);
    const vehiclesData = allVehicleTrucks?.getAllSelfVehicles.data.length > 0 ? allVehicleTrucks?.getAllSelfVehicles.data : []
    // const { data: filteredVehicles, isLoading: filteredVehicleLoading } = useGetFilteredVehiclesQuery(searchKeyVehicle.length >= 3 ? searchKeyVehicle : null, { skip: searchKeyVehicle.length < 3 });

    const { data:filteredVehicles, loading:filteredVehicleLoading } = useQuery(SEARCH_TRUCKS, {
        variables: { searchKeyVehicle },
        skip: !searchKeyVehicle // Don't run query until searchKey is entered
      });
    const displayVehicles = searchKeyVehicle ? filteredVehicles?.searchTrucks.results || [] : vehiclesData;
    // console.log("display vehicles :", displayVehicles)
    const [assignModal, setAssignModal] = useState(false);
    const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
    const [postAssignOrder, { isLoading: isAssigning }] = usePostAssignOrderMutation()
    const [postVehicle, { isLoading: postVehicleLoading }] = usePostSingleVehicleMasterMutation();
    const [editAssignOrder, { isLoading: editAssignLoading }] = useEditAssignOrderOrderMutation()
    // const { data: assignedOrder } = useGetAssignedOrderByIdQuery({ order_ID: orderId })
    const { data:assignedOrder  } = useQuery(GET_ASSIGNED_ORDER, {
        variables: { order_ID: orderId },
        skip: !orderId, // Prevent query from running until an order ID is entered
      });

console.log(assignedOrder)
    // const { data: allDevices, isLoading: deviceLoading } = useGetDeviceMasterQuery({})

    const { loading:deviceLoading, error:deviceERR, data:allDevices } = useQuery(GET_ALL_DEVICES, {
        variables: {  },
      });
    console.log(allDevices)
    const {data:vehiclesDat, loading:isVehiclesLoading } = useQuery(GET_VEHICLES);
    const getAllVehicles = vehiclesDat?.getVehicles.vehicles ||[]
    console.log(getAllVehicles)
    // const { data: productsData } = useGetAllProductsQuery({})
    const { data: productsData } = useQuery(GET_ALL_PRODUCTS, {
        variables: {  },
      });
      console.log(productsData)
    const allProductsData = productsData?.getAllProducts.products || [];
    const {data:locationsData,error: getLocationsError } = useQuery(GET_ALL_LOCATIONS, {
        variables: { page:1, limit: 10 },
      });
    const getAllLocations = locationsData?.getAllLocations?.locations.length > 0 ? locationsData?.getAllLocations?.locations : []
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
    
  
useEffect(() => {
        if (!searchKey) {
            setShowSuggestions(false);

        }
    }, [searchKey]);

    // const { data: order, refetch: fetchOrderById, isFetching } = useGetOrderByIdQuery(
    //     { orderId },
    //     { skip: !orderId }
    // );
    const { loading:isFetching, refetch: fetchOrderById, data:order } = useQuery(GET_ORDER_BY_ID, {
        variables: { order_ID: orderId },
        skip: !orderId, // Prevents query execution if `id` is undefined
      });
console.log(order)
    const getProductDetails = (productID: string) => {
        const productInfo = allProductsData.find((product: ProductDetails) => product.product_ID === productID);
        if (!productInfo) return "Package details not available";
        const details = [
            productInfo.product_name,
            productInfo.product_ID,
        ].filter(Boolean);
        return details.length > 0 ? details.join("-") : "Product details not available";
    };

    const devicesData = allDevices?.getAllDevices.devices.length > 0 ? allDevices?.getAllDevices.devices : []
    if (driverLoading || vehTrucksLoading) {
        console.log("driver loading")
    }

    const [formData, setFormData] = useState({
        truckId: "",
        driverId: "",
        deviceId: "",
    });

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
        router.push(`/liveTracking`);
    };
    const handleRouteReply = (vehicle_ID: string) => {
        if (order) {
            localStorage.setItem("orderData", JSON.stringify(order));
        }
        router.push(`/liveTracking/autoreply?vehicle_ID=${vehicle_ID}`);
    };
    const handleAssign = (allocation: Allocation) => {
        setSelectedAllocation(allocation);
        setAssignModal(true)
    };

    // const handleSubmit = async () => {
    //     console.log("formData: ", formData)
    //     try {
    //         if (assignedOrder.getAssignedOrder.data.length === 0) {
    //             if (!selectedAllocation) return;
    //             const body = {
    //                 order_ID: orderId,
    //                 assigned_vehicle_data: [
    //                     {
    //                         act_truk_ID: formData.truckId,
    //                         dri_ID: formData.driverId,
    //                         dev_ID: formData.deviceId,
    //                         vehicle_ID: selectedAllocation?.vehicle_ID
    //                     },
    //                 ],
    //                 self_transport: 1,
    //                 pod: {},
    //                 pod_doc: ""
    //             };
    //             const response = await postAssignOrder(body).unwrap();
    //             console.log("assign response :", response)
    //             setAssignModal(false);
    //             setSnackbarMessage(`Assined successfully!`);
    //             setSnackbarSeverity("success");
    //             setSnackbarOpen(true);
    //             console.log('response:', response)
    //             setAssignModal(false);
    //             setFormData({
    //                 truckId: "",
    //                 driverId: "",
    //                 deviceId: "",
    //             })
    //             await refetchOrderById();
    //         } else {
    //             const newVehicle = {
    //                 act_truk_ID: formData.truckId,
    //                 dri_ID: formData.driverId,
    //                 dev_ID: formData.deviceId,
    //                 vehicle_ID: selectedAllocation?.vehicle_ID
    //             }
    //             const editBody = {
    //                 assigned_vehicle_data: [...assignedOrder?.getAssignedOrder.data[0]?.assigned_vehicle_data, newVehicle]
    //             }
    //             console.log("edit API body:", editBody);
    //             const response = await editAssignOrder(editBody).unwrap();
    //             console.log("Edit Response: ", response)
    //             setFormData({
    //                 truckId: "",
    //                 driverId: "",
    //                 deviceId: "",
    //             })
    //         }

    //     } catch (error) {
    //         console.log("Getting error while assiging the vechile: ", error)
    //     }

    // }

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
            if (assignedOrder?.getAssignedOrder.data?.length === 0) {
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
                                self_vehicle_num:vehicleSelfTruck[0],
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
                    assigned_vehicle_data: [...assignedOrder?.getAssignedOrder.data[0]?.assigned_vehicle_data, newVehicle]
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
        }}

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

    // console.log('allo', allocations)

    useEffect(() => {
        if (orderId) {
            fetchOrderById();
        }
    }, [orderId, fetchOrderById]);

   
    console.log('order by id:', order?.getOrderById.order?.order_status);
    const handleCreateVehicle = () => {
        setOpen(true)
    }
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
                            cost:values.costing,
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
    return (
        <Box>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={postVehicleLoading || isAssigning || editAssignLoading || deviceLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
            <Modal open={open} onClose={handleClose}>
        <Box sx={style} >


          <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={handleAssignSubmit}
          >
            {({ values,errors,touched,handleChange,handleBlur,setFieldValue,resetForm }) => (
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
                                                    backgroundColor: "#83214F",
                                                    color: "#fff",
                                                    "&:hover": {
                                                        backgroundColor: "#fff",
                                                        color: "#83214F"
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

            <Typography variant="h6" gutterBottom color="#83214F" style={{ fontWeight: 'bold' }}>
                Allocations
            </Typography>
            <Modal open={assignModal} onClose={() => {
                setAssignModal(false)
                setFormData({ truckId: "", driverId: "", deviceId: "" });
                setSelectedAllocation(null);
            }}>
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
                        Assign Order ({orderId}) to self transport
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Grid item xs={12} sm={6} md={2.4}  style={{ display: 'flex', flexDirection: 'row',gap:4 }}>
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
                </Box>
            </Modal>

            {/* {allocations.map((allocation) => (
                <Paper key={allocation.vehicle_ID} sx={{ p: 1, mb: 2 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle1" color="#83214F" style={{ fontWeight: 'bold' }}>
                                Vehicle: {allocation.vehicle_ID} | Cost: ₹{allocation.cost.toFixed(2)}
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
                                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Billing Details</Typography>
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
                                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Date & Timings</Typography>
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
                                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Additional Info</Typography>
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
                                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Tax Info</Typography>
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
                                                        <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Product Details</Typography>
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
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleAssign(allocation)}
                                        >
                                            Assign
                                        </Button>)
                                }

                                {assignedOrder?.data[0]?.allocated_vehicles?.some(
                                    (vehicle: string) => vehicle === allocation.vehicle_ID
                                ) && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleTrack(allocation.vehicle_ID)}
                                            >
                                                View Track
                                            </Button><Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleRouteReply(allocation.vehicle_ID)}
                                            >
                                                Rotereply
                                            </Button>
                                        </>
                                    )}

                            </Box>
                        </Box>
                    </Collapse>
                </Paper>
            ))} */}

            {allocations.map((allocation) => {
                const uniqueKey = `${allocation.vehicle_ID}_${allocation.route[0].end.address}`;
                return (
                    <Paper key={uniqueKey} sx={{ p: 1, mb: 2 }}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="subtitle1" color="#83214F" style={{ fontWeight: 'bold' }}>
                                    Vehicle: {allocation.vehicle_ID} | Cost: ₹{allocation.cost.toFixed(2)}
                                </Typography>
                                <Typography variant="body2">
                                    Route: <strong>{allocation.route[0].start.address}</strong> → <strong>{allocation.route[0].end.address}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Distance: <strong>{allocation.route[0].distance}</strong> | Duration: <strong>{allocation.route[0].duration}</strong>
                                </Typography>
                            </Grid>
                            <Grid item>
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
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }} color="#83214F">
                                    Vehicle ID: {allocation.vehicle_ID}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="body2" >
                                            Total Weight Capacity: <strong> {allocation.totalWeightCapacity?.toFixed(2)}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            Total Volume Capacity: <strong>  {allocation.totalVolumeCapacity?.toFixed(2)}</strong>
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
                                                            <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Billing Details</Typography>
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
                                                            <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Date & Timings</Typography>
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
                                                            <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Additional Info</Typography>
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
                                                            <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Tax Info</Typography>
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
                                                            <Typography color="#83214F" style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px', marginBottom: '5px' }}>Product Details</Typography>
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
                                    {!assignedOrder?.getAssignedOrder.data[0]?.allocated_vehicles?.some(
                                        (vehicle: string) => vehicle === allocation.vehicle_ID
                                    ) && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleAssign(allocation)}
                                            >
                                                Assign
                                            </Button>
                                        )}

                                    {assignedOrder?.getAssignedOrder.data[0]?.allocated_vehicles?.some(
                                        (vehicle: string) => vehicle === allocation.vehicle_ID
                                    ) && (
                                            <>
                                                {order?.order?.order_status === "finished" ? (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleRouteReply(allocation.vehicle_ID)}
                                                    >
                                                        Route Reply
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleTrack(allocation)}
                                                    >
                                                        View Track
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                </Box>
                            </Box>
                        </Collapse>
                    </Paper>
                );
            })}

        </Box>
    );
};

export default Allocations;
