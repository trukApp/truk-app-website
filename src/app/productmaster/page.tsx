'use client';
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Collapse,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    Typography,
    MenuItem,
} from '@mui/material';
import style from './productmaster.module.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from '@/Components/GridComponent';


const dummyData = [
    {
        id: 1,
        productId: 'P001',
        productDescription: 'Premium Quality Rice',
        basicUoM: 'Kg',
        salesUoM: 'Kg',
        weightUoM: 'Kg',
        volumeUoM: 'L',
        shelfLife: '12 months',
        expirationDate: '2025-12-31',
        bestBeforeDate: '2025-06-30',
        stackingFactor: '10',
        documents: 'Spec Sheet',
        locationIds: 'LOC001, LOC002',
        packagingType: 'Bag',
        generatePackagingLabel: true,
        specialInstructions: 'Store in a cool, dry place',
        fragileGoods: false,
        dangerousGoods: false,
        hazardousStorage: false,
        skuNumber: 'SKU12345',
        hsncode: '10061010',
    },
    {
        id: 2,
        productId: 'P002',
        productDescription: 'Organic Wheat Flour',
        basicUoM: 'Kg',
        salesUoM: 'Kg',
        weightUoM: 'Kg',
        volumeUoM: 'L',
        shelfLife: '6 months',
        expirationDate: '2024-06-30',
        bestBeforeDate: '2024-03-31',
        stackingFactor: '8',
        documents: 'Certificate of Authenticity',
        locationIds: 'LOC003, LOC004',
        packagingType: 'Box',
        generatePackagingLabel: false,
        specialInstructions: 'Avoid direct sunlight',
        fragileGoods: false,
        dangerousGoods: false,
        hazardousStorage: false,
        skuNumber: 'SKU67890',
        hsncode: '11010000',
    },
    {
        id: 3,
        productId: 'P003',
        productDescription: 'Cooking Oil',
        basicUoM: 'L',
        salesUoM: 'Bottle',
        weightUoM: 'Kg',
        volumeUoM: 'L',
        shelfLife: '18 months',
        expirationDate: '2026-03-31',
        bestBeforeDate: '2025-12-31',
        stackingFactor: '15',
        documents: 'MSDS',
        locationIds: 'LOC005',
        packagingType: 'Can',
        generatePackagingLabel: true,
        specialInstructions: 'Keep away from open flame',
        fragileGoods: false,
        dangerousGoods: true,
        hazardousStorage: true,
        skuNumber: 'SKU54321',
        hsncode: '15079010',
    },
];

// Define columns for the Data Grid
const columns: GridColDef[] = [
    { field: 'productId', headerName: 'Product ID', flex: 1 },
    { field: 'productDescription', headerName: 'Product Description', flex: 2 },
    { field: 'basicUoM', headerName: 'Basic UoM', flex: 1 },
    { field: 'salesUoM', headerName: 'Sales UoM', flex: 1 },
    { field: 'shelfLife', headerName: 'Shelf Life', flex: 1 },
    { field: 'expirationDate', headerName: 'Expiration Date', flex: 1 },
    { field: 'skuNumber', headerName: 'SKU Number', flex: 1 },
    { field: 'hsncode', headerName: 'HSN Code', flex: 1 },
];

