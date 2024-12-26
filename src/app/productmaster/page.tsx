'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Grid, TextField, Checkbox, FormControlLabel, Typography } from '@mui/material';
import style from './productmaster.module.css'

const ProductMasterPage = () => {
    const initialValues = {
        productId: '',
        productDescription: '',
        basicUoM: '',
        salesUoM: '',
        weightUoM: '',
        volumeUoM: '',
        shelfLife: '',
        expirationDate: '',
        bestBeforeDate: '',
        stackingFactor: '',
        documents: null,
        locationIds: '',
        packagingType: '',
        generatePackagingLabel: false,
        specialInstructions: '',
        fragileGoods: false,
        dangerousGoods: false,
        hazardousStorage: false,
    };

    const validationSchema = Yup.object({
        // productId: Yup.string().required('Product ID is required'),
        // productDescription: Yup.string().required('Product Description is required'),
        // basicUoM: Yup.string().required('Basic Unit of Measure is required'),
        // salesUoM: Yup.string().required('Sales Unit of Measure is required'),
        // weightUoM: Yup.string().required('Weight UoM is required'),
        // volumeUoM: Yup.string().required('Volume UoM is required'),
        // shelfLife: Yup.number().positive('Shelf Life must be a positive number'),
        // expirationDate: Yup.date().required('Expiration Date is required'),
        // bestBeforeDate: Yup.date().required('Best Before Date is required'),
        // stackingFactor: Yup.number()
        //     .min(0, 'Stacking Factor must be 0 or greater')
        //     .required('Stacking Factor is required'),
        // locationIds: Yup.string().required('Location IDs are required'),
        // packagingType: Yup.string().required('Packaging Type is required'),
    });

    const handleSubmit = (values: typeof initialValues) => {
        console.log('Form Submitted', values);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ }) => (
                    <Form>
                        <Grid container spacing={2}>
                            {/* Basic Data */}
                            <Grid item xs={12}>
                                <Typography variant="h6" className={style.basicDetailsHeading}>Basic Data</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="productId"
                                    as={TextField}
                                    label="Product ID*"
                                    fullWidth
                                    helperText={<ErrorMessage name="productId" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="productDescription"
                                    as={TextField}
                                    label="Product Description*"
                                    fullWidth
                                    helperText={<ErrorMessage name="productDescription" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="basicUoM"
                                    as={TextField}
                                    label="Basic Unit of Measure*"
                                    fullWidth
                                    helperText={<ErrorMessage name="basicUoM" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="salesUoM"
                                    as={TextField}
                                    label="Sales Unit of Measure*"
                                    fullWidth
                                    helperText={<ErrorMessage name="salesUoM" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="weightUoM"
                                    as={TextField}
                                    label="Weight - UoM"
                                    fullWidth
                                    helperText={<ErrorMessage name="weightUoM" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="volumeUoM"
                                    as={TextField}
                                    label="Volume - UoM"
                                    fullWidth
                                    helperText={<ErrorMessage name="volumeUoM" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="shelfLife"
                                    as={TextField}
                                    label="Shelf Life"
                                    fullWidth
                                    helperText={<ErrorMessage name="shelfLife" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="expirationDate"
                                    as={TextField}
                                    label="Expiration Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    helperText={<ErrorMessage name="expirationDate" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="bestBeforeDate"
                                    as={TextField}
                                    label="Best Before Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    helperText={<ErrorMessage name="bestBeforeDate" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="stackingFactor"
                                    as={TextField}
                                    label="Stacking Factor"
                                    fullWidth
                                    helperText={<ErrorMessage name="stackingFactor" />}
                                />
                            </Grid>
                            {/* <Grid item xs={12}>
                <Typography variant="h6">Documents</Typography>
                <input
                  type="file"
                  onChange={(event) =>
                    setFieldValue('documents', event.currentTarget.files[0])
                  }
                />
              </Grid> */}

                            {/* Location Data */}
                            <Grid item xs={12}>
                                <Typography variant="h6" className={style.basicDetailsHeading}>Location Data</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="locationIds"
                                    as={TextField}
                                    label="Location IDs (Plants/Warehouses)"
                                    fullWidth
                                    helperText={<ErrorMessage name="locationIds" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="packagingType"
                                    as={TextField}
                                    label="Packaging Type"
                                    fullWidth
                                    helperText={<ErrorMessage name="packagingType" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Field
                                            name="generatePackagingLabel"
                                            as={Checkbox}
                                            type="checkbox"
                                        />
                                    }
                                    label="Generate Packaging Label"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    name="specialInstructions"
                                    as={TextField}
                                    label="Special Instructions"
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>

                            {/* Storage Data */}
                            <Grid item xs={12}>
                                <Typography variant="h6" className={style.basicDetailsHeading}>Storage Data</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={
                                        <Field
                                            name="fragileGoods"
                                            as={Checkbox}
                                            type="checkbox"
                                        />
                                    }
                                    label="Fragile Goods"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={
                                        <Field
                                            name="dangerousGoods"
                                            as={Checkbox}
                                            type="checkbox"
                                        />
                                    }
                                    label="Dangerous Goods"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={
                                        <Field
                                            name="hazardousStorage"
                                            as={Checkbox}
                                            type="checkbox"
                                        />
                                    }
                                    label="Hazardous Substance Storage Rel."
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12} className={style.submitButtonContainer}>
                                <Button type="submit" variant="contained" color="primary" className={style.submitButton}>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default ProductMasterPage;
