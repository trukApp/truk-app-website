import React, { useState } from 'react';
import { Box, Button, Collapse, Grid, TextField, FormControlLabel, Checkbox, MenuItem, SelectChangeEvent, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDriverRegistrationMutation, useGetAllDriversDataQuery, useEditDriverMutation, useDeleteDriverMutation, useGetLocationMasterQuery } from '@/api/apiSlice';
import { withAuthComponent } from '../WithAuthComponent';
import { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

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
  // vehicleTypes: any;
  id: number;
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
  vehicle_types: [];
  logged_in: number;
  driver_id: number;
  location_pincode: string;
  location_longitude: string;
  location_latitude: string;
  location_loc_desc: string;
  location_loc_type: string;
  address: string;
  driverName: string;
  locationID: string;
  drivingLicense: string;
  driverContactNumber: string;
  expiryDate: string;
  vehicleTypes: string;
  emailID: string;
  loggedIntoApp: boolean;
  locationPincode: string;
  locationState: string;
  locationCity: string;
  locationCountry: string;
}

interface Location {
  city: string;
  country: string;
  gln_code: string;
  iata_code: string;
  latitude: string;
  loc_ID: string;
  loc_desc: string;
  loc_type: string;
  location_id: number;
  longitude: string;
  pincode: string;
  state: string;
  time_zone: string;
}

const initialDriverValues = {
  driverName: '',
  locationID: '',
  address: '',
  drivingLicense: '',
  expiryDate: '',
  driverContactNumber: '',
  emailID: '',
  vehicleTypes: [] as string[],
  loggedIntoApp: false,
  pincode: '',
  state: '',
  city: '',
  country: '',
};

