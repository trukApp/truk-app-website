'use client';

import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  // FormControl,
  // Chip,
  // InputLabel,
  // MenuItem,
  // OutlinedInput,
  // Select,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DataGridComponent } from '../GridComponent';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css';
import { useGetLocationMasterQuery, usePostLocationMasterMutation, useEditLocationMasterMutation, useDeleteLocationMasterMutation } from '@/api/apiSlice';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MassUpload from '../MassUpload/MassUpload';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { CustomButtonFilled } from '../ReusableComponents/ButtonsComponent';
import { GET_ALL_LOCATIONS } from '@/api/graphqlApiSlice';
import { useQuery } from '@apollo/client';

export interface Location {
  location_id: number;
  loc_ID: string;
  loc_desc: string;
  loc_type: string;
  gln_code: string;
  iata_code: string;
  longitude: string;
  latitude: string;
  time_zone: string;
  address_1: string;
  address_2: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  contact_name: string;
  contact_phone_number: string;
  contact_email: string;
  def_ship_from: number | boolean;
  def_bill_to: number | boolean;
  locationId: string
}

// Define the type for each row in the DataGrid
interface DataGridRow {
  id: string;
  locationId: string;
  locationDescription: string;
  locationType: string;
  glnCode: string;
  iataCode: string;
  longitude: string;
  latitude: string;
  timeZone: string;
  addressLine1: string,
  addressLine2: string,
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  vehiclesNearBy: [],
  locationContactName: string;
  locationContactNumber: string;
  locationContactEmail: string;
}


// Validation schema
const validationSchema = Yup.object({
  locationDescription: Yup.string().required('Location description is required'),
  locationType: Yup.string().required('Location type is required'),
  latitude: Yup.string().required('Latitude  is required'),
  longitude: Yup.string().required('Longitude  is required'),
  timeZone: Yup.string().required('Time zone is required'),
  addressLine1: Yup.string().required('Address line 1 is required'),
  city: Yup.string().required('City  is required'),
  state: Yup.string().required('State  is required'),
  country: Yup.string().required('Country is required'),
  pincode: Yup.string().required('Pincode is required'),
  locationContactName: Yup.string().required('Contact person name is required'),
  locationContactNumber: Yup.string().required('Phone number is required'),
  locationContactEmail: Yup.string().required('Email is required'),
  // vehiclesNearBy: Yup.array()
  // .min(1, 'Select at least one vehicle')
  // .required('Required'),

});

const Locations: React.FC = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRow, setEditRow] = useState<DataGridRow | null>(null);;
  const { data, error, isLoading } = useGetLocationMasterQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize });
  const [postLocation, { isLoading: postLocationLoading }] = usePostLocationMasterMutation();
  const [editLocation, { isLoading: editLocationLoading }] = useEditLocationMasterMutation();
  const [deleteLocation, { isLoading: deleteLocationLoading }] = useDeleteLocationMasterMutation()
  console.log('all locations :', data?.locations)

  if (error) {
    console.error("Error fetching locations:", error);
  }

  const locationsMaster = data?.locations
