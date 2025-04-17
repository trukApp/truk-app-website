import React, { useEffect, useRef, useState } from 'react';
import { TextField, Grid, Button, Collapse, Box, FormControlLabel, Checkbox, Autocomplete, Backdrop, CircularProgress, Paper, List, ListItem, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCustomerRegistrationMutation, useDeleteBusinessPartnerMutation, useEditBusinessPartnerMutation, useGetAllCustomersDataQuery, useGetFilteredLocationsQuery, useGetLocationMasterQuery } from '@/api/apiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MassUpload from '../MassUpload/MassUpload';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from '../MasterDataComponents/Locations';

const customerValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    locationId: Yup.string().required('Location ID is required'),
    pincode: Yup.string()
        .matches(/^\d{6}$/, 'Pincode must be 6 digits')
        .required('Pincode is required'),
    contactNumber: Yup.string()
        .matches(/^\d{10}$/, 'Contact number must be exactly 10 digits')
        .max(10, 'Contact number cannot exceed 10 digits')
        .required('Contact number is required'),
    emailId: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    contactPerson: Yup.string().required('Contact person is required'),
    locationOfSource: Yup.string().required('Location of source is required'),
});
interface PartnerFunctions {
    ship_to_party: string;
    sold_to_party: string;
    bill_to_party: string;
}
interface Correspondence {
    contact_person: string;
    contact_number: string;
    email: string;
}
interface Customer {
    customerId: string;
    pod_relevant: number;
    location_country: string;
    location_city: string;
    location_state: string;
    location_pincode: string;
    partner_id: number;
    supplier_id: number | null;
    customer_id: string;
    name: string;
    partner_type: string;
    loc_of_source: string;
    loc_of_source_pincode: string;
    loc_of_source_state: string;
    loc_of_source_city: string;
    loc_of_source_country: string;
    partner_functions: PartnerFunctions;
    correspondence: Correspondence;
    loc_ID: string;
    location_loc_ID: string;
    loc_of_source_loc_ID: string
}

const initialCustomerValues = {
    customerId: '',
    name: '',
    locationId: '',
    pincode: '',
    state: '',
    city: '',
    district: '',
    country: '',
    contactPerson: '',
    contactNumber: '',
    emailId: '',
    locationOfSource: '',
    podRelevant: false,
    shipToParty: '',
    soldToParty: '',
    billToParty: '',
};

