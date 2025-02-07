'use client';
import React from 'react';
import { Field, Formik, Form, FormikHelpers } from 'formik';
import { Grid, TextField, Button } from '@mui/material';
import * as Yup from 'yup';
import styles from './CreatePackage.module.css';

interface PackageBillToTab {
	onNext: (values: FormValues) => void;
	onBack: () => void;
}

interface BillTo {
    locationId: string;
    locationDescription: string;
    detailedAddress: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
}

interface FormValues {
    billTo: BillTo;
}

// Initial Values
const initialValues: FormValues = {
    billTo: {
        locationId: '',
        locationDescription: '',
        detailedAddress: '',
        contactPerson: '',
        phoneNumber: '',
        email: '',
    },
};

// Validation Schema
const validationSchema = Yup.object().shape({
    billTo: Yup.object().shape({
        locationId: Yup.string().required('Location ID is required'),
        locationDescription: Yup.string().required('Location Description is required'),
        detailedAddress: Yup.string().required('Detailed Address is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Phone Number must be numeric')
            .min(10, 'Phone Number must be at least 10 digits')
            .required('Phone Number is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
    }),
});

// Submit Handler
const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>, onNext: (values: FormValues) => void) => {
    console.log('Form Submitted:', values);
    onNext(values);
};

const BillTo: React.FC<PackageBillToTab> = ({ onNext, onBack })=> {
    return (
        <Formik initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleFormSubmit(values, actions, onNext)}>
            {({ touched, errors }) => (
                <Form >
                    <Grid container spacing={2} className={styles.formsBgContainer}>
                        <h3 className={styles.mainHeading}>Billing Details</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="billTo.locationId"
                                    label="Location ID"
                                    fullWidth
                                    size="small"
                                    error={touched.billTo?.locationId && Boolean(errors.billTo?.locationId)}
                                    helperText={touched.billTo?.locationId && errors.billTo?.locationId}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="billTo.locationDescription"
                                    label="Location Description"
                                    fullWidth
                                    size="small"
                                    error={touched.billTo?.locationDescription && Boolean(errors.billTo?.locationDescription)}
                                    helperText={touched.billTo?.locationDescription && errors.billTo?.locationDescription}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="billTo.detailedAddress"
                                    label="Detailed Address with Pincode"
                                    fullWidth
                                    size="small"
                                    error={touched.billTo?.detailedAddress && Boolean(errors.billTo?.detailedAddress)}
                                    helperText={touched.billTo?.detailedAddress && errors.billTo?.detailedAddress}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="billTo.contactPerson"
                                    label="Contact Person"
                                    fullWidth
                                    size="small"
                                    error={touched.billTo?.contactPerson && Boolean(errors.billTo?.contactPerson)}
                                    helperText={touched.billTo?.contactPerson && errors.billTo?.contactPerson}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="billTo.phoneNumber"
                                    label="Phone Number"
                                    fullWidth
                                    size="small"
                                    error={touched.billTo?.phoneNumber && Boolean(errors.billTo?.phoneNumber)}
                                    helperText={touched.billTo?.phoneNumber && errors.billTo?.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="billTo.email"
                                    label="Email Address"
                                    fullWidth
                                    size="small"
                                    error={touched.billTo?.email && Boolean(errors.billTo?.email)}
                                    helperText={touched.billTo?.email && errors.billTo?.email}
                                />
                            </Grid>
                        </Grid>

                        {/* Submit Button */}
                            <Grid
                                container
                                spacing={2}
                                justifyContent="space-between"
                                marginTop={2}
                            >
                        <Grid container spacing={2} justifyContent="space-between" marginTop={2}>
                            <Grid item>
                                <Button variant="outlined" onClick={onBack}  >
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary" 
                                >
                                    Next
                                </Button>
                            </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default BillTo;
