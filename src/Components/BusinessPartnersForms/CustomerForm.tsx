import React, { useState } from 'react';
import { TextField, Grid, Button, Collapse, Box, FormControlLabel, Checkbox } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import { GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCustomerRegistrationMutation, useGetAllCustomersDataQuery } from '@/api/apiSlice';
import { withAuthComponent } from '../WithAuthComponent';

// Validation schema for CustomerForm
const customerValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    locationId: Yup.string().required('Location ID is required'),
    pincode: Yup.string()
        .matches(/^\d{6}$/, 'Pincode must be 6 digits')
        .required('Pincode is required'),
    city: Yup.string().required('City is required'),
    district: Yup.string().required('District is required'),
    country: Yup.string().required('Country is required'),
});

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
    locationOfSource: [],
    podRelevant: false,
    shipToParty: '',
    soldToParty: '',
    billToParty: '',
};


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


const columns: GridColDef[] = [
    { field: 'customer_id', headerName: 'Customer ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'loc_of_source', headerName: 'Location ID', width: 150 },
    { field: 'loc_of_source_pincode', headerName: 'Pincode', width: 100 },
    { field: 'loc_of_source_state', headerName: 'State', width: 150 },
    { field: 'loc_of_source_city', headerName: 'City', width: 150 },
    { field: 'loc_of_source_country', headerName: 'Country', width: 150 },
];

const CustomerForm: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [customerRegistration] = useCustomerRegistrationMutation();
    const { data, error, isLoading } = useGetAllCustomersDataQuery({
        partner_type: "customer",
    })
    console.log("all customers data :", data?.partners)
    const customersData = data?.partners.length > 0 ? data?.partners : []

    if (isLoading) {
        console.log("Loading All customers Data...");
    }

    if (error) {
        console.error("getting error while fetching the customers data:", error);
    }
    console.log("customersData", customersData)
    const mappedData = customersData.map((item: Customer) => ({
        id: item.partner_id,
        customer_id: item.customer_id,
        name: item.name,
        loc_of_source: item.loc_of_source,
        loc_of_source_pincode: item.loc_of_source_pincode,
        loc_of_source_state: item.loc_of_source_state,
        loc_of_source_city: item.loc_of_source_city,
        loc_of_source_country: item.loc_of_source_country,
    }));

    const handleCustomerSubmit = async (values: typeof initialCustomerValues) => {
        try {
            console.log('Customer Form Submitted:', values);
            const body = {
                partners: [
                    {
                        name: values?.name,
                        partner_type: "customer",
                        location_id: values?.locationId,
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
            console.log("body: ", body)


            console.log('i am in...')
            const response = await customerRegistration(body).unwrap();
            console.log('API Response:', response);
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    return (
        <Grid >
            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                    variant="contained"
                    onClick={() => setShowForm((prev) => !prev)}
                    className={styles.createButton}
                >
                    Create Customer
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 8 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />}
                </Button>
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={initialCustomerValues}
                        validationSchema={customerValidationSchema}
                        onSubmit={handleCustomerSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
                            <Form>
                                <h3 className={styles.mainHeading}>General Data</h3>
                                <Grid container spacing={2}>
                                    {/* <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Customer ID"
                                            name="customerId"
                                            value={values.customerId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.customerId && Boolean(errors.customerId)}
                                            helperText={touched.customerId && errors.customerId}
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
                                            label="State"
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
                                            label="Ship To Party"
                                            name="shipToParty"
                                            value={values.shipToParty}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.shipToParty && Boolean(errors.shipToParty)}
                                            helperText={touched.shipToParty && errors.shipToParty}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Sold To Party"
                                            name="soldToParty"
                                            value={values.soldToParty}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.soldToParty && Boolean(errors.soldToParty)}
                                            helperText={touched.soldToParty && errors.soldToParty}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Bill To Party"
                                            name="billToParty"
                                            value={values.billToParty}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.billToParty && Boolean(errors.billToParty)}
                                            helperText={touched.billToParty && errors.billToParty}
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
        </Grid>
    );
};

export default withAuthComponent(CustomerForm);
