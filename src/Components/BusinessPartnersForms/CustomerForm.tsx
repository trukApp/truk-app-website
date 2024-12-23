import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import styles from './BusinessPartners.module.css'
import { DataGridComponent } from '../GridComponent';
import { GridColDef } from '@mui/x-data-grid';

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


const dummyCustomersData = [
    {
        id: 1,
        businessName: 'Tech Solutions',
        businessType: 'IT Services',
        officeLocation: 'Building 1, Tech Park',
        address: '123 Tech Street, Silicon Valley',
        pincode: '560001',
        state: 'California',
        country: 'USA',
        district: 'Santa Clara',
        businessId: 'TS001',
    },
    {
        id: 2,
        businessName: 'Green Farms',
        businessType: 'Agriculture',
        officeLocation: 'Farmhouse Lane',
        address: '456 Green Road, Countryside',
        pincode: '400002',
        state: 'Texas',
        country: 'USA',
        district: 'Austin',
        businessId: 'GF002',
    },
    {
        id: 3,
        businessName: 'EduCare',
        businessType: 'Education',
        officeLocation: 'Knowledge Tower',
        address: '789 Education Blvd, Metro City',
        pincode: '600003',
        state: 'New York',
        country: 'USA',
        district: 'Brooklyn',
        businessId: 'EC003',
    },
];

const columns: GridColDef[] = [
    { field: 'businessName', headerName: 'Business Name', width: 200 },
    { field: 'businessType', headerName: 'Business Type', width: 150 },
    { field: 'officeLocation', headerName: 'Office Location', width: 200 },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 250 },
    { field: 'pincode', headerName: 'Pincode', width: 100 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'country', headerName: 'Country', width: 150 },
    { field: 'district', headerName: 'District', width: 150 },
    { field: 'businessId', headerName: 'Business ID', width: 150 },
];

const CustomerForm: React.FC = () => {
    const { values, handleChange, handleBlur, errors, touched } = useFormikContext<CustomerFormValues>();

    return (
        <div>
            <h3 className={styles.mainHeding}>Customer Details</h3>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} style={{ marginTop: '50px' }}>
                    <DataGridComponent
                        columns={columns}
                        rows={dummyCustomersData}
                        isLoading={false}
                        pageSizeOptions={[10, 20]}
                        initialPageSize={10}
                    />
                </Grid>
            </Grid>

        </div>
    );
};

export default CustomerForm;