//graphQlAPi
  const { loading:getallLoads, error:er, data:getallLocations } = useQuery(GET_ALL_LOCATIONS, {
    // variables: { page, limit: 10 },
  });

  if (getallLoads) return <p>Loading...</p>;
  if (er) return <p>Error: {er.message}</p>;
  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const handleFormSubmit = async (values: DataGridRow) => {
    try {
      const body = {
        locations: [
          {
            loc_desc: values.locationDescription,
            longitude: values.longitude,
            latitude: values.latitude,
            time_zone: values.timeZone,
            address_1: values.addressLine1,
            address_2: values.addressLine2,
            city: values.city,
            state: values.state,
            country: values.country,
            pincode: values.pincode,
            loc_type: values.locationType,
            gln_code: values.glnCode,
            iata_code: values.iataCode,
            contact_name: values?.locationContactName,
            contact_phone_number: values?.locationContactNumber,
            contact_email: values?.locationContactEmail

          }
        ]
      }
      const editBody = {
        loc_desc: values.locationDescription,
        longitude: values.longitude,
        latitude: values.latitude,
        time_zone: values.timeZone,
        address_1: values.addressLine1,
        address_2: values.addressLine2,
        city: values.city,
        state: values.state,
        country: values.country,
        pincode: values.pincode,
        loc_type: values.locationType,
        gln_code: values.glnCode,
        iata_code: values.iataCode,
        contact_name: values?.locationContactName,
        contact_phone_number: values?.locationContactNumber,
        contact_email: values?.locationContactEmail
      }
      if (isEditing && editRow) {
        const locationId = editRow.id
        const response = await editLocation({ body: editBody, locationId }).unwrap()
        if (response?.updated_record) {
          setSnackbarMessage(`Location ID ${response.updated_record} updated successfully!`);
          formik.resetForm();
          setShowForm(false)
          setIsEditing(false)
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      }
      else {
        const response = await postLocation(body).unwrap();
        if (response?.created_records) {
          setSnackbarMessage(`Location ID ${response.created_records[0]} created successfully!`);
          formik.resetForm();
          setShowForm(false)
          setIsEditing(false)
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      setSnackbarMessage("Something went wrong! please try again");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setShowForm(false)
    }
  }

  const handleEdit = (row: DataGridRow) => {
    setShowForm(true)
    setIsEditing(true)
    setEditRow(row)
  };

  const handleDelete = async (row: DataGridRow) => {
    const locationId = row?.id;
    if (!locationId) {
      setSnackbarMessage("Error: Location ID is missing!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteLocation(locationId);
      if (response.data.deleted_record) {
        setSnackbarMessage(`Location ID ${response.data.deleted_record} deleted successfully!`);
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting location:", error);

      // Show error snackbar
      setSnackbarMessage("Failed to delete location. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      locationId: '',
      locationDescription: editRow ? editRow?.locationDescription : '',
      locationType: '',
      glnCode: '',
      iataCode: '',
      longitude: '',
      latitude: '',
      timeZone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: '',
      country: '',
      pincode: '',
      vehiclesNearBy: [],
      locationContactName: '',
      locationContactNumber: '',
      locationContactEmail: ''
    },
    validationSchema,
    onSubmit: handleFormSubmit
  });

  useEffect(() => {
    if (editRow) {
      console.log('edit row :', editRow)
      formik.setValues({
        id: editRow.id,
        locationId: editRow.locationId,
        locationDescription: editRow.locationDescription,
        locationType: editRow.locationType,
        glnCode: editRow.glnCode !=='NA' ? editRow.glnCode : "",
        iataCode: editRow.iataCode !=='NA' ? editRow.iataCode : "" ,
        longitude: editRow.longitude,
        latitude: editRow.latitude,
        timeZone: editRow.timeZone,
        city: editRow.city,
        addressLine1: editRow.addressLine1 ? editRow.addressLine1 : '',
        addressLine2: editRow.addressLine2 ? editRow.addressLine2 :'',
        district: editRow.district,
        state: editRow.state,
        country: editRow.country,
        pincode: editRow.pincode,
        vehiclesNearBy: editRow.vehiclesNearBy,
        locationContactName: editRow.locationContactName,
        locationContactNumber: editRow.locationContactNumber,
        locationContactEmail: editRow.locationContactEmail,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRow]);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;


  const rows = locationsMaster?.map((location: Location) => ({
    id: location.location_id,
    locationId: location.loc_ID,
    locationDescription: location.loc_desc,
    locationType: location.loc_type,
    glnCode: location.gln_code || 'NA',
    iataCode: location.iata_code || 'NA',
    longitude: location.longitude,
    latitude: location.latitude,
    timeZone: location.time_zone,
    city: location.city,
    addressLine1: location.address_1,
    addressLine2: location.address_2,
    state: location.state,
    country: location.country,
    pincode: location.pincode,
    locationContactName: location.contact_name,
    locationContactNumber: location.contact_phone_number,
    locationContactEmail: location.contact_email,
  })) || [];

  const columns: GridColDef[] = [
    { field: "locationId", headerName: "Location ID", width: 150 },
    { field: "locationDescription", headerName: "Description", width: 200 },
    { field: "locationType", headerName: "Type", width: 150 },
    { field: "glnCode", headerName: "GLN Code", width: 150 },
    { field: "iataCode", headerName: "IATA Code", width: 150 },
    { field: "longitude", headerName: "Longitude", width: 150 },
    { field: "latitude", headerName: "Latitude", width: 150 },
    { field: "timeZone", headerName: "Time Zone", width: 150 },
    { field: "addressLine1", headerName: "Address Line1", width: 150 },
    { field: "addressLine2", headerName: "Address Line2", width: 150 },
    { field: "city", headerName: "City", width: 150 },
    // { field: "district", headerName: "District", width: 150 },
    { field: "state", headerName: "State", width: 150 },
    { field: "country", headerName: "Country", width: 150 },
    { field: "pincode", headerName: "Pincode", width: 150 },
    // { field: "locationContactName", headerName: "Contact Name", width: 200 },
    // { field: "locationContactNumber", headerName: "Contact Number", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Backdrop
        sx={{
          color: "#ffffff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={postLocationLoading || editLocationLoading || deleteLocationLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          boxSizing: 'border-box',
        }}
      >

        <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '20px', md: '24px' } }} align="center" gutterBottom>
          Location master
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Box gap={2}>
            <Button
              variant="contained"
              onClick={() => setShowForm((prev) => !prev)}
              className={styles.createButton}
            >
              Create Location
              {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
            </Button>
          </Box>
          <MassUpload arrayKey="locations" />
        </Box>
        <Collapse in={showForm}>
          <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
            <Grid container spacing={2} padding={2}>
              <Typography variant="h6" align="center" gutterBottom>
                1. General info
              </Typography>
              <Grid container spacing={2}>
                {isEditing &&
                 <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth disabled
                      size="small"
                      label="Location ID* (Auto-generated)"
                      name="locationId"
                      value={values.locationId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid> }
               
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Location Description*"
                    name="locationDescription"
                    value={values.locationDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.locationDescription && Boolean(errors.locationDescription)}
                    helperText={touched.locationDescription && errors.locationDescription}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Location type"
                    name="locationType"
                    value={values.locationType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="GLN Code (13 Characters Length)"
                    name="glnCode"
                    value={values.glnCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputProps={{ maxLength: 13 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="IATA Code (3 Characters Length)"
                    name="iataCode"
                    value={values.iataCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputProps={{ maxLength: 3 }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={1} sx={{ marginLeft: '3px' }}>
                <Typography gutterBottom>
                  Geographical data
                </Typography>
                <Grid container spacing={2} >
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Longitude*"
                      name="longitude"
                      value={values.longitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.longitude && Boolean(errors.longitude)}
                      helperText={touched.longitude && errors.longitude}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Latitude*"
                      name="latitude"
                      value={values.latitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.latitude && Boolean(errors.latitude)}
                      helperText={touched.latitude && errors.latitude}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Time Zone*"
                      name="timeZone"
                      value={values.timeZone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.timeZone && Boolean(errors.timeZone)}
                      helperText={touched.timeZone && errors.timeZone}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={2} ml={1} mt={2}>
                <Typography variant="h6" align="center" gutterBottom >
                  2. Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Address line 1*"
                      name="addressLine1"
                      value={values.addressLine1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.addressLine1 && Boolean(errors.addressLine1)}
                      helperText={touched.addressLine1 && errors.addressLine1}
                    // InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Address line 2"
                      name="addressLine2"
                      value={values.addressLine2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="City*"
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
                      fullWidth
                      size="small"
                      label="State*"
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
                      fullWidth
                      size="small"
                      label="Country*"
                      name="country"
                      value={values.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.country && Boolean(errors.country)}
                      helperText={touched.country && errors.country}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Pincode*"
                      name="pincode"
                      value={values.pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.pincode && Boolean(errors.pincode)}
                      helperText={touched.pincode && errors.pincode}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2} ml={1} mt={2}>
                <Typography variant="h6" align="center" gutterBottom >
                  3. Additional details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Contact person name*"
                      name="locationContactName"
                      value={values.locationContactName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.locationContactName && Boolean(errors.locationContactName)}
                      helperText={touched.locationContactName && errors.locationContactName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small" type='number'
                      label="Contact phone number*"
                      name="locationContactNumber"
                      value={values.locationContactNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.locationContactNumber && Boolean(errors.locationContactNumber)}
                      helperText={touched.locationContactNumber && errors.locationContactNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Contact email*"
                      name="locationContactEmail"
                      value={values.locationContactEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.locationContactEmail && Boolean(errors.locationContactEmail)}
                      helperText={touched.locationContactEmail && errors.locationContactEmail}
                    />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
            
            <Box sx={{ marginTop: '24px', textAlign: 'center' }}>
                <CustomButtonFilled  >{isEditing ? "Update location" : "Create location"}</CustomButtonFilled>
                <Button
                  variant='outlined'
                  color="secondary"
                  onClick={() => {
                    formik.resetForm()
                    setIsEditing(false);
                    setEditRow(null);
                  }}
                  style={{ marginLeft: "10px" }}>Reset
                </Button>
              </Box>
          </Box>
        </Collapse>
      </Box>

      <div style={{ marginTop: "40px" }}>
        {isLoading ? (
          <DataGridSkeletonLoader columns={columns} />
        ) : (
          <DataGridComponent
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            paginationModel={paginationModel}
            activeEntity='locations'
            onPaginationModelChange={handlePaginationModelChange}
          />
        )}
      </div>

    </>
  );
};

export default Locations
