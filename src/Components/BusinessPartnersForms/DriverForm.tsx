import React, { useState } from 'react';
import { Box, Button, Collapse, Grid, TextField, FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDriverRegistrationMutation, useGetAllDriversDataQuery } from '@/api/apiSlice';
import { withAuthComponent } from '../WithAuthComponent';
import { GridColDef } from '@mui/x-data-grid';
interface DriverFormValues {
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

interface Driver {
  dri_ID: string;
  driver_name: string;
  location_loc_ID: string;
  driver_correspondence: {
    email: string;
    phone: string;
    expiry_date: string;
    driving_license: string;
  };
  location_city: string;
  location_country: string;
  location_state: string;
  vehicle_types: string[];
  logged_in: number;
  driver_id: number;
}

// const dummyDriverData = [
//   {
//     id: 1,
//     driverID: 'DR001',
//     driverName: 'John Doe',
//     locationID: 'LOC123',
//     address: '123 Main St',
//     drivingLicense: 'DL123456789',
//     expiryDate: '2025-12-31',
//     driverContactNumber: '1234567890',
//     emailID: 'john.doe@example.com',
//     vehicleTypes: ['Truck', 'Van'],
//     loggedIntoApp: true,
//   },
// ];

const driverColumns: GridColDef[] = [
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
  const [driverRegistration] = useDriverRegistrationMutation();
  const [showForm, setShowForm] = useState(false);

  const { data, error, isLoading } = useGetAllDriversDataQuery({})
  console.log("all drivers data :", data?.drivers)
  const driversData = data?.drivers.length > 0 ? data?.drivers : []

  if (isLoading) {
    console.log("Loading All drivers Data...");
  }

  if (error) {
    console.error("getting error while fetching the drivers data:", error);
  }
  console.log("drivers", driversData)

  const initialDriverValues: DriverFormValues = {
    driverName: '',
    locationID: '',
    address: '',
    drivingLicense: '',
    expiryDate: '',
    driverContactNumber: '',
    emailID: '',
    vehicleTypes: [],
    loggedIntoApp: false,
  };

  const driverValidationSchema = Yup.object({
    driverName: Yup.string().required('Driver Name is required'),
    locationID: Yup.string().required('Location ID is required'),
    address: Yup.string().required('Address is required'),
    drivingLicense: Yup.string().required('Driving License is required'),
    expiryDate: Yup.string().required('Expiry Date is required'),
    driverContactNumber: Yup.string().required('Contact Number is required'),
    emailID: Yup.string().email('Invalid email format').required('Email ID is required'),
  });

  const driversDataRows = driversData.map((driver: Driver) => ({
    id: driver.driver_id, // Unique row identifier
    driverID: driver.dri_ID,
    driverName: driver.driver_name,
    locationID: driver.location_loc_ID,
    drivingLicense: driver.driver_correspondence?.driving_license,
    expiryDate: driver.driver_correspondence?.expiry_date,
    driverContactNumber: driver.driver_correspondence?.phone,
    emailID: driver.driver_correspondence?.email,
    vehicleTypes: driver.vehicle_types?.join(', '), // Combine array into a string
    loggedIntoApp: driver.logged_in ? 'Yes' : 'No',
  })) || [];



  const handleDriverSubmit = async (values: DriverFormValues) => {
    console.log('Driver Form Submitted:', values);
    try {
      const body = {
        drivers: [{
          location_id: values?.locationID,
          driver_name: values?.driverName,
          address: values?.address,
          driver_correspondence: {
            driving_license: values?.drivingLicense,
            expiry_date: values?.expiryDate,
            phone: values?.driverContactNumber,
            email: values?.emailID
          },
          vehicle_types: values?.vehicleTypes,
          logged_in: values?.loggedIntoApp
        }
        ]
      }
      console.log("body: ", body)

      const response = await driverRegistration(body).unwrap();
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <div className={styles.formsMainContainer}>
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          onClick={() => setShowForm((prev) => !prev)}
          className={styles.createButton}
        >
          Create Driver
          {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
        </Button>
      </Box>

      <Collapse in={showForm}>
        <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
          <Formik
            initialValues={initialDriverValues}
            validationSchema={driverValidationSchema}
            onSubmit={handleDriverSubmit}
          >
            {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
              <Form>
                <h4 className={styles.mainHeading}>General Data</h4>
                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Driver Name"
                      name="driverName"
                      value={values.driverName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.driverName && Boolean(errors.driverName)}
                      helperText={touched.driverName && errors.driverName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Location ID"
                      name="locationID"
                      value={values.locationID}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.locationID && Boolean(errors.locationID)}
                      helperText={touched.locationID && errors.locationID}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
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

                <h4 className={styles.mainHeading}>Correspondence</h4>
                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Driving License"
                      name="drivingLicense"
                      value={values.drivingLicense}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.drivingLicense && Boolean(errors.drivingLicense)}
                      helperText={touched.drivingLicense && errors.drivingLicense}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Expiry Date"
                      name="expiryDate"
                      type="date"
                      value={values.expiryDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.expiryDate && Boolean(errors.expiryDate)}
                      helperText={touched.expiryDate && errors.expiryDate}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Contact Number"
                      name="driverContactNumber"
                      value={values.driverContactNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.driverContactNumber && Boolean(errors.driverContactNumber)}
                      helperText={touched.driverContactNumber && errors.driverContactNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Email ID"
                      name="emailID"
                      type="email"
                      value={values.emailID}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.emailID && Boolean(errors.emailID)}
                      helperText={touched.emailID && errors.emailID}
                    />
                  </Grid>
                </Grid>

                <h4 className={styles.mainHeading}>Vehicle & Status</h4>
                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Vehicle Types"
                      name="vehicleTypes"
                      value={values.vehicleTypes}
                      onChange={(e) => setFieldValue('vehicleTypes', e.target.value)}
                      onBlur={handleBlur}
                      error={touched.vehicleTypes && Boolean(errors.vehicleTypes)}
                      helperText={touched.vehicleTypes && errors.vehicleTypes}
                      SelectProps={{
                        multiple: true,
                      }}
                    >
                      {['Truck', 'Mini Auto', 'Lorry'].map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.loggedIntoApp}
                          onChange={(e) => setFieldValue('loggedIntoApp', e.target.checked)}
                        />
                      }
                      label="Logged Into App"
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
          columns={driverColumns}
          rows={driversDataRows}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </Grid>

    </div>
  );
};

export default withAuthComponent(DriverForm);
