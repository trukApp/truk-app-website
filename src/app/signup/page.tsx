'use client';
import { Formik } from 'formik';
import { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, IconButton, Card, CardContent } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import styles from './SignUpPage.module.css'

interface FormValues {
    firstName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function SignUpPage() {
    const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (values: FormValues, { setSubmitting, setErrors, setTouched }: any) => {
        // Trigger validation manually
        const errors: any = {};
        if (!values.firstName) {
            errors.firstName = 'First name is required';
        }
        if (!values.lastName) {
            errors.lastName = 'Last name is required';
        }
        if (!values.gender) {
            errors.gender = 'Gender is required';
        }
        if (!values.phoneNumber) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(values.phoneNumber)) {
            errors.phoneNumber = 'Phone number must be 10 digits';
        }
        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        if (!values.password) {
            errors.password = 'Password is required';
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        if (!values.confirmPassword) {
            errors.confirmPassword = 'Confirm password is required';
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = 'Passwords must match';
        }

        // Set errors
        setErrors(errors);

        // If there are no errors, set the submitted data
        if (Object.keys(errors).length === 0) {
            setSubmittedData(values);
        }

        setSubmitting(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
            <Card sx={{ maxWidth: 400, width: '100%', padding: 3, boxShadow: 3 }}>
                <CardContent>
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            gender: '',
                            phoneNumber: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, handleSubmit, errors, touched, setFieldTouched }) => (
                            <form onSubmit={handleSubmit}>
                                {/* First Name */}

                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    fullWidth
                                    error={Boolean(touched.firstName && errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    margin="normal"
                                    onBlur={() => setFieldTouched('firstName')}
                                // className={styles.signupTextField}
                                />

                                {/* Last Name */}
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                    error={Boolean(touched.lastName && errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    margin="normal"
                                    onBlur={() => setFieldTouched('lastName')}
                                />

                                {/* Gender Dropdown */}
                                <FormControl fullWidth margin="normal" error={Boolean(touched.gender && errors.gender)}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        label="Gender"
                                        name="gender"
                                        value={values.gender}
                                        onChange={handleChange}
                                        onBlur={() => setFieldTouched('gender')}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                    {touched.gender && errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                                </FormControl>

                                {/* Phone Number */}
                                <TextField
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={values.phoneNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                    margin="normal"
                                    onBlur={() => setFieldTouched('phoneNumber')}
                                />

                                {/* Email */}
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    fullWidth
                                    error={Boolean(touched.email && errors.email)}
                                    helperText={touched.email && errors.email}
                                    margin="normal"
                                    onBlur={() => setFieldTouched('email')}
                                />

                                {/* Password */}
                                <TextField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handleChange}
                                    fullWidth
                                    error={Boolean(touched.password && errors.password)}
                                    helperText={touched.password && errors.password}
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        ),
                                    }}
                                    onBlur={() => setFieldTouched('password')}
                                />

                                {/* Confirm Password */}
                                <TextField
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    fullWidth
                                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        ),
                                    }}
                                    onBlur={() => setFieldTouched('confirmPassword')}
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginTop: 2 }}
                                >
                                    Sign Up
                                </Button>
                            </form>
                        )}
                    </Formik>

                    {submittedData && (
                        <div>
                            <h3>Form Data Submitted:</h3>
                            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
