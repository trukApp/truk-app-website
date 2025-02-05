'use client';
import React from 'react';
import { Field } from 'formik';
import { Grid, TextField } from '@mui/material';

const ShipTo = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Field name="shipTo.locationId" as={TextField} label="Location ID" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="shipTo.locationDescription" as={TextField} label="Location Description" fullWidth required />
            </Grid>
            <Grid item xs={12}>
                <Field name="shipTo.detailedAddress" as={TextField} label="Detailed Address" fullWidth required multiline rows={3} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="shipTo.contactPerson" as={TextField} label="Contact Person" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="shipTo.phoneNumber" as={TextField} label="Phone Number" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="shipTo.email" as={TextField} label="Email Address" fullWidth required />
            </Grid>
        </Grid>
    );
};

export default ShipTo;
