'use client';
import React from 'react';
import {
    TextField,
    MenuItem,
    Button,
    Box,
    Grid,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomerForm from '@/Components/BusinessPartnersForms/CustomerForm';
import DriverForm from '@/Components/BusinessPartnersForms/DriverForm';
import SuppilerForm from '@/Components/BusinessPartnersForms/SuppilerForm';
import CarriersForm from '@/Components/BusinessPartnersForms/CarriersForm';
import AgentForm from '@/Components/BusinessPartnersForms/AgentForm';
import styles from './businessPartners.module.css'

// Validation schema using Yup
const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    phoneNumber: Yup.string()
        .matches(/^\d{10}$/, 'Phone Number must be 10 digits')
        .required('Phone Number is required'),
    idProof: Yup.string().required('ID Proof is required'),
    address: Yup.string().required('Address is required'),
    pincode: Yup.string()
        .matches(/^\d{6}$/, 'Pincode must be 6 digits')
        .required('Pincode is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    businessPartnerType: Yup.string().required('Business Partner Type is required'),
    // Customer-specific validation
    businessName: Yup.string().required('Business Name is required'),
    businessType: Yup.string().required('Business Type is required'),
    officeLocation: Yup.string().required('Office Location is required'),
    district: Yup.string().required('District is required'),
    businessId: Yup.string().required('Business ID is required'),
    drivingLicense: Yup.string().required('Driving License is required'),
    fromTime: Yup.string().required('From Time is required'),
    toTime: Yup.string().required('To Time is required'),
    experience: Yup.string().required('Experience ID is required'),
});

const BusinessPartnersPage: React.FC = () => {
    const initialValues = {
        businessPartnerType: 'customers',
        // Customer-specific initial values
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

        locationOfSource: [],
        podRelevant: false,

        shipToParty: '',
        soldToParty: '',
        billToParty: '',
        //Driver form 
        driverID: '',
        driverName: '',
        locationID: '',
        address: '',
        drivingLicense: '',
        expiryDate: '',
        driverContactNumber: '',
        emailID: '',
        vehicleTypes: [],
        loggedIntoApp: true,
        //Suppiler Form
        transporterId: '',
        vehicleType: '',
        capacity: '',
        operatingRoutes: '',
        //Carrier Form
        carrierName: '',
        carrierVehicleType: '',
        vehicleNumber: '',
        carrierCapacity: '',
        operatingRegions: '',
        //Agents Form 
        agencyName: '',
        agencyId: '',
        serviceArea: '',
        modeOfTransport: '',
        agentcontactNumber: '',
    };

    const handleSubmit = (values: typeof initialValues) => {
        console.log('Form Data:', values);
    };

    return (
        <Box>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, handleBlur, errors, touched }) => (
                    <Form>
                        <Grid container spacing={2}>
                            {/* Business Partner Type Dropdown */}
                            <div className={styles.dropDownContainer}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Business Partner Type"
                                        name="businessPartnerType"
                                        value={values.businessPartnerType}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.businessPartnerType && Boolean(errors.businessPartnerType)}
                                        helperText={touched.businessPartnerType && errors.businessPartnerType}

                                    >
                                        <MenuItem value="customers">Customers</MenuItem>
                                        <MenuItem value="suppliers">Suppliers</MenuItem>
                                        <MenuItem value="carriers">Carriers</MenuItem>
                                        <MenuItem value="agents">Agents</MenuItem>
                                        <MenuItem value="drivers">Drivers</MenuItem>
                                    </TextField>
                                </Grid>
                            </div>
                        </Grid>

                        {values.businessPartnerType === 'customers' && <CustomerForm />}
                        {values.businessPartnerType === 'suppliers' && <SuppilerForm />}
                        {values.businessPartnerType === 'carriers' && <CarriersForm />}
                        {values.businessPartnerType === 'agents' && <AgentForm />}
                        {values.businessPartnerType === 'drivers' && <DriverForm />}

                        <Grid className={styles.submitButtonContainer}>
                            <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
                                Submit
                            </Button>
                        </Grid>

                    </Form>

                )}
            </Formik>
        </Box>
    );
};

export default BusinessPartnersPage;
