"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GridColDef, DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  IconButton,
  Backdrop,
  CircularProgress,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetAllOrdersQuery } from "@/api/apiSlice";
import moment from "moment";

interface Route {
  start: { address: string; latitude: number; longitude: number };
  end: { address: string; latitude: number; longitude: number };
  distance: string;
  duration: string;
}

interface Pack {
  pack_ID: string;
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

export interface Order {
  updated_at: string;
  created_at: string;
  unallocated_packages: Pack[];
  ord_id: number;
  order_ID: string;
  scenario_label: string;
  // total_cost: string;
  allocations: Allocation[];
  order_status: string;
}

const SpotAuction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const { data: allOrders, error, isLoading } = useGetAllOrdersQuery({});
  const router = useRouter();

  if (error) {
    return (
      <Typography color="error">
        Failed to load data. Try after sometime.
      </Typography>
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ordersData: Order[] = allOrders?.orders || [];

  const biddingOrders = ordersData.filter(
    (eachOrder) =>
      eachOrder?.order_status == "open bidding" ||
      eachOrder?.order_status == "bidding finalised",
  );

  const handleViewOrder = (orderId: string) => {
    setLoading(true);
    router.push(`/spot-auction-view?order_ID=${orderId}&from=order-overview`);
  };

  const statusColors: Record<string, string> = {
    "assignment pending": "#FF9800",
    "carrier assignment": "#2196F3",
    "self assigned": "#4CAF50",
    "open bidding": "#9C27B0",
    "bidding finalised": "#4CAF50",
  };

  const toPascalCase = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Filtered Orders based on dateFilter
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredOrders = useMemo(() => {
    if (dateFilter === "All") return biddingOrders;

    const now = moment();
    return ordersData.filter((order) => {
      const createdAt = moment(order.created_at);
      switch (dateFilter) {
        case "Today":
          return createdAt.isSame(now, "day");
        case "Yesterday":
          return createdAt.isSame(now.clone().subtract(1, "day"), "day");
        case "This Week":
          return createdAt.isSame(now, "week");
        case "This Month":
          return createdAt.isSame(now, "month");
        case "This Year":
          return createdAt.isSame(now, "year");
        default:
          return true;
      }
    });
  }, [ordersData, dateFilter]);

  const ordersColumns: GridColDef[] = [
    { field: "order_ID", headerName: "Order ID", width: 150 },
    { field: "scenario_label", headerName: "Scenario", width: 150 },
    // { field: "total_cost", headerName: "Total Cost", width: 150 },
    {
      field: "unallocated_packages",
      headerName: "Unallocated Packages",
      width: 250,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      sortable: true,
      sortComparator: (v1, v2, param1, param2) =>
        new Date(
          param1.api.getCellValue(param1.id, "created_at_raw"),
        ).getTime() -
        new Date(
          param2.api.getCellValue(param2.id, "created_at_raw"),
        ).getTime(),
    },
    {
      field: "order_status",
      headerName: "Order Status",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value || "";
        const pascalStatus = toPascalCase(status);
        return (
          <Typography
            sx={{
              fontWeight: 500,
              color: statusColors[status.toLowerCase()] || "#000",
              marginTop: 1.6,
            }}
          >
            {pascalStatus}
          </Typography>
        );
      },
    },
    {
      field: "view",
      headerName: "View",
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={() => handleViewOrder(params.row.order_ID)}
          sx={{ color: "#F08C24" }}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  const formatCreateDate = (createDate: string) => {
    return moment(createDate).format("MMM DD, YYYY h:mm A");
  };
  return (
    <Box sx={{ width: "100%", marginTop: 2 }}>
      <Backdrop
        open={loading || isLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Grid item>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
            Spot Auction Orders
          </Typography>
        </Grid>
        <Grid container justifyContent="flex-end" sx={{ mb: 2, mt: 2 }}>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Filter by Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="Yesterday">Yesterday</MenuItem>
              <MenuItem value="This Week">This Week</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
              <MenuItem value="This Year">This Year</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Grid>

      <DataGrid
        rows={filteredOrders.map((order: Order) => ({
          id: order.ord_id,
          order_ID: order?.order_ID,
          scenario_label: order?.scenario_label,
          // total_cost: parseFloat(order?.total_cost || "0").toFixed(2),
          unallocated_packages:
            order?.unallocated_packages
              ?.map((pkg: Pack) => pkg.pack_ID)
              .join(", ") || "None",
          order_status: order?.order_status,
          created_at_raw: order?.created_at
            ? new Date(order?.created_at)
            : null,
          created_at: formatCreateDate(order?.created_at),
        }))}
        columns={ordersColumns}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 20, 30]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </Box>
  );
};

export default SpotAuction;
