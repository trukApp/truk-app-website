'use client';
import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { DataGridComponent } from "./GridComponent";

const dummyData = [
  { id: 1, vehicleNumber: "AB123CD", vehicleType: "Truck", model: "Model X", capacity: "1000kg", ownerName: "John Doe", ownerContact: "+1234567890", insuranceNumber: "INS123456", mileage: "15000", notes: "New vehicle", length: "5", width: "2", height: "2", volume: "20", unit: "Meters" },
  { id: 2, vehicleNumber: "XY987ZT", vehicleType: "Van", model: "Model Y", capacity: "800kg", ownerName: "Jane Smith", ownerContact: "+9876543210", insuranceNumber: "INS654321", mileage: "12000", notes: "Used vehicle", length: "4.5", width: "2", height: "2", volume: "18", unit: "Meters" },
  { id: 3, vehicleNumber: "GH456JK", vehicleType: "Lorry", model: "Model Z", capacity: "2000kg", ownerName: "Robert Brown", ownerContact: "+1122334455", insuranceNumber: "INS789012", mileage: "25000", notes: "Heavy duty", length: "6", width: "2.5", height: "3", volume: "45", unit: "Meters" },
  { id: 4, vehicleNumber: "KL234MN", vehicleType: "Truck", model: "Model A", capacity: "1200kg", ownerName: "Michael Lee", ownerContact: "+2233445566", insuranceNumber: "INS345678", mileage: "18000", notes: "Frequent use", length: "5.2", width: "2.1", height: "2.2", volume: "24", unit: "Meters" },
  { id: 5, vehicleNumber: "PQ567RS", vehicleType: "Van", model: "Model B", capacity: "600kg", ownerName: "Sarah Green", ownerContact: "+3344556677", insuranceNumber: "INS987654", mileage: "5000", notes: "In good condition", length: "4", width: "1.8", height: "1.8", volume: "13.2", unit: "Meters" },
  { id: 6, vehicleNumber: "LM678OP", vehicleType: "Lorry", model: "Model C", capacity: "2500kg", ownerName: "James White", ownerContact: "+4455667788", insuranceNumber: "INS321654", mileage: "30000", notes: "Long-haul use", length: "7", width: "2.8", height: "3.5", volume: "61.2", unit: "Meters" },
  { id: 7, vehicleNumber: "TU345VW", vehicleType: "Truck", model: "Model D", capacity: "1500kg", ownerName: "Emily Davis", ownerContact: "+5566778899", insuranceNumber: "INS654987", mileage: "10000", notes: "Routine maintenance", length: "5.3", width: "2.2", height: "2.3", volume: "27.2", unit: "Meters" },
  { id: 8, vehicleNumber: "BC456EF", vehicleType: "Van", model: "Model E", capacity: "700kg", ownerName: "Daniel Clark", ownerContact: "+6677889900", insuranceNumber: "INS987321", mileage: "7000", notes: "Good condition", length: "4.2", width: "2", height: "1.9", volume: "15.96", unit: "Meters" },
  { id: 9, vehicleNumber: "GH789IJ", vehicleType: "Lorry", model: "Model F", capacity: "3000kg", ownerName: "Sophia Lewis", ownerContact: "+7788990011", insuranceNumber: "INS123789", mileage: "22000", notes: "Used for heavy goods", length: "7.2", width: "3", height: "3.6", volume: "77.76", unit: "Meters" },
  { id: 10, vehicleNumber: "JK012LM", vehicleType: "Truck", model: "Model G", capacity: "2000kg", ownerName: "William King", ownerContact: "+8899001122", insuranceNumber: "INS321987", mileage: "13000", notes: "New model", length: "6", width: "2.5", height: "2.8", volume: "42", unit: "Meters" },
];


const columns = [
  { field: "vehicleNumber", headerName: "Vehicle Number", width: 180 },
  { field: "vehicleType", headerName: "Vehicle Type", width: 130 },
  { field: "model", headerName: "Model", width: 150 },
  { field: "capacity", headerName: "Capacity", width: 130 },
  { field: "ownerName", headerName: "Owner Name", width: 180 },
  { field: "ownerContact", headerName: "Owner Contact", width: 180 },
  { field: "insuranceNumber", headerName: "Insurance Number", width: 180 },
  { field: "mileage", headerName: "Mileage", width: 130 },
  { field: "notes", headerName: "Notes", width: 180 },
  { field: "length", headerName: "Length", width: 120 },
  { field: "width", headerName: "Width", width: 120 },
  { field: "height", headerName: "Height", width: 120 },
  { field: "volume", headerName: "Volume", width: 130 },
  { field: "unit", headerName: "Unit", width: 120 },
];


