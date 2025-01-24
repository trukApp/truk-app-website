import React, { useEffect, useState } from 'react';
import {
    Box, Button, Collapse, Grid, TextField, IconButton,
    FormControl,
    MenuItem,
    Select,
    FormHelperText,
    InputLabel,
    // Checkbox, FormControlLabel,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import { GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useGetCarrierMasterQuery,usePostCarrierMasterMutation,useEditCarrierMasterMutation,useDeleteCarrierMasterMutation, useGetLocationMasterQuery, useGetLanesMasterQuery } from '@/api/apiSlice';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { withAuthComponent } from '../WithAuthComponent';
import MassUpload from '../MassUpload/MassUpload';

interface Location {
    loc_ID: string;
}
interface CarrierFormFE  {
    id: string;
        carrierId: string,
        name: string,
        address: string,
        contactPerson: string,
        contactNumber: string,
        emailId: string,
        vehicleTypes: string[],
        locationIds: string[],
        laneIds: string[],
        deviceDetails: string,
        enrollSpotAuction: boolean,
        preferredCarrier: boolean,
};
export interface CarrierFormBE {
    carrier_loc_of_operation: string[];
    carrier_lanes: string[];
    vehicle_types_handling: string[];
    carrier_correspondence: {
        name: string;
        email: string;
        phone: string;
    };
    carrier_address: string;
    carrier_name: string;
    carrier_ID: string;
    cr_id: string;
    }

const CarrierForm: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
          const [isEditing, setIsEditing] = useState(false);
      const [editRow,setEditRow] = useState<CarrierFormFE | null>(null); ;
      const { data, error } = useGetCarrierMasterQuery([])
      const [postCarrier] = usePostCarrierMasterMutation()
      const [editCarrier] = useEditCarrierMasterMutation()
    const [deleteCarrier] = useDeleteCarrierMasterMutation()
    const { data: locationsData, } = useGetLocationMasterQuery([])
     const { data:lanesData } = useGetLanesMasterQuery([]);
    
    
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const getAllLanes = lanesData?.lanes.length > 0 ? lanesData?.lanes : []
    console.log("get all lanes :", getAllLanes)
     console.log('carrier data :', data?.carriers)
  if (error) {
    console.log("err while getting carrier info :", error)
    }



    
const vehicleTypeOptions = ['Truck', 'Van', 'Container', 'Trailer'];
  const handleEdit = (row: CarrierFormFE) => {
    console.log("Edit row:", row);
    setShowForm(true)
    setIsEditing(true)
    setEditRow(row)
    };

const handleDelete = async (row: CarrierFormFE) => {
  const packageId = row?.id;
  if (!packageId) {
    console.error("Row ID is missing");
    return;
  }
  const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
  
  if (!confirmed) {
    console.log("Delete canceled by user.");
    return;
  }

  try {
    const response = await deleteCarrier(packageId);
    console.log("Delete response:", response);
  } catch (error) {
    console.error("Error deleting vehicle:", error);
  }
};
    const initialCarrierValues = {
        id:'',
        carrierId: '',
        name: '',
        address: '',
        contactPerson: '',
        contactNumber: '',
        emailId: '',
        vehicleTypes: [] as string[],
        locationIds: [] as string[],
        laneIds: [] as string[],
        deviceDetails: '',
        enrollSpotAuction: false,
        preferredCarrier: false,
    };
    const [initialValues, setInitialValues] = useState(initialCarrierValues)
    console.log("edit row :", editRow)
        useEffect(() => {
            if (editRow) {
                setInitialValues(() => ({
                    id: editRow?.id || '',
                    carrierId: editRow?.carrierId || '',
                    name: editRow?.name || '',
                    address: editRow?.address || '',
                    contactPerson: editRow?.contactPerson || '',
                    contactNumber: editRow?.contactNumber || '',
                    emailId: editRow?.emailId || '',
                    vehicleTypes: editRow?.vehicleTypes || [],
                    locationIds: editRow?.locationIds || [],
                    laneIds: editRow?.laneIds || [],
                    deviceDetails: editRow?.deviceDetails || '',
                    enrollSpotAuction: editRow?.enrollSpotAuction || false,
                    preferredCarrier: editRow?.preferredCarrier || false,
                }))
    }
}, [editRow]);

    const carrierValidationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        address: Yup.string().required('Address is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
        contactNumber: Yup.string().required('Contact Number is required'),
        emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
        vehicleTypes: Yup.array().of(Yup.string()).min(1, 'Select at least one vehicle type'),
        locationIds: Yup.array().of(Yup.string()).min(1, 'Select at least one location').required('Location is required'),
        laneIds: Yup.array().of(Yup.string()).min(1, 'Select at least one lane').required('Lane IDs are required'),
        // deviceDetails: Yup.string().required('Device Details are required'),
        // enrollSpotAuction: Yup.boolean(),
        // preferredCarrier: Yup.boolean(),
    });

    const handleCarrierSubmit = async (values: CarrierFormFE) => {
        console.log('Carrier Form Submitted:', values);
        try {
            const body = {
                carriers: [
                    {
                        carrier_name: values.name,
                        carrier_address: values.address,
                        carrier_correspondence: {
                            name: values.contactPerson,
                            email: values.emailId,
                            phone: values.contactNumber
                        },
                        carrier_network_portal: 1,
                        vehicle_types_handling: values.vehicleTypes,
                        carrier_loc_of_operation:values.locationIds,
                        carrier_lanes: values.laneIds
                    },
                ]
                    }
                    const editBody=                 {
                        carrier_name: values.name,
                        carrier_address: values.address,
                        carrier_correspondence: {
                            name: values.contactPerson,
                            email: values.emailId,
                            phone: values.contactNumber
                        },
                        carrier_network_portal: 1,
                        vehicle_types_handling: values.vehicleTypes,
                        carrier_loc_of_operation:values.locationIds,
                        carrier_lanes: values.laneIds
                    }
            console.log("carrier body: ", body)
            if (isEditing && editRow) {
                // console.log('edit body is :', editBody)
                const carrierId = editRow.id
                const response = await editCarrier({body:editBody, carrierId}).unwrap()
                console.log("edit response is ", response)
                setShowForm(false)
            }
            else {
                console.log("post create carrier ",body)
                const response = await postCarrier(body).unwrap();
                setShowForm(false)
                console.log('response in post carrier:', response);

            }
        } catch (error) {
            console.error('API Error:', error);
        }
    };
    const rows = data?.carriers.map((carrier:CarrierFormBE) => ({
        id: carrier.cr_id,
        carrierId: carrier.carrier_ID,
        name: carrier.carrier_name,
        address: carrier.carrier_address,
        contactPerson: carrier.carrier_correspondence.name,
        contactNumber: carrier.carrier_correspondence.phone,
        emailId: carrier.carrier_correspondence.email,
        vehicleTypes: carrier.vehicle_types_handling,
        locationIds: carrier.carrier_loc_of_operation,
        laneIds: carrier.carrier_lanes,
        // deviceDetails: carrier.deviceDetails,
        // enrollSpotAuction: carrier.enrollSpotAuction,
        // preferredCarrier: carrier.preferredCarrier,
    }));
    
    const carrierColumns: GridColDef[] = [
    { field: 'carrierId', headerName: 'Carrier ID', width:150 },
    { field: 'name', headerName: 'Name', width:150 },
    { field: 'address', headerName: 'Address', width:150 },
    { field: 'contactPerson', headerName: 'Contact Person', width:150 },
    { field: 'contactNumber', headerName: 'Contact Number', width:150 },
    { field: 'emailId', headerName: 'Email ID', width:150 },
    { field: 'vehicleTypes', headerName: 'Vehicle Types', width:150 },
    { field: 'locationIds', headerName: 'Locations', width:150 },
    { field: 'laneIds', headerName: 'Lane IDs', width:150 },
    // { field: 'deviceDetails', headerName: 'Device Details', flex: 2 },
    // {
    //     field: 'enrollSpotAuction',
    //     headerName: 'Spot Auction',
    //     flex: 1,
    //     renderCell: (params) => params.value ? 'Yes' : 'No'
    // },
    // {
    //     field: 'preferredCarrier',
    //     headerName: 'Preferred Carrier',
    //     flex: 1,
    //     renderCell: (params) => params.value ? 'Yes' : 'No'
    // },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
];

    return (
        <div className={styles.formsMainContainer}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                    variant="contained"
                    onClick={() => setShowForm((prev) => !prev)}
                    className={styles.createButton}
                >
                    Create Carrier
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
                </Button>
                <MassUpload arrayKey='carriers'/>
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={carrierValidationSchema}
                        onSubmit={handleCarrierSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched,
                            // setFieldValue
                        }) => (
                            <Form>
                                <h3 className={styles.mainHeading}>General Data</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField disabled
                                            fullWidth size="small"
                                            label="Carrier ID"
                                            name="carrierId"
                                            value={values.carrierId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.carrierId && Boolean(errors.carrierId)}
                                            helperText={touched.carrierId && errors.carrierId}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Address"
                                            name="address"
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.address && Boolean(errors.address)}
                                            helperText={touched.address && errors.address}
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Correspondence</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Contact Person"
                                            name="contactPerson"
                                            value={values.contactPerson}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactPerson && Boolean(errors.contactPerson)}
                                            helperText={touched.contactPerson && errors.contactPerson}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Contact Number"
                                            name="contactNumber"
                                            value={values.contactNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactNumber && Boolean(errors.contactNumber)}
                                            helperText={touched.contactNumber && errors.contactNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
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

                                <h3 className={styles.mainHeading}>Transport Data</h3>
                                <Grid container spacing={2}>
                                    {/* <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Vehicle Types Handling"
                                            name="vehicleTypes"
                                            value={values.vehicleTypes}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.vehicleTypes && Boolean(errors.vehicleTypes)}
                                            helperText={touched.vehicleTypes && errors.vehicleTypes}
                                        />
                                    </Grid> */}
                                    <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth size="small" error={touched.vehicleTypes && Boolean(errors.vehicleTypes)}>
                                        <InputLabel>Vehicle Types Handling</InputLabel>
                                        <Select
                                            multiple
                                            label="Vehicle Types Handling"
                                            name="vehicleTypes"
                                            value={values.vehicleTypes}
                                            onChange={handleChange} // Formik's change handler
                                            onBlur={handleBlur}     // Formik's blur handler
                                            renderValue={(selected) => (selected as string[]).join(', ')} // Display selected items as comma-separated list
                                        >
                                            {vehicleTypeOptions.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.vehicleTypes && errors.vehicleTypes && (
                                            <FormHelperText>{errors.vehicleTypes}</FormHelperText>
                                        )}
                                    </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        {/* <TextField
                                            fullWidth size="small"
                                            label="Locations of Operation (Location IDs)"
                                            name="locationIds"
                                            value={values.locationIds}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.locationIds && Boolean(errors.locationIds)}
                                            helperText={touched.locationIds && errors.locationIds}
                                        /> */}
                                        <FormControl fullWidth size="small" error={touched.locationIds && Boolean(errors.locationIds)}>
                                        <InputLabel>Location IDs</InputLabel>
                                        <Select
                                            multiple
                                            label="Locations of Operation (Location IDs)"
                                            name="locationIds"
                                            value={values.locationIds}
                                            onChange={handleChange} // Handles updates to the selected values
                                            onBlur={handleBlur}
                                            renderValue={(selected) => (selected as string[]).join(', ')} // Display selected items as comma-separated
                                        >
                                            {getAllLocations.map((location: Location) => (
                                                <MenuItem key={location?.loc_ID} value={location?.loc_ID}>
                                                    {location.loc_ID}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.locationIds && errors.locationIds && (
                                            <FormHelperText>{errors.locationIds}</FormHelperText>
                                        )}
                                    </FormControl>

                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        {/* <TextField
                                            fullWidth size="small"
                                            label="Lane IDs"
                                            name="laneIds"
                                            value={values.laneIds}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.laneIds && Boolean(errors.laneIds)}
                                            helperText={touched.laneIds && errors.laneIds}
                                        /> */}
                                    <FormControl fullWidth size="small" error={touched.laneIds && Boolean(errors.laneIds)}>
                                    <InputLabel>Lane IDs</InputLabel>
                                    <Select
                                        multiple
                                        label="Lane IDs"
                                        name="laneIds"
                                        value={values.laneIds}
                                        onChange={handleChange} // Formik's handler for field change
                                        onBlur={handleBlur}     // Formik's handler for field blur
                                        renderValue={(selected) => (selected as string[]).join(', ')} // Display selected lanes as comma-separated
                                    >
                                        {getAllLanes.map((lane: { lane_ID: string }) => (
                                            <MenuItem key={lane.lane_ID} value={lane.lane_ID}>
                                                {lane.lane_ID}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.laneIds && errors.laneIds && (
                                        <FormHelperText>{errors.laneIds}</FormHelperText>
                                    )}
                                </FormControl>

                                    </Grid>
                                </Grid>

                                {/* <h3 className={styles.mainHeading}>Devices</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Device Details"
                                            name="deviceDetails"
                                            value={values.deviceDetails}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.deviceDetails && Boolean(errors.deviceDetails)}
                                            helperText={touched.deviceDetails && errors.deviceDetails}
                                        />
                                    </Grid>
                                </Grid> */}

                                {/* <h3 className={styles.mainHeading}>Spot Auction</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.enrollSpotAuction}
                                                    onChange={(e) => setFieldValue('enrollSpotAuction', e.target.checked)}
                                                />
                                            }
                                            label="Enroll for Spot Auction"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.preferredCarrier}
                                                    onChange={(e) => setFieldValue('preferredCarrier', e.target.checked)}
                                                />
                                            }
                                            label="Preferred Carrier"
                                        />
                                    </Grid>
                                </Grid> */}

                                <Box marginTop={3} textAlign="center">
                                    <Button type="submit" variant="contained" color="primary">
                                        {isEditing ? "Update carrier" : "Create carrier"}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Collapse>

            <Grid item xs={12} style={{ marginTop: '50px' }}>
                <DataGridComponent
                    columns={carrierColumns}
                    rows={rows}
                    isLoading={false}
                    pageSizeOptions={[10, 20]}
                    initialPageSize={10}
                />
            </Grid>
        </div>
    );
};

export default withAuthComponent(CarrierForm);
