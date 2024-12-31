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
        carrierName: "Express Logistics",
        carrierVehicleType: "Truck",
        vehicleNumber: "AB-1234",
        carrierCapacity: "15 Tons",
        operatingRegions: "California, Nevada, Arizona",
    },
    {
        id: 2,
        carrierName: "Fast Freight",
        carrierVehicleType: "Van",
        vehicleNumber: "XY-5678",
        carrierCapacity: "2 Tons",
        operatingRegions: "Texas, Oklahoma, Louisiana",
    },
    {
        id: 3,
        carrierName: "Reliable Movers",
        carrierVehicleType: "Trailer",
        vehicleNumber: "MN-9101",
        carrierCapacity: "30 Tons",
        operatingRegions: "New York, Pennsylvania, New Jersey",
    },
    {
        id: 4,
        carrierName: "Eco Transport",
        carrierVehicleType: "Electric Van",
        vehicleNumber: "EV-1122",
        carrierCapacity: "1.5 Tons",
        operatingRegions: "Washington, Oregon, California",
    },
    {
        id: 5,
        carrierName: "Swift Haulage",
        carrierVehicleType: "Container Truck",
        vehicleNumber: "CT-3344",
        carrierCapacity: "25 Tons",
        operatingRegions: "Florida, Georgia, Alabama",
    },
];

const carrierColumns: GridColDef[] = [
    { field: 'carrierName', headerName: 'Carrier Name', width: 200 },
    { field: 'carrierVehicleType', headerName: 'Vehicle Type', width: 150 },
    { field: 'vehicleNumber', headerName: 'Vehicle Number', width: 150 },
    { field: 'carrierCapacity', headerName: 'Capacity', width: 150 },
    { field: 'operatingRegions', headerName: 'Operating Regions', width: 150 },
];

const CarrierForm: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    const initialCarrierValues = {
        carrierId: '',
        name: '',
        contactPerson: '',
        contactNumber: '',
        emailId: '',
        location: '',
        serviceType: '',
        vehicleDetails: '',
        deliveryArea: '',
        isActive: false
    };

    const carrierValidationSchema = Yup.object({
        carrierId: Yup.string().required('Carrier ID is required'),
        name: Yup.string().required('Name is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
        contactNumber: Yup.string().required('Contact Number is required'),
        emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
        location: Yup.string().required('Location is required'),
        serviceType: Yup.string().required('Service Type is required'),
        vehicleDetails: Yup.string().required('Vehicle Details are required'),
        deliveryArea: Yup.string().required('Delivery Area is required'),
        isActive: Yup.boolean()
    });

    const handleCarrierSubmit = (values: typeof initialCarrierValues) => {
        console.log('Carrier Form Submitted:', values);
    };

    return (
        <div className={styles.formsMainContainer}>

            <Box display="flex" justifyContent="flex-end"  gap={2}>
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
                                <h3 className={styles.mainHeading}>Carrier Details</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Carrier ID"
                                            name="carrierId"
                                            value={values.carrierId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.carrierId && Boolean(errors.carrierId)}
                                            helperText={touched.carrierId && errors.carrierId}
                                        />
                                    </Grid>
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
                                            label="Contact Number"
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

                                <h3 className={styles.mainHeading}>Service Details</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Location"
                                            name="location"
                                            value={values.location}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.location && Boolean(errors.location)}
                                            helperText={touched.location && errors.location}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Service Type"
                                            name="serviceType"
                                            value={values.serviceType}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.serviceType && Boolean(errors.serviceType)}
                                            helperText={touched.serviceType && errors.serviceType}
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Vehicle & Delivery Details</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Vehicle Details"
                                            name="vehicleDetails"
                                            value={values.vehicleDetails}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.vehicleDetails && Boolean(errors.vehicleDetails)}
                                            helperText={touched.vehicleDetails && errors.vehicleDetails}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Delivery Area"
                                            name="deliveryArea"
                                            value={values.deliveryArea}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.deliveryArea && Boolean(errors.deliveryArea)}
                                            helperText={touched.deliveryArea && errors.deliveryArea}
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Status</h3>
                                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.isActive}
                                                    onChange={(e) => setFieldValue('isActive', e.target.checked)}
                                                />
                                            }
                                            label="Is Active"
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




// import React from 'react';
// import { Box, Button, Accordion, AccordionSummary, AccordionDetails, Grid, TextField, Checkbox, FormControlLabel, Typography } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import styles from './BusinessPartners.module.css'; // Import your styles
// import { DataGridComponent } from '../GridComponent';
// import { GridColDef } from '@mui/x-data-grid';

