"use client";

import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Button,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

const fontSizes = ["Small", "Medium", "Large"];
const colorThemes = ["Light", "Dark", "System"];
const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
const timeZones = ["UTC", "IST", "EST", "PST"];
const currencies = ["USD", "INR", "EUR", "GBP"];

const UserSettingsPage = () => {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    fontSize: "Medium",
    colorTheme: "Light",
    dateFormat: "MM/DD/YYYY",
    timeZone: "UTC",
    localCurrency: "USD",
    groupCurrency: "USD",
    logo: null as File | null,
  });

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
) => {
  const target = e.target as HTMLInputElement & { name: string; value: string };
  const { name, value } = target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, logo: file }));
};

  const handleSubmit = () => {
    // Example: send form data to backend
    console.log("Submitted settings:", form);
    alert("Settings saved successfully!");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        User Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Company Name"
            name="companyName"
            fullWidth size='small'
            value={form.companyName}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="User Email Address"
            name="email" size='small'
            fullWidth
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Font Size</InputLabel>
            <Select name="fontSize" value={form.fontSize} onChange={handleChange} size='small' label="Font Size">
              {fontSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Colour Theme</InputLabel>
            <Select name="colorTheme" value={form.colorTheme} size='small' onChange={handleChange} label="Colour Theme">
              {colorThemes.map((theme) => (
                <MenuItem key={theme} value={theme}>
                  {theme}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Date Format</InputLabel>
            <Select name="dateFormat" value={form.dateFormat} size='small' onChange={handleChange} label="Date Format">
              {dateFormats.map((format) => (
                <MenuItem key={format} value={format}>
                  {format}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Time Zone</InputLabel>
            <Select name="timeZone" value={form.timeZone} size='small' onChange={handleChange} label="Time Zone">
              {timeZones.map((zone) => (
                <MenuItem key={zone} value={zone}>
                  {zone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Local Currency</InputLabel>
            <Select name="localCurrency" value={form.localCurrency} size='small' onChange={handleChange} label="Local Currency">
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Group Currency</InputLabel>
            <Select name="groupCurrency" value={form.groupCurrency} size='small' onChange={handleChange} label="Group Currency">
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            Company Logo
          </Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {form.logo && <Typography mt={1}>{form.logo.name}</Typography>}
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Settings
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserSettingsPage;
