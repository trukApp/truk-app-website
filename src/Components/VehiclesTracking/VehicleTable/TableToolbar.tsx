"use client";

import React from "react";

import { Button, Grid, MenuItem, TextField } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function TableToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <Grid
      container
      spacing={2}
      mb={2}
      alignItems="center"
      justifyContent="space-between"
      mt={1}
    >
      <Grid sx={{ xs: 12, md: 4, pl: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Vehicle / Driver..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{
                  mr: 1,
                  color: "#9ca3af",
                }}
              />
            ),
          }}
        />
      </Grid>

      <Grid sx={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          size="small"
          select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Moving">Moving</MenuItem>
          <MenuItem value="Idle">Idle</MenuItem>
          <MenuItem value="Stopped">Stopped</MenuItem>
        </TextField>
      </Grid>

      <Grid>
        <Button startIcon={<RefreshIcon />} variant="outlined">
          Refresh
        </Button>
      </Grid>

      <Grid>
        <Button
          startIcon={<FileDownloadIcon />}
          variant="contained"
          sx={{
            bgcolor: "#F08C24",

            "&:hover": {
              bgcolor: "#d97706",
            },
          }}
        >
          Export
        </Button>
      </Grid>
    </Grid>
  );
}
