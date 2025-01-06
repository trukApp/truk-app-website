import React, { useState } from 'react';
import { Box, Button, Collapse, Grid, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { DataGridComponent } from '../GridComponent';
import styles from './BusinessPartners.module.css'
import { GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCustomerRegistrationMutation, useGetAllVendorsDataQuery } from '@/api/apiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

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
}



const SupplierForm: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [customerRegistration] = useCustomerRegistrationMutation();
    const { data, error, isLoading } = useGetAllVendorsDataQuery({
        partner_type: "vendor",
    })
    console.log("all Vendors data :", data?.partners)
    const vendorsData = data?.partners.length > 0 ? data?.partners : []

    if (isLoading) {
        console.log("Loading All customers Data...");
    }

    if (error) {
        console.error("getting error while fetching the customers data:", error);
    }

    const handleEdit = (rowData: Customer) => {
        console.log('Edit clicked for:', rowData);
        // Add your edit logic here
    };

    const handleDelete = (rowData: Customer) => {
        console.log('Delete clicked for:', rowData);
        // Add your delete logic here
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
        supplier_id: item.supplier_id,
        name: item.name,
        loc_of_source: item.loc_of_source,
        loc_of_source_pincode: item.loc_of_source_pincode,
        loc_of_source_state: item.loc_of_source_state,
        loc_of_source_city: item.loc_of_source_city,
        loc_of_source_country: item.loc_of_source_country,
    }));

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
        locationOfSource: [],
        podRelevant: false,
        orderingAddress: '',
        goodsSupplier: '',
        forwardingAgent: ''
    };

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
                        location_id: values?.locationId,
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


            console.log('i am in...')
            const response = await customerRegistration(body).unwrap();
            console.log('API Response:', response);
        } catch (error) {
            console.error('API Error:', error);
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
                        initialValues={initialSupplierValues}
                        validationSchema={supplierValidationSchema}
                        onSubmit={handleSupplierSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
                            <Form>
                                <h3 className={styles.mainHeading}>General Data</h3>
                                <Grid container spacing={2}>
                                    {/* <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Supplier ID"
                                            name="supplierId"
                                            value={values.supplierId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.supplierId && Boolean(errors.supplierId)}
                                            helperText={touched.supplierId && errors.supplierId}
                                        />
                                    </Grid> */}
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
                                    <Grid item xs={12} sm={6} md={2.4}>
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
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </Box>
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
