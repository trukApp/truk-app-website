import React, { useEffect, useRef, useState } from 'react';
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
    Paper,
    List,
    ListItem,
    Chip,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useGetCarrierMasterQuery, usePostCarrierMasterMutation, useEditCarrierMasterMutation, useDeleteCarrierMasterMutation, useGetLocationMasterQuery, useGetLanesMasterQuery, useGetFilteredLocationsQuery } from '@/api/apiSlice';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MassUpload from '../MassUpload/MassUpload';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from '../MasterDataComponents/Locations';
import { Lane } from '../MasterDataComponents/Lanes';
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

const CarrierForm: React.FC = () => {
     const wrapperRef = useRef<HTMLDivElement>(null);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editRow, setEditRow] = useState<CarrierFormFE | null>(null);;
    const { data, error, isLoading } = useGetCarrierMasterQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
    const [postCarrier, { isLoading: postCarrierLoading }] = usePostCarrierMasterMutation()
    const [editCarrier, { isLoading: editCarrierLoading }] = useEditCarrierMasterMutation()
    const [deleteCarrier, { isLoading: deleteCarrierLoading }] = useDeleteCarrierMasterMutation()
    const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery({})
    const { data: lanesData } = useGetLanesMasterQuery([]);
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const [searchKey, setSearchKey] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });
    const displayLocations = searchKey ? filteredLocations?.results || [] : getAllLocations;
    const getLocationDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        const details = [
            location.loc_ID,
            location.loc_desc,
            location.city,
            location.state,
            location.pincode,
        ].filter(Boolean);
        return details.length > 0 ? details.join(", ") : "Location details not available";
    };

    const getAllLanes = lanesData?.lanes.length > 0 ? lanesData?.lanes : []
    if (error) {
        console.log("err while getting carrier info :", error)
    }

    const getLaneDetails = (lane_ID: string) => {
        const lane = lanesData?.lanes.find((l: Lane) => l.lane_ID === lane_ID);
        if (!lane) return "Lane details not available";
        const sourceLocationDetails = [
            lane.src_loc_ID,
            lane.src_loc_desc,
            lane.src_city,
            lane.src_state,
            lane_ID
        ].filter(Boolean).join(", ");

        const destinationLocationDetails = [
            lane.des_loc_ID,
            lane.des_loc_desc,
            lane.des_city,
            lane.des_state,
            lane_ID
        ].filter(Boolean).join(", ");
        return `Source: ${sourceLocationDetails} | Destination: ${destinationLocationDetails}`;
    };

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
    
    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };
    // const vehicleTypeOptions = ['Truck', 'Van', 'Container', 'Trailer'];
    const handleEdit = (row: CarrierFormFE) => {
        setShowForm(true)
        setIsEditing(true)
        setEditRow(row)
    };

    const handleDelete = async (row: CarrierFormFE) => {
        const packageId = row?.id;
        if (!packageId) {
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
    const [initialValues, setInitialValues] = useState(initialCarrierValues)

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
        contactNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
        .required("Contact number is required"),
        emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
        vehicleTypes: Yup.string().required('Vehicle type is required'),
        locationIds: Yup.array().of(Yup.string()).min(1, 'Select at least one location').required('Location is required'),
        laneIds: Yup.array().of(Yup.string()).min(1, 'Select at least one lane').required('Lane IDs are required'),
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
                console.log('edit body : ', editBody)
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
                console.log("post body : ", body)
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

    const rows = data?.carriers.map((carrier: CarrierFormBE) => {
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
        {field: "allLocationIdsDetails", headerName: "Locations",width: 250},
        {field: "allLaneIdsDetails",headerName: "Lane Details",width: 250},
        {field: 'preferredCarrier',headerName: 'Is enrolled on carrier network portal',width: 150,renderCell: (params) => params.value ? 'Yes' : 'No'},
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

    return (
        <div className={styles.formsMainContainer}>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={postCarrierLoading || editCarrierLoading || deleteCarrierLoading || isLocationLoading}
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
                        {({ values, handleChange, handleBlur, errors, touched, resetForm,
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
                                            name="contactNumber" type='number'
                                            value={values.contactNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactNumber && Boolean(errors.contactNumber)}
                                            helperText={touched.contactNumber && errors.contactNumber} 
                                                    inputProps={{
                                                    maxLength: 10,
                                                    inputMode: "numeric",
                                                    pattern: "[0-9]*"  
                                                }}
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
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Vehicle Types Handling (Van, Truck...)*"
                                            name="vehicleTypes"
                                            value={values.vehicleTypes}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.vehicleTypes && Boolean(errors.vehicleTypes)}
                                            helperText={touched.vehicleTypes && errors.vehicleTypes}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12} sm={6} md={4}>
                                        <FormControl fullWidth size="small" error={touched.vehicleTypes && Boolean(errors.vehicleTypes)}>
                                            <InputLabel>Vehicle Types Handling</InputLabel>
                                            <Select
                                                multiple
                                                label="Vehicle Types Handling (Van,Truck"
                                                name="vehicleTypes"
                                                value={values.vehicleTypes}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                // renderValue={(selected) => (selected as string[]).join(', ')}
                                            >
                                            </Select>
                                            {touched.vehicleTypes && errors.vehicleTypes && (
                                                <FormHelperText>{errors.vehicleTypes}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid> */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Locations of Operation (Location IDs)"
                                            onFocus={() => {
                                            if (!searchKey) {
                                                setSearchKey("");
                                                setShowSuggestions(true);
                                            }
                                            }}
                                            onChange={(e) => {
                                            setSearchKey(e.target.value);
                                            setShowSuggestions(true);
                                            }}
                                            value={searchKey}
                                            error={touched.locationIds && Boolean(errors.locationIds)}
                                            helperText={
                                            touched.locationIds && typeof errors.locationIds === "string"
                                                ? errors.locationIds
                                                : ""
                                            }
                                            InputProps={{
                                            endAdornment: filteredLocationLoading ? <CircularProgress size={20} /> : null,
                                            }}
                                        />
                                        <div ref={wrapperRef}>
                                            {showSuggestions && displayLocations?.length > 0 && (
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
                                                {displayLocations.map((location: Location) => (
                                                    <ListItem
                                                    key={location.loc_ID}
                                                    component="li"
                                                    onClick={() => {
                                                        setShowSuggestions(false);
                                                        // const selectedDisplay = `${location.loc_ID}, ${location.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
                                                        if (!values.locationIds.includes(location.loc_ID)) {
                                                            setFieldValue("locationIds", [...values.locationIds, location.loc_ID]);
                                                        }
                                                        setSearchKey("");
                                                    }}
                                                    sx={{ cursor: "pointer" }}
                                                    >
                                                    <Tooltip
                                                        title={`${location.loc_desc}, ${location.address_1}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                        placement="right"
                                                    >
                                                        <span style={{ fontSize: "14px" }}>
                                                        {location.loc_ID}, {location.loc_desc}, {location.city}, {location.state}, {location.pincode}
                                                        </span>
                                                    </Tooltip>
                                                    </ListItem>
                                                ))}
                                                </List>
                                            </Paper>
                                            )}
                                        </div>
                                        {values.locationIds.length > 0 && (
                                             <Paper
                                            style={{
                                            marginTop: 8,
                                            padding: 8,
                                            minHeight: 40,
                                            background: "#f5f5f5",
                                            }}
                                        >
                                            {values.locationIds.map((locId: string) => {
                                            const location = displayLocations.find((loc:Location) => loc.loc_ID === locId);
                                            return (
                                                <Chip
                                                key={locId}
                                                label={`${location?.loc_ID}, ${location?.loc_desc}`}
                                                onDelete={() => {
                                                    setFieldValue(
                                                    "locationIds",
                                                    values.locationIds.filter((id) => id !== locId)
                                                    );
                                                }}
                                                style={{ margin: 4 }}
                                                />
                                            );
                                            })}
                                        </Paper>
                                        ) }
                                    </Grid>

                                    {/* <Grid item xs={12} sm={6} md={4}>
                                        <FormControl fullWidth size="small" error={touched.laneIds && Boolean(errors.laneIds)}>
                                            <InputLabel>Lane IDs</InputLabel>
                                            <Select
                                                multiple
                                                label="Lane IDs"
                                                name="laneIds"
                                                value={values.laneIds}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                // renderValue={(selected) => (selected as string[]).join(', ')}
                                            >
                                                {getAllLanes?.map((lane: Lane) => (
                                                    <MenuItem key={lane.lane_ID} value={String(lane.lane_ID)}>
                                                            <span style={{ flex: 1 }}> {lane.lane_ID} :- {lane.src_loc_desc} to {lane.des_loc_desc}</span>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.laneIds && errors.laneIds && (
                                                <FormHelperText>{errors.laneIds}</FormHelperText>
                                            )}
                                        </FormControl>

                                    </Grid> */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <FormControl fullWidth size="small" error={touched.laneIds && Boolean(errors.laneIds)}>
                                            <InputLabel >Lane IDs</InputLabel>
                                            <Select
                                            multiple 
                                            name="laneIds"
                                            value={values.laneIds}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            renderValue={() => null}
                                            >
                                            {getAllLanes?.map((lane: Lane) => (
                                                <MenuItem key={lane.lane_ID} value={String(lane.lane_ID)}>
                                                <span style={{ flex: 1 }}>
                                                    {lane.lane_ID} :- {lane.src_loc_desc} to {lane.des_loc_desc}
                                                </span>
                                                </MenuItem>
                                            ))}
                                            </Select>
                                            {touched.laneIds && errors.laneIds && <FormHelperText>{errors.laneIds}</FormHelperText>}
                                        </FormControl>
                                        {values.laneIds.length > 0 && (
                                            <Paper
                                            style={{
                                                marginTop: 8,
                                                padding: 8,
                                                minHeight: 40,
                                                background: "#f5f5f5",
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 8,
                                            }}
                                            >
                                            {values.laneIds.map((laneId: string) => {
                                                const lane = getAllLanes.find((l:Lane) => String(l.lane_ID) === laneId);
                                                return (
                                                <Chip
                                                    key={laneId}
                                                    label={`${lane?.lane_ID} : ${lane?.src_loc_desc} to ${lane?.des_loc_desc}`}
                                                    onDelete={() => {
                                                    setFieldValue(
                                                        "laneIds",
                                                        values.laneIds.filter((id) => id !== laneId)
                                                    );
                                                    }}
                                                    style={{ margin: 4 }}
                                                />
                                                );
                                            })}
                                            </Paper>
                                        )}
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
                                <Box marginTop={3} textAlign="center">
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
                {isLoading ? (
                    <DataGridSkeletonLoader columns={columns} />
                ) : (
                    <DataGridComponent
                        columns={columns}
                        rows={rows}
                        isLoading={isLoading}
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