const CustomerForm: React.FC = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const wrapperRefDest = useRef<HTMLDivElement>(null);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [showForm, setShowForm] = useState(false);
    const [updateRecord, setUpdateRecord] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState(initialCustomerValues);
    const [updateRecordData, setUpdateRecordData] = useState<Customer | null>(null);
    const [updateRecordId, setUpdateRecordId] = useState(0)
    const [updatePartnerDetails, { isLoading: editCustomerLoading }] = useEditBusinessPartnerMutation();
    const [customerRegistration, { isLoading: postCustomerLoading }] = useCustomerRegistrationMutation();
    const [deleteBusinessPartner, { isLoading: deleteCustomerLoading }] = useDeleteBusinessPartnerMutation()

    const { data, error, isLoading } = useGetAllCustomersDataQuery({
        partner_type: "customer", page: paginationModel.page + 1, limit: paginationModel.pageSize
    })
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
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRefDest.current && !wrapperRefDest.current.contains(event.target as Node)) {
                setShowDestinations(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const { data: locationsData, error: getLocationsError } = useGetLocationMasterQuery([])
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const [searchKey, setSearchKey] = useState('');
    const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });
    const [showSuggestions, setShowSuggestions] = useState(false);
    // const displayLocations = searchKey ? filteredLocations?.results || [] : getAllLocations;
    const displayLocations = searchKey === "" ? getAllLocations : filteredLocations?.results || [];

    const [searchKeyDestination, setSearchKeyDestination] = useState('');
    const [showDestinations, setShowDestinations] = useState(false);
    const { data: destinationFilteredLocations, isLoading: filteredDestinationLoading } = useGetFilteredLocationsQuery(searchKeyDestination.length >= 3 ? searchKeyDestination : null, { skip: searchKeyDestination.length < 3 });
    const displayLocationsDest = searchKeyDestination ? destinationFilteredLocations?.results || [] : getAllLocations;
    const getLocationDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        const details = [
            location.loc_ID,
            location?.loc_dec,
            location.city,
            location.state,
            location.pincode,
            location.country,
        ].filter(Boolean);

        return details.length > 0 ? details.join(", ") : "Location details not available";
    };
    if (getLocationsError) {
        console.log("getLocationsError: ", getLocationsError)
    }
    useEffect(() => {
        if (!searchKey) {
            setShowSuggestions(false);

        }
    }, [searchKey]);
    const customersData = data?.partners.length > 0 ? data?.partners : []
    const getCustomerDetails = (customer_id: string) => {
        const customer = customersData.find((customer: Customer) => customer.customer_id === customer_id);
        if (!location) return "Customer details not available";
        const details = [
            customer.customer_id,
            customer.name,
            customer.location_city,
            customer.location_state,
            customer.location_country,
            customer.location_pincode,

        ].filter(Boolean);
        return details.length > 0 ? details.join(", ") : "Customer details not available";
    };

    if (error) {
        console.error("getting error while fetching the customers data:", error);
    }
    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };
    const mapRowToInitialValues = (rowData: Customer) => ({
        customerId: rowData.customer_id || '',
        name: rowData.name || '',
        locationId: rowData.location_loc_ID || '',
        pincode: rowData.location_pincode || '',
        state: rowData.location_state || '',
        city: rowData.location_city || '',
        district: '',
        country: rowData.location_country || '',
        contactPerson: rowData?.correspondence?.contact_person || '',
        contactNumber: rowData?.correspondence?.contact_number || '',
        emailId: rowData?.correspondence?.email || '',
        locationOfSource: rowData.loc_of_source_loc_ID,
        podRelevant: rowData?.pod_relevant === 1,
        shipToParty: rowData?.partner_functions?.ship_to_party || '',
        soldToParty: rowData?.partner_functions?.sold_to_party || '',
        billToParty: rowData?.partner_functions?.bill_to_party || '',
    });

    const rows = customersData.map((item: Customer) => {
        return {
            id: item.partner_id,
            ...item,
            loc_of_source: getLocationDetails(item?.loc_of_source),
            loc_ID: getLocationDetails(item?.loc_ID),
            contact_person: item.correspondence?.contact_person || "",
            contact_number: item.correspondence?.contact_number || "",
            email: item.correspondence?.email || "",
            bill_to_party: getCustomerDetails(item.partner_functions?.bill_to_party) || "",
            ship_to_party: getCustomerDetails(item.partner_functions?.ship_to_party) || "",
            sold_to_party: getCustomerDetails(item.partner_functions?.sold_to_party) || "",
        };
    });

    const columns: GridColDef[] = [
        { field: 'customer_id', headerName: 'Customer ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: "loc_ID", headerName: "Customer Location ID", width: 250 },
        { field: "loc_of_source", headerName: "Source Location ID", width: 250 },
        { field: "contact_person", headerName: "Contact Person", width: 200 },
        { field: "contact_number", headerName: "Contact Number", width: 150 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "bill_to_party", headerName: "Bill To Party", width: 250 },
        { field: "ship_to_party", headerName: "Ship To Party", width: 250 },
        { field: "sold_to_party", headerName: "Sold To Party", width: 250 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => handleEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        onClick={() => handleDelete(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    const handleEdit = async (rowData: Customer) => {
        setShowForm(true)
        setUpdateRecord(true)
        setUpdateRecordData(rowData)
        const updatedInitialValues = await mapRowToInitialValues(rowData);
        setSearchKey(rowData?.loc_ID);
        setSearchKeyDestination(rowData?.loc_of_source)
        setFormInitialValues(updatedInitialValues);
        setUpdateRecordId(rowData?.partner_id)
    };

    const handleDelete = async (rowData: Customer) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ? This action cannot be undone.`);
        if (!confirmDelete) return;
        try {
            const deleteId = rowData?.partner_id;
            const response = await deleteBusinessPartner(deleteId);
            if (response.data.deleted_record) {
                setSnackbarMessage(`Customer ID ${response.data.deleted_record} deleted successfully!`);
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Delete error:", error);
            setSnackbarMessage("Failed to delete customer. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleCustomerSubmit = async (values: typeof initialCustomerValues, { resetForm }: { resetForm: () => void }) => {
        try {
            const body = {
                partners: [
                    {
                        name: values?.name,
                        partner_type: "customer",
                        loc_ID: values?.locationId,
                        correspondence: {
                            contact_person: values?.contactPerson,
                            contact_number: values?.contactNumber,
                            email: values?.emailId
                        },
                        loc_of_source: values?.locationOfSource,
                        pod_relevant: values?.podRelevant,
                        partner_functions: {
                            ship_to_party: values?.shipToParty,
                            sold_to_party: values?.soldToParty,
                            bill_to_party: values?.billToParty
                        }
                    }
                ]
            }
            const editBody = {
                customer_id: updateRecordData?.customer_id,
                name: values?.name,
                partner_type: "customer",
                loc_ID: values?.locationId,
                correspondence: {
                    contact_person: values?.contactPerson,
                    contact_number: values?.contactNumber,
                    email: values?.emailId
                },
                loc_of_source: values?.locationOfSource,
                pod_relevant: values?.podRelevant,
                partner_functions: {
                    ship_to_party: values?.shipToParty,
                    sold_to_party: values?.soldToParty,
                    bill_to_party: values?.billToParty
                }
            }
            console.log("post body: ", body)
            console.log("editBody: ", editBody)
            if (updateRecord) {
                const response = await updatePartnerDetails({ body: editBody, partnerId: updateRecordId }).unwrap();
                if (response?.updated_record) {
                    setSnackbarMessage(`Customer ID ${response.updated_record} updated successfully!`);
                    resetForm();
                    setShowForm(false)
                    setUpdateRecord(false)
                    setFormInitialValues(initialCustomerValues)
                    setUpdateRecordId(0)
                    setUpdateRecordData(null)
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    setSearchKey('')
                    setSearchKeyDestination('')
                }
            } else {
                const response = await customerRegistration(body).unwrap();
                if (response?.created_records) {
                    setSnackbarMessage(`Customer ID ${response.created_records[0]} created successfully!`);
                    setFormInitialValues(initialCustomerValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData(null)
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    resetForm()
                    setSearchKey('')
                    setSearchKeyDestination('')
                }
            }
        } catch (error) {
            console.error('API Error:', error);
            setSnackbarMessage('Something went wrong! Please try again.');
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <Grid >
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={postCustomerLoading || editCustomerLoading || deleteCustomerLoading}
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
                    onClick={() => setShowForm((prev) => !prev)}
                    className={styles.createButton}
                >
                    Create Customer
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 8 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />}
                </Button>
                <MassUpload arrayKey='partners' partnerType="customer" />
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={formInitialValues}
                        validationSchema={customerValidationSchema}
                        onSubmit={handleCustomerSubmit}
                        enableReinitialize={true}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, setFieldValue, resetForm }) => (
                            <Form>
                                <h3 className={styles.mainHeading}>General Data</h3>
                                <Grid container spacing={2}>
                                    {updateRecord &&
                                        <Grid item xs={12} sm={6} md={2.4}>
                                            <TextField disabled
                                                fullWidth size='small'
                                                label="Customer ID"
                                                name="customerId"
                                                value={values.customerId}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Grid>
                                    }
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Name*"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth
                                            name="locationId"
                                            size="small"
                                            label="Location ID*"
                                            onFocus={() => {
                                                if (!searchKey) {
                                                    setSearchKey(values.locationId || '');
                                                    setShowSuggestions(true);
                                                }
                                            }}
                                            onChange={(e) => {
                                                setSearchKey(e.target.value)
                                                setShowSuggestions(true)
                                            }
                                            }
                                            value={searchKey}
                                            error={
                                                touched.locationId && Boolean(errors.locationId)
                                            }
                                            helperText={
                                                touched?.locationId && typeof errors?.locationId === "string"
                                                    ? errors.locationId
                                                    : ""
                                            }
                                            InputProps={{
                                                endAdornment: filteredLocationLoading ? <CircularProgress size={20} /> : null,
                                            }}
                                        />
                                        <div ref={wrapperRef} >
                                            {showSuggestions && displayLocations?.length > 0 && (
                                                <Paper
                                                    style={{
                                                        maxHeight: 200,
                                                        overflowY: "auto",
                                                        position: "absolute",
                                                        zIndex: 10,
                                                        width: "18%",
                                                    }}
                                                > {displayLocations.length > 0 ? (
                                                    <List>
                                                        {displayLocations.map((location: Location) => (
                                                            <ListItem
                                                                key={location.loc_ID}
                                                                component="li"
                                                                onClick={() => {
                                                                    setShowSuggestions(false)
                                                                    const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
                                                                    setSearchKey(selectedDisplay);
                                                                    // setSearchKey(location.loc_ID);
                                                                    setFieldValue("locationId", location.loc_ID)
                                                                    const matchedLocation = getAllLocations.find((loc: Location) => loc.loc_ID === location.loc_ID);
                                                                    if (matchedLocation) {
                                                                        setFieldValue('address1', matchedLocation.address_1 || '');
                                                                        setFieldValue('address2', matchedLocation.address_2 || '');
                                                                        setFieldValue('city', matchedLocation.city || '');
                                                                        setFieldValue('district', matchedLocation.district || '');
                                                                        setFieldValue('state', matchedLocation.state || '');
                                                                        setFieldValue('country', matchedLocation.country || '');
                                                                        setFieldValue('pincode', matchedLocation.pincode || '');
                                                                    } else {
                                                                        setFieldValue('address1', '');
                                                                        setFieldValue('address2', '');
                                                                        setFieldValue('city', '');
                                                                        setFieldValue('district', '');
                                                                        setFieldValue('state', '');
                                                                        setFieldValue('country', '');
                                                                        setFieldValue('pincode', '');
                                                                    }
                                                                }}
                                                                sx={{ cursor: "pointer" }}
                                                            >
                                                                <span style={{ fontSize: '13px' }}>{location.loc_ID}, {location?.loc_desc}, {location.city}, {location.state}, {location.pincode}</span>
                                                            </ListItem>
                                                        ))}
                                                    </List>) :
                                                    (
                                                        <Typography variant="body2" color="textSecondary">
                                                            No results found
                                                        </Typography>
                                                    )
                                                    }
                                                </Paper>
                                            )}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Pincode"
                                            name="pincode" disabled
                                            value={values.pincode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="City" disabled
                                            name="city"
                                            value={values.city}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="State" disabled
                                            name="state"
                                            value={values.state}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Country" disabled
                                            name="country"
                                            value={values.country}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid> */}
                                </Grid>

                                <h3 className={styles.mainHeading}>Correspondence</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Contact Person*"
                                            name="contactPerson"
                                            value={values.contactPerson}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactPerson && Boolean(errors.contactPerson)}
                                            helperText={touched.contactPerson && errors.contactPerson}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Contact Number*"
                                            name="contactNumber"
                                            value={values.contactNumber}
                                            onChange={handleChange} type="number"
                                            onBlur={handleBlur}
                                            error={touched.contactNumber && Boolean(errors.contactNumber)}
                                            helperText={touched.contactNumber && errors.contactNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Email ID*"
                                            name="emailId"
                                            value={values.emailId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.emailId && Boolean(errors.emailId)}
                                            helperText={touched.emailId && errors.emailId}
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Shipping</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth
                                            name="locationOfSource"
                                            size="small"
                                            label="Location of Source"
                                            onFocus={() => {
                                                if (!searchKeyDestination) {
                                                    setSearchKeyDestination(values?.locationOfSource[0] || "");
                                                    setShowDestinations(true);
                                                }
                                            }}
                                            onChange={(e) => {
                                                setSearchKeyDestination(e.target.value)
                                                setShowDestinations(true)
                                            }
                                            }
                                            value={searchKeyDestination}
                                            error={touched?.locationOfSource && Boolean(errors?.locationOfSource)}
                                            helperText={
                                                touched?.locationOfSource && typeof errors?.locationOfSource === "string"
                                                    ? errors.locationOfSource
                                                    : ""
                                            }
                                            InputProps={{
                                                endAdornment: filteredDestinationLoading ? <CircularProgress size={20} /> : null,
                                            }}
                                        />
                                        <div ref={wrapperRefDest}>
                                            {showDestinations && displayLocationsDest?.length > 0 && (
                                                <Paper
                                                    style={{
                                                        maxHeight: 200,
                                                        overflowY: "auto",
                                                        position: "absolute",
                                                        zIndex: 10,
                                                        width: "18%",
                                                    }}
                                                >
                                                    <List>
                                                        {displayLocationsDest.map((location: Location) => (
                                                            <ListItem
                                                                key={location.loc_ID}
                                                                component="li"
                                                                onClick={() => {
                                                                    const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
                                                                    setSearchKeyDestination(selectedDisplay);
                                                                    setShowDestinations(false)
                                                                    setFieldValue("locationOfSource", location.loc_ID);
                                                                }}
                                                                sx={{ cursor: "pointer" }}
                                                            >
                                                                <span style={{ fontSize: '13px' }}>{location.loc_ID},{location?.loc_desc}, {location.city}, {location.state}, {location.pincode}</span>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Paper>
                                            )}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.podRelevant}
                                                    onChange={(e) => setFieldValue('podRelevant', e.target.checked)}
                                                />
                                            }
                                            label="POD Relevant"
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Partner Functions</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    {['shipToParty', 'soldToParty', 'billToParty'].map((field) => (
                                        <Grid item xs={12} sm={6} md={2.4} key={field}>
                                            <Autocomplete
                                                options={customersData}
                                                getOptionLabel={(option) => `${option.customer_id} - ${option.name}`}
                                                renderOption={(props, option) => (
                                                    <li {...props}>
                                                        {option.customer_id} - {option.name}, {option.location_city}, {option.location_state}, {option.location_country}, {option.location_pincode}
                                                    </li>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label={field
                                                            .replace(/([A-Z])/g, ' $1')
                                                            .replace(/^./, (str) => str.toUpperCase())
                                                        }
                                                        size="small"
                                                        onBlur={handleBlur}
                                                    />
                                                )}
                                                value={customersData.find((item: Customer) => item.customer_id === values[field as keyof typeof values]) || null}
                                                onChange={(event, newValue) => {
                                                    setFieldValue(field, newValue ? newValue.customer_id : '');
                                                }}

                                                // 🛠 Modified: Fix value comparison to avoid type errors
                                                isOptionEqualToValue={(option, value) => option.customer_id === value?.customer_id}
                                            />
                                        </Grid>
                                    ))}
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
                                        {updateRecord ? "Update Customer" : "Create customer"}
                                    </Button>

                                    <Button variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setFormInitialValues(initialCustomerValues)
                                            setUpdateRecord(false)
                                            resetForm()
                                            setSearchKey('')
                                            setSearchKeyDestination('')
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
                        activeEntity='customers'
                        onPaginationModelChange={handlePaginationModelChange}
                    />
                )}
            </div>
        </Grid>
    );
};

export default CustomerForm;