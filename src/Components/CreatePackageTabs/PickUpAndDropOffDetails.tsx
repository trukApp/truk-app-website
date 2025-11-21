// 'use client';
// import React from 'react';
// import { Formik, Form, Field, FormikHelpers } from 'formik';
// import { Grid, TextField, Typography } from '@mui/material';
// import * as Yup from 'yup';
// import { useAppDispatch, useAppSelector } from '@/store';
// import {
// 	// setCompletedState,
// 	setPackagePickAndDropTimings
// } from '@/store/authSlice';
// import { CustomButtonFilled, CustomButtonOutlined } from '../ReusableComponents/ButtonsComponent';
// import dayjs from 'dayjs';
// import { DateTimePicker } from '@mui/x-date-pickers';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// interface PickupDropTab {
// 	onNext: (values: FormValues) => void;
// 	onBack: () => void;
// }
// export interface FormValues {
// 	pickupDateTime: string;
// 	dropoffDateTime: string;
// 	notes: string;
// }


// const validationSchema = Yup.object({
// 	pickupDateTime: Yup.string()
// 		.required("Pick-up Date & Time is required"),
// 	dropoffDateTime: Yup.string()
// 		.required("Drop-off Date & Time is required")
// 		.test(
// 			"is-greater",
// 			"Drop-off Date & Time must be after Pick-up Date & Time",
// 			function (value) {
// 				const { pickupDateTime } = this.parent;
// 				return !pickupDateTime || !value || new Date(value) > new Date(pickupDateTime);
// 			}
// 		),
// });



// const PickupDropoff: React.FC<PickupDropTab> = ({ onNext, onBack }) => {
// 	const dispatch = useAppDispatch()
// 	const packagePickUpAndDropTimingsFromRedux = useAppSelector((state) => state.auth.packagePickAndDropTimings)

// 	const initialValues: FormValues = packagePickUpAndDropTimingsFromRedux ? packagePickUpAndDropTimingsFromRedux : {
// 		pickupDateTime: '',
// 		dropoffDateTime: '',
// 		notes: '',
// 	};
// 	const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>, onNext: (values: FormValues) => void) => {
// 		dispatch(setPackagePickAndDropTimings(values))
// 		// dispatch(setCompletedState(5));
// 		onNext(values);
// 		actions.setSubmitting(false);

// 	};
// 	return (
// 		<Grid sx={{ width: "100%" }}>
// 			<Formik
// 				initialValues={initialValues}
// 				validationSchema={validationSchema}
// 				onSubmit={(values, actions) =>
// 					handleFormSubmit(values, actions, onNext)
// 				}
// 			>
// 				{({ errors, touched, values, setFieldValue }) => (
// 					<Form style={{ width: "100%" }}>
// 						<Typography
// 							variant="h6"
// 							sx={{
// 								fontWeight: "bold",
// 								marginLeft: "15px",
// 								marginTop: 4,
// 								marginBottom: 1,
// 							}}
// 						>
// 							Pickup and dropoff Details
// 						</Typography>
// 						<Grid
// 							container
// 							spacing={2}
// 							sx={{
// 								marginTop: 3,
// 								width: "100%",
// 								m: 0,
// 							}}
// 						>
// 							<Grid item xs={12} md={3}>
// 								<LocalizationProvider dateAdapter={AdapterDayjs}>
// 									<DateTimePicker
// 										label="Pick up Date & Time (Estimated)"
// 										value={
// 											values.pickupDateTime
// 												? dayjs(values.pickupDateTime)
// 												: null
// 										}
// 										minDateTime={dayjs()} // min current time
// 										onChange={(newValue) => {
// 											if (newValue) {
// 												setFieldValue(
// 													"pickupDateTime",
// 													newValue.format("YYYY-MM-DDTHH:mm")
// 												);
// 											}
// 										}}
// 										onAccept={(finalValue) => {
// 											console.log("Final selection:", finalValue?.toString());
// 										}}
// 										slotProps={{
// 											textField: {
// 												size: "small",
// 												fullWidth: true,
// 												error:
// 													touched.pickupDateTime &&
// 													Boolean(errors.pickupDateTime),
// 												helperText:
// 													touched.pickupDateTime && errors.pickupDateTime,
// 											},
// 										}}
// 									/>
// 								</LocalizationProvider>
// 							</Grid>