const ProductMasterPage = () => {
    const [showForm, setShowForm] = useState(false);

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
        documents: '',
        locationIds: '',
        packagingType: '',
        generatePackagingLabel: false,
        specialInstructions: '',
        fragileGoods: false,
        dangerousGoods: false,
        hazardousStorage: false,
        skuNumber: '',
        hsncode: '',
        weightUnit: '',
        volumeUnit: '',
    };

    const validationSchema = Yup.object({
        productId: Yup.string().required('Product ID is required'),
        productDescription: Yup.string().required('Product Description is required'),
        basicUoM: Yup.string().required('Basic Unit of Measure is required'),
        salesUoM: Yup.string().required('Sales Unit of Measure is required'),
    });

    const handleSubmit = (values: typeof initialValues) => {
        console.log('Form Submitted', values);
    };

    return (
        <div className={style.formsMainContainer}>
            <Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
                <Button
                    variant="contained"
                    onClick={() => setShowForm((prev) => !prev)}
                    className={style.createButton}
                >
                    Create Product
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 8 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />}
                </Button>
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, values, touched, errors }) => (
                            <Form>
                                <Typography variant="h6" className={style.basicDetailsHeading}>
                                    Basic Data
                                </Typography>
                                {/* <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Product ID*"
                                            name="productId"
                                            value={values.productId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.productId && Boolean(errors.productId)}
                                            helperText={touched.productId && errors.productId}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Product Description*"
                                            name="productDescription"
                                            value={values.productDescription}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                touched.productDescription &&
                                                Boolean(errors.productDescription)
                                            }
                                            helperText={touched.productDescription && errors.productDescription}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Basic Unit of Measure*"
                                            name="basicUoM"
                                            value={values.basicUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.basicUoM && Boolean(errors.basicUoM)}
                                            helperText={touched.basicUoM && errors.basicUoM}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Sales Unit of Measure*"
                                            name="salesUoM"
                                            value={values.salesUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.salesUoM && Boolean(errors.salesUoM)}
                                            helperText={touched.salesUoM && errors.salesUoM}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Weight - UoM"
                                            name="weightUoM"
                                            value={values.weightUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Volume - UoM"
                                            name="volumeUoM"
                                            value={values.volumeUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                </Grid> */}

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Product ID*"
                                            name="productId"
                                            value={values.productId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.productId && Boolean(errors.productId)}
                                            helperText={touched.productId && errors.productId}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Product Description*"
                                            name="productDescription"
                                            value={values.productDescription}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.productDescription && Boolean(errors.productDescription)}
                                            helperText={touched.productDescription && errors.productDescription}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Basic Unit of Measure*"
                                            name="basicUoM"
                                            value={values.basicUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.basicUoM && Boolean(errors.basicUoM)}
                                            helperText={touched.basicUoM && errors.basicUoM}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Sales Unit of Measure*"
                                            name="salesUoM"
                                            value={values.salesUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.salesUoM && Boolean(errors.salesUoM)}
                                            helperText={touched.salesUoM && errors.salesUoM}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Weight - UoM"
                                            name="weightUoM"
                                            value={values.weightUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Weight Unit"
                                            name="weightUnit"
                                            value={values.weightUnit}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <MenuItem value="gram">Gram</MenuItem>
                                            <MenuItem value="kg">Kg</MenuItem>
                                            <MenuItem value="ton">Ton</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Volume - UoM"
                                            name="volumeUoM"
                                            value={values.volumeUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Volume Unit"
                                            name="volumeUnit"
                                            value={values.volumeUnit}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <MenuItem value="gram">Gram</MenuItem>
                                            <MenuItem value="kg">Kg</MenuItem>
                                            <MenuItem value="ton">Ton</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" className={style.basicDetailsHeading}>
                                    Shelf Life
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Expiration Date"
                                            name="expirationDate"
                                            type="date"
                                            value={values.expirationDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Best Before Date"
                                            name="bestBeforeDate"
                                            type="date"
                                            value={values.bestBeforeDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Stacking Factor"
                                            name="stackingFactor"
                                            value={values.stackingFactor}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="SKU Number"
                                            name="skuNumber"
                                            value={values.skuNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="HSN Code"
                                            name="hsncode"
                                            value={values.hsncode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Documents"
                                            name="Documents"
                                            value={values.documents}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>


                                </Grid>

                                <Typography variant="h6" className={style.basicDetailsHeading}>
                                    Location Data
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Location IDs (Plants/Warehouses)"
                                            name="locationIds"
                                            value={values.locationIds}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Packaging Type"
                                            name="packagingType"
                                            value={values.packagingType}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="generatePackagingLabel"
                                                    checked={values.generatePackagingLabel}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="Generate Packaging Label"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Special Instructions"
                                            name="specialInstructions"
                                            value={values.specialInstructions}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" className={style.basicDetailsHeading}>
                                    Storage Data
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="fragileGoods"
                                                    checked={values.fragileGoods}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="Fragile Goods"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="dangerousGoods"
                                                    checked={values.dangerousGoods}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="Dangerous Goods"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="hazardousStorage"
                                                    checked={values.hazardousStorage}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="Hazardous Substance Storage Rel."
                                        />
                                    </Grid>
                                </Grid>

                                <Box marginTop={2} textAlign="center">
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Collapse>

            <DataGridComponent
                columns={columns}
                rows={dummyData}
                isLoading={false}
                pageSizeOptions={[10, 20]}
                initialPageSize={10}
            />
        </div>
    );
};

export default ProductMasterPage;
