// 'use client';
// import React from 'react';
// import { Field } from 'formik';
// import { Grid, TextField, Button } from '@mui/material';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers';

// const PickupDropoff = () => {
//     return (
//         <Grid container spacing={2}>
//             {/* Pickup Date & Time */}
//             <Grid item xs={12} sm={6}>
//                 <Field name="pickupDateTime" fullWidth>
//                     {({ field, form }) => (
//                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                             <DateTimePicker
//                                 label="Pick up Date & Time (Estimated)"
//                                 value={field.value || null}
//                                 onChange={(date) => form.setFieldValue(field.name, date)}
//                                 renderInput={(params) => <TextField {...params} fullWidth />}
//                             />
//                         </LocalizationProvider>
//                     )}
//                 </Field>
//             </Grid>

//             {/* Drop off Date & Time */}
//             <Grid item xs={12} sm={6}>
//                 <Field name="dropoffDateTime" fullWidth>
//                     {({ field, form }) => (
//                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                             <DateTimePicker
//                                 label="Drop off Date & Time (Estimated)"
//                                 value={field.value || null}
//                                 onChange={(date) => form.setFieldValue(field.name, date)}
//                                 renderInput={(params) => <TextField {...params} fullWidth />}
//                             />
//                         </LocalizationProvider>
//                     )}
//                 </Field>
//             </Grid>

//             {/* Optional Notes */}
//             <Grid item xs={12}>
//                 <Field name="notes" as={TextField} label="Notes (Optional)" fullWidth multiline rows={3} />
//             </Grid>

//             {/* Submit Button */}
//             <Grid item xs={12}>
//                 <Button type="submit" variant="contained" color="primary">
//                     Submit
//                 </Button>
//             </Grid>
//         </Grid>
//     );
// };

// export default PickupDropoff;


import React from 'react'

const PickUpAndDropOffDetails = () => {
  return (
    <div>
      hiii
    </div>
  )
}

export default PickUpAndDropOffDetails
