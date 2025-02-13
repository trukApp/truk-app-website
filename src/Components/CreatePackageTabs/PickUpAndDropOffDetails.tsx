'use client';
import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Button } from '@mui/material';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCompletedState, setPackagePickAndDropTimings } from '@/store/authSlice';

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
    pickupDateTime: Yup.string().required('Pick up date & time is required'),
    dropoffDateTime: Yup.string().required('Drop off date & time is required'),
    // notes: Yup.string().max(300, 'Notes must be 300 characters or less'),
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
        dispatch(setCompletedState(5));
        onNext(values);
        actions.setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleFormSubmit(values, actions, onNext)}
        >
            {({ errors, touched }) => (
                <Form>
                    <Grid container spacing={2}>
                        {/* Pickup Date & Time */}
                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                type="datetime-local"
                                name="pickupDateTime"
                                label="Pick up Date & Time (Estimated)"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={touched.pickupDateTime && Boolean(errors.pickupDateTime)}
                                helperText={touched.pickupDateTime && errors.pickupDateTime}
                            />
                        </Grid>

                        {/* Drop off Date & Time */}
                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                type="datetime-local"
                                name="dropoffDateTime"
                                label="Drop off Date & Time (Estimated)"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={touched.dropoffDateTime && Boolean(errors.dropoffDateTime)}
                                helperText={touched.dropoffDateTime && errors.dropoffDateTime}
                            />
                        </Grid>

                        {/* Optional Notes */}
                        <Grid item xs={12}>
                            <Field
                                as={TextField}
                                name="notes"
                                label="Notes (Optional)"
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid container spacing={2} justifyContent="center" marginTop={2}>
                            <Grid item>
                                <Button variant="outlined" onClick={onBack}  >
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default PickupDropoff;
