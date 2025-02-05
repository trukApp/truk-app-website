import React, { useState } from 'react';
import { TextField, Grid, Button, Collapse, Box, FormControlLabel, Checkbox, Select, MenuItem, FormHelperText, FormControl, InputLabel, SelectChangeEvent, Autocomplete, Backdrop, CircularProgress, Tooltip } from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCustomerRegistrationMutation, useDeleteBusinessPartnerMutation, useEditBusinessPartnerMutation, useGetAllCustomersDataQuery, useGetLocationMasterQuery } from '@/api/apiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MassUpload from '../MassUpload/MassUpload';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from '../MasterDataComponents/Locations';


// Validation schema for CustomerForm
const customerValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    locationId: Yup.string().required('Location ID is required'),
    pincode: Yup.string()
        .matches(/^\d{6}$/, 'Pincode must be 6 digits')
        .required('Pincode is required'),
    city: Yup.string().required('City is required'),
    // district: Yup.string().required('District is required'),
    country: Yup.string().required('Country is required'),
    contactNumber: Yup.string()
        .matches(/^\d{10}$/, 'Contact number must be 10 digits')
        .required('Contact number is required'),
    emailId: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
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
    loc_ID: string
}

const initialCustomerValues = {
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
    locationOfSource: [] as string[],
    podRelevant: false,
    shipToParty: '',
    soldToParty: '',
    billToParty: '',
};


