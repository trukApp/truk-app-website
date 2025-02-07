'use client';
import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Button } from '@mui/material';
import * as Yup from 'yup';

interface PickupDropTab {
    onNext: (values: FormValues) => void;
    onBack: () => void;
}
// Define Form Values
interface FormValues {
    pickupDateTime: string;
    dropoffDateTime: string;
    notes: string;
}

// Initial Values
const initialValues: FormValues = {
    pickupDateTime: '',
    dropoffDateTime: '',
    notes: '',
};

// Validation Schema
const validationSchema = Yup.object({
    pickupDateTime: Yup.string().required('Pick up date & time is required'),
    dropoffDateTime: Yup.string().required('Drop off date & time is required'),
    notes: Yup.string().max(300, 'Notes must be 300 characters or less'),
});

const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>, onNext: (values: FormValues) => void) => {
    console.log('Form Submitted:', values);
    onNext(values);
    actions.setSubmitting(false);
};

const PickupDropoff: React.FC<PickupDropTab> = ({ onNext, onBack }) => {
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
                                error={touched.notes && Boolean(errors.notes)}
                                helperText={touched.notes && errors.notes}
                            />
                        </Grid>

                        {/* Submit Button */}
<Grid container spacing={2} justifyContent="space-between" marginTop={2}>
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
