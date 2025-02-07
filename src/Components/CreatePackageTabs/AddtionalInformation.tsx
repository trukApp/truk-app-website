'use client';
import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import * as Yup from 'yup';
import styles from './CreatePackage.module.css';

interface AdditionalInfo {
    referenceId: string;
    invoiceNumber: string;
    poNumber: string;
    salesOrderNumber: string;
    department: string;
    returnLabel: boolean;
}

interface FormValues {
    additionalInfo: AdditionalInfo;
}

interface AdditionalInformationProps {
    onNext: (values: FormValues) => void;
    onBack: () => void;
}

// Initial Values
const initialValues: FormValues = {
    additionalInfo: {
        referenceId: '',
        invoiceNumber: '',
        poNumber: '',
        salesOrderNumber: '',
        department: '',
        returnLabel: false,
    },
};

// Validation Schema
const validationSchema = Yup.object().shape({
    additionalInfo: Yup.object().shape({
        referenceId: Yup.string().required('Reference ID is required'),
        invoiceNumber: Yup.string().required('Invoice # is required'),
        poNumber: Yup.string().required('PO # is required'),
        salesOrderNumber: Yup.string().required('Sales Order # is required'),
        department: Yup.string().required('Department is required'),
        returnLabel: Yup.boolean(),
    }),
});

// Submit Handler
const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>, onNext: (values: FormValues) => void) => {
    console.log('Form Submitted:', values);
    onNext(values);
    actions.setSubmitting(false);
};

const AdditionalInformation: React.FC<AdditionalInformationProps> = ({ onNext, onBack }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleFormSubmit(values, actions, onNext)}
        >
            {({ touched, errors}) => (
                <Form>
                    <Grid>
                        <h3 className={styles.mainHeading}>Additional Information</h3>
                            <Grid container spacing={2} className={styles.formsBgContainer}>
                        <Grid item xs={12} md={2.4}>
                            <Field
                                as={TextField}
                                name="additionalInfo.referenceId"
                                label="Reference ID"
                                fullWidth
                                required
                                size="small"
                                error={touched.additionalInfo?.referenceId && Boolean(errors.additionalInfo?.referenceId)}
                                helperText={touched.additionalInfo?.referenceId && errors.additionalInfo?.referenceId}
                            />
                        </Grid>

                        <Grid item xs={12} md={2.4}>
                            <Field
                                as={TextField}
                                name="additionalInfo.invoiceNumber"
                                label="Invoice #"
                                fullWidth
                                required
                                size="small"
                                error={touched.additionalInfo?.invoiceNumber && Boolean(errors.additionalInfo?.invoiceNumber)}
                                helperText={touched.additionalInfo?.invoiceNumber && errors.additionalInfo?.invoiceNumber}
                            />
                        </Grid>

                        <Grid item xs={12} md={2.4}>
                            <Field
                                as={TextField}
                                name="additionalInfo.poNumber"
                                label="PO #"
                                fullWidth
                                required
                                size="small"
                                error={touched.additionalInfo?.poNumber && Boolean(errors.additionalInfo?.poNumber)}
                                helperText={touched.additionalInfo?.poNumber && errors.additionalInfo?.poNumber}
                            />
                        </Grid>

                        <Grid item xs={12} md={2.4}>
                            <Field
                                as={TextField}
                                name="additionalInfo.salesOrderNumber"
                                label="Sales Order #"
                                fullWidth
                                required
                                size="small"
                                error={touched.additionalInfo?.salesOrderNumber && Boolean(errors.additionalInfo?.salesOrderNumber)}
                                helperText={touched.additionalInfo?.salesOrderNumber && errors.additionalInfo?.salesOrderNumber}
                            />
                        </Grid>

                        <Grid item xs={12} md={2.4}>
                            <Field
                                as={TextField}
                                name="additionalInfo.department"
                                label="Department"
                                fullWidth
                                required
                                size="small"
                                error={touched.additionalInfo?.department && Boolean(errors.additionalInfo?.department)}
                                helperText={touched.additionalInfo?.department && errors.additionalInfo?.department}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Field name="additionalInfo.returnLabel">
                                        {({ field }: { field: any }) => (
                                            <Checkbox {...field} checked={field.value} />
                                        )}
                                    </Field>
                                }
                                label="Return Label"
                                labelPlacement="end"
                            />
                        </Grid>

                        {/* Navigation Buttons */}
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

export default AdditionalInformation;
