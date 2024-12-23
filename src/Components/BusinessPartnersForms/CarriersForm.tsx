import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';
import styles from './BusinessPartners.module.css'
import { DataGridComponent } from '../GridComponent';
import { GridColDef } from '@mui/x-data-grid';

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
    { field: 'operatingRegions', headerName: 'Operating Regions', flex: 1 },
];

interface CarriersFormValues {
    carrierName: string;
    carrierVehicleType: string;
    vehicleNumber: string;
    carrierCapacity: string;
    operatingRegions: string;
}

const vehicleTypes = [
    'Truck',
    'Van',
    'Container',
    'Tanker',
    'Refrigerated Vehicle',
    'Trailer',
];

const CarriersForm: React.FC = () => {
    const { values, handleChange, handleBlur, errors, touched } = useFormikContext<CarriersFormValues>();

    return (
        <div>
            <h3 className={styles.mainHeding}>Carrier Details</h3>
            <Grid container spacing={2}>
                {/* Carrier Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Carrier Name"
                        name="carrierName"
                        value={values.carrierName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.carrierName && Boolean(errors.carrierName)}
                        helperText={touched.carrierName && errors.carrierName}
                    />
                </Grid>

                {/* Vehicle Type */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Vehicle Type"
                        name="vehicleType"
                        value={values.carrierVehicleType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.carrierVehicleType && Boolean(errors.carrierVehicleType)}
                        helperText={touched.carrierVehicleType && errors.carrierVehicleType}
                    >
                        {vehicleTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Vehicle Number */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Vehicle Number"
                        name="vehicleNumber"
                        value={values.vehicleNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.vehicleNumber && Boolean(errors.vehicleNumber)}
                        helperText={touched.vehicleNumber && errors.vehicleNumber}
                    />
                </Grid>

                {/* Capacity */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Capacity (Tons)"
                        name="capacity"
                        type="number"
                        value={values.carrierCapacity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.carrierCapacity && Boolean(errors.carrierCapacity)}
                        helperText={touched.carrierCapacity && errors.carrierCapacity}
                    />
                </Grid>

                {/* Operating Regions */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Operating Regions"
                        name="operatingRegions"
                        value={values.operatingRegions}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.operatingRegions && Boolean(errors.operatingRegions)}
                        helperText={touched.operatingRegions && errors.operatingRegions}
                    />
                </Grid>
            </Grid>
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

export default CarriersForm;
