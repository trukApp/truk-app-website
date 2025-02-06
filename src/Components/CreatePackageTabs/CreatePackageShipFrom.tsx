'use client';
import React from 'react';
import { Field, useFormikContext } from 'formik';
import { Grid, TextField } from '@mui/material';
import styles from './CreatePackage.module.css';

// Define the TypeScript interface for your form values
interface ShipFrom {
    locationId: string;
    locationDescription: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

interface FormValues {
    shipFrom: ShipFrom;
}

const ShipFrom = () => {
    const { touched, errors } = useFormikContext<FormValues>(); // Use the form values type

    return (
        <Grid container spacing={2} className={styles.formsBgContainer}>
            <h3 className={styles.mainHeading}>Location Details</h3>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.locationId"
                        as={TextField}
                        label="Location ID"
                        fullWidth
                        required
                        error={touched.shipFrom?.locationId && Boolean(errors.shipFrom?.locationId)}
                        helperText={touched.shipFrom?.locationId && errors.shipFrom?.locationId}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.locationDescription"
                        as={TextField}
                        label="Location Description"
                        fullWidth
                        required
                        error={touched.shipFrom?.locationDescription && Boolean(errors.shipFrom?.locationDescription)}
                        helperText={touched.shipFrom?.locationDescription && errors.shipFrom?.locationDescription}
                    />
                </Grid>
            </Grid>

            <h3 className={styles.mainHeading}>Contact Information</h3>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.contactPerson"
                        as={TextField}
                        label="Contact Person"
                        fullWidth
                        required
                        error={touched.shipFrom?.contactPerson && Boolean(errors.shipFrom?.contactPerson)}
                        helperText={touched.shipFrom?.contactPerson && errors.shipFrom?.contactPerson}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.phoneNumber"
                        as={TextField}
                        label="Phone Number"
                        fullWidth
                        required
                        error={touched.shipFrom?.phoneNumber && Boolean(errors.shipFrom?.phoneNumber)}
                        helperText={touched.shipFrom?.phoneNumber && errors.shipFrom?.phoneNumber}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.email"
                        as={TextField}
                        label="Email Address"
                        fullWidth
                        required
                        error={touched.shipFrom?.email && Boolean(errors.shipFrom?.email)}
                        helperText={touched.shipFrom?.email && errors.shipFrom?.email}
                    />
                </Grid>
            </Grid>

            <h3 className={styles.mainHeading}>Address Information</h3>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.addressLine1"
                        as={TextField}
                        label="Address Line 1"
                        fullWidth
                        required
                        error={touched.shipFrom?.addressLine1 && Boolean(errors.shipFrom?.addressLine1)}
                        helperText={touched.shipFrom?.addressLine1 && errors.shipFrom?.addressLine1}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.addressLine2"
                        as={TextField}
                        label="Address Line 2"
                        fullWidth
                        required
                        error={touched.shipFrom?.addressLine2 && Boolean(errors.shipFrom?.addressLine2)}
                        helperText={touched.shipFrom?.addressLine2 && errors.shipFrom?.addressLine2}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.city"
                        as={TextField}
                        label="City"
                        fullWidth
                        required
                        error={touched.shipFrom?.city && Boolean(errors.shipFrom?.city)}
                        helperText={touched.shipFrom?.city && errors.shipFrom?.city}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.state"
                        as={TextField}
                        label="State"
                        fullWidth
                        required
                        error={touched.shipFrom?.state && Boolean(errors.shipFrom?.state)}
                        helperText={touched.shipFrom?.state && errors.shipFrom?.state}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.country"
                        as={TextField}
                        label="Country"
                        fullWidth
                        required
                        error={touched.shipFrom?.country && Boolean(errors.shipFrom?.country)}
                        helperText={touched.shipFrom?.country && errors.shipFrom?.country}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        name="shipFrom.pincode"
                        as={TextField}
                        label="Pincode"
                        fullWidth
                        required
                        error={touched.shipFrom?.pincode && Boolean(errors.shipFrom?.pincode)}
                        helperText={touched.shipFrom?.pincode && errors.shipFrom?.pincode}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ShipFrom;
