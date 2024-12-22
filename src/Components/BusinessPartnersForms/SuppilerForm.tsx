import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';

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
            <h3>Supplier Details</h3>
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
        </div>
    );
};

export default SuppilerForm;
