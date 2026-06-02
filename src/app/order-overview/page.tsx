/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
} from "@mui/x-data-grid";

import {
  Box,
  Typography,
  IconButton,
  Backdrop,
  CircularProgress,
  Grid,
  TextField,
  MenuItem,
  Popover,
  Checkbox,
  FormControlLabel,
  Divider,
  Button,
} from "@mui/material";

import { Visibility, ViewColumn, Edit } from "@mui/icons-material";

import { useGetAllOrdersQuery } from "@/api/apiSlice";

import moment from "moment";

interface Route {
  start: {
    address: string;
    latitude: number;
    longitude: number;
  };

  end: {
    address: string;
    latitude: number;
    longitude: number;
  };

  distance: string;
  duration: string;
}

interface Pack {
  pack_ID: string;
}

interface PackageDestinationRadius {
  destination_radius: string;
  pack_ID: string;
  ship_to: string;
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
  packages?: string[];
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

  start_loc_ID?: string;
  end_loc_ID?: string;

  total_distance?: string;
  total_weight?: string;

  allocated_packages?: string[];
  allocated_vehicles?: string[];

  package_dest_radius?: PackageDestinationRadius[];
}

const OrdersGrid: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showSavedDrafts, setShowSavedDrafts] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const [pickupCustomDate, setPickupCustomDate] = useState("");
  const [dropoffCustomDate, setDropoffCustomDate] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    order_ID: true,
    ship_from: true,
    ship_to: true,
    products: true,
    stops: true,
    order_status: true,
    view: true,
    scenario_label: false,
    // total_cost: false,
    total_distance: false,
    total_weight: false,
    allocated_vehicles: false,
    allocated_packages: false,
    package_dest_radius: false,
    unallocated_packages: false,
    created_at: false,
  });

  const { data: allOrders, error, isLoading } = useGetAllOrdersQuery({});
  console.log("Fetched Orders Data:", allOrders);
  const ordersData: Order[] = useMemo(
    () => allOrders?.orders ?? [],
    [allOrders],
  );
  const statusColors: Record<string, string> = {
    "assignment pending": "#F08C24",
    "carrier assignment": "#2196F3",
    "self assigned": "#4CAF50",
    "open bidding": "#9C27B0",
    delivered: "#111827",
    finished: "#111827",
  };

  const toPascalCase = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // const filteredOrders = useMemo(() => {
  //   let filtered = ordersData;

  //   if (dateFilter !== "All") {
  //     const today = moment();

  //     filtered = filtered.filter((order) => {
  //       const createdAt = moment(order.created_at);

  //       switch (dateFilter) {
  //         case "Today":
  //           return createdAt.isSame(today, "day");
  //         case "Yesterday":
  //           return createdAt.isSame(today.clone().subtract(1, "day"), "day");
  //         case "This Week":
  //           return createdAt.isSame(today, "week");
  //         case "This Month":
  //           return createdAt.isSame(today, "month");
  //         case "This Year":
  //           return createdAt.isSame(today, "year");
  //         default:
  //           return true;
  //       }
  //     });
  //   }

  //   if (pickupCustomDate) {
  //     filtered = filtered.filter((order) =>
  //       moment(order.created_at).isSame(moment(pickupCustomDate), "day"),
  //     );
  //   }

  //   if (dropoffCustomDate) {
  //     filtered = filtered.filter((order) =>
  //       moment(order.updated_at).isSame(moment(dropoffCustomDate), "day"),
  //     );
  //   }

  //   return filtered;
  // }, [ordersData, dateFilter, pickupCustomDate, dropoffCustomDate]);
  const filteredOrders = useMemo(() => {
    let filtered = ordersData;

    if (showSavedDrafts) {
      // Show only Draft Orders
      filtered = filtered.filter(
        (order) => order.order_status?.toLowerCase() === "draft",
      );
    } else {
      // Show all orders except Draft Orders
      filtered = filtered.filter(
        (order) => order.order_status?.toLowerCase() !== "draft",
      );
    }

    // Existing Date Filters
    if (dateFilter !== "All") {
      const today = moment();

      filtered = filtered.filter((order) => {
        const createdAt = moment(order.created_at);

        switch (dateFilter) {
          case "Today":
            return createdAt.isSame(today, "day");

          case "Yesterday":
            return createdAt.isSame(today.clone().subtract(1, "day"), "day");

          case "This Week":
            return createdAt.isSame(today, "week");

          case "This Month":
            return createdAt.isSame(today, "month");

          case "This Year":
            return createdAt.isSame(today, "year");

          default:
            return true;
        }
      });
    }

    if (pickupCustomDate) {
      filtered = filtered.filter((order) =>
        moment(order.created_at).isSame(moment(pickupCustomDate), "day"),
      );
    }

    if (dropoffCustomDate) {
      filtered = filtered.filter((order) =>
        moment(order.updated_at).isSame(moment(dropoffCustomDate), "day"),
      );
    }

    return filtered;
  }, [
    ordersData,
    showSavedDrafts,
    dateFilter,
    pickupCustomDate,
    dropoffCustomDate,
  ]);
  const handleViewOrder = (orderId: string) => {
    setLoading(true);
    router.push(
      `/detailed-order-overview?order_ID=${orderId}&from=order-overview`,
    );
  };

  const handleEditDraft = (row: any) => {
    router.push(`/edit-draft?draftId=${row.order_ID}&mode=edit`);
  };
  const formatDate = (date: string) =>
    moment(date).format("MMM DD, YYYY h:mm A");
  const columns: GridColDef[] = [
    {
      field: "order_ID",
      headerName: showSavedDrafts ? "Draft ID" : "Order ID",
      width: 160,
    },

    {
      field: "ship_from",
      headerName: "Ship From",
      width: 300,
    },

    {
      field: "ship_to",
      headerName: "Ship To",
      width: 300,
    },

    {
      field: "products",
      headerName: "Products",
      width: 320,
    },

    {
      field: "stops",
      headerName: "Stops",
      width: 100,
    },

    {
      field: "order_status",
      headerName: "Order Status",
      width: 220,

      renderCell: (params: GridRenderCellParams) => {
        const status = params.value || "";

        return (
          <Typography
            sx={{
              fontWeight: 700,
              color: statusColors[status.toLowerCase()] || "#111827",
              fontSize: "15px",
            }}
          >
            {toPascalCase(status)}
          </Typography>
        );
      },
    },
    {
      field: "draft_saved",
      headerName: "Draft Saved",
      width: 220,

      renderCell: (params: GridRenderCellParams) => {
        const value = params.value;

        const isRoute = value === "Route Optimization";

        return (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "16px",
              fontWeight: 600,
              fontSize: "13px",
              color: "#fff",
              backgroundColor: isRoute ? "#1976D2" : "#2E7D32",
              textAlign: "center",
              minWidth: "150px",
            }}
          >
            {value}
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: showSavedDrafts ? "Edit" : "View",
      width: 120,
      sortable: false,

      renderCell: (params: GridRenderCellParams) => {
        if (showSavedDrafts) {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                color: "#F08C24",
                fontWeight: 600,
              }}
              onClick={() => handleEditDraft(params.row)}
            >
              <Edit fontSize="small" />
              Edit
            </Box>
          );
        }

        return (
          <IconButton
            onClick={() => handleViewOrder(params.row.order_ID)}
            sx={{ color: "#F08C24" }}
          >
            <Visibility />
          </IconButton>
        );
      },
    },
    {
      field: "scenario_label",
      headerName: "Scenario",
      width: 220,
    },
    {
      field: "total_distance",
      headerName: "Total Distance",
      width: 180,
    },

    {
      field: "total_weight",
      headerName: "Total Weight",
      width: 180,
    },

    {
      field: "allocated_vehicles",
      headerName: "Allocated Vehicles",
      width: 250,
    },

    {
      field: "allocated_packages",
      headerName: "Allocated Packages",
      width: 260,
    },

    {
      field: "package_dest_radius",
      headerName: "Package Destination Radius",
      width: 320,
    },

    {
      field: "unallocated_packages",
      headerName: "Unallocated Packages",
      width: 260,
    },

    {
      field: "created_at",
      headerName: "Created At",
      width: 220,
    },
  ];

  const rows = filteredOrders.map((order: Order) => {
    const firstAllocation = order.allocations?.[0];
    const firstRoute = firstAllocation?.route?.[0];
    return {
      id: order.ord_id,
      // order_ID: order.order_ID,
      order_ID: showSavedDrafts ? `DF${order.order_ID}` : order.order_ID,
      ship_from: firstRoute?.start?.address || order.start_loc_ID || "N/A",
      ship_to: firstRoute?.end?.address || order.end_loc_ID || "N/A",
      products: firstAllocation?.packages?.join(", ") || "N/A",
      stops: firstAllocation?.route?.length || 0,
      order_status: order.order_status,
      scenario_label: order.scenario_label,
      // total_cost: parseFloat(order.total_cost || "0").toFixed(2),
      draft_saved: order.scenario_label?.toLowerCase().includes("route draft")
        ? "Route Optimization"
        : "Load Optimization",
      total_distance: order.total_distance || "N/A",
      total_weight: order.total_weight || "N/A",
      allocated_vehicles: order.allocated_vehicles?.join(", ") || "N/A",
      allocated_packages: order.allocated_packages?.join(", ") || "N/A",
      package_dest_radius:
        order.package_dest_radius
          ?.map((pkg) => `${pkg.pack_ID} (${pkg.destination_radius})`)
          .join(", ") || "N/A",
      unallocated_packages:
        order.unallocated_packages
          ?.map((pkg: Pack) => pkg.pack_ID)
          .join(", ") || "None",
      created_at: formatDate(order.created_at),
    };
  });

  const CustomToolbar = ({
    columnVisibilityModel,
    setColumnVisibilityModel,
  }: any) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <GridToolbarContainer
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: 2,
            py: 1,
          }}
        >
          <Box
            onClick={handleOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#333",
              }}
            >
              Manage Columns
            </Typography>

            <ViewColumn
              sx={{
                fontSize: 20,
                color: "#555",
              }}
            />
          </Box>
        </GridToolbarContainer>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              width: 240,
              p: 2,
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              mb: 1,
              fontSize: "15px",
            }}
          >
            Show Columns
          </Typography>

          <Divider sx={{ mb: 1 }} />

          {columns.map((col) => (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={
                    columnVisibilityModel[
                      col.field as keyof typeof columnVisibilityModel
                    ] !== false
                  }
                  onChange={(e) =>
                    setColumnVisibilityModel((prev: any) => ({
                      ...prev,
                      [col.field]: e.target.checked,
                    }))
                  }
                  sx={{
                    color: "#F08C24",
                    "&.Mui-checked": {
                      color: "#F08C24",
                    },
                  }}
                />
              }
              label={col.headerName}
            />
          ))}
        </Popover>
      </>
    );
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Failed to load orders.
        </Typography>
      )}

      {/* LOADER */}

      <Backdrop
        open={loading || isLoading}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* HEADER */}

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          color="primary"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Order Overview
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#667085",
          }}
        >
          Review and manage all order allocations and shipment details.
        </Typography>
      </Box>

      {/* FILTERS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant={!showSavedDrafts ? "contained" : "outlined"}
            onClick={() => setShowSavedDrafts(false)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            All Orders
          </Button>

          <Button
            variant={showSavedDrafts ? "contained" : "outlined"}
            onClick={() => setShowSavedDrafts(true)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              bgcolor: showSavedDrafts ? "#F08C24" : undefined,
            }}
          >
            Saved Drafts
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {showSavedDrafts
            ? `${filteredOrders.length} Draft Orders`
            : `${filteredOrders.length} Orders`}
        </Typography>
      </Box>

      <Grid container spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
        <Grid item xs={12} md={2}>
          <TextField
            size="small"
            fullWidth
            select
            label="Date Filter"
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

        <Grid item xs={12} md={3}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Pickup Custom Date"
            InputLabelProps={{
              shrink: true,
            }}
            value={pickupCustomDate}
            onChange={(e) => setPickupCustomDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Dropoff Custom Date"
            InputLabelProps={{
              shrink: true,
            }}
            value={dropoffCustomDate}
            onChange={(e) => setDropoffCustomDate(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* GRID */}

      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 20, 30]}
        slots={{
          toolbar: () => (
            <CustomToolbar
              columnVisibilityModel={columnVisibilityModel}
              setColumnVisibilityModel={setColumnVisibilityModel}
            />
          ),
        }}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) =>
          setColumnVisibilityModel(newModel)
        }
      />
    </Box>
  );
};

export default OrdersGrid;