const CustomerForm: React.FC = () => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [showForm, setShowForm] = useState(false);
    const [updateRecord, setUpdateRecord] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState(initialCustomerValues);
    const [updateRecordData, setUpdateRecordData] = useState({});
    const [updateRecordId, setUpdateRecordId] = useState(0)
    const [updatePartnerDetails,{isLoading:editCustomerLoading}] = useEditBusinessPartnerMutation();
    const [customerRegistration, {isLoading:postCustomerLoading}] = useCustomerRegistrationMutation();
    const [deleteBusinessPartner,{isLoading:deleteCustomerLoading}] = useDeleteBusinessPartnerMutation()

    const { data, error, isLoading } = useGetAllCustomersDataQuery({
        partner_type: "customer", page: paginationModel.page + 1, limit: paginationModel.pageSize
    })

    const { data: locationsData, error: getLocationsError } = useGetLocationMasterQuery([])
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    console.log("all customers data :", data?.partners)
    console.log("all locations :", locationsData?.locations)
    console.log("getLocationsError: ", getLocationsError)
    console.log("form intials :", formInitialValues)
    const customersData = data?.partners.length > 0 ? data?.partners : []

    if (isLoading) {
        console.log("Loading All customers Data...");
    }

    if (error) {
        console.error("getting error while fetching the customers data:", error);
    }
    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };
    const mapRowToInitialValues = (rowData: Customer) => ({
        name: rowData.name || '',
        locationId: rowData.loc_ID || '',
        pincode: rowData.location_pincode || '',
        state: rowData.location_state || '',
        city: rowData.location_city || '',
        district: '',
        country: rowData.location_country || '',
        contactPerson: rowData?.correspondence?.contact_person || '',
        contactNumber: rowData?.correspondence?.contact_number || '',
        emailId: rowData?.correspondence?.email || '',
        locationOfSource: [rowData.loc_of_source],
        podRelevant: rowData?.pod_relevant === 1,
        shipToParty: rowData?.partner_functions?.ship_to_party || '',
        soldToParty: rowData?.partner_functions?.sold_to_party || '',
        billToParty: rowData?.partner_functions?.bill_to_party || '',
    });


    const rows = customersData.map((item: Customer) => ({
        id: item.partner_id,
        ...item,
    }));

    const columns: GridColDef[] = [
        { field: 'customer_id', headerName: 'Customer ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'loc_ID', headerName: 'Customer Location ID', width: 150 },
        { field: 'location_pincode', headerName: 'Customer Pincode', width: 100 },
        { field: 'location_city', headerName: 'Customer City', width: 150 },
        { field: 'location_state', headerName: 'Customer State', width: 150 },
        { field: 'location_country', headerName: 'Customer Country', width: 150 },
        { field: 'loc_of_source', headerName: 'Source Location ID', width: 150 },
        // { field: 'pod_relevant', headerName: 'Pod relevant', width: 150 },
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
        console.log('Edit clicked for:', rowData);
        setShowForm(true)
        setUpdateRecord(true)
        setUpdateRecordData(rowData)
        const updatedInitialValues = await mapRowToInitialValues(rowData);
        console.log('Updated Initial Values:', updatedInitialValues);


        setFormInitialValues(updatedInitialValues);
        setUpdateRecordId(rowData?.partner_id)
    };

    const handleDelete = async (rowData: Customer) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ? This action cannot be undone.`);
        
        if (!confirmDelete) return;

        try {
            console.log("Delete clicked for:", rowData);
            const deleteId = rowData?.partner_id;
            const response = await deleteBusinessPartner(deleteId);
            console.log("Delete response:", response);

            setSnackbarMessage("Customer deleted successfully!");
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Delete error:", error);
            setSnackbarMessage("Failed to delete customer. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
};


    const handleCustomerSubmit = async (values: typeof initialCustomerValues, { resetForm }: { resetForm: () => void }) => {
        try {
            console.log('Customer Form Submitted:', values);
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
                ...updateRecordData,
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

            console.log("editBody: ", editBody)
            if (updateRecord) {
                console.log("I am going update the record")
                const response = await updatePartnerDetails({ body: editBody, partnerId: updateRecordId }).unwrap();
                console.log('API Response:', response);
                resetForm()
                setFormInitialValues(initialCustomerValues)
                setShowForm(false)
                setUpdateRecord(false)
                setUpdateRecordId(0)
                setUpdateRecordData({})
                setSnackbarMessage("Customer details updated successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } else {
                console.log("I am going create the record")
                const response = await customerRegistration(body).unwrap();
                console.log('API Response:', response);
                if (response) {
                    setFormInitialValues(initialCustomerValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData({})
                    resetForm()
                    setSnackbarMessage("Customer details posted successfully!");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                }
            }


        } catch (error) {
            console.error('API Error:', error);
                setSnackbarMessage('Something went wrong! Please try again.');
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                    }
    };

    const handleLocationChange = (
        event: SelectChangeEvent<string>,
        setFieldValue: FormikProps<Location>['setFieldValue']
    ) => {
        const selectedLocationId = event.target.value;
        setFieldValue('locationId', selectedLocationId);
        const selectedLocation = getAllLocations.find((loc: Location) => loc.loc_ID === (selectedLocationId));
        console.log(selectedLocation)
        // Check if the selectedLocation exists before calling setFieldValue

        if (selectedLocation) {

            setFieldValue('city', selectedLocation?.city || '');
            setFieldValue('district', selectedLocation?.district || '');
            setFieldValue('state', selectedLocation?.state || '');
            setFieldValue('country', selectedLocation?.country || '');
            setFieldValue('pincode', selectedLocation?.pincode || '');
        } else {
            // Clear fields if no matching location found
            setFieldValue('locationId', '');
            setFieldValue('city', '');
            setFieldValue('district', '');
            setFieldValue('state', '');
            setFieldValue('country', '');
            setFieldValue('pincode', '');
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
                    variant="contained"
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
                        {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
                            <Form>
                                <h3 className={styles.mainHeading}>General Data</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <FormControl fullWidth size="small" error={touched.locationId && Boolean(errors.locationId)}>
                                            <InputLabel>Location ID</InputLabel>
                                            <Select
                                                label="Location ID"
                                                name="locationId"
                                                value={values.locationId}
                                                onChange={(event) => handleLocationChange(event, setFieldValue)}
                                                onBlur={handleBlur}
                                            >
                                            {getAllLocations?.map((location: Location) => (
                                                    <MenuItem key={location.loc_ID} value={String(location.loc_ID)}>
                                                        <Tooltip
                                                            title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                            placement="right"
                                                            >
                                                           <span style={{ flex: 1 }}>{location.loc_ID}</span>
                                                        </Tooltip>
                                                    </MenuItem>
                                            ))}
                                            </Select>
                                            {touched.locationId && errors.locationId && (
                                                <FormHelperText>{errors.locationId}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Pincode"
                                            name="pincode" disabled
                                            value={values.pincode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.pincode && Boolean(errors.pincode)}
                                            helperText={touched.pincode && errors.pincode}
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
                                            error={touched.city && Boolean(errors.city)}
                                            helperText={touched.city && errors.city}
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
                                            error={touched.state && Boolean(errors.state)}
                                            helperText={touched.state && errors.state}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Country" disabled
                                            name="country"
                                            value={values.country}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.country && Boolean(errors.country)}
                                            helperText={touched.country && errors.country}
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Correspondence</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Contact Person"
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
                                            label="Contact Number"
                                            name="contactNumber"
                                            value={values.contactNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactNumber && Boolean(errors.contactNumber)}
                                            helperText={touched.contactNumber && errors.contactNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
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

                                <h3 className={styles.mainHeading}>Shipping</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <FormControl fullWidth size="small" error={touched.locationOfSource && Boolean(errors.locationOfSource)}>
                                            <InputLabel>Location of Source</InputLabel>
                                            <Select
                                                label="Location of Source"
                                                name="locationOfSource"
                                                value={values.locationOfSource}
                                                onChange={(e) => setFieldValue('locationOfSource', e.target.value)}
                                                onBlur={handleBlur}
                                            >
                                            {getAllLocations?.map((location: Location) => (
                                                <MenuItem key={location.loc_ID} value={String(location.loc_ID)}>
                                                    <Tooltip
                                                        title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                        placement="right">
                                                        <span style={{ flex: 1 }}>{location.loc_ID}</span>
                                                    </Tooltip>
                                                </MenuItem>
                                            ))}
                                            </Select>
                                            {touched.locationOfSource && errors.locationOfSource && (
                                                <FormHelperText>{errors.locationOfSource}</FormHelperText>
                                            )}
                                        </FormControl>
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
                                                getOptionLabel={(option) => `${option.customer_id}`}
                                                renderOption={(props, option) => (
                                                    <Tooltip placement='right' title={`${option.name}, ${option.location_city}, ${option.location_state}, ${option.location_country}, ${option.location_pincode}`} arrow>
                                                        <li {...props}>{option.customer_id}</li>
                                                    </Tooltip>
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
                                                isOptionEqualToValue={(option, value) => option.customer_id === value}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                    <Box marginTop={3} textAlign="center">
                                        <Button type="submit" variant="contained" color="primary">
                                            {updateRecord ? "Update record" : "Create record"}
                                        </Button>
                                        <Button variant="outlined"
                                            color="secondary"
                                            onClick={() => {
                                                setFormInitialValues(initialCustomerValues)
                                                setUpdateRecord(false)
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

