import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useFormikContext } from 'formik';

interface CustomerFormValues {
    businessName: string;
    businessType: string;
    officeLocation: string;
    address: string;
    pincode: string;
    state: string;
    country: string;
    district: string;
    businessId: string;
}

const CustomerForm: React.FC = () => {
    const { values, handleChange, handleBlur, errors, touched } = useFormikContext<CustomerFormValues>();

    return (
        <div>
            <h3>Customer Details</h3>
            <Grid container spacing={2}>
                {/* Business Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Business Name"
                        name="businessName"
                        value={values.businessName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.businessName && Boolean(errors.businessName)}
                        helperText={touched.businessName && errors.businessName}
                    />
                </Grid>

                {/* Business Type */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Business Type"
                        name="businessType"
                        value={values.businessType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.businessType && Boolean(errors.businessType)}
                        helperText={touched.businessType && errors.businessType}
                    />
                </Grid>

                {/* Office Location */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Office Location"
                        name="officeLocation"
                        value={values.officeLocation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.officeLocation && Boolean(errors.officeLocation)}
                        helperText={touched.officeLocation && errors.officeLocation}
                    />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                    />
                </Grid>

                {/* Pincode */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Pincode"
                        name="pincode"
                        value={values.pincode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.pincode && Boolean(errors.pincode)}
                        helperText={touched.pincode && errors.pincode}
                    />
                </Grid>

                {/* State */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={values.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.state && Boolean(errors.state)}
                        helperText={touched.state && errors.state}
                    />
                </Grid>

                {/* Country */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={values.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.country && Boolean(errors.country)}
                        helperText={touched.country && errors.country}
                    />
                </Grid>

                {/* District */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="District"
                        name="district"
                        value={values.district}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.district && Boolean(errors.district)}
                        helperText={touched.district && errors.district}
                    />
                </Grid>

                {/* Business ID */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Business ID"
                        name="businessId"
                        value={values.businessId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.businessId && Boolean(errors.businessId)}
                        helperText={touched.businessId && errors.businessId}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default CustomerForm;
