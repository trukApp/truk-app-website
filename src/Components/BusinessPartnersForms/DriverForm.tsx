import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';

interface DriverFormValues {
  drivingLicense: string;
  fromTime: string;
  toTime: string;
  experience: string;
}

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const DriverForm: React.FC = () => {
  const { values, handleChange, handleBlur, errors, touched } = useFormikContext<DriverFormValues>();

  return (
    <div>
      <h3>Driver Details</h3>
      <Grid container spacing={2}>
        {/* Driving License */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Driving License"
            name="drivingLicense"
            value={values.drivingLicense}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.drivingLicense && Boolean(errors.drivingLicense)}
            helperText={touched.drivingLicense && errors.drivingLicense}
          />
        </Grid>

        {/* From Time */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="From Time"
            name="fromTime"
            value={values.fromTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fromTime && Boolean(errors.fromTime)}
            helperText={touched.fromTime && errors.fromTime}
          >
            {hours.map((hour) => (
              <MenuItem key={hour} value={hour}>
                {hour}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* To Time */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="To Time"
            name="toTime"
            value={values.toTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.toTime && Boolean(errors.toTime)}
            helperText={touched.toTime && errors.toTime}
          >
            {hours.map((hour) => (
              <MenuItem key={hour} value={hour}>
                {hour}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Experience */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Experience (Years)"
            name="experience"
            type="number"
            value={values.experience}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.experience && Boolean(errors.experience)}
            helperText={touched.experience && errors.experience}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DriverForm;
