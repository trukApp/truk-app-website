// import React
//   // ,{ useState }

//   from "react";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import {
//   Box,
//   // IconButton,
//   Typography
// } from "@mui/material";
// // import { ExpandMore, ExpandLess } from "@mui/icons-material";
// // import { useAppDispatch, useAppSelector } from "@/store";
// // import { setSelectedTrucks } from "@/store/authSlice";
// import { Package, Product } from "./PackagesTable";
// import { useGetAllProductsQuery } from "@/api/apiSlice";
// export interface Allocation {
//   vehicle_ID: string;
//   totalWeightCapacity: number;
//   totalVolumeCapacity: number;
//   leftoverWeight: number;
//   leftoverVolume: number;
//   cost: number
// }

// export interface Truck {
//   packages: string[];
//   occupiedVolume: number;
//   occupiedWeight: number;
//   label: string;
//   totalCost: number;
//   allocations: Allocation[];
//   unallocatedPackages: string[];
//   vehicle_ID: string;
//   totalWeightCapacity: number;
//   leftoverWeight: string;
//   totalVolumeCapacity: number;
//   leftoverVolume: number;
//   cost: number;
//   loadArrangement: []
// }

// interface TrucksTableProps {
//   trucks: Truck[];
//   unAllocatedPackages: [];
//   selectedPackages: Package[];
// }

// interface UnAllocatedPackage {
//   pack_ID: string;
//   reason: string;
// }
// const TrucksTable: React.FC<TrucksTableProps> = ({ trucks, unAllocatedPackages, selectedPackages }) => {
//   const { data: productsData } = useGetAllProductsQuery({})
//   const allProductsData = productsData?.products || [];
//   const getProductDetails = (productID: string): string => {
//     const productInfo = allProductsData.find((product: Product) => product.product_ID === productID);
//     if (!productInfo) return "Product details not available";
//     const details = [
//       productInfo.product_name,
//       `Weight: ${productInfo.weight}`,
//       productInfo.product_ID,
//     ].filter(Boolean);
//     return details.join(", ");
//   };


//   const columns: GridColDef[] = [
//     { field: "vehicle_ID", headerName: "Vehicle ID", width: 180 },
//     { field: "cost", headerName: "Total cost", width: 180 },
//     { field: "totalWeightCapacity", headerName: "Total weight capacity", width: 180 },
//     { field: "occupiedWeight", headerName: "Occupied weight", width: 180 },
//     { field: "totalVolumeCapacity", headerName: "Total volume capacity", width: 180 },
//     { field: "occupiedVolume", headerName: "Occupied volume", width: 180 },
//     { field: "leftoverWeight", headerName: "Left over weight", width: 180 },
//     { field: "leftoverVolume", headerName: "Left over volume", width: 180 },
//   ];



//   const rows = trucks.flatMap((truck, index) => [
//     {
//       id: index + 1,
//       ...truck,
//       cost: truck.cost?.toFixed(2),
//       totalWeightCapacity: truck?.totalWeightCapacity?.toFixed(2),
//       occupiedWeight: truck?.occupiedWeight?.toFixed(2),
//       totalVolumeCapacity: truck?.totalVolumeCapacity?.toFixed(2),
//       occupiedVolume: truck?.occupiedVolume?.toFixed(2),
//       leftoverWeight: parseFloat(truck?.leftoverWeight)?.toFixed(2),
//       leftoverVolume: truck?.leftoverVolume.toFixed(2),

//     },
//   ]);

//   return (
//     <Box sx={{ height: 500, width: "100%" }}>
//       {unAllocatedPackages?.length > 0 && (
//         <Box sx={{ marginTop: 2 }}>
//           <Typography variant="h6" color="error" fontWeight={600}>
//             Unallocated Packages:
//           </Typography>
//           <ul>
//             {unAllocatedPackages.map((pkg: UnAllocatedPackage, index) => {
//               const matchedPackage = selectedPackages.find(p => p.pack_ID === pkg.pack_ID);
//               const productList = matchedPackage?.product_ID || [];

//               return (
//                 <li key={index}>
//                   <Typography variant="body2" color="primary">
//                     Package ID: <strong>{pkg.pack_ID}</strong>, Reason: <strong>{pkg.reason}</strong>
//                   </Typography>

//                   {productList.length > 0 && (
//                     <>
//                       <Typography variant="body2">
//                         Products: {getProductDetails(productList[0].prod_ID)} - Qty: {productList[0].quantity}
//                       </Typography>
//                       {productList.slice(1).map((prod, i) => (
//                         <Typography
//                           key={i}
//                           variant="body2"
//                           sx={{ pl: 8 }}
//                         >
//                           {getProductDetails(prod.prod_ID)} - Qty: {prod.quantity}
//                         </Typography>
//                       ))}
//                     </>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </Box>
//       )}




