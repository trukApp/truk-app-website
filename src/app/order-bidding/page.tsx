'use client';
import { useGetAllOrdersQuery } from '@/api/apiSlice';
import React, { useState } from 'react'
import { Order } from '../order-overview/page';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import moment from 'moment';
import { Backdrop, CircularProgress, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Visibility } from '@mui/icons-material';

const OrderBidding: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const { data: allOrders, isLoading } = useGetAllOrdersQuery({});
    const router = useRouter();
    const allOrdersData = allOrders?.orders || [];
    const getAssignedPendingOrders = allOrdersData?.filter((eachOrder: Order) => {
        return eachOrder?.order_status === 'assignment pending'
    })

    console.log("getAssignedPendingOrders: ", getAssignedPendingOrders)
    console.log("allOrders: ", allOrders)
    const handleViewOrder = (orderId: string) => {
        setLoading(true)
        router.push(`/detailed-order-overview?order_ID=${orderId}&from=order-bidding`);
    };

    const ordersColumns: GridColDef[] = [
        { field: 'order_ID', headerName: 'Order ID', width: 150 },
        { field: 'scenario_label', headerName: 'Scenario', width: 150 },
        { field: 'total_cost', headerName: 'Total Cost', width: 150 },
        { field: 'unallocated_packages', headerName: 'Unallocated Packages', width: 250 },
        { field: 'created_at', headerName: 'Created At', width: 200 },
        { field: 'order_status', headerName: 'Order status', width: 200 },
        {
            field: 'view',
            headerName: 'View',
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton onClick={() => handleViewOrder(params.row.order_ID)} sx={{ color: "#F08C24" }}>
                    <Visibility />
                </IconButton>
            ),
        },
    ];
    return (
        <>
            <Backdrop
                open={loading || isLoading}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <DataGrid
                rows={getAssignedPendingOrders.map((order: Order) => ({
                    id: order.ord_id,
                    order_ID: order?.order_ID,
                    scenario_label: order?.scenario_label,
                    total_cost: order?.total_cost,
                    unallocated_packages: order?.unallocated_packages?.join(', ') || 'None',
                    order_status: order?.order_status,
                    created_at: moment(new Date(order?.created_at).toLocaleString()).format("DD MMM YYYY"),
                }))}
                columns={ordersColumns}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[10, 20, 30]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
            />
        </>
    )
}

export default OrderBidding