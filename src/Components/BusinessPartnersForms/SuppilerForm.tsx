import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';
import styles from './BusinessPartners.module.css'

import { DataGridComponent } from '../GridComponent';

const dummyTransporterData = [
    {
        id: 1,
        transporterId: 'TR001',
        vehicleType: 'Truck',
        capacity: '15 Tons',
        operatingRoutes: 'Delhi - Mumbai',
    },
    {
        id: 2,
        transporterId: 'TR002',
        vehicleType: 'Mini Van',
        capacity: '2 Tons',
        operatingRoutes: 'Bangalore - Chennai',
    },
    {
        id: 3,
        transporterId: 'TR003',
        vehicleType: 'Container',
        capacity: '30 Tons',
        operatingRoutes: 'Kolkata - Hyderabad',
    },
    {
        id: 4,
        transporterId: 'TR004',
        vehicleType: 'Pickup Truck',
        capacity: '5 Tons',
        operatingRoutes: 'Pune - Ahmedabad',
    },
    {
        id: 5,
        transporterId: 'TR005',
        vehicleType: 'Trailer',
        capacity: '50 Tons',
        operatingRoutes: 'Chandigarh - Jaipur',
    },
];


const transporterColumns = [
    { field: 'transporterId', headerName: 'Transporter ID', width: 150 },
    { field: 'vehicleType', headerName: 'Vehicle Type', width: 150 },
    { field: 'capacity', headerName: 'Capacity', width: 150 },
    { field: 'operatingRoutes', headerName: 'Operating Routes', flex: 1 },
];

interface SupplierFormValues {
    transporterId: string;
    vehicleType: string;
    capacity: string;
    operatingRoutes: string;
}

const vehicleTypes = ['Truck', 'Van', 'Container', 'Tanker'];

const SuppilerForm: React.FC = () => {
    const { values, handleChange, handleBlur, errors, touched } = useFormikContext<SupplierFormValues>();

    return (
        <div>
            <h3 className={styles.mainHeding}>Supplier Details</h3>
            <Grid container spacing={2}>
                {/* Transporter ID */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Transporter ID"
                        name="transporterId"
                        value={values.transporterId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.transporterId && Boolean(errors.transporterId)}
                        helperText={touched.transporterId && errors.transporterId}
                    />
                </Grid>

                {/* Vehicle Type */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Vehicle Type"
                        name="vehicleType"
                        value={values.vehicleType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.vehicleType && Boolean(errors.vehicleType)}
                        helperText={touched.vehicleType && errors.vehicleType}
                    >
                        {vehicleTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Capacity */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Capacity (in Tons)"
                        name="capacity"
                        type="number"
                        value={values.capacity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.capacity && Boolean(errors.capacity)}
                        helperText={touched.capacity && errors.capacity}
                    />
                </Grid>

                {/* Operating Routes */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Operating Routes"
                        name="operatingRoutes"
                        value={values.operatingRoutes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.operatingRoutes && Boolean(errors.operatingRoutes)}
                        helperText={touched.operatingRoutes && errors.operatingRoutes}
                        multiline
                        rows={3}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '50px' }}>
                <DataGridComponent
                    columns={transporterColumns}
                    rows={dummyTransporterData}
                    isLoading={false}
                    pageSizeOptions={[10, 20]}
                    initialPageSize={10}
                />
            </Grid>
        </div>
    );
};

export default SuppilerForm;
