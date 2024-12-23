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
        firstName: '',
        lastName: '',
        phoneNumber: '',
        idProof: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
        businessPartnerType: 'customers',
        // Customer-specific initial values
        businessName: '',
        businessType: '',
        officeLocation: '',
        district: '',
        businessId: '',
        //Driver form 
        drivingLicense: '',
        fromTime: '',
        toTime: '',
        experience: '',
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
        contactNumber: '',
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
                            <Grid item xs={12}>
                                <h2 className={styles.basicDetailsHeading}>Basic Details</h2>
                            </Grid>

                            {/* First Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.firstName && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    className={styles.textInputField}
                                />
                            </Grid>

                            {/* Last Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.lastName && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    className={styles.textInputField}
                                />
                            </Grid>

                            {/* Phone Number */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={values.phoneNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                    className={styles.textInputField}
                                />
                            </Grid>

                            {/* ID Proof */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="ID Proof"
                                    name="idProof"
                                    value={values.idProof}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.idProof && Boolean(errors.idProof)}
                                    helperText={touched.idProof && errors.idProof}
                                    className={styles.textInputField}
                                />
                            </Grid>

                            {/* Address */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.address && Boolean(errors.address)}
                                    helperText={touched.address && errors.address}
                                    className={styles.textInputField}
                                />
                            </Grid>

                            {/* Pincode */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Pincode"
                                    name="pincode"
                                    value={values.pincode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.pincode && Boolean(errors.pincode)}
                                    helperText={touched.pincode && errors.pincode}
                                    className={styles.textInputField}
                                />
                            </Grid>

                            {/* City */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.city && Boolean(errors.city)}
                                    helperText={touched.city && errors.city}
                                    className={styles.textInputField}
                                />
                            </Grid>

                            {/* State */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    name="state"
                                    value={values.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.state && Boolean(errors.state)}
                                    helperText={touched.state && errors.state}
                                    className={styles.textInputField}
                                />
                            </Grid>

                            {/* Country */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    name="country"
                                    value={values.country}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.country && Boolean(errors.country)}
                                    helperText={touched.country && errors.country}
                                    className={styles.textInputField}
                                />
                            </Grid>



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
