import React, { useState } from 'react';
import { Box, Button, Collapse, Grid, TextField, FormControlLabel, Checkbox, FormControl, InputLabel, MenuItem, Select, FormHelperText, SelectChangeEvent, Backdrop, CircularProgress, Tooltip } from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { DataGridComponent } from '../GridComponent';
import styles from './BusinessPartners.module.css'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCustomerRegistrationMutation, useDeleteBusinessPartnerMutation, useEditBusinessPartnerMutation, useGetAllVendorsDataQuery, useGetLocationMasterQuery } from '@/api/apiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MassUpload from '../MassUpload/MassUpload';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from '../MasterDataComponents/Locations';

interface PartnerFunctions {
    forwarding_agent: string;
    goods_supplier: string;
    ordering_address: string;
}

interface Correspondence {
    contact_person: string;
    contact_number: string;
    email: string;
}
export interface Customer {
    location_country: string;
    location_city: string;
    location_state: string;
    location_pincode: string;
    loc_ID: string;
    pod_relevant: number;
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
}

const initialSupplierValues = {
    // supplierId: '',
    name: '',
    locationId: '',
    pincode: '',
    city: '',
    district: '',
    country: '',
    contactPerson: '',
    contactNumber: '',
    emailId: '',
    locationOfSource: '',
    podRelevant: false,
    orderingAddress: '',
    goodsSupplier: '',
    forwardingAgent: ''
};


