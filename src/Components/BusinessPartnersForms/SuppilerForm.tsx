// import React from 'react';
// import { TextField, Grid, MenuItem } from '@mui/material';
// import { useFormikContext } from 'formik';
// import styles from './BusinessPartners.module.css'

// import { DataGridComponent } from '../GridComponent';

// const dummyTransporterData = [
//     {
//         id: 1,
//         transporterId: 'TR001',
//         vehicleType: 'Truck',
//         capacity: '15 Tons',
//         operatingRoutes: 'Delhi - Mumbai',
//     },
//     {
//         id: 2,
//         transporterId: 'TR002',
//         vehicleType: 'Mini Van',
//         capacity: '2 Tons',
//         operatingRoutes: 'Bangalore - Chennai',
//     },
//     {
//         id: 3,
//         transporterId: 'TR003',
//         vehicleType: 'Container',
//         capacity: '30 Tons',
//         operatingRoutes: 'Kolkata - Hyderabad',
//     },
//     {
//         id: 4,
//         transporterId: 'TR004',
//         vehicleType: 'Pickup Truck',
//         capacity: '5 Tons',
//         operatingRoutes: 'Pune - Ahmedabad',
//     },
//     {
//         id: 5,
//         transporterId: 'TR005',
//         vehicleType: 'Trailer',
//         capacity: '50 Tons',
//         operatingRoutes: 'Chandigarh - Jaipur',
//     },
// ];


// const transporterColumns = [
//     { field: 'transporterId', headerName: 'Transporter ID', width: 150 },
//     { field: 'vehicleType', headerName: 'Vehicle Type', width: 150 },
//     { field: 'capacity', headerName: 'Capacity', width: 150 },
//     { field: 'operatingRoutes', headerName: 'Operating Routes', flex: 1 },
// ];

// interface SupplierFormValues {
//     transporterId: string;
//     vehicleType: string;
//     capacity: string;
//     operatingRoutes: string;
// }

// const vehicleTypes = ['Truck', 'Van', 'Container', 'Tanker'];

// const SuppilerForm: React.FC = () => {
//     const { values, handleChange, handleBlur, errors, touched } = useFormikContext<SupplierFormValues>();

//     return (
//         <div>
//             <h3 className={styles.mainHeding}>Supplier Details</h3>
//             <Grid container spacing={2}>
//                 {/* Transporter ID */}
//                 <Grid item xs={12} sm={6}>
//                     <TextField
//                         fullWidth
//                         label="Transporter ID"
//                         name="transporterId"
//                         value={values.transporterId}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={touched.transporterId && Boolean(errors.transporterId)}
//                         helperText={touched.transporterId && errors.transporterId}
//                     />
//                 </Grid>

//                 {/* Vehicle Type */}
//                 <Grid item xs={12} sm={6}>
//                     <TextField
//                         fullWidth
//                         select
//                         label="Vehicle Type"
//                         name="vehicleType"
//                         value={values.vehicleType}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={touched.vehicleType && Boolean(errors.vehicleType)}
//                         helperText={touched.vehicleType && errors.vehicleType}
//                     >
//                         {vehicleTypes.map((type) => (
//                             <MenuItem key={type} value={type}>
//                                 {type}
//                             </MenuItem>
//                         ))}
//                     </TextField>
//                 </Grid>

//                 {/* Capacity */}
//                 <Grid item xs={12} sm={6}>
//                     <TextField
//                         fullWidth
//                         label="Capacity (in Tons)"
//                         name="capacity"
//                         type="number"
//                         value={values.capacity}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={touched.capacity && Boolean(errors.capacity)}
//                         helperText={touched.capacity && errors.capacity}
//                     />
//                 </Grid>

//                 {/* Operating Routes */}
//                 <Grid item xs={12}>
//                     <TextField
//                         fullWidth
//                         label="Operating Routes"
//                         name="operatingRoutes"
//                         value={values.operatingRoutes}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={touched.operatingRoutes && Boolean(errors.operatingRoutes)}
//                         helperText={touched.operatingRoutes && errors.operatingRoutes}
//                         multiline
//                         rows={3}
//                     />
//                 </Grid>
//             </Grid>
//             <Grid item xs={12} style={{ marginTop: '50px' }}>
//                 <DataGridComponent
//                     columns={transporterColumns}
//                     rows={dummyTransporterData}
//                     isLoading={false}
//                     pageSizeOptions={[10, 20]}
//                     initialPageSize={10}
//                 />
//             </Grid>
//         </div>
//     );
// };

