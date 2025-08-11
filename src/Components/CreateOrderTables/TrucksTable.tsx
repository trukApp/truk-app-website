// 'use client';

// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Grid,
//   LinearProgress,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel
// } from "@mui/material";
// import { useGetAllProductsQuery } from "@/api/apiSlice";
// import { Package, Product } from "./PackagesTable";
// import TruckScene from "./LoadThreeDModal";

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
//   loadArrangement: [];
//   boxPlacements: Record<string, { boxes: any[] }>;
//   vehicleDimensions: {
//     interiorLengthM: number;
//     interiorWidthM: number;
//     interiorHeightM: number;
//   };
//   truckCapacity: {
//     allowedLayers: number;
//     maxLayers: number;
//     maxM3: number;
//     oneLayerM3: number;
//     rawM3: number;
//     usableM3: number;
//   };
// }

// interface UnAllocatedPackage {
//   pack_ID: string;
//   reason: string;
// }

// export interface TrucksTableProps {
//   trucks: Truck[];
//   unAllocatedPackages: UnAllocatedPackage[];
//   selectedPackages: Package[];
// }

// interface PackageBlock {
//   pkg_ID: string;
//   color: string;
//   dimensions: [number, number, number];
//   position: [number, number, number];
// }

// const TrucksTable: React.FC<TrucksTableProps> = ({
//   trucks,
//   unAllocatedPackages,
//   selectedPackages
// }) => {
//   const { data: productsData } = useGetAllProductsQuery({});
//   const allProductsData = productsData?.products || [];


//   console.log("trucks: ", trucks[2])

//   const [selectedTruckIndex, setSelectedTruckIndex] = useState(0);
//   const selectedTruck = trucks[selectedTruckIndex];

//   const getProductDetails = (productID: string): string => {
//     const productInfo = allProductsData.find(
//       (product: Product) => product.product_ID === productID
//     );
//     if (!productInfo) return "Product details not available";
//     return `${productInfo.product_name}, Weight: ${productInfo.weight}kg, ID: ${productInfo.product_ID}`;
//   };

//   const getPercentage = (used: number, total: number): number =>
//     total ? Math.round((used / total) * 100) : 0;

//   // const generatePackageBlocks = (
//   //   boxPlacements: Truck['boxPlacements'],
//   //   selectedPackages: Package[]
//   // ): PackageBlock[] => {
//   //   const colorPalette = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];
//   //   const colorMap: Record<string, string> = {};
//   //   let colorIndex = 0;
//   //   const allBlocks: PackageBlock[] = [];

//   //   Object.entries(boxPlacements).forEach(([pkg_ID, { boxes }]) => {
//   //     if (!boxes || boxes.length === 0) return;

//   //     if (!colorMap[pkg_ID]) {
//   //       colorMap[pkg_ID] = colorPalette[colorIndex % colorPalette.length];
//   //       colorIndex++;
//   //     }

//   //     const box = boxes[0];
//   //     const quantityFromPackageInfo = selectedPackages.find(p => p.pack_ID === pkg_ID)?.product_ID?.[0]?.quantity || 1;

//   //     for (let i = 0; i < quantityFromPackageInfo; i++) {
//   //       const offsetX = i % 10;
//   //       const offsetY = Math.floor(i / 10) % 10;
//   //       const offsetZ = Math.floor(i / 100);
//   //       allBlocks.push({
//   //         pkg_ID,
//   //         color: colorMap[pkg_ID],
//   //         dimensions: box.dimensions,
//   //         position: [
//   //           box.position[0] + offsetX * 0.05,
//   //           box.position[1] + offsetY * 0.05,
//   //           box.position[2] + offsetZ * 0.05
//   //         ]
//   //       });
//   //     }
//   //   });

//   //   return allBlocks;
//   // };

//   const generatePackageBlocks = (
//     boxPlacements: Truck['boxPlacements'],
//     selectedPackages: Package[]
//   ): PackageBlock[] => {
//     const colorPalette = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];
//     const colorMap: Record<string, string> = {};
//     let colorIndex = 0;
//     const allBlocks: PackageBlock[] = [];

//     Object.entries(boxPlacements).forEach(([pkg_ID, { boxes }]) => {
//       if (!boxes || boxes.length === 0) return;