// const dummyCarrierData = [
//     {
//         id: 1,
//         carrierName: "Express Logistics",
//         carrierVehicleType: "Truck",
//         vehicleNumber: "AB-1234",
//         carrierCapacity: "15 Tons",
//         operatingRegions: "California, Nevada, Arizona",
//     },
//     {
//         id: 2,
//         carrierName: "Fast Freight",
//         carrierVehicleType: "Van",
//         vehicleNumber: "XY-5678",
//         carrierCapacity: "2 Tons",
//         operatingRegions: "Texas, Oklahoma, Louisiana",
//     },
//     {
//         id: 3,
//         carrierName: "Reliable Movers",
//         carrierVehicleType: "Trailer",
//         vehicleNumber: "MN-9101",
//         carrierCapacity: "30 Tons",
//         operatingRegions: "New York, Pennsylvania, New Jersey",
//     },
//     {
//         id: 4,
//         carrierName: "Eco Transport",
//         carrierVehicleType: "Electric Van",
//         vehicleNumber: "EV-1122",
//         carrierCapacity: "1.5 Tons",
//         operatingRegions: "Washington, Oregon, California",
//     },
//     {
//         id: 5,
//         carrierName: "Swift Haulage",
//         carrierVehicleType: "Container Truck",
//         vehicleNumber: "CT-3344",
//         carrierCapacity: "25 Tons",
//         operatingRegions: "Florida, Georgia, Alabama",
//     },
// ];

// const carrierColumns: GridColDef[] = [
//     { field: 'carrierName', headerName: 'Carrier Name', width: 200 },
//     { field: 'carrierVehicleType', headerName: 'Vehicle Type', width: 150 },
//     { field: 'vehicleNumber', headerName: 'Vehicle Number', width: 150 },
//     { field: 'carrierCapacity', headerName: 'Capacity', width: 150 },
//     { field: 'operatingRegions', headerName: 'Operating Regions', flex: 1 },
// ];

// const CarrierForm: React.FC = () => {
//     const initialCarrierValues = {
//         carrierId: '',
//         name: '',
//         contactPerson: '',
//         contactNumber: '',
//         emailId: '',
//         location: '',
//         serviceType: '',
//         vehicleDetails: '',
//         deliveryArea: '',
//         isActive: false
//     };

//     const carrierValidationSchema = Yup.object({
//         carrierId: Yup.string().required('Carrier ID is required'),
//         name: Yup.string().required('Name is required'),
//         contactPerson: Yup.string().required('Contact Person is required'),
//         contactNumber: Yup.string().required('Contact Number is required'),
//         emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
//         location: Yup.string().required('Location is required'),
//         serviceType: Yup.string().required('Service Type is required'),
//         vehicleDetails: Yup.string().required('Vehicle Details are required'),
//         deliveryArea: Yup.string().required('Delivery Area is required'),
//         isActive: Yup.boolean()
//     });

//     const handleCarrierSubmit = (values: typeof initialCarrierValues) => {
//         console.log('Carrier Form Submitted:', values);
//     };

//     return (
//         <div className={styles.formsMainContainer}>
//             <Accordion>
//                 {/* <AccordionSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls="carrier-form-content"
//                     id="carrier-form-header"
//                     style={{ border: '2px solid red', backgroundColor: 'transparent' }}
//                 >
//                     <Typography variant="h6">Create Carrier</Typography>
//                 </AccordionSummary> */}
//                 <AccordionSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls="carrier-form-content"
//                     id="carrier-form-header"
//                     sx={{
//                         boxShadow: 'none',
//                         backgroundColor: 'transparent',
//                         '&:hover': { backgroundColor: 'transparent' },
//                         padding: 0,
//                         minHeight: 'auto',
//                         '.MuiAccordionSummary-content': {
//                             margin: 0,
//                         },
//                         width: '10%',
//                         textAlign: 'right'
//                     }}
//                 >
//                     <Typography variant="h6">Create Carrier</Typography>
//                 </AccordionSummary>

