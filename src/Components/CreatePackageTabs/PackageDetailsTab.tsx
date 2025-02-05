'use client';
import React from 'react';
import { Field } from 'formik';
import { Grid, TextField } from '@mui/material';

const PackageDetails = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Field name="packageDetails.productId" as={TextField} label="Product ID" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="packageDetails.productName" as={TextField} label="Product Name" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="packageDetails.hsnCode" as={TextField} label="HSN Code" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="packageDetails.rfid" as={TextField} label="RFID #" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="packageDetails.dimensions" as={TextField} label="Product Dimensions" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="packageDetails.quantity" as={TextField} label="Quantity" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="packageDetails.weight" as={TextField} label="Weight (tons/Kgs)" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="packageDetails.packagingType" as={TextField} label="Packaging Type" fullWidth required />
            </Grid>
        </Grid>
    );
};

export default PackageDetails;
