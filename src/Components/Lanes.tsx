import React from 'react';
import {
  Box,
  Button,
  Grid, 
  MenuItem, 
  TextField,
  Typography,
  
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from './GridComponent';

const TransportationLanes = () => {
  const formik = useFormik({
    initialValues: {
      // General Data
      laneId: '', // Auto-generated
      sourceLocationId: '',
      destinationLocationId: '',

      // Transport Data
      vehicleType: '',
      transportStartDate: '',
      transportEndDate: '',
      transportDistance: '',
      transportDuration: '',
      transportCost: '',

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
      carrierId: Yup.string().required('Carrier ID is required'),
      carrierName: Yup.string().required('Carrier Name is required'),
      carrierVehicleType: Yup.string().required('Vehicle Type is required'),
      carrierStartDate: Yup.date().required('Start Date is required'),
      carrierEndDate: Yup.date().required('End Date is required'),
      carrierCost: Yup.string().required('Carrier Cost is required'),
    }),
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
  });

  const rows = Array.from({ length: 10 }, (_, id) => ({
  id,
  laneId: `LANE-${id + 1}`,
  sourceLocationId: `SRC-${100 + id}`,
  destinationLocationId: `DST-${200 + id}`,
  vehicleType: id % 2 === 0 ? "Truck" : "Van",
  transportStartDate: "2024-01-10",
  transportEndDate: "2024-01-15",
  transportDistance: `${100 + id * 10} km`,
  transportDuration: `${8 + id} hours`,
  transportCost: `$${1000 + id * 50}`,
  carrierId: `CARRIER-${id + 1}`,
  carrierName: `Carrier ${id + 1}`,
  carrierVehicleType: id % 2 === 0 ? "Heavy Duty" : "Light Duty",
  carrierStartDate: "2024-01-11",
  carrierEndDate: "2024-01-14",
  carrierCost: `$${800 + id * 40}`,
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
  { field: "carrierId", headerName: "Carrier ID", width: 150 },
  { field: "carrierName", headerName: "Carrier Name", width: 180 },
  { field: "carrierVehicleType", headerName: "Carrier Vehicle Type", width: 180 },
  { field: "carrierStartDate", headerName: "Carrier Start Date", width: 180 },
  { field: "carrierEndDate", headerName: "Carrier End Date", width: 180 },
  { field: "carrierCost", headerName: "Carrier Cost", width: 150 },
];

  return (
    <>
    <form onSubmit={formik.handleSubmit}>
         <Typography variant="h5" align="center" gutterBottom>
        Transportation Lanes Master data
      </Typography>
      <Box  >
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
            <Grid item xs={12} sm={6} md={2.4}>
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
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                id="transportDuration"
                name="transportDuration"
                label="Transport Duration* (UoM)"
                value={formik.values.transportDuration}
                onChange={formik.handleChange}
                error={formik.touched.transportDuration && Boolean(formik.errors.transportDuration)}
                helperText={formik.touched.transportDuration && formik.errors.transportDuration}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
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
            </Grid>
          </Grid>
        </Box>

        {/* Carrier Data */}
        <Box sx={{ marginBottom: 3 }}>
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
        </Box>

        {/* Submit Button */}
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </form>
      
      {/* data grid */}
      <div style={{ marginTop:"40px"}}> 
              <DataGridComponent
              columns={columns}
              rows={rows}
              isLoading={false} // Set true to show loading state
              pageSizeOptions={[5, 10, 20]} // Optional: customize page size options
              initialPageSize={5} // Optional: default page size
            />
      </div>
      
      </>
  );
};

export default TransportationLanes;
