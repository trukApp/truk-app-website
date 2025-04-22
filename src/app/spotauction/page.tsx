'use client';
import React from 'react';
import { Grid, Typography, useMediaQuery } from '@mui/material';
import theme from '@/theme';

const SystemConections = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                Spot Auction
            </Typography>

        </Grid>
    );
};

export default SystemConections;