// export default SuppilerForm;



import React from 'react';
import { TextField, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { useFormikContext } from 'formik';
import styles from './BusinessPartners.module.css';


interface SupplierFormValues {
    vendorId: string;
    name: string;
    locationId: string;
    address: string;
    correspondence: string;
    contactPerson: string;
    contactNumber: string;
    emailId: string;
    locationOfDestinations: string[];
    podRelevant: boolean;
    orderingAddress: string;
    goodsSupplier: string;
    forwardingAgent: string;
}

const SuppilerForm: React.FC = () => {
    const {
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        setFieldValue,
    } = useFormikContext<SupplierFormValues>();

    return (
        <div>
            <h3 className={styles.mainHeding}>General Data</h3>
            <Grid container spacing={2}>
                {/* Vendor ID */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Vendor ID"
                        name="vendorId"
                        value={values.vendorId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.vendorId && Boolean(errors.vendorId)}
                        helperText={touched.vendorId && errors.vendorId}
                    />
                </Grid>

                {/* Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                    />
                </Grid>

                {/* Location ID */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Location ID"
                        name="locationId"
                        value={values.locationId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.locationId && Boolean(errors.locationId)}
                        helperText={touched.locationId && errors.locationId}
                    />
                </Grid>

                {/* Address */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        disabled
                    />
                </Grid>

                {/* Correspondence */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Correspondence"
                        name="correspondence"
                        value={values.correspondence}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.correspondence && Boolean(errors.correspondence)}
                        helperText={touched.correspondence && errors.correspondence}
                        multiline
                        rows={3}
                    />
                </Grid>

                {/* Contact Person */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Contact Person"
                        name="contactPerson"
                        value={values.contactPerson}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.contactPerson && Boolean(errors.contactPerson)}
                        helperText={touched.contactPerson && errors.contactPerson}
                    />
                </Grid>

                {/* Contact Number */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Contact Number"
                        name="contactNumber"
                        type="tel"
                        value={values.contactNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.contactNumber && Boolean(errors.contactNumber)}
                        helperText={touched.contactNumber && errors.contactNumber}
                    />
                </Grid>

                {/* Email ID */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Email ID"
                        name="emailId"
                        type="email"
                        value={values.emailId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.emailId && Boolean(errors.emailId)}
                        helperText={touched.emailId && errors.emailId}
                    />
                </Grid>

                {/* Location of Destinations */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Location of Destinations"
                        name="locationOfDestinations"
                        // value={values.locationOfDestinations.join(', ')}
                        onChange={(e) =>
                            setFieldValue(
                                'locationOfDestinations',
                                e.target.value.split(',').map((item) => item.trim())
                            )
                        }
                        onBlur={handleBlur}
                        error={
                            touched.locationOfDestinations &&
                            Boolean(errors.locationOfDestinations)
                        }
                        helperText={
                            touched.locationOfDestinations && errors.locationOfDestinations
                        }
                    />
                </Grid>

                {/* POD Relevant */}
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="podRelevant"
                                checked={values.podRelevant}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        }
                        label="POD Relevant"
                    />
                </Grid>
            </Grid>

            <h3 className={styles.mainHeding}>Partner Functions</h3>
            <Grid container spacing={2}>
                {/* Ordering Address */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Ordering Address"
                        name="orderingAddress"
                        value={values.orderingAddress}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.orderingAddress && Boolean(errors.orderingAddress)}
                        helperText={touched.orderingAddress && errors.orderingAddress}
                    />
                </Grid>

                {/* Goods Supplier */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Goods Supplier"
                        name="goodsSupplier"
                        value={values.goodsSupplier}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.goodsSupplier && Boolean(errors.goodsSupplier)}
                        helperText={touched.goodsSupplier && errors.goodsSupplier}
                    />
                </Grid>

                {/* Forwarding Agent */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
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
        </div>
    );
};

export default SuppilerForm;
