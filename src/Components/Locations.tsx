'use client';

import React,{useState,useEffect , useRef} from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object({
  locationId: Yup.string().required('Location ID is required'),
  locationDescription: Yup.string().required('Location description is required'),
  locationType : Yup.string().required('Location type is required'),

});

const Locations: React.FC = () => {
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const locationInputRef = useRef<HTMLInputElement | null>(null);


  const formik = useFormik({
    initialValues: {
      locationId: '',
      locationDescription: '',
      locationType: '',
      glnCode: '',
      iataCode: '',
      longitude: '',
      latitude:'',
      timeZone: '',
      city: '',
      state: '',
      country: '',
      pincode : ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
  });

  const { values, errors, touched,setFieldValue, handleChange, handleBlur, handleSubmit } =formik;

useEffect(() => {
  const fetchTimeZone = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(
          Date.now() / 1000
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data?.timeZoneId) {
        setFieldValue('timeZone', data.timeZoneId); // Set the time zone
      }
    } catch (error) {
      console.error('Failed to fetch time zone:', error);
    }
  };

  const fetchPostalCode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    // Look for postal_code in the results
    const postalCodeComponent = data.results
      .flatMap((result: { address_components: any; }) => result.address_components)
      .find((component: { types: string | string[]; }) => component.types.includes('postal_code'));

    if (postalCodeComponent) {
      setFieldValue('pincode', postalCodeComponent.long_name);
    } else {
      console.warn('Postal code not found in geocoding results.');
    }
  } catch (error) {
    console.error('Failed to fetch postal code:', error);
  }
};


  if (window.google && locationInputRef.current) {
    const autocomplete = new google.maps.places.Autocomplete(locationInputRef.current, {
      types: ['address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log('Place details:', place);

      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCoordinates({ lat: lat.toString(), lng: lng.toString() });
        setFieldValue('longitude', lat.toString());
        setFieldValue('latitude', lng.toString());

        // Fetch and set the time zone
        fetchTimeZone(lat, lng);
        fetchPostalCode(lat,lng)
      }

      if (place?.formatted_address) {
        setFieldValue('locationDescription', place.formatted_address);
      }

      if (place?.address_components) {
        const components = place.address_components;

        // Helper function to extract address components
        const getComponent = (type: string) => {
          const component = components.find((c) => c.types.includes(type));
          return component ? component.long_name : '';
        };

        // Extract city, state, country, and postal code
        const city = getComponent('locality') || getComponent('administrative_area_level_2');
        const state = getComponent('administrative_area_level_1');
        const country = getComponent('country');
        const pincode = getComponent('postal_code');
        console.log("postal code :", pincode)

        // Set extracted values
        setFieldValue('city', city);
        setFieldValue('state', state);
        setFieldValue('country', country);
        setFieldValue('pincode', pincode);
      }
    });
  }
}, [setFieldValue]);


return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Location Master Data
      </Typography>

      <Grid container spacing={2}>

      <Grid container spacing={2}>
        <Typography variant="h6" align="center" gutterBottom>
        General info
      </Typography>
      <Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      fullWidth
      size="small"
      label="Location ID* (Auto-generated)"
      name="locationId"
      value={values.locationId}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.locationId && Boolean(errors.locationId)}
      helperText={touched.locationId && errors.locationId}
      InputProps={{
        readOnly: true, // To make it auto-generated and non-editable
      }}
    />
  </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            size="small"
            label="Location Description*"
            name="locationDescription"
            value={values.locationDescription}
            inputRef={locationInputRef}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.locationDescription && Boolean(errors.locationDescription)}
            helperText={touched.locationDescription && errors.locationDescription}
          />
        </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      fullWidth
      size="small" disabled
      label="Longitude*"
      name="longitude"
      value={values.longitude}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      fullWidth
      size="small" disabled
      label="Latitude*"
      name="latitude"
      value={values.latitude}
      onChange={handleChange}
      onBlur={handleBlur}
    />
        </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      fullWidth
      size="small" disabled
      label="Time Zone*"
      name="timeZone"
      value={values.timeZone}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.timeZone && Boolean(errors.timeZone)}
      helperText={touched.timeZone && errors.timeZone}
    />
          </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      fullWidth disabled
      size="small"
      label="City"
      name="city"
      value={values.city}
      onChange={handleChange}
      onBlur={handleBlur}
    />
          </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      fullWidth disabled
      size="small"
      label="State"
      name="state"
      value={values.state}
      onChange={handleChange}
      onBlur={handleBlur}
    />
          </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      fullWidth
      size="small" disabled
      label="Country"
      name="timeZone"
      value={values.country}
      onChange={handleChange}
      onBlur={handleBlur}
    />
          </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      fullWidth
      size="small"
      label="Pincode"
      name="pincode"
      value={values.pincode}
      onChange={handleChange}
      onBlur={handleBlur} disabled
    />
  </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            size="small"
            select
            name="locationType"
            value={values.locationType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.locationType && Boolean(errors.locationType)}
            helperText={touched.locationType && errors.locationType}
            SelectProps={{
              native: true, // Use native dropdown
            }}
          >
            <option value="" disabled>
              Select Location Type *
            </option>
            <option   value="product plant">Product Plant</option>
            <option value="distribution center">Distribution Center</option>
            <option value="shipping point">Shipping Point</option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="terminal">Terminal</option>
            <option value="port">Port</option>
            <option value="airport">Airport</option>
            <option value="railway station">Railway Station</option>
            <option value="container freight station">Container Freight Station</option>
            <option value="hub">Hub</option>
            <option value="gateway">Gateway</option>
            <option value="container yard">Container Yard</option>
            <option value="warehouse">Warehouse</option>
            <option value="carrier warehouse">Carrier Warehouse</option>
            <option value="rail junction">Rail Junction</option>
            <option value="border cross point">Border Cross Point</option>
          </TextField>
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
    </Grid>
  </Grid>
      <Box sx={{ marginTop: '24px', textAlign: 'center' }}>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Locations;
