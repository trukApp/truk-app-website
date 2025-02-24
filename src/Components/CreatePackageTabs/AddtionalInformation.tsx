'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';
import * as Yup from 'yup';
import styles from './CreatePackage.module.css';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    // setCompletedState,
    setPackageAddtionalInfo
} from '@/store/authSlice';
import { CustomButtonFilled, CustomButtonOutlined } from '../ReusableComponents/ButtonsComponent';

export interface AdditionalInfo {
    referenceId: string;
    invoiceNumber: string;
    poNumber: string;
    salesOrderNumber: string;
    department: string;
    returnLabel: boolean;
    file: File | null;
}

interface FormValues {
    additionalInfo: AdditionalInfo;
}

interface AdditionalInformationProps {
    onNext: (values: FormValues) => void;
    onBack: () => void;
}

// Validation Schema
const validationSchema = Yup.object().shape({
    additionalInfo: Yup.object().shape({
        referenceId: Yup.string().required('Reference ID is required'),
        invoiceNumber: Yup.string().required('Invoice # is required'),
        // poNumber: Yup.string().required('PO # is required'),
        // salesOrderNumber: Yup.string().required('Sales Order # is required'),
        // department: Yup.string().required('Department is required'),
        // returnLabel: Yup.boolean(),
        // file: Yup.mixed().nullable().required('File is required'),
    }),
});

const AdditionalInformation: React.FC<AdditionalInformationProps> = ({ onNext, onBack }) => {
    const dispatch = useAppDispatch();
    const packageAddtionalInfoFromRedux = useAppSelector((state) => state.auth.packageAdditionalInfo);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const initialValues: FormValues = {
        additionalInfo: packageAddtionalInfoFromRedux ? packageAddtionalInfoFromRedux : {
            referenceId: '',
            invoiceNumber: '',
            poNumber: '',
            salesOrderNumber: '',
            department: '',
            returnLabel: false,
            file: null,
        },
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: File | null) => void) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setFieldValue('additionalInfo.file', file);
    };

    const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
        dispatch(setPackageAddtionalInfo(values.additionalInfo));
        // dispatch(setCompletedState(4));
        onNext(values);
        actions.setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
        >
            {({ touched, errors, setFieldValue }) => (
                <Form>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 3 }}>Additional Details</Typography>
                    <Grid className={styles.formsBgContainer}>
                        <Typography variant='h6' sx={{ fontWeight: 600 }}>Additional information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="additionalInfo.referenceId"
                                    label="Reference ID*"
                                    fullWidth
                                    size="small"
                                    error={touched.additionalInfo?.referenceId && Boolean(errors.additionalInfo?.referenceId)}
                                    helperText={touched.additionalInfo?.referenceId && errors.additionalInfo?.referenceId}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="additionalInfo.invoiceNumber"
                                    label="Invoice *"
                                    fullWidth
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
                                    size="small"
                                // error={touched.additionalInfo?.poNumber && Boolean(errors.additionalInfo?.poNumber)}
                                // helperText={touched.additionalInfo?.poNumber && errors.additionalInfo?.poNumber}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="additionalInfo.salesOrderNumber"
                                    label="Sales Order #"
                                    fullWidth
                                    size="small"
                                // error={touched.additionalInfo?.salesOrderNumber && Boolean(errors.additionalInfo?.salesOrderNumber)}
                                // helperText={touched.additionalInfo?.salesOrderNumber && errors.additionalInfo?.salesOrderNumber}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="additionalInfo.department"
                                    label="Department"
                                    fullWidth
                                    size="small"
                                // error={touched.additionalInfo?.department && Boolean(errors.additionalInfo?.department)}
                                // helperText={touched.additionalInfo?.department && errors.additionalInfo?.department}
                                />
                            </Grid>


                            {/* File Upload */}
                            <Grid item xs={12} md={4.8}>
                                <label>Upload File (Image/PDF)</label>
                                <Field name="additionalInfo.file">
                                    {() => (
                                        <>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                value={selectedFile ? selectedFile.name : ''}
                                                placeholder="Choose a file"
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: (
                                                        <Button
                                                            variant="contained"
                                                            component="label"
                                                            sx={{
                                                                minWidth: "auto",
                                                                padding: "6px 12px",
                                                                margin: 0, // Removes unwanted margin
                                                                height: '100%', // Makes sure button aligns with TextField height
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            Browse
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="image/*, application/pdf"
                                                                onChange={(event) => handleFileChange(event, setFieldValue)}
                                                            />
                                                        </Button>
                                                    ),
                                                }}
                                            />
                                        </>
                                    )}
                                </Field>
                            </Grid>
                            <Grid item xs={12} md={2.4} sx={{ marginTop: '20px' }}>
                                <Field name="additionalInfo.returnLabel">
                                    {({ field }: { field: { value: boolean; onChange: () => void; onBlur: () => void } }) => (
                                        <FormControlLabel
                                            control={<Checkbox {...field} checked={field.value} />}
                                            label="Return Label"
                                            labelPlacement="end"
                                        />
                                    )}
                                </Field>
                            </Grid>

                            {/* Navigation Buttons */}
                            <Grid container spacing={2} justifyContent="center" marginTop={2}>
                                <Grid item>
                                    {/* <Button variant="outlined" onClick={onBack}>
                                        Back
                                    </Button> */}
                                    <CustomButtonOutlined onClick={onBack}>Back</CustomButtonOutlined>
                                </Grid>
                                <Grid item>
                                    {/* <Button type="submit" variant="contained" color="primary">
                                        Next
                                    </Button> */}
                                    <CustomButtonFilled >Next</CustomButtonFilled>
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
