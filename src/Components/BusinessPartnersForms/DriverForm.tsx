import React, { useState } from 'react';
import { Box, Button, Collapse, Grid, TextField, FormControlLabel, Checkbox, MenuItem, SelectChangeEvent, FormControl, InputLabel, Select, FormHelperText, Backdrop, CircularProgress, Tooltip } from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDriverRegistrationMutation, useGetAllDriversDataQuery, useEditDriverMutation, useDeleteDriverMutation, useGetLocationMasterQuery } from '@/api/apiSlice';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import DriverMassUpload from '../MassUpload/DriverMassUpload';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from '../MasterDataComponents/Locations';
interface DriverFormValues {
  driverId: string;
  driverName: string;
  locations: string[];
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  drivingLicense: string;
  expiryDate: string;
  driverContactNumber: string;
  emailID: string;
  vehicleTypes: string[];
  loggedIntoApp: boolean;
}

interface Driver {
  driverID: string;
  driverId: string;
  id: number;
  dri_ID: string;
  driver_name: string;
  locations: string[];
  driver_correspondence: {
    email: string;
    phone: string;
    expiry_date: string;
    driving_license: string;
  };
  location_city: string;
  location_country: string;
  location_state: string;
  vehicle_types: string;
  logged_in: number;
  driver_id: number;
  location_pincode: string;
  location_longitude: string;
  location_latitude: string;
  location_loc_desc: string;
  location_loc_type: string;
  address: string;
  driverName: string;
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

const initialDriverValues = {
  driverId:'',
  driverName: '',
  locations: [] as string[],
  // address: '',
  address1: '',
  address2: '',
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
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
  const [driverRegistration, { isLoading: postDriverLoading }] = useDriverRegistrationMutation();
  const [editDriverDetails, { isLoading: editDriverLoading }] = useEditDriverMutation()
  const [deleteDriver, { isLoading: deleteDriverLoading }] = useDeleteDriverMutation()
  const [showForm, setShowForm] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState(initialDriverValues);
  const [updateRecordId, setUpdateRecordId] = useState(0)
  const { data, error, isLoading } = useGetAllDriversDataQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
  const driversData = data?.drivers.length > 0 ? data?.drivers : []
  const { data: locationsData,  isLoading: isLocationLoading } = useGetLocationMasterQuery({})
  const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []

   const getLocationDetails = (loc_ID: string) => {
      const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
      if (!location) return "Location details not available";
        const details = [
          location.address_1,
          location.address_2,
          location.city,
          location.state,
          location.country,
          location.pincode
        ].filter(Boolean);
  
        return details.length > 0 ? details.join(", ") : "Location details not available";
  };
  console.log('location details :', getAllLocations)
 console.log('get drivers :', driversData)
  if (error) {
    console.error("getting error while fetching the drivers data:", error);
  }


  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const driverValidationSchema = Yup.object({
    driverName: Yup.string().required('Driver Name is required'),
    locations: Yup.array().of(Yup.string()).min(1, 'Location id is required'),
    drivingLicense: Yup.string().required('Driving License is required'),
    expiryDate: Yup.string().required('Expiry Date is required'),
    driverContactNumber: Yup.string().required('Contact Number is required').matches(/^\d{10}$/, 'Contact Number must be exactly 10 digits'),
    emailID: Yup.string().email('Invalid email format').required('Email ID is required'),
  });


  const mapRowToInitialValues = (rowData: Driver) => {
    console.log('rowData?  :', rowData )
    const matchedLocation = getAllLocations.find((loc: Location) => loc.loc_ID === rowData?.locations[0]);

    return {
      driverId:rowData?.driverID || '',
      driverName: rowData?.driverName || '',
      locations: rowData?.locations ? [...rowData.locations] : [],
      drivingLicense: rowData?.drivingLicense || '',
      driverContactNumber: rowData?.driverContactNumber || '',
      expiryDate: rowData?.expiryDate || '',
      emailID: rowData?.emailID || '',
      vehicleTypes: rowData?.vehicleTypes ? [...rowData.vehicleTypes] : [],
      loggedIntoApp: rowData?.loggedIntoApp,
      address1: matchedLocation?.address_1 || '',
      address2: matchedLocation?.address_2 || '',
      city: matchedLocation?.city || '',
      state: matchedLocation?.state || '',
      country: matchedLocation?.country || '',
      pincode: matchedLocation?.pincode || '',
    };
  };


  const handleEdit = async (rowData: Driver) => {
    setShowForm(true)
    setUpdateRecord(true)
    const updatedInitialValues = await mapRowToInitialValues(rowData);

    setUpdateRecordId(rowData?.id)

    setFormInitialValues(updatedInitialValues);
  };

  const handleDelete = async (rowData: Driver) => {
    const deleteId = rowData?.id;
    if (!deleteId) {
      console.error("Row ID is missing");
      setSnackbarMessage("Error: Driver ID is missing!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this driver?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteDriver(deleteId);
      if (response.data.deleted_record) {
        setSnackbarMessage(`Driver ID ${response.data.deleted_record} deleted successfully!`);
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      setSnackbarMessage("Failed to delete driver. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  const columns: GridColDef[] = [
    { field: 'driverID', headerName: 'Driver ID', width: 150 },
    { field: 'driverName', headerName: 'Name', width: 200 },
    // { field: 'locations', headerName: 'Location ID', width: 200 },
{
  field: "locations",
  headerName: "Location ID",
  width: 200,
  renderCell: (params) => {
    const location = Array.isArray(params.value) ? params.value[0] : params.value; 

    return (
      <Tooltip title={getLocationDetails(location)} arrow>
        <span>{location || "N/A"}</span>
      </Tooltip>
    );
  },
}
,
    { field: 'address', headerName: 'Address', width: 300 },
    { field: 'drivingLicense', headerName: 'Driving License', width: 200 },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 150,
      // Format the date or show 'N/A' if missing
    },
    { field: 'driverContactNumber', headerName: 'Contact Number', width: 150 },
    { field: 'emailID', headerName: 'Email ID', width: 200 },
    { field: 'vehicleTypes', headerName: 'Vehicle Types', width: 200 },
    // { field: 'loggedIntoApp', headerName: 'Logged In', width: 100 },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];


  const rows = driversData.map((driver: Driver) => ({
    id: driver?.driver_id,
    driverID: driver?.dri_ID,
    driverName: driver?.driver_name,
    locations: driver?.locations,
    // locationCity: driver?.location_city,
    // locationCountry: driver?.location_country,
    // locationState: driver?.location_state,
    // locationPincode: driver?.location_pincode,
    // locationLongitude: driver?.location_longitude,
    // locationLatitude: driver?.location_latitude,
    // locationDescription: driver?.location_loc_desc,
    locationType: driver?.location_loc_type,
    drivingLicense: driver?.driver_correspondence?.driving_license,
    expiryDate: driver?.driver_correspondence?.expiry_date,
    driverContactNumber: driver?.driver_correspondence?.phone,
    emailID: driver?.driver_correspondence?.email,
    vehicleTypes: driver?.vehicle_types,
    loggedIntoApp: driver?.logged_in,
    address: driver?.address,
  })) || [];

  const handleDriverSubmit: (values: DriverFormValues) => Promise<void> = async (values) => {
    try {
      const body = {
        drivers: [
          {
            locations: values?.locations,
            driver_name: values?.driverName,
            address: [values?.address1, values?.address2, values?.city, values?.state, values?.country, values?.pincode,].filter((part) => part).join(', '),
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
        // ...updateRecordData,
        locations: values?.locations,
        driver_name: values?.driverName,
        address: [values?.address1, values?.address2, values?.city, values?.state, values?.country, values?.pincode,].filter((part) => part).join(', '),
        driver_correspondence: {
          driving_license: values?.drivingLicense,
          expiry_date: values?.expiryDate,
          phone: values?.driverContactNumber,
          email: values?.emailID,
        },
        vehicle_types: values?.vehicleTypes,
        logged_in: values?.loggedIntoApp,
      };
      if (updateRecord) {
        const response = await editDriverDetails({ body: editBody, driverId: updateRecordId }).unwrap();
        if (response?.updated_record) {
          setSnackbarMessage(`Driver ID ${response.updated_record} updated successfully!`);
          setFormInitialValues(initialDriverValues);
          setShowForm(false);
          setUpdateRecord(false);
          setUpdateRecordId(0);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      } else {
        const response = await driverRegistration(body).unwrap();
        if (response?.created_records) {
          setSnackbarMessage(`Driver ID ${response.created_records[0]} created successfully!`);
          setFormInitialValues(initialDriverValues)
          setShowForm(false)
          setUpdateRecord(false)
          setUpdateRecordId(0)
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      setSnackbarMessage("Something went wrong! Please try again");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleLocationChange = (
    event: SelectChangeEvent<string>,
    setFieldValue: FormikProps<DriverFormValues>['setFieldValue']
  ) => {
    const selectedLocation = event.target.value;

    // Update the locations field as an array with a single selected value
    setFieldValue('locations', [selectedLocation]);

    // Find the selected location object
    const matchedLocation = getAllLocations.find((loc: Location) => loc.loc_ID === selectedLocation);

    if (matchedLocation) {
      // Set corresponding fields from the matched location
      setFieldValue('address1', matchedLocation.address_1 || '');
      setFieldValue('address2', matchedLocation.address_2 || '');
      setFieldValue('city', matchedLocation.city || '');
      setFieldValue('district', matchedLocation.district || '');
      setFieldValue('state', matchedLocation.state || '');
      setFieldValue('country', matchedLocation.country || '');
      setFieldValue('pincode', matchedLocation.pincode || '');
    } else {
      // Clear fields if no matching location is found
      setFieldValue('city', '');
      setFieldValue('district', '');
      setFieldValue('state', '');
      setFieldValue('country', '');
      setFieldValue('pincode', '');
    }
  };


  return (
    <div className={styles.formsMainContainer}>
      <Backdrop
        sx={{
          color: "#ffffff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={postDriverLoading || editDriverLoading || deleteDriverLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          onClick={() => setShowForm((prev) => !prev)}
          className={styles.createButton}
        >
          Create Driver
          {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
        </Button>
        <DriverMassUpload arrayKey='drivers' />
      </Box>

      <Collapse in={showForm}>
        <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
          <Formik
            initialValues={formInitialValues}
            enableReinitialize={true}
            validationSchema={driverValidationSchema}
            onSubmit={handleDriverSubmit}
          >
            {({ values, handleChange, handleBlur, errors, touched, setFieldValue, resetForm }) => (
              <Form>
                <h4 className={styles.mainHeading}>General Data</h4>
                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                  {updateRecord && 
                    <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Driver ID" disabled
                      name="driverId"
                      value={values.driverId}
                      onChange={handleChange}
                      onBlur={handleBlur} 
                    />
                  </Grid> }
                
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Driver Name"
                      name="driverName"
                      value={values.driverName}
                      onChange={handleChange}
                      onBlur={handleBlur} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <FormControl fullWidth size="small" error={touched.locations && Boolean(errors.locations)}>
                      <InputLabel>Location ID</InputLabel>
                      <Select
                        label="Location ID"
                        name="locations"
                        value={values.locations[0] || ''}
                        onChange={(event) => handleLocationChange(event, setFieldValue)}
                        onBlur={handleBlur}
                      >
                        {isLocationLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} color="inherit" />
                            <span style={{ marginLeft: "10px" }}>Loading...</span>
                          </MenuItem>
                        ) : (
                          getAllLocations?.map((location: Location) => (
                            <MenuItem key={location.loc_ID} value={String(location.loc_ID)}>
                              <Tooltip
                                title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                placement="right"
                              >
                                <span style={{ flex: 1 }}>{location.loc_ID}</span>
                              </Tooltip>
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {touched.locations && errors.locations && (
                        <FormHelperText>{errors.locations}</FormHelperText>
                      )}
                    </FormControl>

                  </Grid>

                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Pincode" disabled
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
                      label="Address1" disabled
                      name="address1"
                      value={values.address1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address1 && Boolean(errors.address1)}
                      helperText={touched.address1 && errors.address1}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Address2" disabled
                      name="address2"
                      value={values.address2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address2 && Boolean(errors.address2)}
                      helperText={touched.address2 && errors.address2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="City" disabled
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
                      label="State" disabled
                      name="state"
                      value={values.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.state && Boolean(errors.state)}
                      helperText={touched.state && errors.state}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
                      label="Country" disabled
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
                      fullWidth
                      size="small"
                      label="Expiry Date"
                      name="expiryDate"
                      type="date"
                      value={
                        values.expiryDate
                          ? values.expiryDate.split('-').reverse().join('-')
                          : ''
                      }
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        const formattedDate = selectedDate
                          .split('-')
                          .reverse()
                          .join('-');
                        handleChange({ target: { name: 'expiryDate', value: formattedDate } });
                      }}
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
                      {['Truck', 'Mini Auto', 'Lorry', 'Container', 'Van', "Trailer", "Car"].map((type) => (
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
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#83214F",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#fff",
                        color: "#83214F"
                      }
                    }}
                  >
                    {updateRecord ? "Update driver" : "Create driver"}
                  </Button>

                  <Button variant="outlined" color="secondary"
                    onClick={() => {
                      setFormInitialValues(initialDriverValues);
                      setUpdateRecord(false)
                      resetForm()
                    }}
                    style={{ marginLeft: "10px" }}>Reset
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Collapse>

      <div style={{ marginTop: "40px" }}>
        {isLoading ? (
          <DataGridSkeletonLoader columns={columns} />
        ) : (
          <DataGridComponent
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            paginationModel={paginationModel}
            activeEntity='drivers'
            onPaginationModelChange={handlePaginationModelChange}
          />
        )}
      </div>

    </div>
  );
};

export default DriverForm;
