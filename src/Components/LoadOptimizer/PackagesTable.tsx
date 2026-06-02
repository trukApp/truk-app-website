import React, { useEffect, useState, useMemo } from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridToolbarContainer,
} from "@mui/x-data-grid";

import {
  Grid,
  TextField,
  MenuItem,
  Popover,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import ViewColumnIcon from "@mui/icons-material/ViewColumn";

import { useAppSelector, useAppDispatch } from "@/store";
import { setSelectedPackages } from "@/store/authSlice";

import DataGridSkeletonLoader from "../ReusableComponents/DataGridSkeletonLoader";

import {
  useGetAllProductsQuery,
  useGetLocationMasterQuery,
  useGetPackageMasterQuery,
} from "@/api/apiSlice";

import { Location } from "../MasterDataComponents/Locations";

import moment from "moment";

export interface Product {
  product_name: any;
  prod_ID: string;
  quantity: number;
  product_ID: string;
  weight?: string;
}

export interface AdditionalInfo {
  invoice: string;
  reference_id: string;
}

export interface TaxInfo {
  tax_rate: string;
}

export interface Package {
  handling_unit_type: string;
  dimensions_uom: string;
  packaging_type_name: string;
  dimensions: string;
  pac_id: number;
  pack_ID: string;
  pac_ID: string;
  ship_from: string;
  ship_to: string;
  product_ID: Product[];
  package_info: string;
  bill_to: string;
  return_label: number;
  additional_info: AdditionalInfo;
  pickup_date_time: string;
  dropoff_date_time: string;
  tax_info: TaxInfo;
  package_status: string;
}

interface PackagesTableProps {
  allPackagesData: Package[];
  isPackagesLoading: boolean;
}

const PackagesTable: React.FC<PackagesTableProps> = ({
  allPackagesData,
  isPackagesLoading,
}) => {
  const dispatch = useAppDispatch();

  const selectedPackages = useAppSelector(
    (state) => state.auth.selectedPackages || [],
  );

  const [selectionModel, setSelectionModel] = useState<number[]>([]);

  const [dateFilter, setDateFilter] = useState<string>("All");

  const [pickupCustomDate, setPickupCustomDate] = useState("");

  const [dropoffCustomDate, setDropoffCustomDate] = useState("");

  // COLUMN VISIBILITY
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    pack_ID: true,
    ship_from: true,
    ship_to: true,
    pickup_date_time: true,
    dropoff_date_time: true,
    product_details: true,

    package_info: false,
    bill_to: false,
    return_label: false,
    tax_rate: false,
    additional_info: false,
  });

  const { data: locationsData } = useGetLocationMasterQuery({});

  const getAllLocations =
    locationsData?.locations?.length > 0 ? locationsData.locations : [];

  const { data: productsData } = useGetAllProductsQuery({});

  const allProductsData = productsData?.products || [];

  const { data: packagesData } = useGetPackageMasterQuery({});

  const getAllPackages =
    packagesData?.packages?.length > 0 ? packagesData.packages : [];

  const unorderedPackages = allPackagesData.filter(
    (eachPackage) =>
      eachPackage?.package_status !== "ordered" &&
      eachPackage?.package_status !== "draft",
  );

  const getLocationDescription = (loc_ID: string) => {
    const location = getAllLocations.find(
      (loc: Location) => loc.loc_ID === loc_ID,
    );

    if (!location) return "Location details not available";

    const details = [
      location.loc_ID,
      location.loc_desc,
      location.address_1,
      location.city,
      location.state,
      location.country,
      location.pincode,
    ].filter(Boolean);

    return details.length > 0
      ? details.join(", ")
      : "Location details not available";
  };

  const getPackageDetails = (pac_ID: string) => {
    const packageInfo = getAllPackages.find(
      (pkg: Package) => pkg.pac_ID === pac_ID,
    );

    if (!packageInfo) return "Package details not available";

    const details = [
      packageInfo.packaging_type_name,
      packageInfo.dimensions,
      packageInfo.handling_unit_type,
    ].filter(Boolean);

    return details.length > 0
      ? details.join(", ")
      : "Package details not available";
  };

  const getProductDetails = (productID: string) => {
    const productInfo = allProductsData.find(
      (product: Product) => product.product_ID === productID,
    );

    if (!productInfo) return "Product details not available";

    const details = [productInfo.product_name, productInfo.weight].filter(
      Boolean,
    );

    return details.length > 0
      ? details.join(" - ")
      : "Product details not available";
  };

  const formatPickupDateTime = (pickupDateTime: string) => {
    return moment(pickupDateTime).format("MMM DD, YYYY h:mm A");
  };

  const filteredPackages = useMemo(() => {
    let filtered = unorderedPackages;

    if (dateFilter !== "All") {
      const today = moment();

      filtered = filtered.filter((pkg) => {
        const pickupDate = moment(pkg.pickup_date_time);

        switch (dateFilter) {
          case "Today":
            return pickupDate.isSame(today, "day");

          case "Yesterday":
            return pickupDate.isSame(today.clone().subtract(1, "day"), "day");

          case "This Week":
            return pickupDate.isSame(today, "week");

          case "This Month":
            return pickupDate.isSame(today, "month");

          case "This Year":
            return pickupDate.isSame(today, "year");

          default:
            return true;
        }
      });
    }

    if (pickupCustomDate) {
      filtered = filtered.filter((pkg) =>
        moment(pkg.pickup_date_time).isSame(moment(pickupCustomDate), "day"),
      );
    }

    if (dropoffCustomDate) {
      filtered = filtered.filter((pkg) =>
        moment(pkg.dropoff_date_time).isSame(moment(dropoffCustomDate), "day"),
      );
    }

    return filtered;
  }, [unorderedPackages, dateFilter, pickupCustomDate, dropoffCustomDate]);

  useEffect(() => {
    const selectedIds = selectedPackages.map((pkg) => pkg.pac_id);

    setSelectionModel(selectedIds);
  }, [selectedPackages]);

  const columns: GridColDef[] = [
    {
      field: "pack_ID",
      headerName: "Package ID",
      width: 150,
    },
    {
      field: "ship_from",
      headerName: "Ship From",
      width: 250,
    },
    {
      field: "ship_to",
      headerName: "Ship To",
      width: 250,
    },
    {
      field: "package_info",
      headerName: "Package Info",
      width: 250,
    },
    {
      field: "bill_to",
      headerName: "Bill To",
      width: 250,
    },
    {
      field: "return_label",
      headerName: "Return Label",
      width: 150,
    },
    {
      field: "pickup_date_time",
      headerName: "Pickup Date & Time",
      width: 220,
    },
    {
      field: "dropoff_date_time",
      headerName: "Dropoff Date & Time",
      width: 220,
    },
    {
      field: "tax_rate",
      headerName: "Tax Rate",
      width: 150,
    },
    {
      field: "product_details",
      headerName: "Product Details",
      width: 450,

      renderCell: (params: GridCellParams) => {
        const products = Array.isArray(params.value) ? params.value : [];

        if (!products.length) {
          return <div>No products</div>;
        }

        const productText = products
          .map((prod) => {
            const detail = getProductDetails(prod.prod_ID);

            return `${detail} (Qty: ${prod.quantity})`;
          })
          .join(", ");

        return (
          <div
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {productText}
          </div>
        );
      },
    },
    {
      field: "additional_info",
      headerName: "Additional Info",
      width: 250,

      renderCell: (params: GridCellParams) => {
        const info = params.value as {
          invoice: string;
          reference_id: string;
        };

        return (
          <div>
            <div>Invoice: {info?.invoice}</div>

            <div>Reference: {info?.reference_id}</div>
          </div>
        );
      },
    },
  ];

  const rows = filteredPackages.map((pkg: Package) => ({
    id: pkg.pac_id,

    pack_ID: pkg.pack_ID,

    ship_from: getLocationDescription(pkg.ship_from),

    ship_to: getLocationDescription(pkg.ship_to),

    package_info: getPackageDetails(pkg.package_info),

    bill_to: getLocationDescription(pkg.bill_to),

    return_label: pkg.return_label === 1 ? "Yes" : "No",

    pickup_date_time: formatPickupDateTime(pkg.pickup_date_time),

    dropoff_date_time: formatPickupDateTime(pkg.dropoff_date_time),

    tax_rate: pkg.tax_info.tax_rate,

    product_details: pkg.product_ID ?? [],

    additional_info: pkg.additional_info,
  }));

  const handleSelectionChange = (newSelection: number[]) => {
    setSelectionModel(newSelection);

    const selectedPackages = newSelection
      .map((id) => allPackagesData.find((pkg) => pkg.pac_id === id))
      .filter((pkg): pkg is Package => pkg !== undefined);

    dispatch(setSelectedPackages(selectedPackages));
  };

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

            <ViewColumnIcon
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
                  checked={columnVisibilityModel[col.field] !== false}
                  onChange={(e) =>
                    setColumnVisibilityModel((prev: any) => ({
                      ...prev,
                      [col.field]: e.target.checked,
                    }))
                  }
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
    <div>
      {/* FILTERS */}
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

      {/* TABLE */}
      <Grid
        sx={{
          marginTop: "5px",
          marginBottom: "20px",
        }}
      >
        {isPackagesLoading ? (
          <DataGridSkeletonLoader columns={columns} />
        ) : (
          <DataGrid
            autoHeight
            columns={columns}
            rows={rows}
            checkboxSelection
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
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                  page: 0,
                },
              },
            }}
            pageSizeOptions={[10, 20, 30]}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(model) =>
              handleSelectionChange(model as number[])
            }
          />
        )}
      </Grid>
    </div>
  );
};

export default PackagesTable;
