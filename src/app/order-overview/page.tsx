'use client';

import React, { useState } from 'react';
import { GridColDef, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useGetAllOrdersQuery } from '@/api/apiSlice';

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
  const { data: allOrders, error, isLoading } = useGetAllOrdersQuery({});
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Failed to load data.</Typography>;
  }

  const ordersData: Order[] = allOrders?.orders || [];

  const handleToggleExpand = (orderId: number) => {
    setExpandedRowId((prev) => (prev === orderId ? null : orderId));
  };

  const ordersColumns: GridColDef[] = [
    {
      field: 'expand',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => handleToggleExpand(params.row.id)} size="small">
          {expandedRowId === params.row.id ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      ),
    },
    { field: 'order_ID', headerName: 'Order ID', width: 150 },
    { field: 'scenario_label', headerName: 'Scenario', width: 150 },
    { field: 'total_cost', headerName: 'Total Cost', width: 150 },
    { field: 'unallocated_packages', headerName: 'Unallocated Packages', width: 250 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    { field: 'updated_at', headerName: 'Updated At', width: 200 },
  ];

  const allocationsColumns: GridColDef[] = [
    { field: 'vehicle_ID', headerName: 'Vehicle ID', width: 150 },
    { field: 'route', headerName: 'Route', width: 300 },
    { field: 'leftoverVolume', headerName: 'Leftover Volume', width: 180 },
    { field: 'leftoverWeight', headerName: 'Leftover Weight', width: 180 },
    { field: 'occupiedVolume', headerName: 'Occupied Volume', width: 180 },
    { field: 'occupiedWeight', headerName: 'Occupied Weight', width: 180 },
    { field: 'totalVolumeCapacity', headerName: 'Total Volume Capacity', width: 220 },
    { field: 'totalWeightCapacity', headerName: 'Total Weight Capacity', width: 220 },
  ];

  return (
    <Box sx={{ width: '100%', marginTop: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center', fontWeight: 600 }}>
        Orders List
      </Typography>
      <DataGrid
        rows={ordersData.map((order) => ({
          id: order.ord_id,
          order_ID: order.order_ID,
          scenario_label: order.scenario_label,
          total_cost: order.total_cost,
          unallocated_packages: order.unallocated_packages?.join(', ') || 'None',
          created_at: new Date(order.created_at).toLocaleString(),
          updated_at: new Date(order.updated_at).toLocaleString(),
          allocations: order.allocations,
        }))}
        columns={ordersColumns}
        autoHeight
        disableRowSelectionOnClick
      />

      {ordersData.map((order) => (
        <Collapse key={order.ord_id} in={expandedRowId === order.ord_id} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 2, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 600 }}>
              Allocations for Order {order.order_ID}
            </Typography>
            <DataGrid
              rows={order.allocations.map((allocation, index) => ({
                id: `${order.ord_id}-${index}`,
                vehicle_ID: allocation.vehicle_ID,
                route: allocation.route
                  .map(
                    (route) =>
                      `${route.start.address} to ${route.end.address} (${route.distance}, ${route.duration})`
                  )
                  .join(' | '),
                leftoverVolume: allocation.leftoverVolume,
                leftoverWeight: allocation.leftoverWeight,
                occupiedVolume: allocation.occupiedVolume,
                occupiedWeight: allocation.occupiedWeight,
                totalVolumeCapacity: allocation.totalVolumeCapacity,
                totalWeightCapacity: allocation.totalWeightCapacity,
              }))}
              columns={allocationsColumns}
              autoHeight
              disableRowSelectionOnClick
            />
          </Box>
        </Collapse>
      ))}
    </Box>
  );
};

export default OrdersGrid;



