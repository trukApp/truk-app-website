"use client";
import { useGetAllOrdersQuery } from "@/api/apiSlice";
import {
    Backdrop,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";
// import KPICard from "@/components/KPICard";
// import { calculateKPIs } from "@/utils/kpiCalculations";
import KPICard from "@/Components/KPIDashboard/KPICard";
import { calculateKPIs } from "@/Components/KPIDashboard/kpiCalculations";
import OrdersByStatusBarChart from "@/Components/KPIDashboard/OrdersByStatusBarChart";
const KPIDashboard: React.FC = () => {
    const { data: allOrders, isLoading } = useGetAllOrdersQuery({});

    const orders = allOrders?.orders || [];
    const kpis = calculateKPIs(orders);
    console.log("KPI Dashboard rendered with orders:", orders);

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Typography variant="h5" gutterBottom>
                📊 Order KPI Dashboard
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Total Orders" value={kpis.totalOrders} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Completed Orders" value={kpis.completedOrders} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="In-Progress Orders" value={kpis.inProgressOrders} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Total Distance (km)" value={kpis.totalDistance.toFixed(2)} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Avg Distance / Trip" value={kpis.avgDistancePerTrip.toFixed(2)} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Vehicles Used" value={kpis.vehiclesUsed} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Own Fleet Orders" value={kpis.ownFleetOrders} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Carrier Orders" value={kpis.carrierOrders} />
                </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                    <OrdersByStatusBarChart statusCount={kpis.statusCount} />
                </Grid>
            </Grid>

        </>
    );
};

export default KPIDashboard;
