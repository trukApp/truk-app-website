"use client";
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,

} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css'
import { useGetLanesMasterQuery,usePostLaneMasterMutation,useEditLaneMasterMutation,useDeleteLaneMasterMutation } from '@/api/apiSlice';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { withAuthComponent } from '../WithAuthComponent';
import MassUpload from '../MassUpload/MassUpload';

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
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editRow,setEditRow] = useState<LaneDetails | null>(null); ;
  const distanceUnits = ['km', 'm']
  const durationUnits = ['hour', 'minute', 'seconds']
  const costUnits = ['INR', 'USD']
    const { data, error, isLoading } = useGetLanesMasterQuery([]);
    const [postLane] = usePostLaneMasterMutation();
    const [editLane] = useEditLaneMasterMutation();
    const [deleteLane] = useDeleteLaneMasterMutation()
  
  console.log("all lanes :", data?.lanes)
  if (isLoading) {
    console.log("Loading lanes...");
  }

  if (error) {
    console.error("Error fetching lanes:", error);
    // Handle the error case
  }

  const handleFormSubmit = async (values: LaneDetails) => {
    // console.log("form submitted lanes :", values)

        try {
          const body ={
            lanes: [
                      {
                          src_loc_ID: values.sourceLocationId,
                          des_loc_ID: values.destinationLocationId,
                          lane_transport_data: {
                              vehcle_type: values.vehicleType,
                              start_time: values.transportStartDate,
                              end_time: values.transportEndDate,
                              transport_distance: `${values.transportDistance} ${values.transportDistanceUnits}` ,
                              transport_duration: `${values.transportDuration} ${values.transportDurationUnits}`  ,
                              transport_cost: `${values.transportCost} ${values.transportCostUnits}`
                          }
                      },
                  ]
              }
              const editBody =   {
                          src_loc_ID: values.sourceLocationId,
                          des_loc_ID: values.destinationLocationId,
                          lane_transport_data: {
                              vehcle_type: values.vehicleType,
                              start_time: values.transportStartDate,
                              end_time: values.transportEndDate,
                              transport_distance: `${values.transportDistance} ${values.transportDistanceUnits}` ,
                              transport_duration: `${values.transportDuration} ${values.transportDurationUnits}`  ,
                              transport_cost: `${values.transportCost} ${values.transportCostUnits}`
                          }
                      }
              console.log("lanes body: ", body)
              if (isEditing && editRow) {
                console.log('edit lane body is :', editBody)
                const laneId = editRow.id
                const response = await editLane({ body: editBody, laneId }).unwrap()
                console.log("edit response is ", response)
                formik.resetForm();
              }
              else {
                console.log("post create lane ",body)
                  const response = await postLane(body).unwrap();
                  console.log('response in post lane:', response);
                  formik.resetForm();
              }
          
        } catch (error) {
            console.error('API Error:', error);
        }

  }

  const handleEdit = (row: LaneDetails) => {
    console.log("Edit row:", row);
    setShowForm(true)
    setIsEditing(true)
    setEditRow(row)
    };

const handleDelete = async (row: LaneDetails) => {
    const laneId = row?.id;
    if (!laneId) {
        console.error("Row ID is missing");
        return;
    }
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) {
        console.log("Delete canceled by user.");
        return;
    }

    try {
        const response = await deleteLane(laneId);
        console.log("Delete response:", response);
    } catch (error) {
        console.error("Error deleting lane:", error);
    }
};

  const formik = useFormik({
    initialValues: {
      // General Data
      id:'',
      laneId: '', // Auto-generated
      sourceLocationId: '',
      destinationLocationId: '',

      // Transport Data
      vehicleType: '',
      transportStartDate: '',
      transportEndDate: '',
      transportDistance: '',
      transportDistanceUnits:distanceUnits[0],
      transportDuration: '',
      transportDurationUnits : durationUnits[0],
      transportCost: '',
      transportCostUnits : costUnits[0],

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
      transportStartDate: Yup.date().required('Start Date is required'),
      transportEndDate: Yup.date().required('End Date is required'),
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
      transportDistance: editDistance[0] ,
      transportDistanceUnits: editDistance[1],
      transportDuration: editDuration[0] || '',
      transportDurationUnits: editDuration[1] ,
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
}, [editRow]);

const rows = data?.lanes.map((lane:Lane) => ({
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
      <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '20px', md:'24px' } }} align="center" gutterBottom>
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
      <MassUpload arrayKey="lanes"/>
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
                    <TextField
                      fullWidth
                      id="sourceLocationId"
                      name="sourceLocationId"
                      label="Source Location ID*"
                      value={formik.values.sourceLocationId}
                      onChange={formik.handleChange}
                      error={formik.touched.sourceLocationId && Boolean(formik.errors.sourceLocationId)}
                      helperText={formik.touched.sourceLocationId && formik.errors.sourceLocationId}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="destinationLocationId"
                      name="destinationLocationId"
                      label="Destination Location ID*"
                      value={formik.values.destinationLocationId}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.destinationLocationId &&
                        Boolean(formik.errors.destinationLocationId)
                      }
                      helperText={formik.touched.destinationLocationId && formik.errors.destinationLocationId}
                      size="small"
                    />
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
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      id="transportStartDate"
                      name="transportStartDate"
                      label="Start Date*"
                      type="date"
                      value={formik.values.transportStartDate}
                      onChange={formik.handleChange}
                      error={formik.touched.transportStartDate && Boolean(formik.errors.transportStartDate)}
                      helperText={formik.touched.transportStartDate && formik.errors.transportStartDate}
                      size="small"
                      InputLabelProps={{ shrink: true }}
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
                                            {distanceUnits.map((unit) => (
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
                                            {durationUnits.map((unit) => (
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
                                            {costUnits.map((unit) => (
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
                   {isEditing ? "Update lane": "Create lane"}
                </Button>
              </Box>
      
          </form>
        </Box>
      </Collapse>


      {/* data grid */}
      <div style={{ marginTop: "40px" }}>
        <DataGridComponent
          columns={columns}
          rows={rows}
          isLoading={false}
          pageSizeOptions={[10, 20, 30]}
          initialPageSize={10}
        />
      </div>

    </>
  );
};

export default withAuthComponent(TransportationLanes);