const DriverForm: React.FC = () => {
  const [driverRegistration] = useDriverRegistrationMutation();
  const [editDriverDetails] = useEditDriverMutation()
  const [deleteDriver] = useDeleteDriverMutation()
  const [showForm, setShowForm] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState(initialDriverValues);
  const [updateRecordData, setUpdateRecordData] = useState({});
  const [updateRecordId, setUpdateRecordId] = useState(0)
  console.log("formInitialValues: ", formInitialValues)
  console.log("updateRecordId: ", updateRecordId)
  const { data, error, isLoading } = useGetAllDriversDataQuery({})
  console.log("all drivers data :", data?.drivers)
  const driversData = data?.drivers.length > 0 ? data?.drivers : []

  const { data: locationsData, error: getLocationsError } = useGetLocationMasterQuery([])
  const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
  console.log("all locations :", locationsData?.locations)
  console.log("getLocationsError: ", getLocationsError)

  if (isLoading) {
    console.log("Loading All drivers Data...");
  }

  if (error) {
    console.error("getting error while fetching the drivers data:", error);
  }
  console.log("drivers", driversData)



  const driverValidationSchema = Yup.object({
    driverName: Yup.string().required('Driver Name is required'),
    locationID: Yup.string().required('Location ID is required'),
    address: Yup.string().required('Address is required'),
    drivingLicense: Yup.string().required('Driving License is required'),
    expiryDate: Yup.string().required('Expiry Date is required'),
    driverContactNumber: Yup.string().required('Contact Number is required'),
    emailID: Yup.string().email('Invalid email format').required('Email ID is required'),
  });

  const mapRowToInitialValues = (rowData: Driver) => ({
    driverName: rowData.driverName || '',
    locationID: rowData.locationID || '',
    address: rowData.address || '',
    drivingLicense: rowData.drivingLicense || '',
    driverContactNumber: rowData.driverContactNumber || '',
    expiryDate: rowData.expiryDate || '',
    emailID: rowData.emailID || '',
    vehicleTypes: [rowData.vehicleTypes],
    pincode: rowData.locationPincode || '',
    state: rowData.locationState || '',
    city: rowData.locationCity || '',
    country: rowData.locationCountry || '',
    loggedIntoApp: rowData.loggedIntoApp === true,
  });


  const handleEdit = async (rowData: Driver) => {
    console.log('Edit clicked for:', rowData);
    setShowForm(true)
    setUpdateRecord(true)
    setUpdateRecordData(rowData)
    const updatedInitialValues = await mapRowToInitialValues(rowData);
    console.log('Updated Initial Values:', updatedInitialValues);
    setUpdateRecordId(rowData?.id)

    setFormInitialValues(updatedInitialValues);
  };

  const handleDelete = async (rowData: Driver) => {
    console.log('Delete clicked for:', rowData);
    const deleteId = rowData?.id
    const response = await deleteDriver(deleteId)
    console.log("delete response :", response)
  };

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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const driversDataRows = driversData.map((driver: Driver) => ({
    id: driver?.driver_id,
    driverID: driver?.dri_ID,
    driverName: driver?.driver_name,
    locationID: driver?.location_loc_ID,
    locationCity: driver?.location_city,
    locationCountry: driver?.location_country,
    locationState: driver?.location_state,
    locationPincode: driver?.location_pincode,
    locationLongitude: driver?.location_longitude,
    locationLatitude: driver?.location_latitude,
    locationDescription: driver?.location_loc_desc,
    locationType: driver?.location_loc_type,
    drivingLicense: driver?.driver_correspondence?.driving_license,
    expiryDate: driver?.driver_correspondence?.expiry_date,
    driverContactNumber: driver?.driver_correspondence?.phone,
    emailID: driver?.driver_correspondence?.email,
    vehicleTypes: driver?.vehicle_types.join(', '),
    loggedIntoApp: driver?.logged_in ? 'Yes' : 'No',
    address: driver?.address,
  })) || [];

  // const handleDriverSubmit = async (values: DriverFormValues) => {
  //   console.log('Driver Form Submitted:', values);
  //   try {
  //     const body = {
  //       drivers: [
  //         {
  //           location_id: values?.locationID,
  //           driver_name: values?.driverName,
  //           address: values?.address,
  //           driver_correspondence: {
  //             driving_license: values?.drivingLicense,
  //             expiry_date: values?.expiryDate,
  //             phone: values?.driverContactNumber,
  //             email: values?.emailID
  //           },
  //           vehicle_types: values?.vehicleTypes,
  //           logged_in: values?.loggedIntoApp
  //         }
  //       ]
  //     }

  //     const editBody = {
  //       ...updateRecordData,
  //       location_id: values?.locationID,
  //       driver_name: values?.driverName,
  //       address: values?.address,
  //       driver_correspondence: {
  //         driving_license: values?.drivingLicense,
  //         expiry_date: values?.expiryDate,
  //         phone: values?.driverContactNumber,
  //         email: values?.emailID
  //       },
  //       vehicle_types: values?.vehicleTypes,
  //       logged_in: values?.loggedIntoApp
  //     }
  //     console.log("body: ", body)
  //     if (updateRecord) {
  //       const response = await editDriverDetails({ body: editBody, driverId: updateRecordId }).unwrap();
  //       console.log('API Response:', response);
  //       setFormInitialValues(initialDriverValues)
  //       setShowForm(false)
  //       setUpdateRecord(false)
  //       setUpdateRecordId(0)
  //       setUpdateRecordData({})
  //     } else {
  //       const response = await driverRegistration(body).unwrap();
  //       console.log('API Response:', response);
  //       setFormInitialValues(initialDriverValues)
  //       setShowForm(false)
  //       setUpdateRecord(false)
  //       setUpdateRecordId(0)
  //       setUpdateRecordData({})
  //     }

  //   } catch (error) {
  //     console.error('API Error:', error);
  //   }
  // };

  const handleDriverSubmit: (values: DriverFormValues) => Promise<void> = async (values) => {
    console.log('Driver Form Submitted:', values);
    try {
      const body = {
        drivers: [
          {
            location_id: values?.locationID,
            driver_name: values?.driverName,
            address: values?.address,
            driver_correspondence: {
              driving_license: values?.drivingLicense,
              expiry_date: values?.expiryDate,
              phone: values?.driverContactNumber,
              email: values?.emailID,
            },
            vehicle_types: values?.vehicleTypes,
            logged_in: values?.loggedIntoApp,
          },
        ],
      };

      const editBody = {
        ...updateRecordData,
        location_id: values?.locationID,
        driver_name: values?.driverName,
        address: values?.address,
        driver_correspondence: {
          driving_license: values?.drivingLicense,
          expiry_date: values?.expiryDate,
          phone: values?.driverContactNumber,
          email: values?.emailID,
        },
        vehicle_types: values?.vehicleTypes,
        logged_in: values?.loggedIntoApp,
      };

      console.log('body: ', body);
      if (updateRecord) {
        const response = await editDriverDetails({ body: editBody, driverId: updateRecordId }).unwrap();
        console.log('API Response:', response);
        setFormInitialValues(initialDriverValues);
        setShowForm(false);
        setUpdateRecord(false);
        setUpdateRecordId(0);
        setUpdateRecordData({});
      } else {
        const response = await driverRegistration(body).unwrap();
        console.log('API Response:', response);
        setFormInitialValues(initialDriverValues);
        setShowForm(false);
        setUpdateRecord(false);
        setUpdateRecordId(0);
        setUpdateRecordData({});
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const handleLocationChange = (
    event: SelectChangeEvent<string>,
    setFieldValue: FormikProps<DriverFormValues>['setFieldValue']
  ) => {
    const selectedLocationId = event.target.value;
    setFieldValue('locationID', selectedLocationId);
    const selectedLocation = getAllLocations.find((loc: Location) => loc.location_id === Number(selectedLocationId));
    console.log(selectedLocationId)
    // Check if the selectedLocation exists before calling setFieldValue

    if (selectedLocation) {

      setFieldValue('city', selectedLocation?.city || '');
      setFieldValue('district', selectedLocation?.district || '');
      setFieldValue('state', selectedLocation?.state || '');
      setFieldValue('country', selectedLocation?.country || '');
      setFieldValue('pincode', selectedLocation?.pincode || '');
    } else {
      // Clear fields if no matching location found
      setFieldValue('locationId', '');
      setFieldValue('city', '');
      setFieldValue('district', '');
      setFieldValue('state', '');
      setFieldValue('country', '');
      setFieldValue('pincode', '');
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
            initialValues={formInitialValues}
            enableReinitialize={true}
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
                    <FormControl fullWidth size="small" error={touched.locationID && Boolean(errors.locationID)}>
                      <InputLabel>Location ID</InputLabel>
                      <Select
                        label="Location ID"
                        name="locationID"
                        value={values.locationID}
                        onChange={(event) => handleLocationChange(event, setFieldValue)}
                        onBlur={handleBlur}
                      >
                        {getAllLocations.map((location: Location) => {
                          return (
                            <MenuItem key={location?.location_id} value={location?.location_id}>
                              {location.location_id}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {touched.locationID && errors.locationID && (
                        <FormHelperText>{errors.locationID}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Pincode"
                      name="pincode"
                      value={values.pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.pincode && Boolean(errors.pincode)}
                      helperText={touched.pincode && errors.pincode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="City"
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city && errors.city}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Country"
                      name="country"
                      value={values.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.country && Boolean(errors.country)}
                      helperText={touched.country && errors.country}
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

                {updateRecord ? (
                  <Box marginTop={3} textAlign="center">
                    <Button type="submit" variant="contained" color="primary">
                      Update
                    </Button>
                  </Box>
                ) : (
                  <Box marginTop={3} textAlign="center">
                    <Button type="submit" variant="contained" color="primary">
                      Create
                    </Button>
                  </Box>
                )}
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
