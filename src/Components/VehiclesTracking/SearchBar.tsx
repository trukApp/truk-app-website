"use client";

import React from "react";
import {
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        mt: 3,
        mb: 3,
      }}
    >
      <Grid display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search vehicle, driver..."
          sx={{
            width: {
              xs: "100%",
              md: 350,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Typography color="text.secondary" fontWeight={600}>
          Last Updated : {new Date().toLocaleTimeString()}
        </Typography>
      </Grid>
    </Paper>
  );
}
