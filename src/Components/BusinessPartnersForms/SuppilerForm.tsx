import React, { useState } from 'react';
import { Box, Button, Collapse, Grid, TextField, FormControlLabel, Checkbox, FormControl, InputLabel, MenuItem, Select, FormHelperText, SelectChangeEvent } from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { DataGridComponent } from '../GridComponent';
import styles from './BusinessPartners.module.css'
import { GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCustomerRegistrationMutation, useDeleteBusinessPartnerMutation, useEditBusinessPartnerMutation, useGetAllVendorsDataQuery, useGetLocationMasterQuery } from '@/api/apiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

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
interface Customer {
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

interface Location {
    city: string;
    country: string;
    gln_code: string;
    iata_code: string;
    latitude: string;
    loc_ID: string;
    loc_desc: string;
    loc_type: string;
    longitude: string;
    pincode: string;
    state: string;
    time_zone: string;
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
    locationOfSource: [] as string[],
    podRelevant: false,
    orderingAddress: '',
    goodsSupplier: '',
    forwardingAgent: ''
};


const SupplierForm: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [updateRecord, setUpdateRecord] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState(initialSupplierValues);
    const [updateRecordData, setUpdateRecordData] = useState({});
    const [updateRecordId, setUpdateRecordId] = useState(0)
    const [updatePartnerDetails] = useEditBusinessPartnerMutation();
    const [customerRegistration] = useCustomerRegistrationMutation();
    const [deleteBusinessPartner] = useDeleteBusinessPartnerMutation()
    const { data, error, isLoading } = useGetAllVendorsDataQuery({
        partner_type: "vendor",
    })
    const { data: locationsData, error: getLocationsError } = useGetLocationMasterQuery([])
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    console.log("all locations :", locationsData?.locations)
    console.log("getLocationsError: ", getLocationsError)
    console.log("all Vendors data :", data?.partners)
    const vendorsData = data?.partners.length > 0 ? data?.partners : []

    if (isLoading) {
        console.log("Loading All customers Data...");
    }

    if (error) {
        console.error("getting error while fetching the customers data:", error);
    }

    const mapRowToInitialValues = (rowData: Customer) => ({
        name: rowData.name || '',
        locationId: rowData.loc_of_source || '',
        pincode: rowData.loc_of_source_pincode || '',
        state: rowData.loc_of_source_state || '',
        city: rowData.loc_of_source_city || '',
        district: '',
        country: rowData.loc_of_source_country || '',
        contactPerson: rowData?.correspondence?.contact_person || '',
        contactNumber: rowData?.correspondence?.contact_number || '',
        emailId: rowData?.correspondence?.email || '',
        locationOfSource: [rowData.loc_of_source],
        podRelevant: false,
        forwardingAgent: rowData?.partner_functions?.forwarding_agent || '',
        goodsSupplier: rowData?.partner_functions?.goods_supplier || '',
        orderingAddress: rowData?.partner_functions?.ordering_address || '',
    });

    const handleDelete = async (rowData: Customer) => {
        console.log('Delete clicked for:', rowData);
        const deleteId = rowData?.partner_id
        const response = await deleteBusinessPartner(deleteId)
        console.log("delete response :", response)
    };;

    const handleEdit = async (rowData: Customer) => {
        console.log('Edit clicked for:', rowData);
        setShowForm(true)
        setUpdateRecord(true)
        setUpdateRecordData(rowData)
        setUpdateRecordId(rowData?.partner_id)
        const updatedInitialValues = await mapRowToInitialValues(rowData);
        console.log('Updated Initial Values:', updatedInitialValues);

        setFormInitialValues(updatedInitialValues);
    };


    const columns: GridColDef[] = [
        { field: 'supplier_id', headerName: 'Customer ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'loc_of_source', headerName: 'Location ID', width: 150 },
        { field: 'loc_of_source_pincode', headerName: 'Pincode', width: 100 },
        { field: 'loc_of_source_state', headerName: 'State', width: 150 },
        { field: 'loc_of_source_city', headerName: 'City', width: 150 },
        { field: 'loc_of_source_country', headerName: 'Country', width: 150 },
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

    const mappedData = vendorsData.map((item: Customer) => ({
        id: item.partner_id,
        ...item,
    }));



    const supplierValidationSchema = Yup.object({
        // supplierId: Yup.string().required('Supplier ID is required'),
        name: Yup.string().required('Name is required'),
        locationId: Yup.string().required('Location ID is required'),
        pincode: Yup.string().required('Pincode is required'),
        city: Yup.string().required('City is required'),
        district: Yup.string().required('District is required'),
        country: Yup.string().required('Country is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
        contactNumber: Yup.string().required('Contact Number is required'),
        emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
        locationOfSource: Yup.array().min(1, 'At least one location is required'),
        orderingAddress: Yup.string().required('Ship To Party is required'),
        goodsSupplier: Yup.string().required('Sold To Party is required'),
        forwardingAgent: Yup.string().required('Bill To Party is required')
    });

    const handleSupplierSubmit = async (values: typeof initialSupplierValues) => {
        try {
            console.log('Vendor Form Submitted:', values);
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
            console.log("body: ", body)
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
                console.log("I am going update the record")
                const response = await updatePartnerDetails({ body: editBody, partnerId: updateRecordId }).unwrap();
                console.log('API Response:', response);
                if (response) {
                    setFormInitialValues(initialSupplierValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData({})
                }
            } else {
                console.log("I am going create the record")
                const response = await customerRegistration(body).unwrap();
                console.log('API Response:', response);
                if (response) {
                    setFormInitialValues(initialSupplierValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData({})
                }
            }
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    const handleLocationChange = (
        event: SelectChangeEvent<string>,
        setFieldValue: FormikProps<Location>['setFieldValue']
    ) => {
        const selectedLocationId = event.target.value;
        setFieldValue('locationId', selectedLocationId);
        const selectedLocation = getAllLocations.find((loc: Location) => loc.loc_ID === (selectedLocationId));
        console.log(selectedLocationId)
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
        <div className={styles.formsMainContainer}>

            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                    variant="contained"
                    onClick={() => setShowForm((prev) => !prev)}
                    className={styles.createButton}
                >
                    Create Vendor
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
                </Button>
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
                                                {getAllLocations.map((location: Location) => {
                                                    return (
                                                        <MenuItem key={location?.loc_ID} value={location?.loc_ID}>
                                                            {location.loc_ID}
                                                        </MenuItem>
                                                    );
                                                })}
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
                                            name="pincode"
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
                                            label="District"
                                            name="district"
                                            value={values.district}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.district && Boolean(errors.district)}
                                            helperText={touched.district && errors.district}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
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
                                                {getAllLocations.map((location: Location) => (
                                                    <MenuItem key={location.loc_ID} value={location.loc_ID}>
                                                        {location.loc_ID}
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
                                {updateRecord ? (

                                    <Box marginTop={3} textAlign="center">
                                        <Button type="submit" variant="contained" color="primary">
                                            Update
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box marginTop={3} textAlign="center">
                                        <Button type="submit" variant="contained" color="primary">
                                            Create
                                        </Button>
                                    </Box>
                                )}
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Collapse>

            <Grid item xs={12} style={{ marginTop: '50px' }}>
                <DataGridComponent
                    columns={columns}
                    rows={mappedData}
                    isLoading={false}
                    pageSizeOptions={[10, 20]}
                    initialPageSize={10}
                />
            </Grid>
        </div>
    );
};

export default SupplierForm;

