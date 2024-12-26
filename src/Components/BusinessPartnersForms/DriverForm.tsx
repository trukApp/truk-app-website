import React from 'react';
import { TextField, Grid, } from '@mui/material';
import { useFormikContext } from 'formik';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';

interface DriverFormValues {
  driverID: string;
  driverName: string;
  locationID: string;
  address: string;
  drivingLicense: string;
  expiryDate: string;
  driverContactNumber: string;
  emailID: string;
  vehicleTypes: string[];
  loggedIntoApp: boolean;
}

const dummyDriverData = [
  {
    id: 1,
    driverID: 'DR001',
    driverName: 'John Doe',
    locationID: 'LOC123',
    address: '123 Main St',
    drivingLicense: 'DL123456789',
    expiryDate: '2025-12-31',
    driverContactNumber: '1234567890',
    emailID: 'john.doe@example.com',
    vehicleTypes: ['Truck', 'Van'],
    loggedIntoApp: true,
  },
  // Add more dummy data as needed
];

const driverColumns = [
  { field: 'driverID', headerName: 'Driver ID', width: 150 },
  { field: 'driverName', headerName: 'Name', width: 200 },
  { field: 'locationID', headerName: 'Location ID', width: 150 },
  { field: 'drivingLicense', headerName: 'Driving License', width: 200 },
  { field: 'expiryDate', headerName: 'Expiry Date', width: 150 },
  { field: 'driverContactNumber', headerName: 'Contact Number', width: 150 },
  { field: 'emailID', headerName: 'Email ID', width: 200 },
  { field: 'vehicleTypes', headerName: 'Vehicle Types', width: 200 },
  { field: 'loggedIntoApp', headerName: 'Logged In', width: 100 },
];

const DriverForm: React.FC = () => {
  const { values, handleChange, handleBlur, errors, touched } = useFormikContext<DriverFormValues>();

  return (
    <div>
      {/* General Data */}
      <h4 className={styles.mainHeding}>General Data</h4>
      <Grid container spacing={2} style={{ marginBottom: '30px' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Driver ID"
            name="driverID"
            value={values.driverID}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.driverID && Boolean(errors.driverID)}
            helperText={touched.driverID && errors.driverID}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={values.driverName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.driverName && Boolean(errors.driverName)}
            helperText={touched.driverName && errors.driverName}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location ID"
            name="locationID"
            value={values.locationID}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.locationID && Boolean(errors.locationID)}
            helperText={touched.locationID && errors.locationID}
          />
        </Grid>
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
          />
        </Grid>
      </Grid>

      {/* Correspondence */}
      <h4 className={styles.mainHeding}>Correspondence</h4>
      <Grid container spacing={2} style={{ marginBottom: '30px' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Driving License Number"
            name="drivingLicense"
            value={values.drivingLicense}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.drivingLicense && Boolean(errors.drivingLicense)}
            helperText={touched.drivingLicense && errors.drivingLicense}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={values.expiryDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.expiryDate && Boolean(errors.expiryDate)}
            helperText={touched.expiryDate && errors.expiryDate}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Contact Number"
            name="contactNumber"
            value={values.driverContactNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.driverContactNumber && Boolean(errors.driverContactNumber)}
            helperText={touched.driverContactNumber && errors.driverContactNumber}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email ID"
            name="emailID"
            type="email"
            value={values.emailID}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.emailID && Boolean(errors.emailID)}
            helperText={touched.emailID && errors.emailID}
            required
          />
        </Grid>
      </Grid>

      {/* Vehicle Types Handling */}
      {/* <h4 className={styles.mainHeding}>Vehicle Types Handling</h4> */}

      {/* Data Grid */}
      <Grid item xs={12} style={{ marginTop: '50px' }}>
        <DataGridComponent
          columns={driverColumns}
          rows={dummyDriverData}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </Grid>
    </div>
  );
};

export default DriverForm;
