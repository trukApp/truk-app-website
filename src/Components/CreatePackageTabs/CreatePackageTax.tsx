'use client';
import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Button } from '@mui/material';
import * as Yup from 'yup';

interface TaxInfoValues {
    taxInfo: {
        senderGSTN: string;
        receiverGSTN: string;
        carrierGSTN: string;
        isSelfTransport: string;
    };
}

interface TaxInfoProps {
    onSubmit: (values: TaxInfoValues) => void;
    onBack: () => void;
}

// Initial Values
const initialValues: TaxInfoValues = {
    taxInfo: {
        senderGSTN: '',
        receiverGSTN: '',
        carrierGSTN: '',
        isSelfTransport: '',
    },
};

// Validation Schema
const validationSchema = Yup.object().shape({
    taxInfo: Yup.object().shape({
        senderGSTN: Yup.string().required('GSTN of the Sender is required'),
        receiverGSTN: Yup.string().required('GSTN of the Receiver is required'),
        carrierGSTN: Yup.string().required('GSTN of the Carrier is required'),
        isSelfTransport: Yup.string()
            .oneOf(['Yes', 'No'], 'Must be Yes or No')
            .required('Self Transport is required'),
    }),
});

// Submit Handler
const handleSubmit = (values: TaxInfoValues, actions: FormikHelpers<TaxInfoValues>, onSubmit: (values: TaxInfoValues) => void) => {
    console.log('Tax Info Submitted:', values);
    actions.setSubmitting(false);
    onSubmit(values)
};

const TaxInfo: React.FC<TaxInfoProps> = ({ onSubmit, onBack }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleSubmit(values, actions, onSubmit)}
        >
            {({ touched, errors }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                name="taxInfo.senderGSTN"
                                label="GSTN of the Sender"
                                fullWidth
                                error={touched.taxInfo?.senderGSTN && Boolean(errors.taxInfo?.senderGSTN)}
                                helperText={touched.taxInfo?.senderGSTN && errors.taxInfo?.senderGSTN}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                name="taxInfo.receiverGSTN"
                                label="GSTN of the Receiver"
                                fullWidth
                                error={touched.taxInfo?.receiverGSTN && Boolean(errors.taxInfo?.receiverGSTN)}
                                helperText={touched.taxInfo?.receiverGSTN && errors.taxInfo?.receiverGSTN}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                name="taxInfo.carrierGSTN"
                                label="GSTN of the Carrier"
                                fullWidth
                                error={touched.taxInfo?.carrierGSTN && Boolean(errors.taxInfo?.carrierGSTN)}
                                helperText={touched.taxInfo?.carrierGSTN && errors.taxInfo?.carrierGSTN}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                name="taxInfo.isSelfTransport"
                                label="Self Transport (Yes/No)"
                                fullWidth
                                error={touched.taxInfo?.isSelfTransport && Boolean(errors.taxInfo?.isSelfTransport)}
                                helperText={touched.taxInfo?.isSelfTransport && errors.taxInfo?.isSelfTransport}
                            />
                        </Grid>

                        {/* Navigation Buttons */}
                        <Grid container spacing={2} justifyContent="space-between" marginTop={2}>
                            <Grid item>
                                <Button variant="outlined" onClick={onBack}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default TaxInfo;
