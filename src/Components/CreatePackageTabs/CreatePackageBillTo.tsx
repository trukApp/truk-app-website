'use client';
import React from 'react';
import { Field } from 'formik';
import { Grid, TextField } from '@mui/material';

const BillTo = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Field name="billTo.locationId" as={TextField} label="Location ID" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="billTo.locationDescription" as={TextField} label="Location Description" fullWidth required />
            </Grid>
            <Grid item xs={12}>
                <Field name="billTo.detailedAddress" as={TextField} label="Detailed Address with Pincode" fullWidth required multiline rows={3} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="billTo.contactPerson" as={TextField} label="Contact Person" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="billTo.phoneNumber" as={TextField} label="Phone Number" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="billTo.email" as={TextField} label="Email Address" fullWidth required />
            </Grid>
        </Grid>
    );
};

export default BillTo;
