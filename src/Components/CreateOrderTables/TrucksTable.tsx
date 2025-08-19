// 'use client';

// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Grid,
//   LinearProgress,
//   Typography,
//   Button,
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
//   cost: number;
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
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
//   quantity: number;
// }

// const TrucksTable: React.FC<TrucksTableProps> = ({
//   trucks,
//   unAllocatedPackages,
//   selectedPackages,
// }) => {
//   const { data: productsData } = useGetAllProductsQuery({});
//   const allProductsData = productsData?.products || [];

//   const [openTruckIndex, setOpenTruckIndex] = useState<number | null>(null);

//   const getProductDetails = (productID: string): string => {
//     const productInfo = allProductsData.find(
//       (product: Product) => product.product_ID === productID
//     );
//     if (!productInfo) return "Product details not available";
//     return `${productInfo.product_name}, Weight: ${productInfo.weight}kg, ID: ${productInfo.product_ID}`;
//   };

//   const getPercentage = (used: number, total: number): number =>
//     total ? Math.round((used / total) * 100) : 0;


//   const generatePackageBlocks = (
//     boxPlacements:
//       | {
//         pkg_ID: string;
//         color?: string;
//         position: number[];       // <- correct type
//         dimensions: number[];     // <- correct type
//       }[]
//       | Record<string, { boxes: { position: number[]; dimensions: number[] }[] }>
//   ): PackageBlock[] => {
//     const colorPalette = [
//       "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6",
//     ];
//     const colorMap: Record<string, string> = {};
//     let colorIndex = 0;
//     const allBlocks: PackageBlock[] = [];

//     if (Array.isArray(boxPlacements)) {
//       boxPlacements.forEach((box) => {
//         const { pkg_ID, position, dimensions, color } = box;

//         if (!colorMap[pkg_ID]) {
//           colorMap[pkg_ID] = color ?? colorPalette[colorIndex % colorPalette.length];
//           colorIndex++;
//         }

//         allBlocks.push({
//           pkg_ID,
//           color: colorMap[pkg_ID],
//           dimensions: [
//             dimensions[0] ?? 0,
//             dimensions[1] ?? 0,
//             dimensions[2] ?? 0,
//           ] as [number, number, number],
//           position: [
//             position[0] ?? 0,
//             position[1] ?? 0,
//             position[2] ?? 0,
//           ] as [number, number, number],
//           quantity: 1,
//         });
//       });
//     } else {
//       Object.entries(boxPlacements).forEach(([pkg_ID, { boxes }]) => {
//         if (!colorMap[pkg_ID]) {
//           colorMap[pkg_ID] = colorPalette[colorIndex % colorPalette.length];
//           colorIndex++;
//         }

//         boxes.forEach((box) => {
//           allBlocks.push({
//             pkg_ID,
//             color: colorMap[pkg_ID],
//             dimensions: [
//               box.dimensions?.[0] ?? 0,
//               box.dimensions?.[1] ?? 0,
//               box.dimensions?.[2] ?? 0,
//             ] as [number, number, number],
//             position: [
//               box.position?.[0] ?? 0,
//               box.position?.[1] ?? 0,
//               box.position?.[2] ?? 0,
//             ] as [number, number, number],
//             quantity: boxes.length,
//           });
//         });
//       });
//     }

//     return allBlocks;
//   };



//   return (
//     <Box sx={{ padding: 2 }}>
//       {/* Unallocated Packages */}
//       {unAllocatedPackages.length > 0 && (
//         <Box sx={{ marginBottom: 3 }}>
//           <Typography variant="h6" color="error" fontWeight={600}>
//             Unallocated Packages:
//           </Typography>
//           <ul>
//             {unAllocatedPackages.map((pkg, index) => {
//               const matchedPackage = selectedPackages.find((p) => p.pack_ID === pkg.pack_ID);
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

//       {/* Trucks Grid */}
//       <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 500, mb: 3 }}>
//         Suggested Trucks
//       </Typography>

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
//                     <Typography>
//                       Weight Capacity: {weightUsed.toFixed(2)} / {weightTotal.toFixed(2)} kg
//                     </Typography>
//                     <LinearProgress
//                       variant="determinate"
//                       value={getPercentage(weightUsed, weightTotal)}
//                       sx={{ height: 10, borderRadius: 5, mt: 1 }}
//                     />
//                     <Typography variant="caption">{getPercentage(weightUsed, weightTotal)}% occupied</Typography>
//                   </Box>

//                   <Box mt={2}>
//                     <Typography>
//                       Volume Capacity: {volumeUsed.toFixed(2)} / {volumeTotal.toFixed(2)} m³
//                     </Typography>
//                     <LinearProgress
//                       variant="determinate"
//                       value={getPercentage(volumeUsed, volumeTotal)}
//                       color="secondary"
//                       sx={{ height: 10, borderRadius: 5, mt: 1 }}
//                     />
//                     <Typography variant="caption">{getPercentage(volumeUsed, volumeTotal)}% occupied</Typography>
//                   </Box>

//                   <Box mt={2}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => setOpenTruckIndex(openTruckIndex === index ? null : index)}
//                       fullWidth
//                     >
//                       {openTruckIndex === index ? "Hide load builder" : "Show load builder"}
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>

