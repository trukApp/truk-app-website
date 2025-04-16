'use client';
import React, { useEffect, useRef, useState } from 'react';
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
    Backdrop,
    ListItem,
    List,
    Paper,
} from '@mui/material';
import style from './productmaster.module.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from '@/Components/GridComponent';
import { useCreateProductMutation, useDeleteProductMutation, useEditProductMutation, useGetAllProductsQuery, useGetFilteredLocationsQuery, useGetLocationMasterQuery, useGetPackageMasterQuery } from '@/api/apiSlice';
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
import { CustomButtonFilled } from '@/Components/ReusableComponents/ButtonsComponent';
import { withAuthComponent } from '@/Components/WithAuthComponent';
import { useQuery ,useLazyQuery} from "@apollo/client";
import { GET_ALL_PRODUCTS,GET_ALL_PACKAGES,GET_LOCATIONS,SEARCH_LOCATIONS,GET_ALL_LOCATIONS} from '@/api/graphqlApiSlice';
export interface PackagingType {
    pac_ID: string;
    location: string;

}
export interface Product {
    locationId: string;
    weight_uom: string;
    productID: string;
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
    packagingType: string;
    packing_label: boolean;
    special_instructions: string;
    tempControl: boolean;
    packingLabel: boolean;
    quantity: number;
    destination: string;
    volume_uom: string;
}

