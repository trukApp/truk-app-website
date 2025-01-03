import React, { useState } from 'react';
import { Box, Button, Collapse, Grid, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { DataGridComponent } from '../GridComponent';
import styles from './BusinessPartners.module.css'
import { GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCustomerRegistrationMutation } from '@/api/apiSlice';

const dummyVendors = [
    {
        id: 1,
        supplierId: 'SUP001',
        name: 'ABC Supplies Co.',
        locationId: 'LOC123',
        pincode: '110001',
        city: 'New Delhi',
        district: 'Central Delhi',
        country: 'India',
        contactPerson: 'Rajesh Sharma',
        contactNumber: '9876543210',
        emailId: 'rajesh@abcsupplies.com',
        locationOfSource: ['Delhi', 'Mumbai'],
        podRelevant: true,
        orderingAddress: '123, Connaught Place, New Delhi',
        goodsSupplier: 'Electronics',
        forwardingAgent: 'Fast Logistics'
    },
    {
        id: 2,
        supplierId: 'SUP002',
        name: 'Global Trade Ltd.',
        locationId: 'LOC456',
        pincode: '400001',
        city: 'Mumbai',
        district: 'South Mumbai',
        country: 'India',
        contactPerson: 'Priya Mehta',
        contactNumber: '9988776655',
        emailId: 'priya@globaltrade.com',
        locationOfSource: ['Mumbai', 'Chennai'],
        podRelevant: false,
        orderingAddress: '45, Nariman Point, Mumbai',
        goodsSupplier: 'Textiles',
        forwardingAgent: 'Swift Transport'
    },
    {
        id: 3,
        supplierId: 'SUP003',
        name: 'TechMart Solutions',
        locationId: 'LOC789',
        pincode: '560001',
        city: 'Bangalore',
        district: 'Bangalore Urban',
        country: 'India',
        contactPerson: 'Ankit Verma',
        contactNumber: '9123456789',
        emailId: 'ankit@techmart.com',
        locationOfSource: ['Bangalore', 'Hyderabad'],
        podRelevant: true,
        orderingAddress: '12, MG Road, Bangalore',
        goodsSupplier: 'IT Hardware',
        forwardingAgent: 'Reliable Logistics'
    },
    {
        id: 4,
        supplierId: 'SUP004',
        name: 'EcoGoods Traders',
        locationId: 'LOC321',
        pincode: '700001',
        city: 'Kolkata',
        district: 'Kolkata',
        country: 'India',
        contactPerson: 'Suman Banerjee',
        contactNumber: '9876543100',
        emailId: 'suman@ecogoods.com',
        locationOfSource: ['Kolkata', 'Guwahati'],
        podRelevant: false,
        orderingAddress: '76, Park Street, Kolkata',
        goodsSupplier: 'Organic Products',
        forwardingAgent: 'Green Transport'
    },
    {
        id: 5,
        supplierId: 'SUP005',
        name: 'Mega Builders Pvt. Ltd.',
        locationId: 'LOC654',
        pincode: '122001',
        city: 'Gurgaon',
        district: 'Gurgaon',
        country: 'India',
        contactPerson: 'Arjun Singh',
        contactNumber: '9012345678',
        emailId: 'arjun@megabuilders.com',
        locationOfSource: ['Delhi NCR', 'Lucknow'],
        podRelevant: true,
        orderingAddress: '45, Cyber City, Gurgaon',
        goodsSupplier: 'Construction Materials',
        forwardingAgent: 'BuildFast Couriers'
    }
];

const columns: GridColDef[] = [
    { field: 'supplierId', headerName: 'Supplier ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'locationId', headerName: 'Location ID', width: 150 },
    { field: 'pincode', headerName: 'Pincode', width: 100 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'district', headerName: 'District', width: 150 },
    { field: 'country', headerName: 'Country', width: 150 },
    { field: 'contactPerson', headerName: 'Contact Person', width: 200 },
    { field: 'contactNumber', headerName: 'Contact Number', width: 150 },
    { field: 'emailId', headerName: 'Email ID', width: 200 },
    { field: 'locationOfSource', headerName: 'Location of Source', width: 250 },
    { field: 'podRelevant', headerName: 'POD Relevant', width: 150 },
    { field: 'orderingAddress', headerName: 'Ordering Address', width: 250 },
    { field: 'goodsSupplier', headerName: 'Goods Supplier', width: 200 },
    { field: 'forwardingAgent', headerName: 'Forwarding Agent', width: 200 }
];


const SupplierForm: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [customerRegistration] = useCustomerRegistrationMutation();

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
                    rows={dummyVendors}
                    isLoading={false}
                    pageSizeOptions={[10, 20]}
                    initialPageSize={10}
                />
            </Grid>
        </div>
    );
};

export default SupplierForm;
