'use client';
import { useAppSelector, useAppDispatch } from '@/store';
import React from 'react';
import { Checkbox, FormControlLabel, Grid, Typography, useMediaQuery } from '@mui/material';
import { setFilters } from '@/store/authSlice';
import theme from '@/theme';

const ConfigSettings = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.auth.filters);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    console.log("filters:", filters);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        dispatch(setFilters({ ...filters, [name]: checked }));
    };

return (
        <Grid
            container
            direction="column"
            alignItems="center"
            sx={{ p: isMobile ? 2 : 3 }}
        >
            <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#83214F", fontWeight: "bold", textAlign: "center" }}
            >
                Config Settings
            </Typography>

            <Grid
                container
                spacing={2}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    width: isMobile ? "100%" : "700px",
                    maxWidth: "100%",
                }}
                justifyContent={isMobile ? "center" : "flex-start"}
            >
                {Object.entries(filters).map(([filterKey, filterValue]) => (
                    <Grid item key={filterKey} xs={12} sm={6} md={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filterValue}
                                    onChange={handleFilterChange}
                                    name={filterKey}
                                />
                            }
                            label={filterKey
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .toLowerCase()
                                .replace(/^./, (char) => char.toUpperCase())
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default ConfigSettings;