const SupplierForm: React.FC = () => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [showForm, setShowForm] = useState(false);
    const [updateRecord, setUpdateRecord] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState(initialSupplierValues);
    const [updateRecordData, setUpdateRecordData] = useState({});
    const [updateRecordId, setUpdateRecordId] = useState(0)
    const [updatePartnerDetails, { isLoading: postVendorLoading }] = useEditBusinessPartnerMutation();
    const [customerRegistration, { isLoading: editVendorLoading }] = useCustomerRegistrationMutation();
    const [deleteBusinessPartner, { isLoading: deleteVendorLoading }] = useDeleteBusinessPartnerMutation()
    const { data, error, isLoading } = useGetAllVendorsDataQuery({
        partner_type: "vendor", page: paginationModel.page + 1, limit: paginationModel.pageSize
    })
    const { data: locationsData, error: getLocationsError, isLoading: isLocationLoading } = useGetLocationMasterQuery([])
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
     const getLocationDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
          const details = [
            location.address_1,
            location.address_2,
            location.city,
            location.state,
            location.country,
            location.pincode
          ].filter(Boolean);
    
          return details.length > 0 ? details.join(", ") : "Location details not available";
      };
    console.log("getLocationsError: ", getLocationsError)
    const vendorsData = data?.partners.length > 0 ? data?.partners : []


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
        locationOfSource: rowData.loc_of_source,
        podRelevant: rowData?.pod_relevant === 1,
        forwardingAgent: rowData?.partner_functions?.forwarding_agent || '',
        goodsSupplier: rowData?.partner_functions?.goods_supplier || '',
        orderingAddress: rowData?.partner_functions?.ordering_address || '',
    });

    const handleDelete = async (rowData: Customer) => {
        const deleteId = rowData?.partner_id;
        if (!deleteId) {
            console.error("Row ID is missing");
            setSnackbarMessage("Error: Partner ID is missing!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const confirmed = window.confirm("Are you sure you want to delete this partner?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await deleteBusinessPartner(deleteId);
            if (response.data.deleted_record) {
                setSnackbarMessage(`Supplier ID ${response.data.deleted_record} deleted successfully!`);
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error deleting partner:", error);
            setSnackbarMessage("Failed to delete partner. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    const handleEdit = async (rowData: Customer) => {
        setShowForm(true)
        setUpdateRecord(true)
        setUpdateRecordData(rowData)
        setUpdateRecordId(rowData?.partner_id)
        const updatedInitialValues = await mapRowToInitialValues(rowData);
        setFormInitialValues(updatedInitialValues);
    };


    const columns: GridColDef[] = [
        { field: 'supplier_id', headerName: 'Supplier ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        // { field: 'loc_ID', headerName: 'Supplier Location ID', width: 150 },
            {
            field: "loc_ID",
            headerName: "Supplier Location ID",
            width: 150,
            renderCell: (params) => (
              <Tooltip title={getLocationDetails(params.value)} arrow>
                <span>{params.value}</span>
              </Tooltip>
            ),
          },
        { field: 'location_pincode', headerName: 'Supplier Pincode', width: 100 },
        { field: 'location_city', headerName: 'Supplier City', width: 150 },
        { field: 'location_state', headerName: 'Supplier State', width: 150 },
        { field: 'location_country', headerName: 'Supplier Country', width: 150 },
        // { field: 'loc_of_source', headerName: 'Source Location ID', width: 150 },
            {
            field: "loc_of_source",
            headerName: "Source Location ID",
            width: 200,
            renderCell: (params) => (
              <Tooltip title={getLocationDetails(params.value)} arrow>
                <span>{params.value}</span>
              </Tooltip>
            ),
          },
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

    const rows = vendorsData.map((item: Customer) => ({
        id: item.partner_id,
        ...item,
    }));



    const supplierValidationSchema = Yup.object({
        // supplierId: Yup.string().required('Supplier ID is required'),
        name: Yup.string().required('Name is required'),
        locationId: Yup.string().required('Location ID is required'),
        pincode: Yup.string().required('Pincode is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
        contactNumber: Yup.string().required('Contact Number is required'),
        emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
        locationOfSource: Yup.string().required('Location is required'),
        orderingAddress: Yup.string().required('Ship To Party is required'),
        goodsSupplier: Yup.string().required('Sold To Party is required'),
        forwardingAgent: Yup.string().required('Bill To Party is required')
    });

    const handleSupplierSubmit = async (values: typeof initialSupplierValues) => {
        try {
            const body = {
                partners: [
                    {
                        name: values?.name,
                        partner_type: "vendor",
                        loc_ID: values?.locationId,
                        correspondence: {
                            contact_person: values?.contactPerson,
                            contact_number: values?.contactNumber,
                            email: values?.emailId
                        },
                        loc_of_source: values?.locationOfSource,
                        pod_relevant: values?.podRelevant,
                        partner_functions: {
                            ordering_address: values?.orderingAddress,
                            goods_supplier: values?.goodsSupplier,
                            forwarding_agent: values?.forwardingAgent
                        }
                    }
                ]
            }
            const editBody = {
                ...updateRecordData,
                name: values?.name,
                partner_type: "vendor",
                loc_ID: values?.locationId,
                correspondence: {
                    contact_person: values?.contactPerson,
                    contact_number: values?.contactNumber,
                    email: values?.emailId
                },
                loc_of_source: values?.locationOfSource,
                pod_relevant: values?.podRelevant,
                partner_functions: {
                    ordering_address: values?.orderingAddress,
                    goods_supplier: values?.goodsSupplier,
                    forwarding_agent: values?.forwardingAgent
                }
            }
            if (updateRecord) {
                const response = await updatePartnerDetails({ body: editBody, partnerId: updateRecordId }).unwrap();
                if (response?.updated_record) {
                    setSnackbarMessage(`Supplier ID ${response.updated_record} updated successfully!`);
                    setFormInitialValues(initialSupplierValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData({})
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                }
            } else {
                const response = await customerRegistration(body).unwrap();
                if (response?.created_records) {
                    setSnackbarMessage(`Supplier ID ${response.created_records[0]} created successfully!`);
                    setFormInitialValues(initialSupplierValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData({})
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

    const handleLocationChange = (
        event: SelectChangeEvent<string>,
        setFieldValue: FormikProps<Location>['setFieldValue']
    ) => {
        const selectedLocationId = event.target.value;
        setFieldValue('locationId', selectedLocationId);
        const selectedLocation = getAllLocations.find((loc: Location) => loc.loc_ID === (selectedLocationId));
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
        <div className={styles.formsMainContainer}>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={postVendorLoading || editVendorLoading || deleteVendorLoading}
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
                    Create Vendor
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
                </Button>
                <MassUpload arrayKey='partners' partnerType="vendor" />
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={formInitialValues}
                        validationSchema={supplierValidationSchema}
                        onSubmit={handleSupplierSubmit}
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
                                    {/* <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Location ID"
                                            name="locationId"
                                            value={values.locationId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.locationId && Boolean(errors.locationId)}
                                            helperText={touched.locationId && errors.locationId}
                                        />



                                    </Grid> */}

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
                                            label="City"
                                            name="city" disabled
                                            value={values.city}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.city && Boolean(errors.city)}
                                            helperText={touched.city && errors.city}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="District"
                                            name="district"
                                            value={values.district}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.district && Boolean(errors.district)}
                                            helperText={touched.district && errors.district}
                                        />
                                    </Grid> */}
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small' disabled
                                            label="Country"
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
                                    {/* <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Location of Source"
                                            name="locationOfSource"
                                            value={values.locationOfSource.join(', ')}
                                            onChange={(e) => setFieldValue('locationOfSource', e.target.value.split(', '))}
                                            onBlur={handleBlur}
                                            error={touched.locationOfSource && Boolean(errors.locationOfSource)}
                                            helperText={touched.locationOfSource && errors.locationOfSource}
                                        />
                                    </Grid> */}

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
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Ordering Address"
                                            name="orderingAddress"
                                            value={values.orderingAddress}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.orderingAddress && Boolean(errors.orderingAddress)}
                                            helperText={touched.orderingAddress && errors.orderingAddress}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Goods Supplier"
                                            name="goodsSupplier"
                                            value={values.goodsSupplier}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.goodsSupplier && Boolean(errors.goodsSupplier)}
                                            helperText={touched.goodsSupplier && errors.goodsSupplier}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Forwarding Agent"
                                            name="forwardingAgent"
                                            value={values.forwardingAgent}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.forwardingAgent && Boolean(errors.forwardingAgent)}
                                            helperText={touched.forwardingAgent && errors.forwardingAgent}
                                        />
                                    </Grid>
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
                                        {updateRecord ? "Update Supplier" : "Create Supplier"}
                                        </Button>

                                    <Button variant="outlined" color="secondary"
                                        onClick={() => {
                                            setFormInitialValues(initialSupplierValues)
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
                        activeEntity='vendors'
                        onPaginationModelChange={handlePaginationModelChange}
                    />
                )}
            </div>
        </div>
    );
};

export default SupplierForm;