interface VehicleDetails {
  vehicleNumber: string;
  vehicleType: string;
  model: string;
  capacity: string;
  ownerName: string;
  ownerContact: string;
  insuranceNumber: string;
  mileage: string;
  notes: string;
  length: string;
  width: string;
  height: string;
  volume: string;
  unit: string;
}

const vehicleTypes = ["Truck", "Van", "Lorry"];
const units = ["Meters", "Feet", "Inches"];

const validationSchema = Yup.object().shape({
  vehicleNumber: Yup.string().required("Vehicle number is required"),
  vehicleType: Yup.string().required("Vehicle type is required"),
  model: Yup.string().required("Model is required"),
  capacity: Yup.string().required("Capacity is required"),
  ownerName: Yup.string().required("Owner name is required"),
  ownerContact: Yup.string().required("Owner contact is required"),
  insuranceNumber: Yup.string().required("Insurance number is required"),
  mileage: Yup.string().required("Mileage is required"),
  notes: Yup.string(),
  length: Yup.number()
    .typeError("Length must be a number")
    .required("Length is required"),
  width: Yup.number()
    .typeError("Width must be a number")
    .required("Width is required"),
  height: Yup.number()
    .typeError("Height must be a number")
    .required("Height is required"),
  unit: Yup.string().required("Unit is required"),
});

const Vehicles: React.FC = () => {
  const initialValues: VehicleDetails = {
    vehicleNumber: "",
    vehicleType: "",
    model: "",
    capacity: "",
    ownerName: "",
    ownerContact: "",
    insuranceNumber: "",
    mileage: "",
    notes: "",
    length: "",
    width: "",
    height: "",
    volume: "",
    unit: "Meters",
  };

  const calculateVolume = (values: VehicleDetails): string => {
    const { length, width, height } = values;
    const volume =
      parseFloat(length) * parseFloat(width) * parseFloat(height) || 0;
    return volume.toFixed(2);
  };

  const handleSubmit = (values: VehicleDetails) => {
    console.log('vehicle values :', values);
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Vehicle Details
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Vehicle Type Dropdown */}
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl
                  fullWidth
                  size="small"
                  error={touched.vehicleType && !!errors.vehicleType}
                >
                  <Select
                    name="vehicleType"
                    value={values.vehicleType}
                    onChange={(e) => setFieldValue("vehicleType", e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Type
                    </MenuItem>
                    {vehicleTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.vehicleType && errors.vehicleType && (
                    <FormHelperText>{errors.vehicleType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Other Fields */}
              {[
                "vehicleNumber",
                "model",
                "capacity",
                "ownerName",
                "ownerContact",
                "insuranceNumber",
                "mileage",
                "notes",
              ].map((field) => (
                <Grid item xs={12} sm={6} md={2.4} key={field}>
                  <TextField
                    fullWidth
                    size="small"
                    label={field.replace(/([A-Z])/g, " $1")}
                    name={field}
                    // value={(values as VehicleDetails)[field]}
                    onChange={handleChange}
                    error={touched[field as keyof VehicleDetails] && !!errors[field as keyof VehicleDetails]}
                    helperText={
                      touched[field as keyof VehicleDetails] &&
                      errors[field as keyof VehicleDetails]
                    }
                  />
                </Grid>
              ))}

              {/* Dimensions with Units */}
              {["length", "width", "height"].map((dimension) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2.4}
                  key={dimension}
                  container
                  spacing={1}
                >
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      size="small"
                      label={dimension}
                      name={dimension}
                      type="number"
                      // value={(values as any)[dimension]}
                      onChange={(e) => {
                        handleChange(e);
                        const volume = calculateVolume({
                          ...values,
                          [dimension]: e.target.value,
                        });
                        setFieldValue("volume", volume);
                      }}
                      error={touched[dimension as keyof VehicleDetails] && !!errors[dimension as keyof VehicleDetails]}
                      helperText={
                        touched[dimension as keyof VehicleDetails] &&
                        errors[dimension as keyof VehicleDetails]
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={values.unit}
                        onChange={(e) => setFieldValue("unit", e.target.value)}
                      >
                        {units.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ))}

              {/* Volume (Read-only) */}
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Volume (cubic units)"
                  value={values.volume}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    focusRipple
                    sx={{
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      paddingTop: "6px",
                      paddingBottom: "6px",
                      fontSize: "16px",
                      alignSelf: "center",
                      display: "flex",
                      justifyContent: "center",
                      textTransform: "none",
                    }}
                  >
                    Add vehicle
                  </Button>
                </div>

              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <div style={{ marginTop: '80px' }}>
        <DataGridComponent
          columns={columns}
          rows={dummyData}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </div>

    </Box>
  );
};

export default Vehicles;
