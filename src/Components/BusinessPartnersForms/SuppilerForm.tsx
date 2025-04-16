import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Collapse, Grid, TextField, FormControlLabel, Checkbox, Backdrop, CircularProgress, List, Paper, ListItem } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { DataGridComponent } from '../GridComponent';
import styles from './BusinessPartners.module.css'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCustomerRegistrationMutation, useDeleteBusinessPartnerMutation, useEditBusinessPartnerMutation, useGetAllVendorsDataQuery, useGetFilteredLocationsQuery, useGetLocationMasterQuery } from '@/api/apiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MassUpload from '../MassUpload/MassUpload';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from '../MasterDataComponents/Locations';
import { useLazyQuery, useQuery} from "@apollo/client";
import { GET_ALL_LOCATIONS, SEARCH_LOCATIONS,GET_BUSINESS_PARTNERS } from '@/api/graphqlApiSlice';
interface PartnerFunctions {
    forwarding_agent: string;
    goods_supplier: string;
    ordering_address: string;
}
interface Correspondence {
    contact_person: string;
    contact_number: string;
    email: string;
}
export interface Customer {
    supplierID: string;
    location_country: string;
    location_city: string;
    location_state: string;
    location_pincode: string;
    loc_ID: string;
    pod_relevant: number;
    partner_id: number;
    supplier_id: string;
    customer_id: string;
    name: string;
    partner_type: string;
    loc_of_source: string;
    loc_of_source_pincode: string;
    loc_of_source_state: string;
    loc_of_source_city: string;
    loc_of_source_country: string;
    partner_functions: PartnerFunctions;
    correspondence: Correspondence;
    location_loc_ID: string;
    loc_of_source_loc_ID: string;
}

const initialSupplierValues = {
    supplierID: '',
    name: '',
    locationId: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
    contactPerson: '',
    contactNumber: '',
    emailId: '',
    locationOfSource: '',
    podRelevant: false,
    orderingAddress: '',
    goodsSupplier: '',
    forwardingAgent: '',
    supplier_id: ''
};


