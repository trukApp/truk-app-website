'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';
import * as Yup from 'yup';
import styles from './CreatePackage.module.css';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    setPackageAddtionalInfo
} from '@/store/authSlice';
import { CustomButtonFilled, CustomButtonOutlined } from '../ReusableComponents/ButtonsComponent';
import { useImageUploadingMutation } from '@/api/apiSlice';

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
        invoiceNumber: Yup.string(),
        poNumber: Yup.string(),
        salesOrderNumber: Yup.string(),
    }).test(
        "at-least-one-required",
        "At least one of Invoice #, PO #, or Sales Order # is required",
        function (values) {
            return !!(values?.invoiceNumber || values?.poNumber || values?.salesOrderNumber);
        }
    ),
});



const AdditionalInformation: React.FC<AdditionalInformationProps> = ({ onNext, onBack }) => {
    const dispatch = useAppDispatch();
    const packageAddtionalInfoFromRedux = useAppSelector((state) => state.auth.packageAdditionalInfo);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUpload] = useImageUploadingMutation()

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

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: File | null) => void) => {
    //     const file = event.target.files?.[0] || null;
    //     setSelectedFile(file);
    //     setFieldValue('additionalInfo.file', file);
    // };
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: File | string | null) => void
    ) => {
        const file = event.target.files?.[0] || null;
        console.log("File selected:", file);

        setSelectedFile(file);
        setFieldValue("additionalInfo.file", file);

        if (file) {
            try {
                const formData = new FormData();
                formData.append("image", file);
                // Log FormData keys & values to verify
                for (const [key, value] of formData.entries()) {
                    console.log("FormData entry:", key, value);
                }

                const response = await imageUpload(formData).unwrap();
                console.log("File upload response:", response);

                if (response?.imageUrl) {
                    setFieldValue("additionalInfo.file", response.imageUrl);
                }
            } catch (error) {
                console.error("File upload failed:", error);
            }
        }
    };



    const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
        const updatedAdditionalInfo = {
            ...values.additionalInfo,
            fileUrl: values.additionalInfo.file || "",
        };
        console.log("updated :", updatedAdditionalInfo)
        dispatch(setPackageAddtionalInfo(updatedAdditionalInfo));
        onNext(values);
        actions.setSubmitting(false);
    };

 

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
        >
            {({ touched, errors, setFieldValue , setFieldTouched }) => (
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
                                                                // padding: "6px 12px",
                                                                margin: 0,
                                                                height: '100%', // Makes sure button aligns with TextField height
                                                                // display: 'flex',
                                                                // alignItems: 'center',
                                                                // justifyContent: 'center',
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

                            <Grid item xs={12} sx={{textAlign:'center' ,marginTop:'15px'}}>
                                    {errors.additionalInfo && typeof errors.additionalInfo === "string" && (
                                        <Typography color="error" sx={{fontSize:'13px'}}>{errors.additionalInfo}</Typography>
                                    )}
                            </Grid>
                            {/* Navigation Buttons */}
                            <Grid container spacing={2} justifyContent="center" >
                                <Grid item>
                                    <CustomButtonOutlined onClick={onBack}>Back</CustomButtonOutlined>
                                </Grid>
                                {/* <Grid item>
                                    <CustomButtonFilled >Next</CustomButtonFilled>
                                </Grid> */}
                                <Grid item>
                                    <CustomButtonFilled
                                        onClick={() => {
                                        setFieldTouched("additionalInfo.invoiceNumber", true);
                                        setFieldTouched("additionalInfo.poNumber", true);
                                        setFieldTouched("additionalInfo.salesOrderNumber", true);
                                        }}
                                    >
                                        Next
                                    </CustomButtonFilled>
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
