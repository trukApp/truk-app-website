'use client';
import React from 'react';
import { Field } from 'formik';
import { Grid, TextField, Checkbox, FormControlLabel } from '@mui/material';

const AdditionalInformation = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Field name="additionalInfo.referenceId" as={TextField} label="Reference ID" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="additionalInfo.invoiceNumber" as={TextField} label="Invoice #" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="additionalInfo.poNumber" as={TextField} label="PO #" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="additionalInfo.salesOrderNumber" as={TextField} label="Sales Order #" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="additionalInfo.department" as={TextField} label="Department #" fullWidth required />
            </Grid>
            <Grid item xs={12}>
                <Field name="additionalInfo.returnLabel" type="checkbox" as={Checkbox} />
                <FormControlLabel
                    control={<Checkbox checked={false} />}
                    label="Return Label"
                    labelPlacement="end"
                />
            </Grid>
        </Grid>
    );
};

export default AdditionalInformation;
