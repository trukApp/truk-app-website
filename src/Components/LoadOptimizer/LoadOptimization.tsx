import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Paper, Button, Grid } from "@mui/material";
import { Truck } from "./TrucksTable";
import { Package, Product } from "./PackagesTable";
import { useGetAllProductsQuery } from "@/api/apiSlice";

interface LoadArrangement {
  stop: number;
  location: string;
  packages: string[];
}

interface TrucksTableProps {
  trucks: Truck[];
  selectedPackages: Package[];
  onBack: () => void;
  onSaveDraft: () => void;
  onConfirmOrder: () => void;
}

const LoadOptimization: React.FC<TrucksTableProps> = ({
  trucks,
  selectedPackages,
  onBack,
  onSaveDraft,
  onConfirmOrder,
}) => {
  const selectedTrucks = trucks ?? [];
  const { data: productsData } = useGetAllProductsQuery({});
  console.log("trucks in LoadOptimization", trucks);
  const allProductsData: Product[] = productsData?.products || [];

  // Helper to get product name from prod_ID
  const getProductName = (prod_ID: string) => {
    const product = allProductsData.find((p) => p.product_ID === prod_ID);
    return product ? product.product_name : prod_ID;
  };

  const columns: GridColDef[] = [
    // { field: "id", headerName: "Stop", width: 80 },
    {
      field: "loadArrangement",
      headerName: "Load Arrangement",
      width: 200,
    },
    { field: "location", headerName: "Delivery Address", width: 300 },
    { field: "packages", headerName: "Packages", width: 400 },
  ];

  return (
    <Grid sx={{ p: 2 }}>
      <Typography
        variant="h5"
        gutterBottom
        color="#F08C24"
        sx={{ fontWeight: "bold", marginTop: "30px" }}
      >
        Load Optimization Details
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {selectedTrucks.map((vehicle, index) => {
          // const rows = (vehicle.loadArrangement ?? []).map(
          //   (item: LoadArrangement, i) => {
          const loadArrangementData = [
            ...(vehicle.loadArrangement ?? []),
          ].reverse();

          const rows = loadArrangementData.map((item: LoadArrangement, i) => {
            const packagesDisplay: string[] = [];

            (item.packages || []).forEach((pkgId) => {
              const pkg = selectedPackages.find((p) => p.pack_ID === pkgId);
              if (pkg) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pkgProducts = (pkg.product_ID || []).map((prod: any) => ({
                  ...prod,
                  packageId: pkg.pack_ID,
                }));

                if (pkgProducts.length) {
                  const productStr = pkgProducts
                    .map(
                      (p) =>
                        `${getProductName(p.product_ID || p.prod_ID)} (Qty: ${p.quantity ?? 1})`,
                    )
                    .join(", ");
                  packagesDisplay.push(`${pkg.pack_ID}: ${productStr}`);
                } else {
                  packagesDisplay.push(`${pkg.pack_ID}: No products`);
                }
              }
            });
            return {
              id: i + 1,
              loadArrangement: i + 1,
              location: item.location || "N/A",
              packages: packagesDisplay.join(" | "),
            };
          });

          return (
            <Paper
              key={index}
              sx={{
                my: 3,
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                width: "85%",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mb: 2, fontWeight: "bold" }}
                color="#F08C24"
              >
                Vehicle ID: {vehicle.vehicle_ID}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                Total Weight Capacity:{" "}
                <strong>
                  {vehicle?.totalWeightCapacity?.toFixed(2) ?? "0.00"} kg
                </strong>
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                Leftover Weight:{" "}
                <strong>
                  {Number(vehicle?.leftoverWeight ?? 0).toFixed(2)} kg
                </strong>
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                Total Volume Capacity:{" "}
                <strong>
                  {vehicle?.totalVolumeCapacity?.toFixed(2) ?? "0.00"} m³
                </strong>
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                Leftover Volume:{" "}
                <strong>
                  {vehicle?.leftoverVolume?.toFixed(2) ?? "0.00"} m³
                </strong>
              </Typography>

              {/* <Typography variant="body1" sx={{ mb: 1 }}>
                Estimated Cost:{" "}
                <strong>₹{vehicle?.cost?.toFixed(2) ?? "0.00"}</strong>
              </Typography> */}

              {rows.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  No load arrangement data available.
                </Typography>
              ) : (
                <Grid sx={{ mt: 2, height: 350, backgroundColor: "white" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5, page: 0 } },
                    }}
                    disableRowSelectionOnClick
                  />
                </Grid>
              )}
            </Paper>
          );
        })}
      </div>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 4,
          px: 4,
        }}
      >
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>

        <Grid
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={onSaveDraft}>
            Save As Draft
          </Button>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#F08C24",
            }}
            onClick={onConfirmOrder}
          >
            Confirm Order
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoadOptimization;