const SupplierForm: React.FC = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const wrapperRefDest = useRef<HTMLDivElement>(null);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [showForm, setShowForm] = useState(false);
    const [updateRecord, setUpdateRecord] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState(initialSupplierValues);
    const [updateRecordData, setUpdateRecordData] = useState<Customer | null>(null);
    const [updateRecordId, setUpdateRecordId] = useState(0)
    const [searchKeyDestination, setSearchKeyDestination] = useState('');
    const [showDestinations, setShowDestinations] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [updatePartnerDetails, { isLoading: postVendorLoading }] = useEditBusinessPartnerMutation();
    const [customerRegistration, { isLoading: editVendorLoading }] = useCustomerRegistrationMutation();
    const [deleteBusinessPartner, { isLoading: deleteVendorLoading }] = useDeleteBusinessPartnerMutation()
    // const { data, error, isLoading } = useGetAllVendorsDataQuery({
    //     partner_type: "vendor", page: paginationModel.page + 1, limit: paginationModel.pageSize
    // })

    const { data, loading, error } = useQuery(GET_BUSINESS_PARTNERS, {
        variables: {
          partner_type: "vendor", // example
        },
        
      });
    const {data:locationsData,error: getLocationsError } = useQuery(GET_ALL_LOCATIONS, {
        variables: { page:1, limit: 10 },
      });
    const getAllLocations = locationsData?.getAllLocations?.locations.length > 0 ? locationsData?.getAllLocations?.locations : []

    // const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });
    const { loading:filteredLocationLoading, error:searnerr, data:filteredLocations } = useQuery(SEARCH_LOCATIONS, {
        variables: { searchKey },
        skip: searchKey.length < 3, // Avoid fetching when input is too short
      });
    const displayLocations = searchKey ? filteredLocations?.searchLocations.results || [] : getAllLocations;




    // const { data: destinationFilteredLocations,isLoading: filteredDestinationLoading } = useGetFilteredLocationsQuery(searchKeyDestination.length >= 3 ? searchKeyDestination : null, { skip: searchKeyDestination.length < 3 });
    console.log(searchKeyDestination)
    const { loading:filteredDestinationLoading,error:Desearnerr,  data:destinationFilteredLocations } = useQuery(SEARCH_LOCATIONS, {
        variables: {searchKey: searchKeyDestination },
        skip: searchKeyDestination.length < 3, // Avoid fetching when input is too short
      });
    
      console.log(destinationFilteredLocations)
    const displayLocationsDest = searchKeyDestination ? destinationFilteredLocations?.searchLocations.results || [] : getAllLocations;

    const getLocationDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        const details = [
            location.loc_ID,
            location?.loc_dec,
            location.city,
            location.state,
            location.pincode,
            location.country,
        ].filter(Boolean);

        return details.length > 0 ? details.join(", ") : "Location details not available";
    };
    if (getLocationsError) {
        console.log("getLocationsError: ", getLocationsError)
    }
    const vendorsData = data?.getBusinessPartners.partners.length > 0 ? data?.getBusinessPartners.partners : []
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
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRefDest.current && !wrapperRefDest.current.contains(event.target as Node)) {
                setShowDestinations(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    if (error) {
        console.error("getting error while fetching the customers data:", error);
    }
    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };
    const mapRowToInitialValues = (rowData: Customer) => ({
        supplierID: rowData.supplier_id || '',
        name: rowData.name || '',
        locationId: rowData.location_loc_ID || '',
        pincode: rowData.location_pincode || '',
        state: rowData.location_state || '',
        city: rowData.location_city || '',
        district: '',
        country: rowData.location_country || '',
        contactPerson: rowData?.correspondence?.contact_person || '',
        contactNumber: rowData?.correspondence?.contact_number || '',
        emailId: rowData?.correspondence?.email || '',
        locationOfSource: rowData.loc_of_source_loc_ID,
        podRelevant: rowData?.pod_relevant === 1,
        forwardingAgent: rowData?.partner_functions?.forwarding_agent || '',
        goodsSupplier: rowData?.partner_functions?.goods_supplier || '',
        orderingAddress: rowData?.partner_functions?.ordering_address || '',
        supplier_id: rowData.supplier_id || '',

    });

    const handleDelete = async (rowData: Customer) => {
        const deleteId = rowData?.partner_id;
        if (!deleteId) {
            console.error("Row ID is missing");
            setSnackbarMessage("Error: Partner ID is missing!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const confirmed = window.confirm("Are you sure you want to delete this partner?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await deleteBusinessPartner(deleteId);
            if (response.data.deleted_record) {
                setSnackbarMessage(`Supplier ID ${response.data.deleted_record} deleted successfully!`);
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error deleting partner:", error);
            setSnackbarMessage("Failed to delete partner. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    const handleEdit = async (rowData: Customer) => {
        setShowForm(true)
        setUpdateRecord(true)
        setUpdateRecordData(rowData)
        setUpdateRecordId(rowData?.partner_id)
        const updatedInitialValues = await mapRowToInitialValues(rowData);
        setFormInitialValues(updatedInitialValues);
        console.log(rowData?.location_loc_ID, rowData?.loc_of_source_loc_ID)
        setSearchKey(rowData?.loc_ID)
        setSearchKeyDestination(rowData?.loc_of_source)
    };

    const columns: GridColDef[] = [
        { field: 'supplier_id', headerName: 'Supplier ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: "loc_ID",
            headerName: "Supplier Location ID",
            width: 250,
        },
        {
            field: "loc_of_source",
            headerName: "Source Location ID",
            width: 250,
        },
        { field: "contact_person", headerName: "Contact Person", width: 200 },
        { field: "contact_number", headerName: "Contact Number", width: 150 },
        { field: "email", headerName: "Email", width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
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

    const rows = vendorsData.map((item: Customer) => ({
        id: item.partner_id,
        ...item,
        loc_of_source: getLocationDetails(item?.loc_of_source),
        loc_ID: getLocationDetails(item?.loc_ID),
        contact_person: item.correspondence?.contact_person || "",
        contact_number: item.correspondence?.contact_number || "",
        email: item.correspondence?.email || "",
        // ordering_address: getVendorDetails(item.partner_functions?.ordering_address) || "",
        // goods_supplier: getVendorDetails(item.partner_functions?.goods_supplier) || "",
        // forwarding_agent: getVendorDetails(item.partner_functions?.forwarding_agent) || "",
    }));

    const supplierValidationSchema = Yup.object({
        // supplierId: Yup.string().required('Supplier ID is required'),
        name: Yup.string().required('Name is required'),
        locationId: Yup.string().required('Location ID is required'),
        pincode: Yup.string().required('Pincode is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
       contactNumber: Yup.string()
            .matches(/^\d{10}$/, 'Contact number must be exactly 10 digits')
            .max(10, 'Contact number cannot exceed 10 digits')
            .required('Contact number is required'),
        emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
        locationOfSource: Yup.string().required('Location of source is required'),
        orderingAddress: Yup.string().required('Ordering address is required'),
        goodsSupplier: Yup.string().required('Goods supplier is required'),
        forwardingAgent: Yup.string().required('Forwarding agent is required')
    });

    const handleSupplierSubmit = async (values: typeof initialSupplierValues, { resetForm }: { resetForm: () => void }) => {
        try {
            const body = {
                partners: [
                    {
                        name: values?.name,
                        partner_type: "vendor",
                        loc_ID: values?.locationId,
                        correspondence: {
                            contact_person: values?.contactPerson,
                            contact_number: values?.contactNumber,
                            email: values?.emailId
                        },
                        loc_of_source: values?.locationOfSource,
                        pod_relevant: values?.podRelevant,
                        partner_functions: {
                            ordering_address: values?.orderingAddress,
                            goods_supplier: values?.goodsSupplier,
                            forwarding_agent: values?.forwardingAgent
                        }
                    }
                ]
            }
            const editBody = {
                supplier_id: updateRecordData?.supplier_id,
                name: values?.name,
                partner_type: "vendor",
                loc_ID: values?.locationId,
                correspondence: {
                    contact_person: values?.contactPerson,
                    contact_number: values?.contactNumber,
                    email: values?.emailId
                },
                loc_of_source: values?.locationOfSource,
                pod_relevant: values?.podRelevant,
                partner_functions: {
                    ordering_address: values?.orderingAddress,
                    goods_supplier: values?.goodsSupplier,
                    forwarding_agent: values?.forwardingAgent
                }
            }
            if (updateRecord) {
                const response = await updatePartnerDetails({ body: editBody, partnerId: updateRecordId }).unwrap();
                if (response?.updated_record) {
                    setSnackbarMessage(`Supplier ID ${response.updated_record} updated successfully!`);
                    setFormInitialValues(initialSupplierValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData(null)
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    setSearchKey('')
                    setSearchKeyDestination('')
                    resetForm()
                }
            } else {
                const response = await customerRegistration(body).unwrap();
                if (response?.created_records) {
                    setSnackbarMessage(`Supplier ID ${response.created_records[0]} created successfully!`);
                    setFormInitialValues(initialSupplierValues)
                    setShowForm(false)
                    setUpdateRecord(false)
                    setUpdateRecordId(0)
                    setUpdateRecordData(null)
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    setSearchKey('')
                    setSearchKeyDestination('')
                    resetForm()
                }
            }
        } catch (error) {
            console.error('API Error:', error);
            setSnackbarMessage("Something went wrong! Please try again");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <div className={styles.formsMainContainer}>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={postVendorLoading || editVendorLoading || deleteVendorLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button 
                    onClick={() => setShowForm((prev) => !prev)}
                    className={styles.createButton}
                >
                    Create Vendor
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
                </Button>
                <MassUpload arrayKey='partners' partnerType="vendor" />
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={formInitialValues}
                        validationSchema={supplierValidationSchema}
                        onSubmit={handleSupplierSubmit}
                        enableReinitialize={true}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, setFieldValue, resetForm }) => (
                            <Form>
                                <h3 className={styles.mainHeading}>General Data</h3>
                                <Grid container spacing={2}>
                                    {updateRecord &&
                                        <Grid item xs={12} sm={6} md={2.4}>
                                            <TextField
                                                fullWidth size='small' disabled
                                                label="Supplier ID"
                                                name="supplierID"
                                                value={values.supplierID}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Grid>
                                    }
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth
                                            name="locationId"
                                            size="small"
                                            label="Location ID"
                                            onFocus={() => {
                                                if (!searchKey) {
                                                    setSearchKey(values.locationId || '');
                                                    setShowSuggestions(true);
                                                }
                                            }}
                                            onChange={(e) => {
                                                setSearchKey(e.target.value)
                                                setShowSuggestions(true)
                                            }
                                            }
                                            value={searchKey}
                                            error={
                                                touched.locationId && Boolean(errors.locationId)
                                            }
                                            helperText={
                                                touched?.locationId && typeof errors?.locationId === "string"
                                                    ? errors.locationId
                                                    : ""
                                            }
                                            InputProps={{
                                                endAdornment: filteredLocationLoading ? <CircularProgress size={20} /> : null,
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
                                                                    setShowSuggestions(false)
                                                                    const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
                                                                    setSearchKey(selectedDisplay);
                                                                    // setSearchKey(location.loc_ID);
                                                                    setFieldValue("locationId", location.loc_ID)
                                                                    const matchedLocation = getAllLocations.find((loc: Location) => loc.loc_ID === location.loc_ID);

                                                                    if (matchedLocation) {
                                                                        setFieldValue('address1', matchedLocation.address_1 || '');
                                                                        setFieldValue('address2', matchedLocation.address_2 || '');
                                                                        setFieldValue('city', matchedLocation.city || '');
                                                                        setFieldValue('district', matchedLocation.district || '');
                                                                        setFieldValue('state', matchedLocation.state || '');
                                                                        setFieldValue('country', matchedLocation.country || '');
                                                                        setFieldValue('pincode', matchedLocation.pincode || '');
                                                                    } else {
                                                                        setFieldValue('city', '');
                                                                        setFieldValue('district', '');
                                                                        setFieldValue('state', '');
                                                                        setFieldValue('country', '');
                                                                        setFieldValue('pincode', '');
                                                                    }

                                                                }}
                                                                sx={{ cursor: "pointer" }}
                                                            >
                                                                <span style={{ fontSize: '13px' }}>{location.loc_ID},{location?.loc_desc}, {location.city}, {location.state}, {location.pincode}</span>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Paper>
                                            )}
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Pincode"
                                            name="pincode" disabled
                                            value={values.pincode}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="City"
                                            name="city" disabled
                                            value={values.city}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small' disabled
                                            label="State"
                                            name="state"
                                            value={values.state}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                </Grid>


                                <h3 className={styles.mainHeading}>Correspondence</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Contact Person"
                                            name="contactPerson"
                                            value={values.contactPerson}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactPerson && Boolean(errors.contactPerson)}
                                            helperText={touched.contactPerson && errors.contactPerson}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Contact Number" type="number"
                                            name="contactNumber"
                                            value={values.contactNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactNumber && Boolean(errors.contactNumber)}
                                            helperText={touched.contactNumber && errors.contactNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Email ID"
                                            name="emailId"
                                            value={values.emailId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.emailId && Boolean(errors.emailId)}
                                            helperText={touched.emailId && errors.emailId}
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Shipping</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>

                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth
                                            name="locationOfSource"
                                            size="small"
                                            label="Location of Source"
                                            onFocus={() => {
                                                if (!searchKeyDestination) {
                                                    setSearchKeyDestination(values?.locationOfSource[0] || "");
                                                    setShowDestinations(true);
                                                }
                                            }}
                                            onChange={(e) => {
                                                setSearchKeyDestination(e.target.value)
                                                setShowDestinations(true)
                                            }
                                            }
                                            value={searchKeyDestination}
                                            error={touched?.locationOfSource && Boolean(errors?.locationOfSource)}
                                            helperText={
                                                touched?.locationOfSource && typeof errors?.locationOfSource === "string"
                                                    ? errors.locationOfSource
                                                    : ""
                                            }
                                            InputProps={{
                                                endAdornment: filteredDestinationLoading ? <CircularProgress size={20} /> : null,
                                            }}
                                        />
                                        <div ref={wrapperRefDest} >
                                            {showDestinations && displayLocationsDest?.length > 0 && (
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
                                                        {displayLocationsDest.map((location: Location) => (
                                                            <ListItem
                                                                key={location.loc_ID}
                                                                component="li"
                                                                onClick={() => {
                                                                    setShowDestinations(false)
                                                                    const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
                                                                    setSearchKeyDestination(selectedDisplay);
                                                                    // setSearchKeyDestination(location.loc_ID);
                                                                    setFieldValue("locationOfSource", location.loc_ID);
                                                                }}
                                                                sx={{ cursor: "pointer" }}
                                                            >
                                                                {/* <Tooltip
                                                                    title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                                    placement="right"
                                                                >
                                                                </Tooltip> */}
                                                                <span style={{ fontSize: '13px' }}>{location.loc_ID},{location?.loc_desc}, {location.city}, {location.state}, {location.pincode}</span>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Paper>
                                            )}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.podRelevant}
                                                    onChange={(e) => setFieldValue('podRelevant', e.target.checked)}
                                                />
                                            }
                                            label="POD Relevant"
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Partner Functions</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Ordering Address"
                                            name="orderingAddress"
                                            value={values.orderingAddress}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.orderingAddress && Boolean(errors.orderingAddress)}
                                            helperText={touched.orderingAddress && errors.orderingAddress}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Goods Supplier"
                                            name="goodsSupplier"
                                            value={values.goodsSupplier}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.goodsSupplier && Boolean(errors.goodsSupplier)}
                                            helperText={touched.goodsSupplier && errors.goodsSupplier}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Forwarding Agent"
                                            name="forwardingAgent"
                                            value={values.forwardingAgent}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.forwardingAgent && Boolean(errors.forwardingAgent)}
                                            helperText={touched.forwardingAgent && errors.forwardingAgent}
                                        />
                                    </Grid>
                                </Grid>

                                <Box marginTop={3} textAlign="center">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#83214F",
                                            color: "#fff",
                                            "&:hover": {
                                                backgroundColor: "#fff",
                                                color: "#83214F"
                                            }
                                        }}
                                    >
                                        {updateRecord ? "Update Supplier" : "Create Supplier"}
                                    </Button>

                                    <Button variant="outlined" color="secondary"
                                        onClick={() => {
                                            setFormInitialValues(initialSupplierValues)
                                            setUpdateRecord(false)
                                            resetForm()
                                            setSearchKey('')
                                            setSearchKeyDestination('')
                                        }}
                                        style={{ marginLeft: "10px" }}>Reset
                                    </Button>

                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Collapse>

            <div style={{ marginTop: "40px" }}>
                {loading ? (
                    <DataGridSkeletonLoader columns={columns} />
                ) : (
                    <DataGridComponent
                        columns={columns}
                        rows={rows}
                        isLoading={loading}
                        paginationModel={paginationModel}
                        activeEntity='vendors'
                        onPaginationModelChange={handlePaginationModelChange}
                    />
                )}
            </div>
        </div>
    );
};

export default SupplierForm;