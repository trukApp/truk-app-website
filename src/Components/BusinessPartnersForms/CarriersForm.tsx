import React, { useState } from 'react';
import { Box, Button, Collapse, Grid, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import { GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const dummyCarrierData = [
    {
        id: 1,
        carrierId: 'C001',
        name: 'Fast Logistics',
        address: '123 Main Street, Springfield',
        contactPerson: 'John Doe',
        contactNumber: '123-456-7890',
        emailId: 'johndoe@fastlogistics.com',
        vehicleTypes: 'Trucks, Vans',
        locationIds: 'LOC001, LOC002',
        laneIds: 'LANE001, LANE002',
        deviceDetails: 'GPS Tracker, IoT Sensors',
        enrollSpotAuction: true,
        preferredCarrier: false,
    },
    {
        id: 2,
        carrierId: 'C002',
        name: 'Express Movers',
        address: '456 Elm Street, Metropolis',
        contactPerson: 'Jane Smith',
        contactNumber: '987-654-3210',
        emailId: 'janesmith@expressmovers.com',
        vehicleTypes: 'Cargo Trucks, Trailers',
        locationIds: 'LOC003, LOC004',
        laneIds: 'LANE003, LANE004',
        deviceDetails: 'Fleet Management System',
        enrollSpotAuction: false,
        preferredCarrier: true,
    },
    {
        id: 3,
        carrierId: 'C003',
        name: 'Prime Carriers',
        address: '789 Oak Avenue, Gotham',
        contactPerson: 'Alice Johnson',
        contactNumber: '555-123-4567',
        emailId: 'alicejohnson@primecarriers.com',
        vehicleTypes: 'Refrigerated Trucks, Flatbeds',
        locationIds: 'LOC005, LOC006',
        laneIds: 'LANE005, LANE006',
        deviceDetails: 'Temperature Monitors, Dash Cams',
        enrollSpotAuction: true,
        preferredCarrier: true,
    },
];

const carrierColumns: GridColDef[] = [
    { field: 'carrierId', headerName: 'Carrier ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1.5 },
    { field: 'address', headerName: 'Address', flex: 2 },
    { field: 'contactPerson', headerName: 'Contact Person', flex: 1.5 },
    { field: 'contactNumber', headerName: 'Contact Number', flex: 1.5 },
    { field: 'emailId', headerName: 'Email ID', flex: 2 },
    { field: 'vehicleTypes', headerName: 'Vehicle Types', flex: 1.5 },
    { field: 'locationIds', headerName: 'Locations', flex: 1.5 },
    { field: 'laneIds', headerName: 'Lane IDs', flex: 1.5 },
    { field: 'deviceDetails', headerName: 'Device Details', flex: 2 },
];

const CarrierForm: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    const initialCarrierValues = {
        carrierId: '',
        name: '',
        address: '',
        contactPerson: '',
        contactNumber: '',
        emailId: '',
        vehicleTypes: '',
        locationIds: '',
        laneIds: '',
        deviceDetails: '',
        enrollSpotAuction: false,
        preferredCarrier: false,
    };

    const carrierValidationSchema = Yup.object({
        carrierId: Yup.string().required('Carrier ID is required'),
        name: Yup.string().required('Name is required'),
        address: Yup.string().required('Address is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
        contactNumber: Yup.string().required('Contact Number is required'),
        emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
        vehicleTypes: Yup.string().required('Vehicle Types Handling is required'),
        locationIds: Yup.string().required('Locations of Operation are required'),
        laneIds: Yup.string().required('Lane IDs are required'),
        deviceDetails: Yup.string().required('Device Details are required'),
        enrollSpotAuction: Yup.boolean(),
        preferredCarrier: Yup.boolean(),
    });

    const handleCarrierSubmit = (values: typeof initialCarrierValues) => {
        console.log('Carrier Form Submitted:', values);
    };

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
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={initialCarrierValues}
                        validationSchema={carrierValidationSchema}
                        onSubmit={handleCarrierSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
                            <Form>
                                <h3 className={styles.mainHeading}>General Data</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
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
                                    <Grid item xs={12} sm={6} md={4}>
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
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Locations of Operation (Location IDs)"
                                            name="locationIds"
                                            value={values.locationIds}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.locationIds && Boolean(errors.locationIds)}
                                            helperText={touched.locationIds && errors.locationIds}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Lane IDs"
                                            name="laneIds"
                                            value={values.laneIds}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.laneIds && Boolean(errors.laneIds)}
                                            helperText={touched.laneIds && errors.laneIds}
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Devices</h3>
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
                                </Grid>

                                <h3 className={styles.mainHeading}>Spot Auction</h3>
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
                                </Grid>

                                <Box marginTop={3} textAlign="center">
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
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
                    rows={dummyCarrierData}
                    isLoading={false}
                    pageSizeOptions={[10, 20]}
                    initialPageSize={10}
                />
            </Grid>
        </div>
    );
};

export default CarrierForm;
