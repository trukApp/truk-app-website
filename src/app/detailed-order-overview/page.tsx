"use client";
import React from "react";
import { useGetOrderByIdQuery } from "@/api/apiSlice";
import { Backdrop, CircularProgress, Grid, Paper, Typography, Box } from "@mui/material";
import Allocations from "@/Components/OrderOverViewAllocations/Allocations";

const OrderDetailedOverview = () => {
    const orderId = "ORD000001";
    const { data: order, isLoading } = useGetOrderByIdQuery({ orderId });

    const orderData = order?.order;
    console.log("orderData: ", orderData);

    return (
        <Box sx={{ p: 3 }}>
            {/* Loading Indicator */}
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Order Details Section */}
            {orderData && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Order Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Order ID: {orderData.order_ID}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Scenario: {orderData.scenario_label}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Total Cost: ₹{orderData.total_cost}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Created At: {new Date(orderData.created_at).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Updated At: {new Date(orderData.updated_at).toLocaleString()}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Allocations Section */}
            {orderData?.allocations && <Allocations allocations={orderData.allocations} />}
        </Box>
    );
};

export default OrderDetailedOverview;
