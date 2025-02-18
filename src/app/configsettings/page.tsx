'use client';
import { useAppSelector, useAppDispatch } from '@/store';
import React from 'react';
import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { setFilters } from '@/store/authSlice';

const ConfigSettings = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.auth.filters);

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

        >
            <Typography variant="h6" gutterBottom sx={{ color: '#83214F', fontWeight: 'bold' }}>
                Config Settings
            </Typography>

            <Grid container spacing={2}
                sx={{ p: 3, borderRadius: 2, width: '700px' }}
            >
                {Object.entries(filters).map(([filterKey, filterValue]) => (
                    <Grid item key={filterKey}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filterValue}
                                    onChange={handleFilterChange}
                                    name={filterKey}
                                />
                            }
                            label={filterKey
                                .replace(/([A-Z])/g, ' $1')
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