//       if (!colorMap[pkg_ID]) {
//         colorMap[pkg_ID] = colorPalette[colorIndex % colorPalette.length];
//         colorIndex++;
//       }

//       // ✅ No duplication by quantity – use boxes as-is
//       boxes.forEach((box) => {
//         allBlocks.push({
//           pkg_ID,
//           color: colorMap[pkg_ID],
//           dimensions: box.dimensions,
//           position: box.position
//         });
//       });
//     });

//     return allBlocks;
//   };


//   const packageBlocks = generatePackageBlocks(selectedTruck?.boxPlacements, selectedPackages);

//   return (
//     <Box sx={{ padding: 2 }}>
//       {unAllocatedPackages.length > 0 && (
//         <Box sx={{ marginBottom: 3 }}>
//           <Typography variant="h6" color="error" fontWeight={600}>
//             Unallocated Packages:
//           </Typography>
//           <ul>
//             {unAllocatedPackages.map((pkg, index) => {
//               const matchedPackage = selectedPackages.find(p => p.pack_ID === pkg.pack_ID);
//               const productList = matchedPackage?.product_ID || [];

//               return (
//                 <li key={index}>
//                   <Typography variant="body2" color="primary">
//                     Package ID: <strong>{pkg.pack_ID}</strong>, Reason: <strong>{pkg.reason}</strong>
//                   </Typography>
//                   {productList.map((prod, i) => (
//                     <Typography key={i} variant="body2" sx={{ pl: 4 }}>
//                       {getProductDetails(prod.prod_ID)} - Qty: {prod.quantity}
//                     </Typography>
//                   ))}
//                 </li>
//               );
//             })}
//           </ul>
//         </Box>
//       )}

//       <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 500, mb: 3 }}>
//         Suggested Trucks
//       </Typography>

//       <FormControl fullWidth sx={{ mb: 3 }}>
//         <InputLabel>Select Truck</InputLabel>
//         <Select
//           value={selectedTruckIndex}
//           label="Select Truck"
//           onChange={(e) => setSelectedTruckIndex(Number(e.target.value))}
//         >
//           {trucks.map((truck, idx) => (
//             <MenuItem key={truck.vehicle_ID} value={idx}>
//               {truck.vehicle_ID}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <Grid container spacing={3}>
//         {trucks.map((truck, index) => {
//           const weightUsed = truck.occupiedWeight;
//           const weightTotal = truck.totalWeightCapacity;
//           const volumeUsed = truck.occupiedVolume;
//           const volumeTotal = truck.totalVolumeCapacity;

//           return (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card elevation={3}>
//                 <CardContent>
//                   <Typography variant="h6">Vehicle ID: {truck.vehicle_ID}</Typography>
//                   <Typography>Total Cost: {truck.cost.toFixed(2)} (per ton/km)</Typography>

//                   <Box mt={2}>
//                     <Typography>Weight Capacity: {weightUsed.toFixed(2)} / {weightTotal.toFixed(2)} kg</Typography>
//                     <LinearProgress
//                       variant="determinate"
//                       value={getPercentage(weightUsed, weightTotal)}
//                       sx={{ height: 10, borderRadius: 5, mt: 1 }}
//                     />
//                     <Typography variant="caption">
//                       {getPercentage(weightUsed, weightTotal)}% occupied
//                     </Typography>
//                   </Box>

//                   <Box mt={2}>
//                     <Typography>Volume Capacity: {volumeUsed.toFixed(2)} / {volumeTotal.toFixed(2)} m³</Typography>
//                     <LinearProgress
//                       variant="determinate"
//                       value={getPercentage(volumeUsed, volumeTotal)}
//                       color="secondary"
//                       sx={{ height: 10, borderRadius: 5, mt: 1 }}
//                     />
//                     <Typography variant="caption">
//                       {getPercentage(volumeUsed, volumeTotal)}% occupied
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>

//       {selectedTruck && (
//         <Box sx={{ height: "100vh", width: "100%", mt: 4 }}>
//           <TruckScene
//             vehicleDimensions={{
//               length: selectedTruck.vehicleDimensions.interiorLengthM,
//               width: selectedTruck.vehicleDimensions.interiorWidthM,
//               height: selectedTruck.vehicleDimensions.interiorHeightM,
//             }}
//             truckCapacity={selectedTruck.truckCapacity}
//             packageBlocks={packageBlocks}
//           />

//         </Box>

