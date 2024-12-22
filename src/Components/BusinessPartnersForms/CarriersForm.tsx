import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';

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
            <h3>Carrier Details</h3>
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
        </div>
    );
};

export default CarriersForm;