// 							{/* Drop off Date & Time */}
// 							<Grid item xs={12} md={3}>
// 								<LocalizationProvider dateAdapter={AdapterDayjs}>
// 									<DateTimePicker
// 										label="Drop off Date & Time (Estimated)"
// 										value={
// 											values.dropoffDateTime
// 												? dayjs(values.dropoffDateTime)
// 												: null
// 										}
// 										minDateTime={dayjs()}
// 										onChange={(newValue) => {
// 											if (newValue) {
// 												setFieldValue(
// 													"dropoffDateTime",
// 													newValue.format("YYYY-MM-DDTHH:mm")
// 												);
// 											}
// 										}}
// 										onAccept={(finalValue) => {
// 											console.log("Final selection:", finalValue?.toString());
// 										}}
// 										slotProps={{
// 											textField: {
// 												size: "small",
// 												fullWidth: true,
// 												error:
// 													touched.dropoffDateTime &&
// 													Boolean(errors.dropoffDateTime),
// 												helperText:
// 													touched.dropoffDateTime && errors.dropoffDateTime,
// 											},
// 										}}
// 									/>
// 								</LocalizationProvider>
// 							</Grid>

// 							{/* Optional Notes */}
// 							<Grid item xs={12} md={6}>
// 								<Field
// 									as={TextField}
// 									name="notes"
// 									label="Notes (Optional)"
// 									fullWidth
// 									size="small"
// 								/>
// 							</Grid>

// 							{/* Submit Button */}
// 							{/* <Grid
// 									container
// 									spacing={2}
// 									justifyContent="center"
// 									marginTop={2}
// 								>
// 									<Grid item>
// 										<CustomButtonOutlined onClick={onBack}>
// 											Back
// 										</CustomButtonOutlined>
// 									</Grid>
// 									<Grid item>
// 										<CustomButtonFilled type="submit">Next</CustomButtonFilled>
// 									</Grid>
// 								</Grid> */}
// 						</Grid>
// 					</Form>
// 				)}
// 			</Formik>
// 		</Grid>
// 	);
// };

// export default PickupDropoff;


// import React from 'react';
// import { useFormikContext } from 'formik';
// import { Grid, TextField, Typography } from '@mui/material';
// import dayjs from 'dayjs';
// import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// export interface FormValues {
// 	pickupDateTime: string;
// 	dropoffDateTime: string;
// 	notes: string;
// }

// const PickupDropoff: React.FC = () => {
// 	const { values, errors, touched, setFieldValue } = useFormikContext<FormValues>();

// 	return (
// 		<Grid sx={{ width: '100%' }}>
// 			<Typography
// 				variant="h6"
// 				sx={{ fontWeight: 'bold', marginLeft: '15px', marginTop: 4, marginBottom: 1 }}
// 			>
// 				Pickup and dropoff Details
// 			</Typography>
// 			<Grid
// 				container
// 				spacing={2}
// 				sx={{ marginTop: 3, width: '100%', m: 0 }}
// 			>
// 				<Grid item xs={12} md={3}>
// 					<LocalizationProvider dateAdapter={AdapterDayjs}>
// 						<DateTimePicker
// 							label="Pick up Date & Time (Estimated)"
// 							value={values.pickupDropoff.pickupDateTime ? dayjs(values.pickupDropoff.pickupDateTime) : null}
// 							minDateTime={dayjs()}
// 							onChange={(newValue) => {
// 								if (newValue) {
// 									setFieldValue('pickupDateTime', newValue.format('YYYY-MM-DDTHH:mm'));
// 								}
// 							}}
// 							slotProps={{
// 								textField: {
// 									size: 'small',
// 									fullWidth: true,
// 									error: touched.pickupDateTime && Boolean(errors.pickupDateTime),
// 									helperText: touched.pickupDateTime ? errors.pickupDateTime : '',
// 								},
// 							}}
// 						/>
// 					</LocalizationProvider>
// 				</Grid>

