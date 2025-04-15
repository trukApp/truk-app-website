'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GridColDef, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography, IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useGetAllOrdersQuery } from '@/api/apiSlice';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { GET_ALL_ORDERS } from '@/api/graphqlApiSlice';
interface Route {
  start: { address: string; latitude: number; longitude: number };
  end: { address: string; latitude: number; longitude: number };
  distance: string;
  duration: string;
}

interface Allocation {
  vehicle_ID: string;
  route: Route[];
  leftoverVolume: number;
  leftoverWeight: number;
  occupiedVolume: number;
  occupiedWeight: number;
  totalVolumeCapacity: number;
  totalWeightCapacity: number;
}

interface Order {
  updated_at: string;
  created_at: string;
  unallocated_packages: string[];
  ord_id: number;
  order_ID: string;
  scenario_label: string;
  total_cost: string;
  allocations: Allocation[];
}


const OrdersGrid: React.FC = () => {
  // const { data: allOrders, error, isLoading } = useGetAllOrdersQuery({});
 
  const { loading, error, data:allOrders } = useQuery(GET_ALL_ORDERS, {
    variables: { page: 1, limit: 10 },
  });

console.log(allOrders)


  const router = useRouter();




  const ordersData = allOrders?.getAllOrders.orders || [];
  const handleViewOrder = (orderId: string) => {
    router.push(`/detailed-order-overview?order_ID=${orderId}`);
  };

  const ordersColumns: GridColDef[] = [
    { field: 'order_ID', headerName: 'Order ID', width: 150 },
    { field: 'scenario_label', headerName: 'Scenario', width: 150 },
    { field: 'total_cost', headerName: 'Total Cost', width: 150 },
    { field: 'unallocated_packages', headerName: 'Unallocated Packages', width: 250 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    {
      field: 'view',
      headerName: 'View',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => handleViewOrder(params.row.order_ID)} sx={{ color: "#83214F" }}>
          <Visibility />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', marginTop: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center', fontWeight: 600 }}>
        Orders List
      </Typography>
      <DataGrid
        rows={ordersData.map((order: Order) => ({
          id: order.ord_id,
          order_ID: order?.order_ID,
          scenario_label: order?.scenario_label,
          total_cost: order?.total_cost,
          unallocated_packages: order?.unallocated_packages?.join(', ') || 'None',
          created_at: moment(new Date(order?.created_at).toLocaleString()).format("DD MMM YYYY, hh:mm A"),

       
        }))}
        columns={ordersColumns}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 20, 30]}
        initialState={{pagination: { paginationModel: { pageSize: 10 } },
  }}
      />
    </Box>
  );
};

export default OrdersGrid;
