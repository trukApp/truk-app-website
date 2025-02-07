'use client';
import React from 'react';
import { Field, useFormikContext } from 'formik';
import { Grid, TextField } from '@mui/material';
import styles from './CreatePackage.module.css';

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

const BillTo = () => {
    const { touched, errors } = useFormikContext<FormValues>();

    return (
        <Grid container spacing={2} className={styles.formsBgContainer}>
            <h3 className={styles.mainHeading}>Billing Details</h3>
            <Grid container spacing={2}>
                <Grid item xs={12} md={2.4} >
                    <Field
                        name="billTo.locationId"
                        as={TextField}
                        label="Location ID"
                        fullWidth
                        size='small'
                        error={touched.billTo?.locationId && Boolean(errors.billTo?.locationId)}
                        helperText={touched.billTo?.locationId && errors.billTo?.locationId}
                    />
                </Grid>
                <Grid item xs={12} md={2.4} >
                    <Field
                        name="billTo.locationDescription"
                        as={TextField}
                        label="Location Description"
                        fullWidth
                        size='small'
                        error={touched.billTo?.locationDescription && Boolean(errors.billTo?.locationDescription)}
                        helperText={touched.billTo?.locationDescription && errors.billTo?.locationDescription}
                    />
                </Grid>
                <Grid item xs={12} md={2.4}>
                    <Field
                        name="billTo.detailedAddress"
                        as={TextField}
                        label="Detailed Address with Pincode"
                        fullWidth
                        size='small'
                        multiline
                        rows={3}
                        error={touched.billTo?.detailedAddress && Boolean(errors.billTo?.detailedAddress)}
                        helperText={touched.billTo?.detailedAddress && errors.billTo?.detailedAddress}
                    />
                </Grid>
                <Grid item xs={12} md={2.4} >
                    <Field
                        name="billTo.contactPerson"
                        as={TextField}
                        label="Contact Person"
                        fullWidth
                        size='small'
                        error={touched.billTo?.contactPerson && Boolean(errors.billTo?.contactPerson)}
                        helperText={touched.billTo?.contactPerson && errors.billTo?.contactPerson}
                    />
                </Grid>
                <Grid item xs={12} md={2.4} >
                    <Field
                        name="billTo.phoneNumber"
                        as={TextField}
                        label="Phone Number"
                        fullWidth
                        size='small'
                        error={touched.billTo?.phoneNumber && Boolean(errors.billTo?.phoneNumber)}
                        helperText={touched.billTo?.phoneNumber && errors.billTo?.phoneNumber}
                    />
                </Grid>
                <Grid item xs={12} md={2.4} >
                    <Field
                        name="billTo.email"
                        as={TextField}
                        label="Email Address"
                        fullWidth
                        size='small'
                        error={touched.billTo?.email && Boolean(errors.billTo?.email)}
                        helperText={touched.billTo?.email && errors.billTo?.email}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default BillTo;
