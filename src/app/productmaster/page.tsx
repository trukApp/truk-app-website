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
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    IconButton,
} from '@mui/material';
import style from './productmaster.module.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from '@/Components/GridComponent';
import { useCreateProductMutation, useDeleteProductMutation, useEditProductMutation, useGetAllProductsQuery, useGetLocationMasterQuery } from '@/api/apiSlice';
import { GridCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MassUpload from '@/Components/MassUpload/MassUpload';

interface PackagingType {
    pac_ID: string;
    location: string;
}
interface Product {
    productName: string;
    productCode: string;
    category: string;
    subCategory: string;
    price: number;
    stockQuantity: number;
    manufacturer: string;
    description: string;
    warehouseLocation: string;
    warehousePincode: string;
    warehouseState: string;
    warehouseCity: string;
    warehouseCountry: string;
    product_ID: number;
    product_desc: string;
    sales_uom: string;
    basic_uom: string;
    weight: string;
    volume: string;
    expiration: string;
    best_before: string;
    hsn_code: string;
    sku_num: string;
    fragile_goods: boolean;
    dangerous_goods: boolean;
    id: number;
    prod_id: number;
    loc_ID: string;
    specialInstructions: string;
    documents: string;
    stacking_factor: string;
    packaging_type: PackagingType[];
    temp_controlled: boolean
    hazardous: boolean;
    product_name: string;
    packagingType: PackagingType[];
    packing_label: boolean;
    special_instructions: string;
    tempControl: boolean;
    packingLabel: boolean
}
interface Location {
    city: string;
    country: string;
    gln_code: string;
    iata_code: string;
    latitude: string;
    loc_ID: string;
    loc_desc: string;
    loc_type: string;
    // location_id: number;
    longitude: string;
    pincode: string;
    state: string;
    time_zone: string;
    productDescription: string;
    temp_controlled: boolean;
    hazardous: boolean;
}

const ProductMasterPage = () => {
    const unitsofMeasurement = useSelector((state: RootState) => state.auth.unitsofMeasurement);
    const productFormInitialValues = {
        productName: '',
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
        locationId: '',
        packagingType: '',
        generatePackagingLabel: false,
        specialInstructions: '',
        fragileGoods: false,
        dangerousGoods: false,
        hazardousStorage: false,
        skuNumber: '',
        hsncode: '',
        weightUnit: unitsofMeasurement[0],
        volumeUnit: unitsofMeasurement[0],
        temperatureControl: false,
    };
    const [updateRecord, setUpdateRecord] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState(productFormInitialValues);
    const [updateRecordData, setUpdateRecordData] = useState({});
    const [updateRecordId, setUpdateRecordId] = useState(0)

    const { data: productsData, error: allProductsFectchingError } = useGetAllProductsQuery([])
    const [showForm, setShowForm] = useState(false);
    const { data: locationsData, error: getLocationsError } = useGetLocationMasterQuery([])
    const [createNewProduct] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation()
    const [updateProductDetails] = useEditProductMutation();
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const allProductsData = productsData?.products || [];

    console.log("updateRecord: ", updateRecordData)
    console.log("updateRecordId: ", updateRecordId)


    console.log("productsData: ", allProductsData)
    console.log("Getting all product errors: ", allProductsFectchingError)
    console.log("getLocationsError: ", getLocationsError)



    console.log("initialValues: ", formInitialValues)

    const validationSchema = Yup.object({
        productName: Yup.string().required('Product name is required'),
        productDescription: Yup.string().required('Product Description is required'),
        basicUoM: Yup.string().required('Basic Unit of Measure is required'),
        salesUoM: Yup.string().required('Sales Unit of Measure is required'),
    });


    const mapRowToInitialValues = (selectedProduct: Product) => ({
        productName: selectedProduct.productName || '',
        productDescription: selectedProduct.product_desc || '',
        basicUoM: selectedProduct.basic_uom || '',
        salesUoM: selectedProduct.sales_uom || '',
        weightUoM: selectedProduct.weight || '',
        volumeUoM: selectedProduct.volume || '',
        shelfLife: '',
        expirationDate: selectedProduct.expiration || '',
        bestBeforeDate: selectedProduct.best_before || '',
        stackingFactor: selectedProduct?.stacking_factor || '',
        documents: '',
        // locationId: selectedProduct.packaging_type?.location || '',
        // packagingType: selectedProduct.packaging_type?.pac_ID || '',
        locationId: selectedProduct?.packagingType[0]?.location || '',
        packagingType: selectedProduct?.packagingType[0]?.pac_ID || '',
        generatePackagingLabel: selectedProduct.packingLabel || false,
        specialInstructions: selectedProduct.specialInstructions || '',
        fragileGoods: selectedProduct.fragile_goods || false,
        dangerousGoods: selectedProduct.dangerous_goods || false,
        hazardousStorage: selectedProduct?.hazardous || false,
        skuNumber: selectedProduct.sku_num || '',
        hsncode: selectedProduct.hsn_code || '',
        weightUnit: unitsofMeasurement[0],
        volumeUnit: unitsofMeasurement[0],
        temperatureControl: selectedProduct?.tempControl || false,
    });

    const handleEdit = async (rowData: Product) => {
        console.log('Edit clicked for:', rowData);
        console.log("rowData: ", rowData?.packagingType)
        setShowForm(true)
        setUpdateRecord(true)
        setUpdateRecordData(rowData)
        const updatedInitialValues = await mapRowToInitialValues(rowData);
        console.log('Updated Initial Values:', updatedInitialValues);
        setUpdateRecordId(rowData?.id)

        setFormInitialValues(updatedInitialValues);
    };

    const handleDelete = async (row: Product) => {
        console.log('Delete clicked:', row);
        const productId = row?.id
        const response = await deleteProduct(productId)
        console.log("delete response :", response)
    };


    const columns = [
        { field: 'productName', headerName: 'Product Name', width: 150 },
        { field: 'product_ID', headerName: 'Product ID', width: 150 },
        { field: 'product_desc', headerName: 'Product Description', width: 200 },
        { field: 'sales_uom', headerName: 'Sales UOM', width: 150 },
        { field: 'basic_uom', headerName: 'Basic UOM', width: 150 },
        { field: 'weight', headerName: 'Weight', width: 150 },
        { field: 'volume', headerName: 'Volume', width: 150 },
        { field: 'expiration', headerName: 'Expiration Date', width: 180 },
        { field: 'best_before', headerName: 'Best Before Date', width: 180 },
        { field: 'hsn_code', headerName: 'HSN Code', width: 150 },
        { field: 'sku_num', headerName: 'SKU Number', width: 150 },
        { field: 'fragile_goods', headerName: 'Fragile Goods', width: 180, valueFormatter: (params: GridCellParams) => params.value ? 'Yes' : 'No' },
        { field: 'dangerous_goods', headerName: 'Dangerous Goods', width: 180, valueFormatter: (params: GridCellParams) => params.value ? 'Yes' : 'No' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params: GridCellParams) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => handleEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        onClick={() => handleDelete(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    // const rows = allProductsData.map((product: Product) => ({
    //     id: product.prod_id,
    //     product_ID: product.product_ID,
    //     product_desc: product.product_desc,
    //     sales_uom: product.sales_uom,
    //     basic_uom: product.basic_uom,
    //     weight: product.weight,
    //     volume: product.volume,
    //     expiration: product.expiration,
    //     best_before: product.best_before,
    //     hsn_code: product.hsn_code,
    //     sku_num: product.sku_num,
    //     fragile_goods: product.fragile_goods,
    //     dangerous_goods: product.dangerous_goods,
    // }));

    const rows = allProductsData.map((product: Product) => ({
        id: product.prod_id,
        product_ID: product.product_ID,
        product_desc: product.product_desc,
        sales_uom: product.sales_uom,
        basic_uom: product.basic_uom,
        weight: product.weight,
        volume: product.volume,
        expiration: product.expiration,
        best_before: product.best_before,
        hsn_code: product.hsn_code,
        sku_num: product.sku_num,
        fragile_goods: product.fragile_goods,
        dangerous_goods: product.dangerous_goods,
        // Include all other properties you need here
        documents: product.documents,
        stacking_factor: product.stacking_factor,
        locationId: product.loc_ID,
        packagingType: product.packaging_type, // Make sure to map all properties
        specialInstructions: product.special_instructions,
        hazardousStorage: product.hazardous,
        tempControl: product.temp_controlled,
        productName: product?.product_name,
        packingLabel: product?.packing_label,
        hazardous: product?.hazardous

    }));


    const handleSubmit = async (values: typeof productFormInitialValues) => {
        console.log('Form Submitted', values);
        const createProductBody = {
            products: [
                {
                    product_name: values?.productName,
                    product_desc: values?.productDescription,
                    basic_uom: values?.basicUoM,
                    sales_uom: values?.salesUoM,
                    weight: values?.weightUoM,
                    weight_uom: values?.weightUnit,
                    volume: values?.volumeUoM,
                    volume_uom: values?.volumeUnit,
                    expiration: values?.expirationDate,
                    best_before: values?.bestBeforeDate,
                    stacking_factor: values?.stackingFactor,
                    sku_num: values?.skuNumber,
                    hsn_code: values?.hsncode,
                    documents: values?.documents,
                    loc_ID: values?.locationId,
                    packaging_type: [
                        {
                            pac_ID: values?.packagingType,
                            location: values?.locationId
                        }
                    ],
                    special_instructions: values?.specialInstructions,
                    packing_label: values?.generatePackagingLabel,
                    fragile_goods: values?.fragileGoods,
                    dangerous_goods: values?.dangerousGoods,
                    hazardous: values?.hazardousStorage,
                    temp_controlled: values?.temperatureControl

                }
            ]
        }

        const editProductBody = {
            ...updateRecordData,
            product_name: values?.productName,
            product_desc: values?.productDescription,
            basic_uom: values?.basicUoM,
            sales_uom: values?.salesUoM,
            weight: values?.weightUoM,
            weight_uom: values?.weightUnit,
            volume: values?.volumeUoM,
            volume_uom: values?.volumeUnit,
            expiration: values?.expirationDate,
            best_before: values?.bestBeforeDate,
            stacking_factor: values?.stackingFactor,
            sku_num: values?.skuNumber,
            hsn_code: values?.hsncode,
            documents: values?.documents,
            loc_ID: values?.locationId,
            packaging_type: [
                {
                    pac_ID: values?.packagingType,
                    location: values?.locationId
                }
            ],
            special_instructions: values?.specialInstructions,
            packing_label: values?.generatePackagingLabel,
            fragile_goods: values?.fragileGoods,
            dangerous_goods: values?.dangerousGoods,
            hazardous: values?.hazardousStorage,
            temp_controlled: values?.temperatureControl
        }

        if (updateRecord) {
            console.log("I am going to update the existing record")
            const response = await updateProductDetails({ body: editProductBody, productId: updateRecordId }).unwrap();
            console.log('API Response:', response);
            if (response) {
                setFormInitialValues(productFormInitialValues)
                setShowForm(false)
                setUpdateRecord(false)
                setUpdateRecordId(0)
                setUpdateRecordData({})
            }
        } else {
            console.log("I am going to create a record")
            console.log("createProductBody: ", createProductBody)
            const response = await createNewProduct(createProductBody).unwrap();
            console.log('API Response:', response)
        }


    };

    return (
        <Grid sx={{ margin: { xs: "0px", md: "0px 30px" } }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '20px', md: '24px' } }} align="center" gutterBottom>
                Product master
            </Typography>
            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                    variant="contained"
                    onClick={() => setShowForm((prev) => !prev)}
                    className={style.createButton}
                >
                    Create Product
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
                </Button>
                <MassUpload arrayKey='products' />
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={formInitialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
                            <Form>
                                <Typography variant="h6" className={style.basicDetailsHeading}>
                                    Basic Data
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="Product name*"
                                            name="productName"
                                            value={values.productName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.productName && Boolean(errors.productName)}
                                            helperText={touched.productName && errors.productName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="Product Description*"
                                            name="productDescription"
                                            value={values.productDescription}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.productDescription && Boolean(errors.productDescription)}
                                            helperText={touched.productDescription && errors.productDescription}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}   >
                                        <TextField
                                            fullWidth size='small'
                                            select
                                            label="Basic Unit of Measure*"
                                            name="basicUoM"
                                            value={values.basicUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.basicUoM && Boolean(errors.basicUoM)}
                                            helperText={touched.basicUoM && errors.basicUoM}
                                        >
                                            {unitsofMeasurement.map((unit) => (
                                                <MenuItem key={unit} value={unit}>
                                                    {unit}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="Sales Unit of Measure*"
                                            name="salesUoM"
                                            value={values.salesUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.salesUoM && Boolean(errors.salesUoM)}
                                            helperText={touched.salesUoM && errors.salesUoM}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}   >
                                        <TextField
                                            fullWidth size='small'
                                            type='number'
                                            label="Weight"
                                            name="weightUoM"
                                            value={values.weightUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}   >
                                        <TextField
                                            fullWidth size='small'
                                            select
                                            label="Weight Unit"
                                            name="weightUnit"
                                            value={values.weightUnit}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            {unitsofMeasurement.map((unit) => (
                                                <MenuItem key={unit} value={unit}>
                                                    {unit}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}  >
                                        <TextField
                                            fullWidth size='small'
                                            label="Volume" type='number'
                                            name="volumeUoM"
                                            value={values.volumeUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}  >
                                        <TextField
                                            fullWidth size='small'
                                            select
                                            label="Volume Unit"
                                            name="volumeUnit"
                                            value={values.volumeUnit}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            {unitsofMeasurement.map((unit) => (
                                                <MenuItem key={unit} value={unit}>
                                                    {unit}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" className={style.basicDetailsHeading}>
                                    Shelf Life
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="Expiration Date"
                                            name="expirationDate"
                                            type="date"
                                            value={values.expirationDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="Best Before Date"
                                            name="bestBeforeDate"
                                            type="date"
                                            value={values.bestBeforeDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="Stacking Factor"
                                            name="stackingFactor"
                                            value={values.stackingFactor}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="SKU Number"
                                            name="skuNumber"
                                            value={values.skuNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="HSN Code"
                                            name="hsncode"
                                            value={values.hsncode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
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
                                    {/* <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="Location IDs (Plants/Warehouses)"
                                            name="locationIds"
                                            value={values.locationIds}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid> */}

                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <FormControl fullWidth size="small" error={touched.locationId && Boolean(errors.locationId)}>
                                            <InputLabel>Location of Source</InputLabel>
                                            <Select
                                                label="Location of Source"
                                                name="locationOfSource"
                                                value={values.locationId}
                                                onChange={(e) => setFieldValue('locationId', e.target.value)}
                                                onBlur={handleBlur}
                                            >
                                                {getAllLocations.map((location: Location) => (
                                                    <MenuItem key={location.loc_ID} value={location.loc_ID}>
                                                        {location.loc_ID}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.locationId && errors.locationId && (
                                                <FormHelperText>{errors.locationId}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="Packaging Type"
                                            name="packagingType"
                                            value={values.packagingType}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4} >
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
                                    <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
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
                                    <Grid item xs={12} md={3}>
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
                                    <Grid item xs={12} md={3}>
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
                                    <Grid item xs={12} md={3}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="hazardousStorage"
                                                    checked={values.hazardousStorage}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="Hazardous Substance Storage"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="temperatureControl"
                                                    checked={values.temperatureControl}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="Temperature control"
                                        />
                                    </Grid>
                                </Grid>

                                <Box marginTop={2} textAlign="center">
                                    {updateRecord ? (
                                        <Button type="submit" variant="contained" color="primary">
                                            Update
                                        </Button>
                                    ) : (
                                        <Button type="submit" variant="contained" color="primary">
                                            Submit
                                        </Button>
                                    )}

                                </Box>
                            </Form>
                        )
                        }
                    </Formik>
                </Box>
            </Collapse>

            <div style={{ marginTop: '40px' }}>
                <DataGridComponent
                    // columns={columns}
                    // rows={dummyData}
                    rows={rows}  // Pass the dynamic rows here
                    columns={columns}
                    isLoading={false}
                    pageSizeOptions={[10, 20, 30]}
                    initialPageSize={10}
                />
            </div>
        </Grid>
    );
};

export default ProductMasterPage;