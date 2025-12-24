// import React from 'react';
// import { useFormikContext } from 'formik';
// import { Grid, TextField, Typography } from '@mui/material';
// import dayjs from 'dayjs';
// import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// interface PickupDropoffValues {
// 	pickupDropoff: {
// 		pickupDateTime: string;
// 		dropoffDateTime: string;
// 		notes: string;
// 	};
// }

// const PickupDropoff: React.FC = () => {
// 	const { values, errors, touched, setFieldValue } = useFormikContext<PickupDropoffValues>();

// 	return (
// 		<Grid sx={{ width: '100%' }}>
// 			<Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: '15px', marginTop: 4, marginBottom: 1 }}>
// 				Pickup and dropoff Details
// 			</Typography>
// 			<Grid container spacing={2} sx={{ marginTop: 3, width: '100%', m: 0 }}>
// 				<Grid item xs={12} md={3}>
// 					<LocalizationProvider dateAdapter={AdapterDayjs}>
// 						<DateTimePicker
// 							label="Pick up Date & Time (Estimated)"
// 							value={values.pickupDropoff.pickupDateTime ? dayjs(values.pickupDropoff.pickupDateTime) : null}
// 							minDateTime={dayjs()}
// 							onChange={(newValue) => {
// 								if (newValue) {
// 									setFieldValue('pickupDropoff.pickupDateTime', newValue.format('YYYY-MM-DDTHH:mm'));
// 								}
// 							}}
// 							slotProps={{
// 								textField: {
// 									size: 'small',
// 									fullWidth: true,
// 									error: touched.pickupDropoff?.pickupDateTime && Boolean(errors.pickupDropoff?.pickupDateTime),
// 									helperText: touched.pickupDropoff?.pickupDateTime ? errors.pickupDropoff?.pickupDateTime : '',
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
// 									setFieldValue('pickupDropoff.dropoffDateTime', newValue.format('YYYY-MM-DDTHH:mm'));
// 								}
// 							}}
// 							slotProps={{
// 								textField: {
// 									size: 'small',
// 									fullWidth: true,
// 									error: touched.pickupDropoff?.dropoffDateTime && Boolean(errors.pickupDropoff?.dropoffDateTime),
// 									helperText: touched.pickupDropoff?.dropoffDateTime ? errors.pickupDropoff?.dropoffDateTime : '',
// 								},
// 							}}
// 						/>
// 					</LocalizationProvider>
// 				</Grid>

// 				<Grid item xs={12} md={6}>
// 					<TextField
// 						name="pickupDropoff.notes"
// 						label="Notes (Optional)"
// 						value={values.pickupDropoff.notes}
// 						onChange={(e) => setFieldValue('pickupDropoff.notes', e.target.value)}
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

interface PickupDropoff {
	pickupDateTime: string;
	dropoffDateTime: string;
	notes: string;
}

interface FormValues {
	packages: {
		pickupDropoff: PickupDropoff;
	}[];
}

interface Props {
	index: number;
}

const PickupDropoff: React.FC<Props> = ({ index }) => {
	const { values, errors, touched, setFieldValue } =
		useFormikContext<FormValues>();

	const pickupDropoff = values.packages[index].pickupDropoff;
	const pickupDropoffTouched = touched?.packages?.[index]?.pickupDropoff;
	const pickupDropoffErrors = errors?.packages?.[index]?.pickupDropoff;

	return (
		<Grid sx={{ width: '100%' }}>
			<Typography
				variant="h6"
				sx={{
					fontWeight: 'bold',
					marginLeft: '15px',
					marginTop: 4,
					marginBottom: 1,
				}}
			>
				Pickup and Dropoff Details
			</Typography>

			<Grid container spacing={2} sx={{ marginTop: 3, width: '100%', m: 0 }}>
				{/* Pickup Date & Time */}
				<Grid item xs={12} md={3}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateTimePicker
							label="Pick up Date & Time (Estimated)"
							value={
								pickupDropoff.pickupDateTime
									? dayjs(pickupDropoff.pickupDateTime)
									: null
							}
							minDateTime={dayjs()}
							onChange={(newValue) => {
								if (newValue) {
									setFieldValue(
										`packages.${index}.pickupDropoff.pickupDateTime`,
										newValue.format('YYYY-MM-DDTHH:mm')
									);
								}
							}}
							slotProps={{
								textField: {
									size: 'small',
									fullWidth: true,
									error:
										pickupDropoffTouched?.pickupDateTime &&
										Boolean(pickupDropoffErrors?.pickupDateTime),
									helperText:
										pickupDropoffTouched?.pickupDateTime
											? pickupDropoffErrors?.pickupDateTime
											: '',
								},
							}}
						/>
					</LocalizationProvider>
				</Grid>

				{/* Dropoff Date & Time */}
				<Grid item xs={12} md={3}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateTimePicker
							label="Drop off Date & Time (Estimated)"
							value={
								pickupDropoff.dropoffDateTime
									? dayjs(pickupDropoff.dropoffDateTime)
									: null
							}
							minDateTime={dayjs()}
							onChange={(newValue) => {
								if (newValue) {
									setFieldValue(
										`packages.${index}.pickupDropoff.dropoffDateTime`,
										newValue.format('YYYY-MM-DDTHH:mm')
									);
								}
							}}
							slotProps={{
								textField: {
									size: 'small',
									fullWidth: true,
									error:
										pickupDropoffTouched?.dropoffDateTime &&
										Boolean(pickupDropoffErrors?.dropoffDateTime),
									helperText:
										pickupDropoffTouched?.dropoffDateTime
											? pickupDropoffErrors?.dropoffDateTime
											: '',
								},
							}}
						/>
					</LocalizationProvider>
				</Grid>

				{/* Notes */}
				<Grid item xs={12} md={6}>
					<TextField
						label="Notes (Optional)"
						value={pickupDropoff.notes}
						onChange={(e) =>
							setFieldValue(
								`packages.${index}.pickupDropoff.notes`,
								e.target.value
							)
						}
						fullWidth
						size="small"
					/>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default PickupDropoff;
