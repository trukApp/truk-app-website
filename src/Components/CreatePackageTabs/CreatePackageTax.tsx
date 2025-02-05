'use client';
import React from 'react';
import { Field } from 'formik';
import { Grid, TextField } from '@mui/material';

const TaxInfo = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Field name="taxInfo.senderGSTN" as={TextField} label="GSTN of the Sender" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="taxInfo.receiverGSTN" as={TextField} label="GSTN of the Receiver" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="taxInfo.carrierGSTN" as={TextField} label="GSTN of the Carrier" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field name="taxInfo.isSelfTransport" as={TextField} label="Self Transport (Yes/No)" fullWidth required />
            </Grid>
        </Grid>
    );
};

export default TaxInfo;