//       <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 500, marginTop: 3, }}>Suggested Trucks</Typography>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         getRowId={(row) => row.id}
//         hideFooter
//         sx={{
//           "& .MuiDataGrid-row": {
//             "&.Mui-selected": { backgroundColor: "transparent !important" },
//           },
//         }}
//         getRowClassName={(params) => (params.row.isAllocation ? "child-row" : "")}
//       />
//     </Box>
//   );
// };

// export default TrucksTable;




import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography
} from "@mui/material";
import { useGetAllProductsQuery } from "@/api/apiSlice";
import { Package, Product } from "./PackagesTable";
import TruckScene from "./LoadThreeDModal";
export interface Allocation {
  vehicle_ID: string;
  totalWeightCapacity: number;
  totalVolumeCapacity: number;
  leftoverWeight: number;
  leftoverVolume: number;
  cost: number
}

export interface Truck {
	packages: string[];
	occupiedVolume: number;
	occupiedWeight: number;
	label: string;
	totalCost: number;
	allocations: Allocation[];
	unallocatedPackages: string[];
	vehicle_ID: string;
	totalWeightCapacity: number;
	leftoverWeight: string;
	totalVolumeCapacity: number;
	leftoverVolume: number;
	cost: number;
	loadArrangement: [];
	truckCapacity: {
		allowedLayers: number;
		maxLayers: number;
		maxM3: number;
		oneLayerM3: number;
		rawM3: number;
		usableM3: number;
	};
}
interface UnAllocatedPackage {
  pack_ID: string;
  reason: string;
}
export interface TrucksTableProps {
  trucks: Truck[];
  unAllocatedPackages: [];
  selectedPackages: Package[];
}



const TrucksTable: React.FC<TrucksTableProps> = ({
  trucks,
  unAllocatedPackages,
  selectedPackages
}) => {console.log("trucks :", trucks); 
  const { data: productsData } = useGetAllProductsQuery({});
  const allProductsData = productsData?.products || [];

  const getProductDetails = (productID: string): string => {
    const productInfo = allProductsData.find(
      (product: Product) => product.product_ID === productID
    );
    if (!productInfo) return "Product details not available";
    return `${productInfo.product_name}, Weight: ${productInfo.weight}kg, ID: ${productInfo.product_ID}`;
  };

  
  const getPercentage = (used: number, total: number): number =>
    total ? Math.round((used / total) * 100) : 0;

  return (
    <Box sx={{ padding: 2 }}>
      {unAllocatedPackages.length > 0 && (
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" color="error" fontWeight={600}>
            Unallocated Packages:
          </Typography>
          <ul>
            {unAllocatedPackages.map((pkg: UnAllocatedPackage, index) => {
              const matchedPackage = selectedPackages.find(p => p.pack_ID === pkg.pack_ID);
              const productList = matchedPackage?.product_ID || [];

              return (
                <li key={index}>
                  <Typography variant="body2" color="primary">
                    Package ID: <strong>{pkg.pack_ID}</strong>, Reason: <strong>{pkg.reason}</strong>
                  </Typography>
                  {productList.map((prod, i) => (
                    <Typography key={i} variant="body2" sx={{ pl: 4 }}>
                      {getProductDetails(prod.prod_ID)} - Qty: {prod.quantity}
                    </Typography>
                  ))}
                </li>
              );
            })}
          </ul>
        </Box>
      )}

      <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 500, mb: 3 }}>
        Suggested Trucks
      </Typography>

      <Grid container spacing={3}>
        {trucks.map((truck, index) => {
          const weightUsed = truck.occupiedWeight;
          const weightTotal = truck.totalWeightCapacity;
          const volumeUsed = truck.occupiedVolume;
          const volumeTotal = truck.totalVolumeCapacity;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">Vehicle ID: {truck.vehicle_ID}</Typography>
                  <Typography>Total Cost: {truck.cost.toFixed(2)} (estimated cost  per ton per km units)</Typography>

                  <Box mt={2}>
                    <Typography>Weight Capacity: {weightUsed.toFixed(2)} / {weightTotal.toFixed(2)} kg</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getPercentage(weightUsed, weightTotal)}
                      sx={{ height: 10, borderRadius: 5, mt: 1 }}
                    />
                    <Typography variant="caption">
                      {getPercentage(weightUsed, weightTotal)}% occupied
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Typography>Volume Capacity: {volumeUsed.toFixed(2)} / {volumeTotal.toFixed(2)} m³</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getPercentage(volumeUsed, volumeTotal)}
                      color="secondary"
                      sx={{ height: 10, borderRadius: 5, mt: 1 }}
                    />
                    {/* <LinearProgress
                      variant="determinate"
                      value={getPercentage(volumeUsed, volumeTotal)}
                      color="secondary"
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        mt: 1,
                        backgroundColor: 'white', // sets the unfilled (track) color
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                        },
                      }}
                    /> */}

                    <Typography variant="caption">
                      {getPercentage(volumeUsed, volumeTotal)}% occupied
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
                  <div style={{ height: "100vh", width: "100%" }}>
            <TruckScene truckData={trucks} selectedPackages={selectedPackages}
	 />
          </div>
    </Box>
  );
};

export default TrucksTable;
