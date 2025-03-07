"use client";
import React, { useEffect, useRef, useState } from 'react';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Paper,
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
import { useGetLanesMasterQuery, usePostLaneMasterMutation, useEditLaneMasterMutation, useDeleteLaneMasterMutation, useGetLocationMasterQuery, useGetFilteredLocationsQuery, } from '@/api/apiSlice';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MassUpload from '../MassUpload/MassUpload';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from './Locations';
import { CustomButtonFilled } from '../ReusableComponents/ButtonsComponent';

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefDest = useRef<HTMLDivElement>(null);
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
  const { data: locationsData, } = useGetLocationMasterQuery({});
  const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : [];
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyDestination, setSearchKeyDestination] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);
  const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });
  const { data: destinationFilteredLocations } = useGetFilteredLocationsQuery(searchKeyDestination.length >= 3 ? searchKeyDestination : null, { skip: searchKeyDestination.length < 3 });
  const displayLocations = searchKey ? filteredLocations?.results || [] : getAllLocations;
  const displayLocationsDest = searchKeyDestination ? destinationFilteredLocations?.results || [] : getAllLocations;
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
  if (error) {
    console.error("Error fetching lanes:", error);
  }
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRefDest.current && !wrapperRefDest.current.contains(event.target as Node)) {
        setShowDestinations(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              transport_cost: `${values.transportCost}`
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
          transport_cost: `${values.transportCost}`
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
          setSearchKey("")
          setSearchKeyDestination("")
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
          setSearchKey("")
          setSearchKeyDestination("")
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
    }),
    onSubmit: handleFormSubmit
  });

  useEffect(() => {
    if (editRow) {
      setSearchKey(editRow.sourceLocationId || '')
      setSearchKeyDestination(editRow.destinationLocationId || '')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRow]);

  const rows = data?.lanes.map((lane: Lane) => ({
    id: lane?.ln_id,
    laneId: lane?.lane_ID,
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
  }));


  const columns: GridColDef[] = [
    { field: "laneId", headerName: "Lane ID", width: 150 },
    {
      field: "sourceLocationId",
      headerName: "Source Location ID",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={getLocationDetails(params.value)} arrow>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "destinationLocationId",
      headerName: "Destination Location",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={getLocationDetails(params.value)} arrow>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    { field: "vehicleType", headerName: "Vehicle Type", width: 150 },
    { field: "transportStartDate", headerName: "Transport Start Date", width: 180 },
    { field: "transportEndDate", headerName: "Transport End Date", width: 180 },
    { field: "transportDistance", headerName: "Transport Distance", width: 160 },
    { field: "transportDuration", headerName: "Transport Duration", width: 160 },
    { field: "transportCost", headerName: "Transport Cost", width: 150 },
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
                {isEditing &&
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
                  </Grid>}
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    name="sourceLocationId"
                    size="small"
                    label="Search for source Location... "
                    onFocus={() => {
                      if (!searchKey) {
                        setSearchKey(formik.values?.sourceLocationId || "");
                        setShowSuggestions(true);
                      }
                    }}
                    onChange={(e) => {
                      setSearchKey(e.target.value)
                      setShowSuggestions(true)
                    }
                    }
                    value={searchKey}
                    error={formik.touched?.sourceLocationId && Boolean(formik.errors?.sourceLocationId)}
                    helperText={
                      formik.touched?.sourceLocationId && typeof formik.errors?.sourceLocationId === "string"
                        ? formik.errors.sourceLocationId
                        : ""
                    }
                    InputProps={{
                      endAdornment: filteredLocationLoading ? <CircularProgress size={20} /> : null,
                    }}
                  />
                  <div ref={wrapperRef} >
                    {showSuggestions && displayLocations?.length > 0 && (
                      <Paper
                        style={{
                          maxHeight: 200,
                          overflowY: "auto",
                          position: "absolute",
                          zIndex: 10,
                          width: "18%",
                        }}
                      >
                        <List>
                          {displayLocations.map((location: Location) => (
                            <ListItem
                              key={location.loc_ID}
                              component="li"
                              onClick={() => {
                                setShowSuggestions(false)
                                setSearchKey(location.loc_ID);
                                formik.setFieldValue("sourceLocationId", location.loc_ID);
                              }}
                              sx={{ cursor: "pointer" }}
                            >
                              <Tooltip
                                title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                placement="right"
                              >
                                <span style={{ fontSize: '13px' }}>{location.loc_ID}, {location.city}, {location.state}, {location.pincode}</span>
                              </Tooltip>
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    name="destinationLocationId"
                    size="small"
                    label="Search for destination Location... "
                    onFocus={() => {
                      if (!searchKeyDestination) {
                        setSearchKeyDestination(formik.values?.destinationLocationId || "");
                        setShowDestinations(true);
                      }
                    }}
                    onChange={(e) => {
                      setSearchKeyDestination(e.target.value)
                      setShowDestinations(true)
                    }
                    }
                    value={searchKeyDestination}
                    error={formik.touched?.destinationLocationId && Boolean(formik.errors?.destinationLocationId)}
                    helperText={
                      formik.touched?.destinationLocationId && typeof formik.errors?.destinationLocationId === "string"
                        ? formik.errors.destinationLocationId
                        : ""
                    }
                    InputProps={{
                      endAdornment: filteredLocationLoading ? <CircularProgress size={20} /> : null,
                    }}
                  />
                  <div ref={wrapperRefDest} >
                    {showDestinations && displayLocationsDest?.length > 0 && (
                      <Paper
                        style={{
                          maxHeight: 200,
                          overflowY: "auto",
                          position: "absolute",
                          zIndex: 10,
                          width: "18%",
                        }}
                      >
                        <List>
                          {displayLocationsDest.map((location: Location) => (
                            <ListItem
                              key={location.loc_ID}
                              component="li"
                              onClick={() => {
                                setShowDestinations(false)
                                setSearchKeyDestination(location.loc_ID);
                                formik.setFieldValue("destinationLocationId", location.loc_ID);
                              }}
                              sx={{ cursor: "pointer" }}
                            >
                              <Tooltip
                                title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                placement="right"
                              >
                                <span style={{ fontSize: '13px' }}>{location.loc_ID}, {location.city}, {location.state}, {location.pincode}</span>
                              </Tooltip>
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Box>

            {/* Transport Data */}
            <Box sx={{ marginBottom: 3 }}>
              <h3>2. Transport Data</h3>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    label="Vehicle Type (Truck , Trailer...)"
                    name="vehicleType"
                    value={formik.values.vehicleType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
                    helperText={formik.touched.vehicleType && formik.errors.vehicleType}
                    size="small"
                  >

                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    id="transportStartDate"
                    size="small"
                    label="Start Date*"
                    name="transportStartDate"
                    type="date"
                    value={formik.values.transportStartDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.transportStartDate && Boolean(formik.errors.transportStartDate)}
                    helperText={formik.touched.transportStartDate && formik.errors.transportStartDate}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
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
                    InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  />
                </Grid>
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
                <Grid item xs={12} sm={6} md={1.6}>
                  <TextField
                    fullWidth
                    id="transportCost"
                    name="transportCost"
                    label="Transport Cost(Rs.)* "
                    type="number"
                    value={formik.values.transportCost}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.transportCost && Boolean(formik.errors.transportCost)}
                    helperText={formik.touched.transportCost && formik.errors.transportCost}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Submit Button */}
            <Box sx={{ textAlign: 'center', marginTop: 3 }}>
              <CustomButtonFilled >{isEditing ? "Update lane" : "Create lane"}</CustomButtonFilled>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  formik.resetForm()
                  setIsEditing(false);
                  setEditRow(null);
                  setSearchKey("")
                  setSearchKeyDestination("")
                }}
                style={{ marginLeft: "10px" }}
              >
                Reset
              </Button>
            </Box>

          </form>
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
            activeEntity='lanes'
            onPaginationModelChange={handlePaginationModelChange}
          />
        )}
      </div>
    </>
  );
};

export default TransportationLanes;


