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
    Tooltip,
    CircularProgress,
} from '@mui/material';
import style from './productmaster.module.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from '@/Components/GridComponent';
import { useCreateProductMutation, useDeleteProductMutation, useEditProductMutation, useGetAllProductsQuery, useGetLocationMasterQuery, useGetPackageMasterQuery } from '@/api/apiSlice';
import { GridCellParams, GridPaginationModel } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MassUpload from '@/Components/MassUpload/MassUpload';
import DataGridSkeletonLoader from '@/Components/ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '@/Components/ReusableComponents/SnackbarAlerts';
import { Location } from '@/Components/MasterDataComponents/Locations';
import { Package } from '@/Components/MasterDataComponents/PackagingInfo';

export interface PackagingType {
    pac_ID: string;
    location: string;

}
export interface Product {
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
    product_ID: string;
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
    packingLabel: boolean;
    quantity: number;
    destination: string;
}

const ProductMasterPage = () => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const unitsofMeasurement = useSelector((state: RootState) => state.auth.unitsofMeasurement);
    const productFormInitialValues = {
        productName: '',
        productDescription: '',
        basicUoM: unitsofMeasurement[0],
        salesUoM: unitsofMeasurement[0],
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
    const { data: productsData, error: allProductsFectchingError, isLoading } = useGetAllProductsQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
    const [showForm, setShowForm] = useState(false);
    const { data: locationsData, error: getLocationsError, isLoading: isLocationLoading } = useGetLocationMasterQuery({})
    const { data: packagesData, isLoading: isPackageLoading } = useGetPackageMasterQuery({})
    const [createNewProduct] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation()
    const [updateProductDetails] = useEditProductMutation();
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const getAllPackages = packagesData?.packages.length > 0 ? packagesData?.packages : []
    const allProductsData = productsData?.products || [];

    console.log("Getting all product errors: ", allProductsFectchingError)
    console.log("getLocationsError: ", getLocationsError)
    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };
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
        setShowForm(true)
        setUpdateRecord(true)
        setUpdateRecordData(rowData)
        const updatedInitialValues = await mapRowToInitialValues(rowData);
        setUpdateRecordId(rowData?.id)

        setFormInitialValues(updatedInitialValues);
    };

    const handleDelete = async (row: Product) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ? This action cannot be undone.`);

        if (!confirmDelete) return;

        try {
            const productId = row?.id;
            const response = await deleteProduct(productId);
            if (response.data.deleted_record) {
                setSnackbarMessage(`Product ID ${response.data.deleted_record} deleted successfully!`);
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Delete error:", error);
            setSnackbarMessage("Failed to delete product. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    const columns = [
        { field: 'product_ID', headerName: 'Product ID', width: 150 },
        { field: 'productName', headerName: 'Product Name', width: 150 },
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
        documents: product.documents,
        stacking_factor: product.stacking_factor,
        locationId: product.loc_ID,
        packagingType: product.packaging_type,
        specialInstructions: product.special_instructions,
        hazardousStorage: product.hazardous,
        tempControl: product.temp_controlled,
        productName: product?.product_name,
        packingLabel: product?.packing_label,
        hazardous: product?.hazardous

    }));


    const handleSubmit = async (values: typeof productFormInitialValues, { resetForm }: { resetForm: () => void }) => {
        try {
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
                const response = await updateProductDetails({ body: editProductBody, productId: updateRecordId }).unwrap();
                if (response?.updated_record) {
                    setSnackbarMessage(`Product ID ${response.updated_record} updated successfully!`);
                    resetForm()
                    setFormInitialValues(productFormInitialValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData({})
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                }
            } else {
                const response = await createNewProduct(createProductBody).unwrap();
                if (response?.created_records) {
                    setSnackbarMessage(`Product ID ${response.created_records[0]} created successfully!`);
                    resetForm()
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData({})
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                }
            }
        }
        catch (error) {
            console.log("err :", error)
            resetForm()
            setShowForm(false)
            setSnackbarMessage("Something went wrong! please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }



    };

    return (
        <Grid sx={{ margin: { xs: "0px", md: "0px 30px" } }}>
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
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
                                    {/* <Grid item xs={12} sm={6} md={2.4} >
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
                                    </Grid> */}
                                    <Grid item xs={12} sm={6} md={2.4}   >
                                        <TextField
                                            fullWidth size='small'
                                            select
                                            label="Sales Unit of Measure*"
                                            name="salesUoM"
                                            value={values.salesUoM}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.salesUoM && Boolean(errors.salesUoM)}
                                            helperText={touched.salesUoM && errors.salesUoM}
                                        >
                                            {unitsofMeasurement.map((unit) => (
                                                <MenuItem key={unit} value={unit}>
                                                    {unit}
                                                </MenuItem>
                                            ))}
                                        </TextField>
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
                                    {/* <Grid item xs={12} sm={6} md={2.4} >
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
                                    </Grid> */}
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Expiration Date"
                                            name="expirationDate"
                                            type="date"
                                            value={
                                                values.expirationDate
                                                    ? values.expirationDate.split('-').reverse().join('-')
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                const formattedDate = selectedDate
                                                    .split('-').reverse().join('-');
                                                handleChange({ target: { name: 'expiryDate', value: formattedDate } });
                                            }}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12} sm={6} md={2.4} >
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
                                    </Grid> */}
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Best Before Date"
                                            name="bestBeforeDate"
                                            type="date"
                                            value={
                                                values.bestBeforeDate
                                                    ? values.bestBeforeDate.split('-').reverse().join('-')
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                const formattedDate = selectedDate
                                                    .split('-').reverse().join('-');
                                                handleChange({ target: { name: 'expiryDate', value: formattedDate } });
                                            }}
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
                                                {isLocationLoading ? (
                                                    <MenuItem disabled>
                                                        <CircularProgress size={20} color="inherit" />
                                                        <span style={{ marginLeft: "10px" }}>Loading...</span>
                                                    </MenuItem>
                                                ) : (
                                                    getAllLocations?.map((location: Location) => (
                                                        <MenuItem key={location.loc_ID} value={String(location.loc_ID)}>
                                                            <Tooltip
                                                                title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                                placement="right"
                                                            >
                                                                <span style={{ flex: 1 }}>{location.loc_ID}</span>
                                                            </Tooltip>
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                            {touched.locationId && errors.locationId && (
                                                <FormHelperText>{errors.locationId}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    {/* <Grid item xs={12} sm={6} md={2.4} >
                                        <TextField
                                            fullWidth size='small'
                                            label="Packaging Type"
                                            name="packagingType"
                                            value={values.packagingType}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid> */}
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <FormControl fullWidth size="small" error={touched.locationId && Boolean(errors.locationId)}>
                                            <InputLabel>Packaging Type</InputLabel>
                                            <Select
                                                label="Packaging Type"
                                                name="packagingType"
                                                value={values.packagingType}
                                                onChange={(e) => setFieldValue('packagingType', e.target.value)}
                                                onBlur={handleBlur}
                                            >
                                                {isPackageLoading ? (
                                                    <MenuItem disabled>
                                                        <CircularProgress size={20} color="inherit" />
                                                        <span style={{ marginLeft: "10px" }}>Loading...</span>
                                                    </MenuItem>
                                                ) : (
                                                    getAllPackages?.map((packages: Package) => (
                                                        <MenuItem key={packages.pac_ID} value={String(packages.pac_ID)}>
                                                            <Tooltip
                                                                title={`${packages.packaging_type_name}, ${packages.dimensions}, ${packages.dimensions_uom}`}
                                                                placement="right"
                                                            >
                                                                <span style={{ flex: 1 }}>{packages.pac_ID}</span>
                                                            </Tooltip>
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                            {touched.packagingType && errors.packagingType && (
                                                <FormHelperText>{errors.packagingType}</FormHelperText>
                                            )}
                                        </FormControl>
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
                                    <Button type="submit" variant="contained" color="primary">
                                        {updateRecord ? "Update product" : "Create product"}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setFormInitialValues(productFormInitialValues)
                                            setUpdateRecord(false)
                                        }}
                                        style={{ marginLeft: "10px" }}>Reset
                                    </Button>
                                </Box>
                            </Form>
                        )
                        }
                    </Formik>
                </Box>
            </Collapse>
            <div style={{ marginTop: "40px" }}>
                {isLoading ? (
                    <DataGridSkeletonLoader columns={columns} />
                ) : (
                    <DataGridComponent
                        columns={columns}
                        rows={rows}
                        isLoading={isLoading}
                        paginationModel={paginationModel}
                        onPaginationModelChange={handlePaginationModelChange}
                        activeEntity='products'
                    />
                )}
            </div>
        </Grid>
    );
};

export default ProductMasterPage;