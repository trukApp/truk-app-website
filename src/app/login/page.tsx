
'use client'
import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signIn } from 'next-auth/react';

const LoginPage: React.FC = () => {
  const [callbackUrl, setCallbackUrl] = useState<string>('/');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  console.log('callbackUrl', callbackUrl)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callbackUrlFromQuery = urlParams.get('callbackUrl');
    if (callbackUrlFromQuery) {
      setCallbackUrl(callbackUrlFromQuery); // Set callbackUrl if it exists in the query params
    }
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        phone,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to callbackUrl or default to home page ('/')
        window.location.href = callbackUrl; // Redirect after successful login
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  console.log("")
  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: '#ffffff' }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '400px',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h4" align="center" marginBottom="20px" color="primary">
          Login
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center" marginBottom="10px">
            {error}
          </Typography>
        )}
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handlePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: '20px' }}
          onClick={handleLogin}
          disabled={loading} // Disable button during loading
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
        <Typography variant="body2" align="center" marginTop="10px">
          Don't have an account? <a href="/signup">Sign up</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
