"use client";
import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,

} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css'
import { useGetLanesMasterQuery, usePostLaneMasterMutation, useEditLaneMasterMutation, useDeleteLaneMasterMutation, useGetLocationMasterQuery, } from '@/api/apiSlice';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MassUpload from '../MassUpload/MassUpload';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from './Locations';

interface LaneDetails {
  // General Data
  id: string;
  laneId: string; // Auto-generated
  sourceLocationId: string;
  destinationLocationId: string;

  // Transport Data
  vehicleType: string;
  transportStartDate: string;
  transportEndDate: string;
  transportDistance: string;
  transportDistanceUnits: string;
  transportDuration: string;
  transportDurationUnits: string;
  transportCost: string;
  transportCostUnits: string;

  // Carrier Data
  carrierId: string;
  carrierName: string;
  carrierVehicleType: string;
  carrierStartDate: string;
  carrierEndDate: string;
  carrierCost: string;
}
// interface unitsOfMeasure {
//   unit_name: string;
//   unit_desc: string;
//   alt_unit_name :string;
//   alt_unit_desc :string;

// }

export interface Lane {
  des_state: string;
  des_city: string;
  des_loc_desc: string;
  src_state: string;
  src_city: string;
  src_loc_desc: string;
  des_loc_id: string;
  src_loc_id: string;
  des_loc_ID: string;
  lane_ID: string;
  src_loc_ID: string;
  ln_id: string;
  lane_transport_data: {
    transport_duration: string;
    transport_distance: string;
    transport_cost: string;
    end_time: string;
    start_time: string;
    vehcle_type: string;

  }

}
const TransportationLanes = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRow, setEditRow] = useState<LaneDetails | null>(null);
  const { data, error, isLoading } = useGetLanesMasterQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize });
  const unitsofMeasurement = useSelector((state: RootState) => state.auth.unitsofMeasurement);

  const [postLane, { isLoading: postLaneLoading }] = usePostLaneMasterMutation();
  const [editLane, { isLoading: editLaneLoading }] = useEditLaneMasterMutation();
  const [deleteLane, { isLoading: deleteLaneLoading }] = useDeleteLaneMasterMutation()
  const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery({});
  const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : [];

  if (error) {
    console.error("Error fetching lanes:", error);
  }

  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const handleFormSubmit = async (values: LaneDetails) => {
    try {
      const body = {
        lanes: [
          {
            src_loc_ID: values.sourceLocationId,
            des_loc_ID: values.destinationLocationId,
            lane_transport_data: {
              vehcle_type: values.vehicleType,
              start_time: values.transportStartDate,
              end_time: values.transportEndDate,
              transport_distance: `${values.transportDistance} ${values.transportDistanceUnits}`,
              transport_duration: `${values.transportDuration} ${values.transportDurationUnits}`,
              transport_cost: `${values.transportCost} ${values.transportCostUnits}`
            }
          },
        ]
      }
      const editBody = {
        src_loc_ID: values.sourceLocationId,
        des_loc_ID: values.destinationLocationId,
        lane_transport_data: {
          vehcle_type: values.vehicleType,
          start_time: values.transportStartDate,
          end_time: values.transportEndDate,
          transport_distance: `${values.transportDistance} ${values.transportDistanceUnits}`,
          transport_duration: `${values.transportDuration} ${values.transportDurationUnits}`,
          transport_cost: `${values.transportCost} ${values.transportCostUnits}`
        }
      }
      if (isEditing && editRow) {
        const laneId = editRow.id
        const response = await editLane({ body: editBody, laneId }).unwrap()
        if (response.updated_record) {
          formik.resetForm();
          setIsEditing(false)
          setSnackbarMessage(`Lane ID ${response.updated_record} updated successfully!`);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setShowForm(false)
        }

      }
      else {
        const response = await postLane(body).unwrap();
        if (response.created_records) {
          formik.resetForm();
          setSnackbarMessage(`Lane ID ${response.created_records[0]} created successfully!`);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setShowForm(false)
        }
      }

    } catch (error) {
      console.error('API Error:', error);
      setSnackbarMessage(`Something went wrong! please try again, ${error}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setShowForm(false)
    }

  }

  const handleEdit = (row: LaneDetails) => {
    setShowForm(true)
    setIsEditing(true)
    setEditRow(row)
  };

  const handleDelete = async (row: LaneDetails) => {
    const laneId = row?.id;
    if (!laneId) {
      console.error("Row ID is missing");
      setSnackbarMessage("Error: Lane ID is missing!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteLane(laneId);
      if (response.data.deleted_record) {
        setSnackbarMessage(`Lane ID ${response.data.deleted_record} deleted successfully!`);
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }

    } catch (error) {
      console.error("Error deleting lane:", error);
      setSnackbarMessage("Failed to delete lane. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  const formik = useFormik({
    initialValues: {
      // General Data
      id: '',
      laneId: '', // Auto-generated
      sourceLocationId: '',
      destinationLocationId: '',

      // Transport Data
      vehicleType: '',
      transportStartDate: '',
      transportEndDate: '',
      transportDistance: '',
      transportDistanceUnits: unitsofMeasurement[0],
      transportDuration: '',
      transportDurationUnits: unitsofMeasurement[0],
      transportCost: '',
      transportCostUnits: unitsofMeasurement[0],

      // Carrier Data
      carrierId: '',
      carrierName: '', // Auto-populated
      carrierVehicleType: '',
      carrierStartDate: '',
      carrierEndDate: '',
      carrierCost: '',
    },
    validationSchema: Yup.object({
      // General Data
      sourceLocationId: Yup.string().required('Source Location ID is required'),
      destinationLocationId: Yup.string().required('Destination Location ID is required'),

      // Transport Data
      vehicleType: Yup.string().required('Vehicle Type is required'),
      transportStartDate: Yup.string().required('Start Date is required'),
      transportEndDate: Yup.string().required('End Date is required'),
      transportDistance: Yup.string().required('Transport Distance is required'),
      transportDuration: Yup.string().required('Transport Duration is required'),
      transportCost: Yup.string().required('Transport Cost is required'),

      // Carrier Data
      // carrierId: Yup.string().required('Carrier ID is required'),
      // carrierName: Yup.string().required('Carrier Name is required'),
      // carrierVehicleType: Yup.string().required('Vehicle Type is required'),
      // carrierStartDate: Yup.date().required('Start Date is required'),
      // carrierEndDate: Yup.date().required('End Date is required'),
      // carrierCost: Yup.string().required('Carrier Cost is required'),
    }),
    onSubmit: handleFormSubmit
  });

  useEffect(() => {
    if (editRow) {
      const editDistance = editRow.transportDistance.split(" ")
      const editDuration = editRow?.transportDuration.split(" ")
      const editCost = editRow.transportCost.split(" ");
      formik.setValues({
        id: editRow.id || '',
        laneId: editRow.laneId || '',
        sourceLocationId: editRow.sourceLocationId || '',
        destinationLocationId: editRow.destinationLocationId || '',

        // Transport Data
        vehicleType: editRow.vehicleType || '',
        transportStartDate: editRow.transportStartDate || '',
        transportEndDate: editRow.transportEndDate || '',
        transportDistance: editDistance[0],
        transportDistanceUnits: editDistance[1],
        transportDuration: editDuration[0] || '',
        transportDurationUnits: editDuration[1],
        transportCost: editCost[0] || '',
        transportCostUnits: editCost[1],

        // Carrier Data
        carrierId: editRow.carrierId || '',
        carrierName: editRow.carrierName || '',
        carrierVehicleType: editRow.carrierVehicleType || '',
        carrierStartDate: editRow.carrierStartDate || '',
        carrierEndDate: editRow.carrierEndDate || '',
        carrierCost: editRow.carrierCost || '',
      });
    }
  }, [editRow, formik]);

  const rows = data?.lanes.map((lane: Lane) => ({
    id: lane?.ln_id,
    laneId: lane?.lane_ID,
    // sourceLocationId: lane?.src_loc_ID,
    // destinationLocationId: lane?.des_loc_ID,
    sourceLocationId: lane?.src_loc_ID,
    destinationLocationId: lane?.des_loc_ID,
    vehicleType: lane.lane_transport_data?.vehcle_type || "Unknown",
    transportStartDate: lane?.lane_transport_data?.start_time || "N/A",
    transportEndDate: lane?.lane_transport_data?.end_time || "N/A",
    transportDistance: lane?.lane_transport_data?.transport_distance
      ? `${lane.lane_transport_data.transport_distance}`
      : "N/A",
    transportDuration: lane?.lane_transport_data?.transport_duration || "N/A",
    transportCost: lane?.lane_transport_data?.transport_cost
      ? `${lane?.lane_transport_data?.transport_cost}`
      : "N/A",
    // carrierId: `CARRIER-${id + 1}`,
    // carrierName: `Carrier ${id + 1}`,
    // carrierVehicleType: lane.lane_transport_data?.vehcle_type || "N/A",
    // carrierStartDate: lane.lane_transport_data?.start_time || "N/A",
    // carrierEndDate: lane.lane_transport_data?.end_time || "N/A",
    // carrierCost: `$${800 + id * 40}`,
  }));


  const columns: GridColDef[] = [
    { field: "laneId", headerName: "Lane ID", width: 150 },
    { field: "sourceLocationId", headerName: "Source Location", width: 150 },
    { field: "destinationLocationId", headerName: "Destination Location", width: 180 },
    { field: "vehicleType", headerName: "Vehicle Type", width: 150 },
    { field: "transportStartDate", headerName: "Transport Start Date", width: 180 },
    { field: "transportEndDate", headerName: "Transport End Date", width: 180 },
    { field: "transportDistance", headerName: "Transport Distance", width: 160 },
    { field: "transportDuration", headerName: "Transport Duration", width: 160 },
    { field: "transportCost", headerName: "Transport Cost", width: 150 },
    // { field: "carrierId", headerName: "Carrier ID", width: 150 },
    // { field: "carrierName", headerName: "Carrier Name", width: 180 },
    // { field: "carrierVehicleType", headerName: "Carrier Vehicle Type", width: 180 },
    // { field: "carrierStartDate", headerName: "Carrier Start Date", width: 180 },
    // { field: "carrierEndDate", headerName: "Carrier End Date", width: 180 },
    // { field: "carrierCost", headerName: "Carrier Cost", width: 150 },
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
        open={postLaneLoading || editLaneLoading || deleteLaneLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '20px', md: '24px' } }} align="center" gutterBottom>
        Transportation lanes master
      </Typography>
      <Box display="flex" justifyContent="flex-end">
        <Box  >
          <Button
            variant="contained"
            onClick={() => setShowForm((prev) => !prev)}
            className={styles.createButton}
          >
            Create Lane
            {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
          </Button>
        </Box>
        <MassUpload arrayKey="lanes" />
      </Box>



      <Collapse in={showForm}>
        <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
          <form onSubmit={formik.handleSubmit}>
            {/* General Data */}
            <Box sx={{ marginBottom: 3 }}>
              <h3>1. General Data</h3>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    id="laneId" disabled
                    name="laneId"
                    label="Lane ID (Auto-generated)"
                    value={formik.values.laneId}
                    onChange={formik.handleChange}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl
                    fullWidth id='sourceLocationId'
                    size="small"
                    error={
                      formik.touched.sourceLocationId && Boolean(formik.errors.sourceLocationId)
                    }
                  >
                    <InputLabel>Source Location ID</InputLabel>
                    <Select
                      label="Source Location ID*"
                      name="sourceLocationId"
                      value={formik.values.sourceLocationId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {/* {getAllLocations.map((location: Location) => (
															<MenuItem
																key={location.loc_ID}
																value={location.loc_ID}
															>
																{location.loc_ID}
															</MenuItem>
														))} */}
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
                    {formik.touched.sourceLocationId && formik.errors.sourceLocationId && (
                      <FormHelperText>{formik.errors.sourceLocationId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl
                    fullWidth id='destinationLocationId'
                    size="small"
                    error={
                      formik.touched.destinationLocationId && Boolean(formik.errors.destinationLocationId)
                    }
                  >
                    <InputLabel>Destination Location ID</InputLabel>
                    <Select
                      label="Destination Location ID*"
                      name="destinationLocationId"
                      value={formik.values.destinationLocationId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                    {formik.touched.destinationLocationId && formik.errors.destinationLocationId && (
                      <FormHelperText>{formik.errors.destinationLocationId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Transport Data */}
            <Box sx={{ marginBottom: 3 }}>
              <h3>2. Transport Data</h3>
              <Grid container spacing={2}>
                {/* <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                id="vehicleType"
                name="vehicleType"
                label="Vehicle Type*"
                value={formik.values.vehicleType}
                onChange={formik.handleChange}
                error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
                helperText={formik.touched.vehicleType && formik.errors.vehicleType}
                size="small"
              />
            </Grid> */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    select
                    fullWidth
                    label="Vehicle Type"
                    name="vehicleType"
                    value={formik.values.vehicleType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
                    helperText={formik.touched.vehicleType && formik.errors.vehicleType}
                    size="small"
                  >
                    <MenuItem value="Truck">Truck</MenuItem>
                    <MenuItem value="Trailer">Trailer</MenuItem>
                    <MenuItem value="Container">Container</MenuItem>
                  </TextField>
                </Grid>
                {/* <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth 
                      id='transportStartDate'
                      size="small"
                      label="Start Date*"
                      name="transportStartDate"
                      type="date"
                      value={formik.values.transportStartDate
                              ? formik.values.transportStartDate.split('-').reverse().join('-'): ''}
                      onChange={(e) => {const selectedDate = e.target.value;
                                        const formattedDate = selectedDate.split('-')
                                          .reverse()
                                          .join('-');
                                        formik.handleChange({ target: { name: 'transportStartDate', value: formattedDate } });
                                  }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.transportStartDate && Boolean(formik.errors.transportStartDate)}
                      helperText={formik.touched.transportStartDate && formik.errors.transportStartDate}
                      InputLabelProps={{ shrink: true }}
                          />
                  </Grid> */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    id="transportStartDate"
                    size="small"
                    label="Start Date*"
                    name="transportStartDate"
                    type="date"
                    value={
                      formik.values.transportStartDate
                        ? formik.values.transportStartDate.split("-").reverse().join("-") // Convert DD-MM-YYYY → YYYY-MM-DD for display
                        : ""
                    }
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const formattedDate = selectedDate.split("-").reverse().join("-"); // Convert to DD-MM-YYYY
                      formik.setFieldValue("transportStartDate", formattedDate); // Store as DD-MM-YYYY
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.transportStartDate && Boolean(formik.errors.transportStartDate)}
                    helperText={formik.touched.transportStartDate && formik.errors.transportStartDate}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>


                {/* <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="transportEndDate"
                      name="transportEndDate"
                      label="End Date*"
                      type="date"
                      value={formik.values.transportEndDate}
                      onChange={formik.handleChange}
                      error={formik.touched.transportEndDate && Boolean(formik.errors.transportEndDate)}
                      helperText={formik.touched.transportEndDate && formik.errors.transportEndDate}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid> */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    id='transportEndDate'
                    size="small"
                    label="End Date*"
                    name="transportEndDate"
                    type="date"
                    value={formik.values.transportEndDate
                      ? formik.values.transportEndDate.split('-').reverse().join('-') : ''}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const formattedDate = selectedDate.split('-')
                        .reverse()
                        .join('-');
                      formik.handleChange({ target: { name: 'transportEndDate', value: formattedDate } });
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.transportEndDate && Boolean(formik.errors.transportEndDate)}
                    helperText={formik.touched.transportEndDate && formik.errors.transportEndDate}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="transportDistance"
                      name="transportDistance"
                      label="Transport Distance* (UoM)"
                      value={formik.values.transportDistance}
                      onChange={formik.handleChange}
                      error={formik.touched.transportDistance && Boolean(formik.errors.transportDistance)}
                      helperText={formik.touched.transportDistance && formik.errors.transportDistance}
                      size="small"
                    />
                  </Grid> */}
                <Grid item xs={12} sm={6} md={1.6}>
                  <TextField
                    fullWidth
                    id="transportDistance"
                    name="transportDistance"
                    label="Transport Distance* "
                    type="number"
                    value={formik.values.transportDistance}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.transportDistance && Boolean(formik.errors.transportDistance)}
                    helperText={formik.touched.transportDistance && formik.errors.transportDistance}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={0.8}>
                  <TextField
                    fullWidth name="transportDistanceUnits"
                    select onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.transportDistanceUnits}
                    size="small"
                  >
                    {unitsofMeasurement.map((unit: string) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>


                <Grid item xs={12} sm={6} md={1.6}>
                  <TextField
                    fullWidth
                    id="transportDuration"
                    name="transportDuration"
                    label="Transport Duration* "
                    type="number"
                    value={formik.values.transportDuration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.transportDuration && Boolean(formik.errors.transportDuration)}
                    helperText={formik.touched.transportDuration && formik.errors.transportDuration}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={0.8}>
                  <TextField
                    fullWidth name="transportDurationUnits"
                    select onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.transportDurationUnits}
                    size="small"
                  >
                    {unitsofMeasurement.map((unit: string) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="transportCost"
                      name="transportCost"
                      label="Transport Cost* (UoM)"
                      value={formik.values.transportCost}
                      onChange={formik.handleChange}
                      error={formik.touched.transportCost && Boolean(formik.errors.transportCost)}
                      helperText={formik.touched.transportCost && formik.errors.transportCost}
                      size="small"
                    />
                  </Grid> */}

                <Grid item xs={12} sm={6} md={1.6}>
                  <TextField
                    fullWidth
                    id="transportCost"
                    name="transportCost"
                    label="Transport Cost* "
                    type="number"
                    value={formik.values.transportCost}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.transportCost && Boolean(formik.errors.transportCost)}
                    helperText={formik.touched.transportCost && formik.errors.transportCost}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={0.8}>
                  <TextField
                    fullWidth name="transportCostUnits"
                    select onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.transportCostUnits}
                    size="small"
                  >
                    {unitsofMeasurement.map((unit: string) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

              </Grid>
            </Box>

            {/* Carrier Data */}

            {/* <Box sx={{ marginBottom: 3 }}>
                <h3>3. Carrier Data</h3>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="carrierId"
                      name="carrierId"
                      label="Carrier ID*"
                      value={formik.values.carrierId}
                      onChange={formik.handleChange}
                      error={formik.touched.carrierId && Boolean(formik.errors.carrierId)}
                      helperText={formik.touched.carrierId && formik.errors.carrierId}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="carrierName"
                      name="carrierName"
                      label="Carrier Name* (Auto-populated)"
                      value={formik.values.carrierName}
                      onChange={formik.handleChange}
                      error={formik.touched.carrierName && Boolean(formik.errors.carrierName)}
                      helperText={formik.touched.carrierName && formik.errors.carrierName}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="carrierVehicleType"
                      name="carrierVehicleType"
                      label="Vehicle Type*"
                      value={formik.values.carrierVehicleType}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.carrierVehicleType && Boolean(formik.errors.carrierVehicleType)
                      }
                      helperText={formik.touched.carrierVehicleType && formik.errors.carrierVehicleType}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="carrierStartDate"
                      name="carrierStartDate"
                      label="Start Date*"
                      type="date"
                      value={formik.values.carrierStartDate}
                      onChange={formik.handleChange}
                      error={formik.touched.carrierStartDate && Boolean(formik.errors.carrierStartDate)}
                      helperText={formik.touched.carrierStartDate && formik.errors.carrierStartDate}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="carrierEndDate"
                      name="carrierEndDate"
                      label="End Date*"
                      type="date"
                      value={formik.values.carrierEndDate}
                      onChange={formik.handleChange}
                      error={formik.touched.carrierEndDate && Boolean(formik.errors.carrierEndDate)}
                      helperText={formik.touched.carrierEndDate && formik.errors.carrierEndDate}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="carrierCost"
                      name="carrierCost"
                      label="Carrier Cost* (UoM)"
                      value={formik.values.carrierCost}
                      onChange={formik.handleChange}
                      error={formik.touched.carrierCost && Boolean(formik.errors.carrierCost)}
                      helperText={formik.touched.carrierCost && formik.errors.carrierCost}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box> */}

            {/* Submit Button */}
            <Box sx={{ textAlign: 'center', marginTop: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                {isEditing ? "Update lane" : "Create lane"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  formik.resetForm()
                  setIsEditing(false);
                  setEditRow(null);
                }}
                style={{ marginLeft: "10px" }}
              >
                Reset
              </Button>
            </Box>

          </form>
        </Box>
      </Collapse>


      {/* data grid */}
      {/* <div style={{ marginTop: "40px" }}>
        <DataGridComponent
          columns={columns}
          rows={rows}
          isLoading={false}
          pageSizeOptions={[10, 20, 30]}
          initialPageSize={10}
        />
      </div> */}
      <div style={{ marginTop: "40px" }}>
        {isLoading ? (
          <DataGridSkeletonLoader columns={columns} />
        ) : (
          <DataGridComponent
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            paginationModel={paginationModel}
            activeEntity='lanes'
            onPaginationModelChange={handlePaginationModelChange}
          />
        )}
      </div>
    </>
  );
};

export default TransportationLanes;


