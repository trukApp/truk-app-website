import React, { useEffect, useState } from 'react';
import {
    Box, Button, Collapse, Grid, TextField, IconButton,
    FormControl,
    MenuItem,
    Select,
    FormHelperText,
    InputLabel,
    Backdrop,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Tooltip,
    // Checkbox, FormControlLabel,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useGetCarrierMasterQuery, usePostCarrierMasterMutation, useEditCarrierMasterMutation, useDeleteCarrierMasterMutation, useGetLocationMasterQuery, useGetLanesMasterQuery } from '@/api/apiSlice';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MassUpload from '../MassUpload/MassUpload';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from '../MasterDataComponents/Locations';
import { Lane } from '../MasterDataComponents/Lanes';
import { useQuery } from '@apollo/client';
import { GET_ALL_LOCATIONS, GET_LANES ,GET_CARRIERS,SEARCH_LOCATIONS} from '@/api/graphqlApiSlice';
interface CarrierFormFE {
    id: string;
    carrierId: string,
    name: string,
    address: string,
    contactPerson: string,
    contactNumber: string,
    emailId: string,
    vehicleTypes: string[],
    locationIds: string[],
    laneIds: string[],
    deviceDetails: string,
    enrollSpotAuction: boolean,
    preferredCarrier: boolean,
};
export interface CarrierFormBE {
    carrier_loc_of_operation: string[];
    carrier_lanes: string[];
    vehicle_types_handling: string[];
    carrier_correspondence: {
        name: string;
        email: string;
        phone: string;
    };
    carrier_address: string;
    carrier_name: string;
    carrier_ID: string;
    cr_id: string;
    carrier_network_portal: number;
}

const initialCarrierValues = {
    id: '',
    carrierId: '',
    name: '',
    address: '',
    contactPerson: '',
    contactNumber: '',
    emailId: '',
    vehicleTypes: [] as string[],
    locationIds: [] as string[],
    laneIds: [] as string[],
    deviceDetails: '',
    enrollSpotAuction: false,
    preferredCarrier: false,
};

const CarrierForm: React.FC = () => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);z
    const [searchKey, setSearchKey] = useState('');
    const [page, setPage] = useState(1);
    const [initialValues, setInitialValues] = useState(initialCarrierValues)
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [editRow, setEditRow] = useState<CarrierFormFE | null>(null);
    const { loading:getallLoads, error:er, data:getallLocations } = useQuery(GET_ALL_LOCATIONS, {
         variables: { page, limit: 10 },
      });
    
      
      const { data: carrerData, loading: carrerLoading, error } = useQuery(GET_CARRIERS, {
        variables: { page: paginationModel.page + 1, limit: paginationModel.pageSize },
    });

    // const { data: lanesData } = useGetLanesMasterQuery([]);
     
    const { loading, error:laneErr, data:laneData,  } = useQuery(GET_LANES);
    
    // const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });
    const { data:filteredLocations, loading:filteredLocationLoading  } = useQuery(SEARCH_LOCATIONS, {
        variables: { searchKey },
        skip: !searchKey, // skip if no key
      });
    const [postCarrier, { isLoading: postCarrierLoading }] = usePostCarrierMasterMutation()
    const [editCarrier, { isLoading: editCarrierLoading }] = useEditCarrierMasterMutation()
    const [deleteCarrier, { isLoading: deleteCarrierLoading }] = useDeleteCarrierMasterMutation()

    // const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery({})
       //graphQlAPI
  
  

 
  
    const getAllLocations = getallLocations?.getAllLocations?.locations.length > 0 ? getallLocations?.getAllLocations?.locations : []
  

    const displayLocations = searchKey ? filteredLocations?.searchLocations?.results || [] : getAllLocations;
    console.log(displayLocations)
    const getLocationDetails = (loc_ID: string) => {
        // Find the location object from the array
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);

        // Return a fallback message if location not found
        if (!location) return "Location details not available";

        // Gather the location details, filter out any falsy values (e.g., empty strings, null, undefined)
        const details = [
            location.loc_ID,
            location.address_1,
            location.address_2,
            location.city,
            location.state,
            location.country,
            location.pincode
        ].filter(Boolean);

        // Return the combined details or a fallback message if no valid details
        return details.length > 0 ? details.join(", ") : "Location details not available";
    };

    const getAllLanes = laneData?.allLanes.lanes.length > 0 ? laneData?.allLanes.lanes : []
    // if (error) {
    //     console.log("err while getting carrier info :", error)
    // }

    const getLaneDetails = (lane_ID: string) => {
        const lane = laneData?.allLanes?.lanes.find((l: Lane) => l.lane_ID === lane_ID);
        if (!lane) return "Lane details not available";

        // Extract source and destination location details
        const sourceLocationDetails = [
            lane.src_loc_ID,
            lane.src_loc_desc,
            lane.src_city,
            lane.src_state,
            lane.src_latitude,
            lane.src_longitude
        ].filter(Boolean).join(", ");

        const destinationLocationDetails = [
            lane.des_loc_ID,
            lane.des_loc_desc,
            lane.des_city,
            lane.des_state,
            lane.des_latitude,
            lane.des_longitude
        ].filter(Boolean).join(", ");

        // Return combined source and destination location details
        return `Source: ${sourceLocationDetails} | Destination: ${destinationLocationDetails}`;
    };

    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };
    const vehicleTypeOptions = ['Truck', 'Van', 'Container', 'Trailer'];
    const handleEdit = (row: CarrierFormFE) => {
        setShowForm(true)
        setIsEditing(true)
        setEditRow(row)
    };

    const handleDelete = async (row: CarrierFormFE) => {
        const packageId = row?.id;
        if (!packageId) {
            console.error("Row ID is missing");
            setSnackbarMessage("Error: Vehicle ID is missing!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const confirmed = window.confirm("Are you sure you want to delete this vehicle? This action canot be undone.");
        if (!confirmed) {
            return;
        }

        try {
            const response = await deleteCarrier(packageId);
            if (response.data.deleted_record) {
                setSnackbarMessage(`Carrier ID ${response.data.deleted_record} deleted successfully!`);
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            setSnackbarMessage("Failed to delete vehicle. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    useEffect(() => {
        if (editRow) {
            setInitialValues(() => ({
                id: editRow?.id || '',
                carrierId: editRow?.carrierId || '',
                name: editRow?.name || '',
                address: editRow?.address || '',
                contactPerson: editRow?.contactPerson || '',
                contactNumber: editRow?.contactNumber || '',
                emailId: editRow?.emailId || '',
                vehicleTypes: editRow?.vehicleTypes || [],
                locationIds: editRow?.locationIds || [],
                laneIds: editRow?.laneIds || [],
                deviceDetails: editRow?.deviceDetails || '',
                enrollSpotAuction: editRow?.enrollSpotAuction || false,
                preferredCarrier: editRow?.preferredCarrier || false,
            }))
        }
    }, [editRow]);

    const carrierValidationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        address: Yup.string().required('Address is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
        contactNumber: Yup.string().required('Contact Number is required'),
        emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
        vehicleTypes: Yup.array().of(Yup.string()).min(1, 'Select at least one vehicle type'),
        locationIds: Yup.array().of(Yup.string()).min(1, 'Select at least one location').required('Location is required'),
        laneIds: Yup.array().of(Yup.string()).min(1, 'Select at least one lane').required('Lane IDs are required'),
        // deviceDetails: Yup.string().required('Device Details are required'),
        // enrollSpotAuction: Yup.boolean(),
        // preferredCarrier: Yup.boolean(),
    });

    const handleCarrierSubmit = async (values: CarrierFormFE) => {
        try {
            const body = {
                carriers: [
                    {
                        carrier_name: values.name,
                        carrier_address: values.address,
                        carrier_correspondence: {
                            name: values.contactPerson,
                            email: values.emailId,
                            phone: values.contactNumber
                        },
                        carrier_network_portal: `${values.preferredCarrier ? 1 : 0}`,
                        vehicle_types_handling: values.vehicleTypes,
                        carrier_loc_of_operation: values.locationIds,
                        carrier_lanes: values.laneIds
                    },
                ]
            }
            const editBody = {
                carrier_name: values.name,
                carrier_address: values.address,
                carrier_correspondence: {
                    name: values.contactPerson,
                    email: values.emailId,
                    phone: values.contactNumber
                },
                carrier_network_portal: `${values.preferredCarrier ? 1 : 0}`,
                vehicle_types_handling: values.vehicleTypes,
                carrier_loc_of_operation: values.locationIds,
                carrier_lanes: values.laneIds
            }
            if (isEditing && editRow) {
                const carrierId = editRow.id
                const response = await editCarrier({ body: editBody, carrierId }).unwrap()
                if (response?.updated_record) {
                    setSnackbarMessage(`Carrier ID ${response.updated_record} updated successfully!`);
                    setInitialValues(initialCarrierValues)
                    setShowForm(false)
                    setIsEditing(false)
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                }
            }
            else {
                const response = await postCarrier(body).unwrap();
                if (response?.created_records) {
                    setSnackbarMessage(`Carrier ID ${response.created_records[0]} created successfully!`);
                    setInitialValues(initialCarrierValues)
                    setShowForm(false)
                    setIsEditing(false)
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                }

            }
        } catch (error) {
            console.error('API Error:', error);
            setSnackbarMessage("Something went wrong! Please try again");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const rows = carrerData?.allCarriers.carriers.map((carrier: CarrierFormBE) => {
        const locationIds = Array.isArray(carrier.carrier_loc_of_operation)
            ? carrier?.carrier_loc_of_operation
            : [carrier?.carrier_loc_of_operation];

        const laneIds = Array.isArray(carrier?.carrier_lanes)
            ? carrier.carrier_lanes
            : [carrier.carrier_lanes];
        const locationDetails = locationIds
            .map((id) => getLocationDetails(id))
            .join("\n");

        const laneDetails = laneIds
            .map((id) => getLaneDetails(id))
            .join("\n");

        return {
            id: carrier.cr_id,
            carrierId: carrier.carrier_ID,
            name: carrier.carrier_name,
            address: carrier.carrier_address,
            contactPerson: carrier.carrier_correspondence.name,
            contactNumber: carrier.carrier_correspondence.phone,
            emailId: carrier.carrier_correspondence.email,
            vehicleTypes: carrier.vehicle_types_handling,
            allLocationIdsDetails: locationDetails,
            allLaneIdsDetails: laneDetails,
            preferredCarrier: carrier.carrier_network_portal,
            locationIds: locationIds,
            laneIds: laneIds
        };
    }) || [];

    const columns: GridColDef[] = [
        { field: 'carrierId', headerName: 'Carrier ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'address', headerName: 'Address', width: 150 },
        { field: 'contactPerson', headerName: 'Contact Person', width: 150 },
        { field: 'contactNumber', headerName: 'Contact Number', width: 150 },
        { field: 'emailId', headerName: 'Email ID', width: 150 },
        { field: 'vehicleTypes', headerName: 'Vehicle Types', width: 150 },
        {
            field: "locationIds",
            headerName: "Locations",
            width: 150,
            renderCell: (params) => {
                const locationIds = Array.isArray(params.value) ? params.value : [params.value];
                const allLocs = locationIds.join(" | ")
                const locationDetails = locationIds
                    .map((id) => getLocationDetails(id))
                    .join(" | ");

                return (
                    <Tooltip title={locationDetails} arrow>
                        <span>{allLocs}</span>
                    </Tooltip>
                );
            },
        }


        ,

        // { field: 'laneIds', headerName: 'Lane IDs', width: 150 },
        {
            field: "lane_ID",
            headerName: "Lane Details",
            width: 200,
            renderCell: (params) => {
                // Ensure params.value is an array, otherwise treat it as a single lane ID
                const laneIDs = Array.isArray(params.row.laneIds) ? params.row.laneIds : [params.row.laneIds];

                const allLanes = laneIDs.join(" | ")
                console.log('lane id s :', laneIDs)
                const laneDetails = laneIDs
                    .map((id: string) => getLaneDetails(id))
                    .join(" | "); // Combine the details of all lanes into a single string

                return (
                    <Tooltip title={laneDetails} arrow>
                        <span>{allLanes}</span>
                        {/* <span>fghm</span> */}
                    </Tooltip>
                );
            },
        },
        // { field: 'deviceDetails', headerName: 'Device Details', flex: 2 },
        // {
        //     field: 'enrollSpotAuction',
        //     headerName: 'Spot Auction',
        //     flex: 1,
        //     renderCell: (params) => params.value ? 'Yes' : 'No'
        // },
        {
            field: 'preferredCarrier',
            headerName: 'Is enrolled on carrier network portal',
            flex: 1,
            renderCell: (params) => params.value ? 'Yes' : 'No'
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params) => (
                <div>
                    <IconButton
                        color="primary"
                        onClick={() => handleEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDelete(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];
    if (getallLoads) return <p>Loading...</p>;
    if (er) return <p>Error: {er.message}</p>;
  
    return (
        <div className={styles.formsMainContainer}>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={postCarrierLoading || editCarrierLoading || deleteCarrierLoading || getallLoads}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                    variant="contained"
                    onClick={() => setShowForm((prev) => !prev)}
                    className={styles.createButton}
                >
                    Create Carrier
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
                </Button>
                <MassUpload arrayKey='carriers' />
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={carrierValidationSchema}
                        onSubmit={handleCarrierSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, resetForm ,
                            setFieldValue
                        }) => (
                            <Form>
                                <h3 className={styles.mainHeading}>General Data</h3>
                                <Grid container spacing={2}>
                                    {isEditing && 
                                        <Grid item xs={12} sm={6} md={4}>
                                        <TextField disabled
                                            fullWidth size="small"
                                            label="Carrier ID"
                                            name="carrierId"
                                            value={values.carrierId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>}
                              
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Address"
                                            name="address"
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.address && Boolean(errors.address)}
                                            helperText={touched.address && errors.address}
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Correspondence</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Contact Person"
                                            name="contactPerson"
                                            value={values.contactPerson}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactPerson && Boolean(errors.contactPerson)}
                                            helperText={touched.contactPerson && errors.contactPerson}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Contact Number"
                                            name="contactNumber"
                                            value={values.contactNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactNumber && Boolean(errors.contactNumber)}
                                            helperText={touched.contactNumber && errors.contactNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Email ID"
                                            name="emailId"
                                            value={values.emailId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.emailId && Boolean(errors.emailId)}
                                            helperText={touched.emailId && errors.emailId}
                                        />
                                    </Grid>

                                </Grid>

                                <h3 className={styles.mainHeading}>Transport Data</h3>
                                <Grid container spacing={2}>
                                    {/* <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Vehicle Types Handling"
                                            name="vehicleTypes"
                                            value={values.vehicleTypes}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.vehicleTypes && Boolean(errors.vehicleTypes)}
                                            helperText={touched.vehicleTypes && errors.vehicleTypes}
                                        />
                                    </Grid> */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <FormControl fullWidth size="small" error={touched.vehicleTypes && Boolean(errors.vehicleTypes)}>
                                            <InputLabel>Vehicle Types Handling</InputLabel>
                                            <Select
                                                multiple
                                                label="Vehicle Types Handling"
                                                name="vehicleTypes"
                                                value={values.vehicleTypes}
                                                onChange={handleChange} // Formik's change handler
                                                onBlur={handleBlur}     // Formik's blur handler
                                                renderValue={(selected) => (selected as string[]).join(', ')} // Display selected items as comma-separated list
                                            >
                                                {vehicleTypeOptions.map((type) => (
                                                    <MenuItem key={type} value={type}>
                                                        {type}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.vehicleTypes && errors.vehicleTypes && (
                                                <FormHelperText>{errors.vehicleTypes}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        {/* <TextField
                                            fullWidth size="small"
                                            label="Locations of Operation (Location IDs)"
                                            name="locationIds"
                                            value={values.locationIds}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.locationIds && Boolean(errors.locationIds)}
                                            helperText={touched.locationIds && errors.locationIds}
                                        /> */}
                                        <FormControl fullWidth size="small" error={touched.locationIds && Boolean(errors.locationIds)}>
                                            <InputLabel>Locations of Operation (Location IDs)</InputLabel>
                                            <Select
                                                multiple
                                                label="Locations of Operation (Location IDs)"
                                                name="locationIds"
                                                value={values.locationIds}
                                                onChange={handleChange} // Handles updates to the selected values
                                                onBlur={handleBlur}
                                                renderValue={(selected) => (selected as string[]).join(', ')} // Display selected items as comma-separated
                                            >
                                                {isLocationLoading ? (
                                                    <MenuItem disabled>
                                                        <CircularProgress size={20} color="inherit" />
                                                        <span style={{ marginLeft: "10px" }}>Loading...</span>
                                                    </MenuItem>
                                                ) : (
                                                    getAllLocations?.map((location: Location) => (
                                                        <MenuItem key={location.loc_ID} value={String(location.loc_ID)}>
                                                            <Tooltip
                                                                title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                                placement="right"
                                                            >
                                                                <span style={{ flex: 1 }}>{location.loc_ID}</span>
                                                            </Tooltip>
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                            {touched.locationIds && errors.locationIds && (
                                                <FormHelperText>{errors.locationIds}</FormHelperText>
                                            )}
                                        </FormControl>

                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        {/* <TextField
                                            fullWidth size="small"
                                            label="Lane IDs"
                                            name="laneIds"
                                            value={values.laneIds}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.laneIds && Boolean(errors.laneIds)}
                                            helperText={touched.laneIds && errors.laneIds}
                                        /> */}
                                        <FormControl fullWidth size="small" error={touched.laneIds && Boolean(errors.laneIds)}>
                                            <InputLabel>Lane IDs</InputLabel>
                                            <Select
                                                multiple
                                                label="Lane IDs"
                                                name="laneIds"
                                                value={values.laneIds}
                                                onChange={handleChange} // Formik's handler for field change
                                                onBlur={handleBlur}     // Formik's handler for field blur
                                                renderValue={(selected) => (selected as string[]).join(', ')} // Display selected lanes as comma-separated
                                            >
                                                {/* {getAllLanes.map((lane: { lane_ID: string }) => (
                                            <MenuItem key={lane.lane_ID} value={lane.lane_ID}>
                                                {lane.lane_ID}
                                            </MenuItem>
                                        ))} */}
                                                {getAllLanes?.map((lane: Lane) => (
                                                    <MenuItem key={lane.lane_ID} value={String(lane.lane_ID)}>
                                                        <Tooltip
                                                            title={`${lane.src_loc_desc}, ${lane.src_city}, ${lane.src_state} to ${lane.des_loc_desc}, ${lane.des_city}, ${lane.des_state} `}
                                                            placement="right">
                                                            <span style={{ flex: 1 }}>{lane.lane_ID}</span>
                                                        </Tooltip>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.laneIds && errors.laneIds && (
                                                <FormHelperText>{errors.laneIds}</FormHelperText>
                                            )}
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.preferredCarrier}
                                                onChange={(e) => setFieldValue('preferredCarrier', e.target.checked)}
                                            />
                                        }
                                        label="Is enrolled on carrier network portal"
                                    />
                                </Grid>

                                {/* <h3 className={styles.mainHeading}>Devices</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Device Details"
                                            name="deviceDetails"
                                            value={values.deviceDetails}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.deviceDetails && Boolean(errors.deviceDetails)}
                                            helperText={touched.deviceDetails && errors.deviceDetails}
                                        />
                                    </Grid>
                                </Grid> */}

                                {/* <h3 className={styles.mainHeading}>Spot Auction</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.enrollSpotAuction}
                                                    onChange={(e) => setFieldValue('enrollSpotAuction', e.target.checked)}
                                                />
                                            }
                                            label="Enroll for Spot Auction"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.preferredCarrier}
                                                    onChange={(e) => setFieldValue('preferredCarrier', e.target.checked)}
                                                />
                                            }
                                            label="Preferred Carrier"
                                        />
                                    </Grid>
                                </Grid> */}

                                <Box marginTop={3} textAlign="center">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#83214F", // Custom button background color
                                            color: "#fff", // Text color
                                            "&:hover": {
                                                backgroundColor: "#fff",
                                                color: "#83214F"
                                            }
                                        }}
                                    >
                                        {isEditing ? "Update carrier" : "Create carrier"}
                                    </Button>
                                    <Button variant="outlined" color="secondary"
                                        onClick={() => {
                                            setInitialValues(initialCarrierValues)
                                            setIsEditing(false)
                                            resetForm()
                                        }}
                                        style={{ marginLeft: "10px" }}>Reset
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Collapse>
            <div style={{ marginTop: "40px" }}>
                {carrerLoading ? (
                    <DataGridSkeletonLoader columns={columns} />
                ) : (
                    <DataGridComponent
                        columns={columns}
                        rows={rows}
                        isLoading={carrerLoading}
                        paginationModel={paginationModel}
                        activeEntity='carriers'
                        onPaginationModelChange={handlePaginationModelChange}
                    />
                )}
            </div>
        </div>
    );
};

export default CarrierForm;
