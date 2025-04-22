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
                sx={{ color: "#83214F", fontWeight: "bold", textAlign: "center" }}
            >
               External ERP Systems connected for package creation
            </Typography>

        </Grid>
    );
};

export default SystemConections;
