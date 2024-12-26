import React from 'react';
import { TextField, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { useFormikContext } from 'formik';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import { GridColDef } from '@mui/x-data-grid';

interface CustomerFormValues {
    customerId: string;
    name: string;
    locationId: string;
    pincode: string;
    state: string;
    city: string;
    district: string;
    country: string;

    contactPerson: string;
    contactNumber: string;
    emailId: string;

    locationOfSource: string[];
    podRelevant: boolean;

    shipToParty: string;
    soldToParty: string;
    billToParty: string;
}

const columns: GridColDef[] = [
    { field: 'customerId', headerName: 'Customer ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'locationId', headerName: 'Location ID', width: 150 },
    { field: 'pincode', headerName: 'Pincode', width: 100 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'district', headerName: 'District', width: 150 },
    { field: 'country', headerName: 'Country', width: 150 },
];

const dummyCustomersData = [
    {
        id: 1,
        customerId: 'CUST001',
        name: 'John Doe',
        locationId: 'LOC123',
        pincode: '123456',
        state: 'California',
        city: 'Los Angeles',
        district: 'Downtown',
        country: 'USA',
    },
];

const CustomerForm: React.FC = () => {
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = useFormikContext<CustomerFormValues>();

    return (
        <div>
            {/* General Data Section */}
            <h3 className={styles.mainHeding}>General Data</h3>
            <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Customer ID"
                        name="customerId"
                        value={values.customerId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.customerId && Boolean(errors.customerId)}
                        helperText={touched.customerId && errors.customerId}
                    />
                </Grid>
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
                {/* Add other fields for pincode, state, city, district, and country */}
            </Grid>

            {/* Correspondence Section */}
            <h3 className={styles.mainHeding}>Correspondence</h3>
            <Grid container spacing={2} style={{ marginBottom: '30px' }}>
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
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Contact Number"
                        name="contactNumber"
                        value={values.contactNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.contactNumber && Boolean(errors.contactNumber)}
                        helperText={touched.contactNumber && errors.contactNumber}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
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

            {/* Shipping Section */}
            <h3 className={styles.mainHeding}>Shipping</h3>
            <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Location of Source"
                        name="locationOfSource"
                        value={values.locationOfSource.join(', ')}
                        onChange={(e) => setFieldValue('locationOfSource', e.target.value.split(', '))}
                        onBlur={handleBlur}
                        error={touched.locationOfSource && Boolean(errors.locationOfSource)}
                        helperText={touched.locationOfSource && errors.locationOfSource}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={values.podRelevant}
                                onChange={(e) => setFieldValue('podRelevant', e.target.checked)}
                            />
                        }
                        label="POD Relevant"
                    />
                </Grid>
            </Grid>

            {/* Partner Functions Section */}
            <h3 className={styles.mainHeding}>Partner Functions</h3>
            <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Ship To Party"
                        name="shipToParty"
                        value={values.shipToParty}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.shipToParty && Boolean(errors.shipToParty)}
                        helperText={touched.shipToParty && errors.shipToParty}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Sold To Party"
                        name="soldToParty"
                        value={values.soldToParty}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.soldToParty && Boolean(errors.soldToParty)}
                        helperText={touched.soldToParty && errors.soldToParty}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Bill To Party"
                        name="billToParty"
                        value={values.billToParty}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.billToParty && Boolean(errors.billToParty)}
                        helperText={touched.billToParty && errors.billToParty}
                    />
                </Grid>
            </Grid>

            {/* Customer List */}
            <Grid item xs={12} style={{ marginTop: '50px' }}>
                <DataGridComponent
                    columns={columns}
                    rows={dummyCustomersData}
                    isLoading={false}
                    pageSizeOptions={[10, 20]}
                    initialPageSize={10}
                />
            </Grid>
        </div>
    );
};

export default CustomerForm;