// 				<Grid item xs={12} md={3}>
// 					<LocalizationProvider dateAdapter={AdapterDayjs}>
// 						<DateTimePicker
// 							label="Drop off Date & Time (Estimated)"
// 							value={values.pickupDropoff.dropoffDateTime ? dayjs(values.pickupDropoff.dropoffDateTime) : null}
// 							minDateTime={dayjs()}
// 							onChange={(newValue) => {
// 								if (newValue) {
// 									setFieldValue('dropoffDateTime', newValue.format('YYYY-MM-DDTHH:mm'));
// 								}
// 							}}
// 							slotProps={{
// 								textField: {
// 									size: 'small',
// 									fullWidth: true,
// 									error: touched.dropoffDateTime && Boolean(errors.dropoffDateTime),
// 									helperText: touched.dropoffDateTime ? errors.dropoffDateTime : '',
// 								},
// 							}}
// 						/>
// 					</LocalizationProvider>
// 				</Grid>

// 				<Grid item xs={12} md={6}>
// 					<TextField
// 						name="pickupDropoff.notes"
// 						label="Notes (Optional)"
// 						value={values.notes}
// 						onChange={(e) => setFieldValue('notes', e.target.value)}
// 						fullWidth
// 						size="small"
// 					/>
// 				</Grid>
// 			</Grid>
// 		</Grid>
// 	);
// };

// export default PickupDropoff;




import React from 'react';
import { useFormikContext } from 'formik';
import { Grid, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface PickupDropoffValues {
	pickupDropoff: {
		pickupDateTime: string;
		dropoffDateTime: string;
		notes: string;
	};
}

const PickupDropoff: React.FC = () => {
	const { values, errors, touched, setFieldValue } = useFormikContext<PickupDropoffValues>();

	return (
		<Grid sx={{ width: '100%' }}>
			<Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: '15px', marginTop: 4, marginBottom: 1 }}>
				Pickup and dropoff Details
			</Typography>
			<Grid container spacing={2} sx={{ marginTop: 3, width: '100%', m: 0 }}>
				<Grid item xs={12} md={3}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateTimePicker
							label="Pick up Date & Time (Estimated)"
							value={values.pickupDropoff.pickupDateTime ? dayjs(values.pickupDropoff.pickupDateTime) : null}
							minDateTime={dayjs()}
							onChange={(newValue) => {
								if (newValue) {
									setFieldValue('pickupDropoff.pickupDateTime', newValue.format('YYYY-MM-DDTHH:mm'));
								}
							}}
							slotProps={{
								textField: {
									size: 'small',
									fullWidth: true,
									error: touched.pickupDropoff?.pickupDateTime && Boolean(errors.pickupDropoff?.pickupDateTime),
									helperText: touched.pickupDropoff?.pickupDateTime ? errors.pickupDropoff?.pickupDateTime : '',
								},
							}}
						/>
					</LocalizationProvider>
				</Grid>

				<Grid item xs={12} md={3}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateTimePicker
							label="Drop off Date & Time (Estimated)"
							value={values.pickupDropoff.dropoffDateTime ? dayjs(values.pickupDropoff.dropoffDateTime) : null}
							minDateTime={dayjs()}
							onChange={(newValue) => {
								if (newValue) {
									setFieldValue('pickupDropoff.dropoffDateTime', newValue.format('YYYY-MM-DDTHH:mm'));
								}
							}}
							slotProps={{
								textField: {
									size: 'small',
									fullWidth: true,
									error: touched.pickupDropoff?.dropoffDateTime && Boolean(errors.pickupDropoff?.dropoffDateTime),
									helperText: touched.pickupDropoff?.dropoffDateTime ? errors.pickupDropoff?.dropoffDateTime : '',
								},
							}}
						/>
					</LocalizationProvider>
				</Grid>

				<Grid item xs={12} md={6}>
					<TextField
						name="pickupDropoff.notes"
						label="Notes (Optional)"
						value={values.pickupDropoff.notes}
						onChange={(e) => setFieldValue('pickupDropoff.notes', e.target.value)}
						fullWidth
						size="small"
					/>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default PickupDropoff;