//       {/* Truck Scene Below All Cards */}
//       {openTruckIndex !== null && (
//         <Box sx={{ height: "90vh", width: "100%", mt: 4 }}>
//           <TruckScene
//             vehicleDimensions={{
//               length: trucks[openTruckIndex].vehicleDimensions.interiorLengthM,
//               width: trucks[openTruckIndex].vehicleDimensions.interiorWidthM,
//               height: trucks[openTruckIndex].vehicleDimensions.interiorHeightM,
//             }}
//             truckCapacity={trucks[openTruckIndex].truckCapacity}
//             packageBlocks={generatePackageBlocks(
//               trucks[openTruckIndex].boxPlacements,
//             )}
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
  // BE returns an array now, but keep union for backward compatibility.
  boxPlacements:
  | {
    pkg_ID: string;
    color?: string;
    position: [number, number, number];
    dimensions: [number, number, number];
  }[]
  | Record<string, { boxes: { position: number[]; dimensions: number[] }[] }>;
  vehicleDimensions: {
    interiorLengthM: number;
    interiorWidthM: number;
    interiorHeightM: number;
  };
  truckCapacity: {
    allowedLayers: number;
    maxLayers: number;
    maxM3?: number;
    oneLayerM3: number;
    rawM3: number;
    usableM3: number; // <-- use this for volume %
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
    return `${productInfo.product_name}, Weight: ${productInfo.weight} kg, ID: ${productInfo.product_ID}`;
  };

  const getPercentage = (used: number, total: number): number =>
    total ? Math.round((used / total) * 100) : 0;

  // ----- Normalize BE placements to a flat list of blocks -----
  const generatePackageBlocks = (
    boxPlacements:
      | {
        pkg_ID: string;
        color?: string;
        position: number[];
        dimensions: number[];
      }[]
      | Record<string, { boxes: { position: number[]; dimensions: number[] }[] }>
  ): PackageBlock[] => {
    const colorPalette = [
      "#10b981",
      "#3b82f6",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#14b8a6",
      "#0ea5e9",
      "#6366f1",
      "#22c55e",
    ];
    const colorMap: Record<string, string> = {};
    let colorIndex = 0;
    const allBlocks: PackageBlock[] = [];

    if (Array.isArray(boxPlacements)) {
      boxPlacements.forEach((box) => {
        const { pkg_ID, position, dimensions, color } = box;

        if (!colorMap[pkg_ID]) {
          colorMap[pkg_ID] =
            color ?? colorPalette[colorIndex % colorPalette.length];
          colorIndex++;
        }

        allBlocks.push({
          pkg_ID,
          color: colorMap[pkg_ID],
          dimensions: [
            (dimensions?.[0] ?? 0) as number,
            (dimensions?.[1] ?? 0) as number,
            (dimensions?.[2] ?? 0) as number,
          ],
          position: [
            (position?.[0] ?? 0) as number,
            (position?.[1] ?? 0) as number,
            (position?.[2] ?? 0) as number,
          ],
          quantity: 1,
        });
      });
    } else {
      Object.entries(boxPlacements).forEach(([pkg_ID, { boxes }]) => {
        if (!colorMap[pkg_ID]) {
          colorMap[pkg_ID] = colorPalette[colorIndex % colorPalette.length];
          colorIndex++;
        }

        boxes.forEach((box) => {
          allBlocks.push({
            pkg_ID,
            color: colorMap[pkg_ID],
            dimensions: [
              (box.dimensions?.[0] ?? 0) as number,
              (box.dimensions?.[1] ?? 0) as number,
              (box.dimensions?.[2] ?? 0) as number,
            ],
            position: [
              (box.position?.[0] ?? 0) as number,
              (box.position?.[1] ?? 0) as number,
              (box.position?.[2] ?? 0) as number,
            ],
            quantity: 1,
          });
        });
      });
    }

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
              const matchedPackage = selectedPackages.find(
                (p) => p.pack_ID === pkg.pack_ID
              );
              const productList = matchedPackage?.product_ID || [];

              return (
                <li key={index}>
                  <Typography variant="body2" color="primary">
                    Package ID: <strong>{pkg.pack_ID}</strong>, Reason:{" "}
                    <strong>{pkg.reason}</strong>
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
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontWeight: 500, mb: 3 }}
      >
        Suggested Trucks
      </Typography>

      <Grid container spacing={3}>
        {trucks.map((truck, index) => {
          const weightUsed = truck.occupiedWeight;
          const weightTotal = truck.totalWeightCapacity;

          // FIX: use usable volume from BE (layer-limited), not raw interior m3
          const volumeUsed = truck.occupiedVolume;
          const volumeTotal =
            truck.truckCapacity?.usableM3 ?? truck.totalVolumeCapacity;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">
                    Vehicle ID: {truck.vehicle_ID}
                  </Typography>
                  <Typography>
                    Total Cost: {truck.cost.toFixed(2)} (per ton/km)
                  </Typography>

                  <Box mt={2}>
                    <Typography>
                      Weight Capacity: {weightUsed.toFixed(2)} /{" "}
                      {weightTotal.toFixed(2)} kg
                    </Typography>
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
                    <Typography>
                      Volume Capacity: {volumeUsed.toFixed(2)} /{" "}
                      {volumeTotal.toFixed(2)} m³
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getPercentage(volumeUsed, volumeTotal)}
                      color="secondary"
                      sx={{ height: 10, borderRadius: 5, mt: 1 }}
                    />
                    <Typography variant="caption">
                      {getPercentage(volumeUsed, volumeTotal)}% occupied
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        setOpenTruckIndex(openTruckIndex === index ? null : index)
                      }
                      fullWidth
                    >
                      {openTruckIndex === index
                        ? "Hide load builder"
                        : "Show load builder"}
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
              length:
                trucks[openTruckIndex].vehicleDimensions.interiorLengthM,
              width: trucks[openTruckIndex].vehicleDimensions.interiorWidthM,
              height: trucks[openTruckIndex].vehicleDimensions.interiorHeightM,
            }}
            truckCapacity={trucks[openTruckIndex].truckCapacity}
            packageBlocks={generatePackageBlocks(
              trucks[openTruckIndex].boxPlacements
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default TrucksTable;