interface ProductMasterProps {
    productsFromServer?: Product[];
}
const ProductMasterPage: React.FC<ProductMasterProps> = ({ productsFromServer }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const unitsofMeasurement = useSelector((state: RootState) => state.auth.unitsofMeasurement);

    const productFormInitialValues = {
        productID: '',
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
    const [updateRecordId, setUpdateRecordId] = useState(0)
    // const { data: productsDataFromClient, isLoading } = useGetAllProductsQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
    const { data: allProductsDatas, loading: productsLoading, error: productsError, refetch } = useQuery(GET_ALL_PRODUCTS, {
        variables: { page: paginationModel.page + 1, limit: paginationModel.pageSize },
      });
     
    const productsData = productsLoading ? productsFromServer : allProductsDatas.getAllProducts;
    const [showForm, setShowForm] = useState(false);
    // const { data: locationsData, } = useGetLocationMasterQuery({})

       //graphQlAPI
       const {data:locationsData } = useQuery(GET_ALL_LOCATIONS, {
        variables: { page:1, limit: 10 },
      });
    
    // const { data: packagesData, isLoading: isPackageLoading } = useGetPackageMasterQuery({})
    const { data: allPackagesData, loading: packagesLoading, error: packagesError } = useQuery(GET_ALL_PACKAGES);
    console.log(allPackagesData)
    const [createNewProduct, { isLoading: createLoading }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: deleteProductLoading }] = useDeleteProductMutation()
    const [updateProductDetails, { isLoading: updateProductLoading }] = useEditProductMutation();
    const getAllLocations = locationsData?.getAllLocations?.locations.length > 0 ? locationsData?.getAllLocations.locations : []
    console.log(getAllLocations)
    const [searchKey, setSearchKey] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    // const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });


      const { loading:LocationLoading,  data:filteredLocations } = useQuery(SEARCH_LOCATIONS, {
        variables: {searchKey: searchKey },
        skip: searchKey.length < 3, // Avoid fetching when input is too short
      });
   console.log(filteredLocations)
    const displayLocations = searchKey ? filteredLocations?.searchLocations?.results || [] : getAllLocations;

    const getAllPackages = allPackagesData?.getAllPackages?.packages.length > 0 ? allPackagesData?.getAllPackages?.packages : []
    const allProductsData = productsData?.products || [];
    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // ✅ Added dependencies
    

    // GraphQl Querys

   

  
  const { loading:locationLoading, error:locationError, data:allLocations } = useQuery(GET_LOCATIONS, {
    variables: { page: 1, limit: 10 },
  });
  
 


  
    const validationSchema = Yup.object({
        productName: Yup.string().required('Product name is required'),
        productDescription: Yup.string().required('Product Description is required'),
        weightUoM: Yup.string().required('Weight is required'),
        volumeUoM: Yup.string().required('Volume is required'),
        basicUoM: Yup.string().required('Basic Unit of Measure is required'),
        salesUoM: Yup.string().required('Sales Unit of Measure is required'),
        locationId: Yup.string().required('Location id is required'),
        packagingType: Yup.string().required('packaging type is required'),
        hsncode: Yup.string().required('Hsn code is required'),
    });

    const getLocationDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        const details = [
            location.loc_ID,
            location.loc_desc,
            location.city,
            location.state,
            location.pincode,
        ].filter(Boolean);

        return details.length > 0 ? details.join(", ") : "Location details not available";
    };

    const getPackageDetails = (pack_ID: string) => {
        const packageData = getAllPackages.find((pack: Package) => pack.pac_ID === pack_ID);
        return packageData
            ? `${packageData.packaging_type_name}, ${packageData.pac_ID}`
            : "NA";
    };

    const mapRowToInitialValues = (selectedProduct: Product) => {
        const locId = selectedProduct?.locationId ? selectedProduct?.locationId.split(", ")[0] ?? "" : "";
        const packIdd = selectedProduct?.packagingType ? selectedProduct?.packagingType.split(", ").at(-1) ?? "" : "";
        setSearchKey(selectedProduct?.locationId || '')
        const weightUnit = selectedProduct.weight.split(' ')
        const volumeUnit = selectedProduct.volume.split(' ')
        return (
            {
                productID: selectedProduct.product_ID || '',
                productName: selectedProduct.productName || '',
                productDescription: selectedProduct.product_desc || '',
                basicUoM: selectedProduct.basic_uom || '',
                salesUoM: selectedProduct.sales_uom || '',
                weightUoM: weightUnit[0] || '',
                volumeUoM: volumeUnit[0] || '',
                shelfLife: '',
                expirationDate: selectedProduct.expiration || '',
                bestBeforeDate: selectedProduct.best_before || '',
                stackingFactor: selectedProduct?.stacking_factor || '',
                documents: selectedProduct.documents || '',
                locationId: locId || '',
                packagingType: packIdd || '',
                generatePackagingLabel: selectedProduct?.packingLabel || false,
                specialInstructions: selectedProduct?.specialInstructions || '',
                fragileGoods: selectedProduct?.fragile_goods || false,
                dangerousGoods: selectedProduct?.dangerous_goods || false,
                hazardousStorage: selectedProduct?.hazardous || false,
                skuNumber: selectedProduct.sku_num || '',
                hsncode: selectedProduct.hsn_code || '',
                weightUnit: weightUnit[1],
                volumeUnit: volumeUnit[1],
                temperatureControl: selectedProduct?.tempControl || false,
            });
    }

    const handleEdit = async (rowData: Product) => {
        setShowForm(true)
        setUpdateRecord(true)
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
        { field: 'weight', headerName: 'Weight', width: 150 },
        { field: 'volume', headerName: 'Volume', width: 150 },
        { field: 'expiration', headerName: 'Expiration Date', width: 150 },
        { field: 'best_before', headerName: 'Best Before Date', width: 150 },
        { field: 'locationId', headerName: 'Location', width: 250 },
        { field: 'packagingType', headerName: 'Packaging type', width: 250 },
        { field: 'hsn_code', headerName: 'HSN Code', width: 150 },
        { field: 'sku_num', headerName: 'SKU Number', width: 150 },
        { field: 'fragile_goods', headerName: 'Fragile Goods', width: 150, valueFormatter: (params: GridCellParams) => params.value ? 'Yes' : 'No' },
        { field: 'dangerous_goods', headerName: 'Dangerous Goods', width: 150, valueFormatter: (params: GridCellParams) => params.value ? 'Yes' : 'No' },
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
        weight: `${product.weight} ${product.weight_uom}`,
        volume: `${product.volume} ${product.volume_uom}`,
        expiration: product.expiration,
        best_before: product.best_before,
        hsn_code: product.hsn_code,
        sku_num: product.sku_num,
        fragile_goods: product.fragile_goods,
        dangerous_goods: product.dangerous_goods,
        documents: product.documents,
        stacking_factor: product.stacking_factor,
        locationId: getLocationDetails(product.loc_ID),
        packagingType: getPackageDetails(product.packaging_type[0].pac_ID),
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
                // ...updateRecordData,
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
                console.log('editBody :', editProductBody)
                const response = await updateProductDetails({ body: editProductBody, productId: updateRecordId }).unwrap();
                if (response?.updated_record) {
                    setSnackbarMessage(`Product ID ${response.updated_record} updated successfully!`);
                    resetForm()
                    setFormInitialValues(productFormInitialValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    // setUpdateRecordData({})
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    setSearchKey('')
                }
            } else {
                console.log('post body : ', createProductBody)
                const response = await createNewProduct(createProductBody).unwrap();
                if (response?.created_records) {
                    setSnackbarMessage(`Product ID ${response.created_records[0]} created successfully!`);
                    resetForm()
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    // setUpdateRecordData({})
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    setSearchKey('')
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
            setSearchKey('')
        }
    };



    return (
        <>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={productsLoading || createLoading || deleteProductLoading || updateProductLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

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
                            {({ values, handleChange, handleBlur, errors, touched, setFieldValue, resetForm }) => (
                                <Form>
                                    <Typography variant="h6" sx={{ fontWeight: 600, marginTop: 2 }} >
                                        Basic data
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {updateRecord &&
                                            <Grid item xs={12} sm={6} md={2.4} >
                                                <TextField
                                                    fullWidth size='small'
                                                    label="Product ID" disabled
                                                    name="productID"
                                                    value={values.productID}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>}
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
                                                // onChange={handleChange}
                                                onChange={(e) => {
														const inputValue = e.target.value;
														const numericValue = Number(inputValue);

														if (numericValue > 0 || inputValue === "") {
															handleChange(e);
														}
													}}
                                                onBlur={handleBlur}
                                                error={touched.weightUoM && Boolean(errors.weightUoM)}
                                                helperText={touched.weightUoM && errors.weightUoM}
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
                                                // onChange={handleChange}
                                                onChange={(e) => {
														const inputValue = e.target.value;
														const numericValue = Number(inputValue);

														if (numericValue > 0 || inputValue === "") {
															handleChange(e);
														}
													}}
                                                onBlur={handleBlur}
                                                error={touched.volumeUoM && Boolean(errors.volumeUoM)}
                                                helperText={touched.volumeUoM && errors.volumeUoM}
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

                                    <Typography variant="h6" sx={{ fontWeight: 600, marginTop: 2 }}>
                                        Shelf life
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={2.4}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Expiration Date"
                                                name="expirationDate"
                                                type="date"
                                                value={
                                                    values.expirationDate
                                                        ? values.expirationDate
                                                            .split("-")
                                                            .reverse()
                                                            .join("-")
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    const selectedDate = e.target.value;
                                                    const formattedDate = selectedDate
                                                        .split("-")
                                                        .reverse()
                                                        .join("-");
                                                    handleChange({
                                                        target: {
                                                            name: "expirationDate",
                                                            value: formattedDate,
                                                        },
                                                    });
                                                }}
                                                onBlur={handleBlur}
                                                error={
                                                    touched.expirationDate &&
                                                    Boolean(errors.expirationDate)
                                                }
                                                helperText={
                                                    touched.expirationDate && errors.expirationDate
                                                }
                                                InputLabelProps={{ shrink: true }}
                                                inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={2.4}>
                                            <TextField
                                                fullWidth
                                                size="small" inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                                label="Best Before Date"
                                                name="bestBeforeDate"
                                                type="date"
                                                value={
                                                    values.bestBeforeDate
                                                        ? values.bestBeforeDate
                                                            .split("-")
                                                            .reverse()
                                                            .join("-")
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    const selectedDate = e.target.value;
                                                    const formattedDate = selectedDate
                                                        .split("-")
                                                        .reverse()
                                                        .join("-");
                                                    handleChange({
                                                        target: {
                                                            name: "bestBeforeDate",
                                                            value: formattedDate,
                                                        },
                                                    });
                                                }}
                                                onBlur={handleBlur}
                                                error={
                                                    touched.bestBeforeDate &&
                                                    Boolean(errors.bestBeforeDate)
                                                }
                                                helperText={
                                                    touched.bestBeforeDate && errors.bestBeforeDate
                                                }
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
                                                error={
                                                    touched.hsncode &&
                                                    Boolean(errors.hsncode)
                                                }
                                                helperText={
                                                    touched.hsncode && errors.hsncode
                                                }
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

                                    <Typography variant="h6" sx={{ fontWeight: 600, marginTop: 2 }}>
                                        Location data
                                    </Typography>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12} sm={6} md={2.4}>
                                            <TextField
                                                fullWidth
                                                error={touched.locationId && Boolean(errors.locationId)}
                                                helperText={touched.locationId && errors.locationId}
                                                name="locationId"
                                                size="small"
                                                label="Location ID"
                                                onFocus={() => {
                                                    if (!searchKey) {
                                                        setSearchKey(values?.locationId || "");
                                                        setShowSuggestions(true);
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setSearchKey(e.target.value)
                                                    setShowSuggestions(true)
                                                }
                                                }
                                                // onBlur={handleBlur}
                                                value={searchKey}
                                                InputProps={{
                                                    endAdornment: LocationLoading ? <CircularProgress size={20} /> : null,
                                                }}
                                            />
                                            <div ref={wrapperRef} >
                                                {showSuggestions && displayLocations?.length > 0 && (
                                                    <Paper
                                                        style={{
                                                            maxHeight: 200,
                                                            overflowY: "auto",
                                                            position: "absolute",
                                                            zIndex: 10,
                                                            width: "18%",
                                                        }}
                                                    >
                                                        <List>
                                                            {displayLocations.map((location: Location) => (
                                                                <ListItem
                                                                    key={location.loc_ID}
                                                                    component="li"
                                                                    onClick={() => {
                                                                        const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
                                                                        setSearchKey(selectedDisplay);
                                                                        setShowSuggestions(false)
                                                                        setFieldValue("locationId", location.loc_ID);
                                                                    }}
                                                                    sx={{ cursor: "pointer" }}
                                                                >
                                                                    <Tooltip
                                                                        title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                                        placement="right"
                                                                    >
                                                                        <span style={{ fontSize: '14px' }}>{location.loc_ID}, {location.city}, {location.state}, {location.pincode}</span>
                                                                    </Tooltip>
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Paper>
                                                )} </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={2.4}>
                                            <FormControl fullWidth size="small" error={touched.packagingType && Boolean(errors.packagingType)}>
                                                <InputLabel>Packaging Type</InputLabel>
                                                <Select
                                                    label="Packaging Type"
                                                    name="packagingType"
                                                    value={values.packagingType}
                                                    onChange={(e) => setFieldValue('packagingType', e.target.value)}
                                                    onBlur={handleBlur}
                                                >
                                                    {packagesLoading ? (
                                                        <MenuItem disabled>
                                                            <CircularProgress size={20} color="inherit" />
                                                            <span style={{ marginLeft: "10px" }}>Loading...</span>
                                                        </MenuItem>
                                                    ) : (
                                                        getAllPackages?.map((packages: Package) => (
                                                            <MenuItem key={packages.pac_ID} value={String(packages.pac_ID)}>
                                                                <Tooltip
                                                                    title={`${packages.packaging_type_name}, ${packages.pack_length}*${packages.pack_width}*${packages.pack_height}, ${packages.dimensions_uom}`}
                                                                    placement="right"
                                                                >
                                                                    <span>{packages.packaging_type_name}, {packages.pack_length}*{packages.pack_width}*{packages.pack_height} {packages.dimensions_uom}, {packages.pac_ID} </span>
                                                                </Tooltip>
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </Select>
                                                {touched.packagingType && errors.packagingType && (
                                                    <FormHelperText style={{ color: 'red' }}>{errors.packagingType}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={2.4} >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="generatePackagingLabel"
                                                        checked={values.generatePackagingLabel}
                                                        onChange={(e) => setFieldValue("generatePackagingLabel", e.target.checked)}
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

                                    <Typography variant="h6" sx={{ fontWeight: 600, marginTop: 1 }}>
                                        Storage data
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="fragileGoods"
                                                        checked={values.fragileGoods}
                                                        onChange={(e) => setFieldValue("fragileGoods", e.target.checked)}
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
                                                        onChange={(e) => setFieldValue("dangerousGoods", e.target.checked)}
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
                                                        onChange={(e) => setFieldValue("hazardousStorage", e.target.checked)}
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
                                                        onChange={(e) => setFieldValue("temperatureControl", e.target.checked)}
                                                    />
                                                }
                                                label="Temperature control"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box marginTop={2} textAlign="center">
                                        <CustomButtonFilled >{updateRecord ? "Update product" : "Create product"}</CustomButtonFilled>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => {
                                                setFormInitialValues(productFormInitialValues)
                                                setUpdateRecord(false)
                                                setSearchKey('')
                                                resetForm({ values: productFormInitialValues });
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
                    {productsLoading ? (
                        <DataGridSkeletonLoader columns={columns} />
                    ) : (
                        <DataGridComponent
                            columns={columns}
                            rows={rows}
                            isLoading={productsLoading}
                            paginationModel={paginationModel}
                            onPaginationModelChange={handlePaginationModelChange}
                            activeEntity='products'
                        />
                    )}
                </div>
            </Grid>
        </>
    );
};


export default withAuthComponent(ProductMasterPage);