//                 <AccordionDetails>
//                     <Box padding={2} border="1px solid #ccc" borderRadius={2}>
//                         <Formik
//                             initialValues={initialCarrierValues}
//                             validationSchema={carrierValidationSchema}
//                             onSubmit={handleCarrierSubmit}
//                         >
//                             {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
//                                 <Form>
//                                     <h3 className={styles.mainHeading}>Carrier Details</h3>
//                                     <Grid container spacing={2}>
//                                         <Grid item xs={12} sm={6} md={2.4}>
//                                             <TextField
//                                                 fullWidth size='small'
//                                                 label="Carrier ID"
//                                                 name="carrierId"
//                                                 value={values.carrierId}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 error={touched.carrierId && Boolean(errors.carrierId)}
//                                                 helperText={touched.carrierId && errors.carrierId}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6} md={2.4}>
//                                             <TextField
//                                                 fullWidth size='small'
//                                                 label="Name"
//                                                 name="name"
//                                                 value={values.name}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 error={touched.name && Boolean(errors.name)}
//                                                 helperText={touched.name && errors.name}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6} md={2.4}>
//                                             <TextField
//                                                 fullWidth size='small'
//                                                 label="Contact Person"
//                                                 name="contactPerson"
//                                                 value={values.contactPerson}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 error={touched.contactPerson && Boolean(errors.contactPerson)}
//                                                 helperText={touched.contactPerson && errors.contactPerson}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6} md={2.4}>
//                                             <TextField
//                                                 fullWidth size='small'
//                                                 label="Contact Number"
//                                                 name="contactNumber"
//                                                 value={values.contactNumber}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 error={touched.contactNumber && Boolean(errors.contactNumber)}
//                                                 helperText={touched.contactNumber && errors.contactNumber}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6} md={2.4}>
//                                             <TextField
//                                                 fullWidth size='small'
//                                                 label="Email ID"
//                                                 name="emailId"
//                                                 value={values.emailId}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 error={touched.emailId && Boolean(errors.emailId)}
//                                                 helperText={touched.emailId && errors.emailId}
//                                             />
//                                         </Grid>
//                                     </Grid>

//                                     <h3 className={styles.mainHeading}>Service Details</h3>
//                                     <Grid container spacing={2} style={{ marginBottom: '30px' }}>
//                                         <Grid item xs={12} sm={6} md={2.4}>
//                                             <TextField
//                                                 fullWidth size='small'
//                                                 label="Location"
//                                                 name="location"
//                                                 value={values.location}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 error={touched.location && Boolean(errors.location)}
//                                                 helperText={touched.location && errors.location}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6} md={2.4}>
//                                             <TextField
//                                                 fullWidth size='small'
//                                                 label="Service Type"
//                                                 name="serviceType"
//                                                 value={values.serviceType}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 error={touched.serviceType && Boolean(errors.serviceType)}
//                                                 helperText={touched.serviceType && errors.serviceType}
//                                             />
//                                         </Grid>
//                                     </Grid>

//                                     <h3 className={styles.mainHeading}>Vehicle & Delivery Details</h3>
//                                     <Grid container spacing={2} style={{ marginBottom: '30px' }}>
//                                         <Grid item xs={12} sm={6} md={2.4}>
//                                             <TextField
//                                                 fullWidth size='small'
//                                                 label="Vehicle Details"
//                                                 name="vehicleDetails"
//                                                 value={values.vehicleDetails}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 error={touched.vehicleDetails && Boolean(errors.vehicleDetails)}
//                                                 helperText={touched.vehicleDetails && errors.vehicleDetails}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6} md={2.4}>
//                                             <TextField
//                                                 fullWidth size='small'
//                                                 label="Delivery Area"
//                                                 name="deliveryArea"
//                                                 value={values.deliveryArea}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 error={touched.deliveryArea && Boolean(errors.deliveryArea)}
//                                                 helperText={touched.deliveryArea && errors.deliveryArea}
//                                             />
//                                         </Grid>
//                                     </Grid>

//                                     <h3 className={styles.mainHeading}>Status</h3>
//                                     <Grid container spacing={2} style={{ marginBottom: '30px' }}>
//                                         <Grid item xs={12}>
//                                             <FormControlLabel
//                                                 control={
//                                                     <Checkbox
//                                                         checked={values.isActive}
//                                                         onChange={(e) => setFieldValue('isActive', e.target.checked)}
//                                                     />
//                                                 }
//                                                 label="Is Active"
//                                             />
//                                         </Grid>
//                                     </Grid>

//                                     <Box marginTop={3} textAlign="center">
//                                         <Button type="submit" variant="contained" color="primary">
//                                             Submit
//                                         </Button>
//                                     </Box>
//                                 </Form>
//                             )}
//                         </Formik>
//                     </Box>
//                 </AccordionDetails>
//             </Accordion>

//             <Grid item xs={12} style={{ marginTop: '50px' }}>
//                 <DataGridComponent
//                     columns={carrierColumns}
//                     rows={dummyCarrierData}
//                     isLoading={false}
//                     pageSizeOptions={[10, 20]}
//                     initialPageSize={10}
//                 />
//             </Grid>
//         </div>
//     );
// };

// export default CarrierForm;
