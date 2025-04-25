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
                sx={{ color: "#F08C24", fontWeight: "bold", textAlign: "center" }}
            >
                Config Settings
            </Typography>
            
            <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "#666", mb: 2 }}
            >
                Customize your preferences below. These settings control various aspects of your app experience.
                Toggle the switches to enable or disable specific features based on your needs.
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
                <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            General Settings
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                            These settings control the general behavior and appearance of your account. You can toggle options like notifications and more.
                        </Typography>
                    </Grid>
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