//       )}
//     </Box>
//   );
// };

// export default TrucksTable;



'use client';

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  Button,
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
  cost: number;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  boxPlacements: Record<string, { boxes: any[] }>;
  vehicleDimensions: {
    interiorLengthM: number;
    interiorWidthM: number;
    interiorHeightM: number;
  };
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
  unAllocatedPackages: UnAllocatedPackage[];
  selectedPackages: Package[];
}

interface PackageBlock {
  pkg_ID: string;
  color: string;
  dimensions: [number, number, number];
  position: [number, number, number];
  quantity: number;
}

const TrucksTable: React.FC<TrucksTableProps> = ({
  trucks,
  unAllocatedPackages,
  selectedPackages,
}) => {
  const { data: productsData } = useGetAllProductsQuery({});
  const allProductsData = productsData?.products || [];

  const [openTruckIndex, setOpenTruckIndex] = useState<number | null>(null);

  const getProductDetails = (productID: string): string => {
    const productInfo = allProductsData.find(
      (product: Product) => product.product_ID === productID
    );
    if (!productInfo) return "Product details not available";
    return `${productInfo.product_name}, Weight: ${productInfo.weight}kg, ID: ${productInfo.product_ID}`;
  };

  const getPercentage = (used: number, total: number): number =>
    total ? Math.round((used / total) * 100) : 0;

  const generatePackageBlocks = (
    boxPlacements: Truck["boxPlacements"],
  ): PackageBlock[] => {
    const colorPalette = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];
    const colorMap: Record<string, string> = {};
    let colorIndex = 0;
    const allBlocks: PackageBlock[] = [];

    Object.entries(boxPlacements).forEach(([pkg_ID, { boxes }]) => {
      if (!boxes || boxes.length === 0) return;

      if (!colorMap[pkg_ID]) {
        colorMap[pkg_ID] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
      }

      boxes.forEach((box) => {
        allBlocks.push({
          pkg_ID,
          color: colorMap[pkg_ID],
          dimensions: box.dimensions,
          position: box.position,
          quantity: boxes.length,
        });
      });
    });

    return allBlocks;
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Unallocated Packages */}
      {unAllocatedPackages.length > 0 && (
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" color="error" fontWeight={600}>
            Unallocated Packages:
          </Typography>
          <ul>
            {unAllocatedPackages.map((pkg, index) => {
              const matchedPackage = selectedPackages.find((p) => p.pack_ID === pkg.pack_ID);
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

      {/* Trucks Grid */}
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
                  <Typography>Total Cost: {truck.cost.toFixed(2)} (per ton/km)</Typography>

                  <Box mt={2}>
                    <Typography>
                      Weight Capacity: {weightUsed.toFixed(2)} / {weightTotal.toFixed(2)} kg
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getPercentage(weightUsed, weightTotal)}
                      sx={{ height: 10, borderRadius: 5, mt: 1 }}
                    />
                    <Typography variant="caption">{getPercentage(weightUsed, weightTotal)}% occupied</Typography>
                  </Box>

                  <Box mt={2}>
                    <Typography>
                      Volume Capacity: {volumeUsed.toFixed(2)} / {volumeTotal.toFixed(2)} m³
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getPercentage(volumeUsed, volumeTotal)}
                      color="secondary"
                      sx={{ height: 10, borderRadius: 5, mt: 1 }}
                    />
                    <Typography variant="caption">{getPercentage(volumeUsed, volumeTotal)}% occupied</Typography>
                  </Box>

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOpenTruckIndex(openTruckIndex === index ? null : index)}
                      fullWidth
                    >
                      {openTruckIndex === index ? "Hide load builder" : "Show load builder"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Truck Scene Below All Cards */}
      {openTruckIndex !== null && (
        <Box sx={{ height: "90vh", width: "100%", mt: 4 }}>
          <TruckScene
            vehicleDimensions={{
              length: trucks[openTruckIndex].vehicleDimensions.interiorLengthM,
              width: trucks[openTruckIndex].vehicleDimensions.interiorWidthM,
              height: trucks[openTruckIndex].vehicleDimensions.interiorHeightM,
            }}
            truckCapacity={trucks[openTruckIndex].truckCapacity}
            packageBlocks={generatePackageBlocks(
              trucks[openTruckIndex].boxPlacements,
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default TrucksTable;
