'use client';
import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    // setCompletedState,
    setPackagePickAndDropTimings
} from '@/store/authSlice';
import { CustomButtonFilled, CustomButtonOutlined } from '../ReusableComponents/ButtonsComponent';

interface PickupDropTab {
    onNext: (values: FormValues) => void;
    onBack: () => void;
}
export interface FormValues {
    pickupDateTime: string;
    dropoffDateTime: string;
    notes: string;
}


const validationSchema = Yup.object({
      pickupDateTime: Yup.string()
    .required("Pick-up Date & Time is required"),
  dropoffDateTime: Yup.string()
    .required("Drop-off Date & Time is required")
    .test(
      "is-greater",
      "Drop-off Date & Time must be after Pick-up Date & Time",
      function (value) {
        const { pickupDateTime } = this.parent;
        return !pickupDateTime || !value || new Date(value) > new Date(pickupDateTime);
      }
    ),
});



const PickupDropoff: React.FC<PickupDropTab> = ({ onNext, onBack }) => {
    const dispatch = useAppDispatch()
    const packagePickUpAndDropTimingsFromRedux = useAppSelector((state) => state.auth.packagePickAndDropTimings)

    const initialValues: FormValues = packagePickUpAndDropTimingsFromRedux ? packagePickUpAndDropTimingsFromRedux : {
        pickupDateTime: '',
        dropoffDateTime: '',
        notes: '',
    };
    const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>, onNext: (values: FormValues) => void) => {
        dispatch(setPackagePickAndDropTimings(values))
        // dispatch(setCompletedState(5));
        onNext(values);
        actions.setSubmitting(false);
        
    };

    return (
        <Grid  sx={{width: '100%'}}>
              <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleFormSubmit(values, actions, onNext)}
        >
            {({ errors, touched , values }) => (
                    <Form style={{ width: '100%' }}>
                          <Typography variant="h6" sx={{fontWeight:'bold', textAlign:'center' , marginTop:4, marginBottom:1}}>Pickup and dropoff Details</Typography>
                        <Grid container spacing={2}
                            sx={{ 
                        marginTop: 3, 
                        width: '100%', 
                        m: 0 
                            }}  >
                          
                        <Grid item  xs={12} md={3}>
                            <Field
                                as={TextField}
                                type="datetime-local"
                                name="pickupDateTime"
                                label="Pick up Date & Time (Estimated)"
                                fullWidth size='small'
                                InputLabelProps={{ shrink: true }}
                                error={touched.pickupDateTime && Boolean(errors.pickupDateTime)}
                                helperText={touched.pickupDateTime && errors.pickupDateTime}
                                inputProps={{
                            min: new Date().toISOString().slice(0, 16), 
                        }}
                            />
                        </Grid>

                        {/* Drop off Date & Time */}
                            <Grid item xs={12} md={3}>
                                <Field
                                    as={TextField}
                                    type="datetime-local"
                                    name="dropoffDateTime"
                                    label="Drop off Date & Time (Estimated)"
                                    fullWidth
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    error={touched.dropoffDateTime && Boolean(errors.dropoffDateTime)}
                                    helperText={(touched.dropoffDateTime && errors.dropoffDateTime)}
                                    inputProps={{
                                        min: values.pickupDateTime ? values.pickupDateTime  : new Date().toISOString().slice(0, 16),
                                    }}
                                />
                            </Grid>


                        {/* Optional Notes */}
                        <Grid item xs={12} md={6}>
                            <Field
                                as={TextField}
                                name="notes"
                                label="Notes (Optional)"
                                fullWidth size='small'
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid container spacing={2} justifyContent="center" marginTop={2}>
                            <Grid item>
                                {/* <Button variant="outlined" onClick={onBack}  >
                                    Back
                                </Button> */}
                                    <CustomButtonOutlined onClick={onBack}>Back</CustomButtonOutlined>
                            </Grid>
                            <Grid item>
                                {/* <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Next
                                </Button> */}
                                 <CustomButtonFilled type="submit">Next</CustomButtonFilled>

                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
        </Grid>
      
    );
};

export default PickupDropoff;