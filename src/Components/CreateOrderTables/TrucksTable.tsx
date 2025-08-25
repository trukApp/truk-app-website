// 'use client';

// import React, { useMemo, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Grid,
//   LinearProgress,
//   Typography,
//   Button,
//   Chip,
//   Divider,
//   Stack,
// } from "@mui/material";
// import { useGetAllProductsQuery } from "@/api/apiSlice";
// import { Package, Product } from "./PackagesTable";
// import TruckScene, { PackageBlock } from "./LoadThreeDModal";

// export interface Allocation {
//   vehicle_ID: string;
//   totalWeightCapacity: number;
//   totalVolumeCapacity: number;
//   leftoverWeight: number;
//   leftoverVolume: number;
//   cost: number;
// }

// export interface ProductLegendItem {
//   prod_ID: string;
//   color: string; // neutral product-level color
//   totalQty: number;
//   byPackage: { pack_ID: string; qty: number; color?: string }[]; // per-package swatch
//   byStop: { stop: number; qty: number }[];
// }

// export interface LoadLeg {
//   start: { address: string; latitude: number; longitude: number };
//   end: { address: string; latitude: number; longitude: number };
//   distance: string;
//   duration: string;
//   loadAfterStop?: number; // legacy
//   onboardAfterStop?: number; // optional (if you adopt the suggestion)
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
//   route?: LoadLeg[];
//   loadArrangement: { stop: number; location: string; packages: string[] }[];
//   boxPlacements:
//   | {
//     pkg_ID: string;
//     prod_ID?: string;
//     color?: string;
//     position: [number, number, number];
//     dimensions: [number, number, number];
//   }[]
//   | Record<string, { boxes: { position: number[]; dimensions: number[] }[] }>;
//   vehicleDimensions: {
//     interiorLengthM: number;
//     interiorWidthM: number;
//     interiorHeightM: number;
//   };
//   truckCapacity: {
//     allowedLayers: number;
//     maxLayers?: number;
//     maxLayersByHeight?: number;
//     maxM3?: number;
//     oneLayerM3: number;
//     rawM3: number;     // denominator for UI progress
//     usableM3: number;  // informational cap
//     perLineLayers?: { prod_ID: string; pac_ID: string; allowedLayers: number }[];
//   };
//   productLegend?: ProductLegendItem[];
//   occupiedPercent?: number;
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
//     return `${productInfo.product_name}, Weight: ${productInfo.weight} kg, ID: ${productInfo.product_ID}`;
//   };

//   const getPercentage = (used: number, total: number): number =>
//     total ? Math.round((used / total) * 100) : 0;

//   // Normalize BE placements to a flat list of blocks (keeps backward compatibility)
//   const normalizeBlocks = (
//     boxPlacements:
//       | {
//         pkg_ID: string;
//         prod_ID?: string;
//         color?: string;
//         position: number[];
//         dimensions: number[];
//       }[]
//       | Record<string, { boxes: { position: number[]; dimensions: number[] }[] }>
//   ): PackageBlock[] => {
//     // Preferred path: array from BE with colors by product+package
//     if (Array.isArray(boxPlacements)) {
//       return boxPlacements.map(b => ({
//         pkg_ID: b.pkg_ID,
//         prod_ID: b.prod_ID,
//         color: b.color || "#999",
//         position: [
//           (b.position?.[0] ?? 0) as number,
//           (b.position?.[1] ?? 0) as number,
//           (b.position?.[2] ?? 0) as number,
//         ],
//         dimensions: [
//           (b.dimensions?.[0] ?? 0) as number,
//           (b.dimensions?.[1] ?? 0) as number,
//           (b.dimensions?.[2] ?? 0) as number,
//         ],
//         quantity: 1,
//       }));
//     }

//     // Legacy (object) path: no color info — give a stable fallback
//     const palette = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#0ea5e9", "#6366f1", "#22c55e"];
//     const colorByPkg: Record<string, string> = {};
//     let i = 0;

//     const out: PackageBlock[] = [];
//     Object.entries(boxPlacements).forEach(([pkg_ID, { boxes }]) => {
//       if (!colorByPkg[pkg_ID]) colorByPkg[pkg_ID] = palette[i++ % palette.length];
//       boxes.forEach((box) => {
//         out.push({
//           pkg_ID,
//           color: colorByPkg[pkg_ID],
//           position: [
//             (box.position?.[0] ?? 0) as number,
//             (box.position?.[1] ?? 0) as number,
//             (box.position?.[2] ?? 0) as number,
//           ],
//           dimensions: [
//             (box.dimensions?.[0] ?? 0) as number,
//             (box.dimensions?.[1] ?? 0) as number,
//             (box.dimensions?.[2] ?? 0) as number,
//           ],
//           quantity: 1,
//         });
//       });
//     });
//     return out;
//   };

//   const openTruck = useMemo(
//     () => (openTruckIndex != null ? trucks[openTruckIndex] : null),
//     [openTruckIndex, trucks]
//   );

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
//               const matchedPackage = selectedPackages.find(
//                 (p) => p.pack_ID === pkg.pack_ID
//               );
//               const productList = matchedPackage?.product_ID || [];

//               return (
//                 <li key={index}>
//                   <Typography variant="body2" color="primary">
//                     Package ID: <strong>{pkg.pack_ID}</strong>, Reason:{" "}
//                     <strong>{pkg.reason}</strong>
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
//       <Typography
//         variant="h5"
//         sx={{ textAlign: "center", fontWeight: 500, mb: 3 }}
//       >
//         Suggested Trucks
//       </Typography>

//       <Grid container spacing={3}>
//         {trucks.map((truck, index) => {
//           const weightUsed = truck.occupiedWeight;
//           const weightTotal = truck.totalWeightCapacity;

//           // Progress uses RAW interior m³
//           const volumeUsed = truck.occupiedVolume;
//           const volumeTotal = truck.truckCapacity?.rawM3 ?? truck.totalVolumeCapacity;

//           const volumePct = getPercentage(volumeUsed, volumeTotal);
//           const weightPct = getPercentage(weightUsed, weightTotal);

//           return (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card elevation={3}>
//                 <CardContent>
//                   <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
//                     <Typography variant="h6">
//                       Vehicle: {truck.vehicle_ID}
//                     </Typography>
//                     <Chip
//                       label={
//                         (truck.truckCapacity?.allowedLayers ?? 1) <= 1
//                           ? "No stacking"
//                           : `Up to ${truck.truckCapacity?.allowedLayers ?? 1} layers`
//                       }
//                       color={(truck.truckCapacity?.allowedLayers ?? 1) <= 1 ? "warning" : "success"}
//                       size="small"
//                     />
//                   </Stack>

//                   <Typography variant="body2" sx={{ mt: 0.5 }}>
//                     Trip cost: <b>{truck.cost.toFixed(2)}</b>
//                   </Typography>

//                   <Box mt={2}>
//                     <Typography>
//                       Weight: {weightUsed.toFixed(2)} / {weightTotal.toFixed(2)} kg
//                     </Typography>
//                     <LinearProgress
//                       variant="determinate"
//                       value={weightPct}
//                       sx={{ height: 10, borderRadius: 5, mt: 1 }}
//                     />
//                     <Typography variant="caption">{weightPct}% occupied</Typography>
//                   </Box>

//                   <Box mt={2}>
//                     <Typography>
//                       Volume: {volumeUsed.toFixed(2)} / {volumeTotal.toFixed(2)} m³
//                     </Typography>
//                     <LinearProgress
//                       variant="determinate"
//                       value={volumePct}
//                       color="secondary"
//                       sx={{ height: 10, borderRadius: 5, mt: 1 }}
//                     />
//                     <Typography variant="caption">
//                       {volumePct}% occupied — usable by rules: {truck.truckCapacity?.usableM3?.toFixed(2) ?? "—"} m³
//                     </Typography>
//                   </Box>

//                   {!!truck.truckCapacity?.perLineLayers?.length && (
//                     <>
//                       <Divider sx={{ my: 2 }} />
//                       <Typography variant="subtitle2" gutterBottom>
//                         Per-line stacking caps
//                       </Typography>
//                       <ul style={{ margin: 0, paddingLeft: 18 }}>
//                         {truck.truckCapacity.perLineLayers.map((l, idx) => (
//                           <li key={`${l.prod_ID}-${l.pac_ID}-${idx}`}>
//                             prod <code>{l.prod_ID}</code> → up to <b>{l.allowedLayers}</b> layer(s)
//                           </li>
//                         ))}
//                       </ul>
//                     </>
//                   )}

//                   <Box mt={2}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() =>
//                         setOpenTruckIndex(openTruckIndex === index ? null : index)
//                       }
//                       fullWidth
//                     >
//                       {openTruckIndex === index
//                         ? "Hide load builder"
//                         : "Show load builder"}
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>

//       {/* 3D + indexes for the selected card */}
//       {openTruck && (
//         <Box sx={{ mt: 4 }}>
//           <Box sx={{ height: "90vh", width: "100%", mb: 3 }}>
//             {(() => {
//               const blocks = normalizeBlocks(openTruck.boxPlacements);
//               const noStack = (openTruck.truckCapacity?.allowedLayers ?? 1) <= 1;
//               const safeBlocks: PackageBlock[] = noStack
//                 ? blocks.map(b => ({ ...b, position: [b.position[0], 0, b.position[2]] }))
//                 : blocks;

//               // Dev safety: warn if any >0 in no-stack
//               if (process.env.NODE_ENV !== "production") {
//                 const bad = safeBlocks.find(b => b.position[1] > 0);
//                 if (bad) console.error("Invariant: SF<=1 item placed above floor.", bad);
//               }

//               return (
//                 <TruckScene
//                   vehicleDimensions={{
//                     length: openTruck.vehicleDimensions.interiorLengthM,
//                     width: openTruck.vehicleDimensions.interiorWidthM,
//                     height: openTruck.vehicleDimensions.interiorHeightM,
//                   }}
//                   truckCapacity={openTruck.truckCapacity}
//                   packageBlocks={safeBlocks}
//                   productLegend={openTruck.productLegend}
//                 />
//               );
//             })()}
//           </Box>

//           {!!openTruck.loadArrangement?.length && (
//             <>
//               <Typography variant="h6" sx={{ mb: 1 }}>
//                 Route drops (FILO respected)
//               </Typography>
//               <ol style={{ paddingLeft: 18 }}>
//                 {openTruck.loadArrangement.map((s) => (
//                   <li key={s.stop}>
//                     <Typography variant="body2">
//                       <b>Stop {s.stop}</b> — {s.location}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Packages: {s.packages.join(", ")}
//                     </Typography>
//                   </li>
//                 ))}
//               </ol>
//             </>
//           )}

//           {!!openTruck.productLegend?.length && (
//             <>
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="h6" sx={{ mb: 1 }}>
//                 Product index (color-coded)
//               </Typography>
//               <Grid container spacing={2}>
//                 {openTruck.productLegend.map((p) => (
//                   <Grid item xs={12} sm={6} md={4} key={p.prod_ID}>
//                     <Card variant="outlined">
//                       <CardContent>
//                         <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
//                           <span style={{ width: 14, height: 14, background: p.color, border: '1px solid #000' }} />
//                           <Typography variant="subtitle2"><code>{p.prod_ID}</code> — qty {p.totalQty}</Typography>
//                         </Stack>
//                         {!!p.byPackage?.length && (
//                           <>
//                             <Typography variant="caption" sx={{ fontWeight: 600 }}>By package:</Typography>
//                             <ul style={{ margin: 0, paddingLeft: 16 }}>
//                               {p.byPackage.map(bp => (
//                                 <li key={bp.pack_ID} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
//                                   <span style={{ width: 10, height: 10, background: bp.color || p.color, border: '1px solid #000' }} />
//                                   {bp.pack_ID}: {bp.qty}
//                                 </li>
//                               ))}
//                             </ul>
//                           </>
//                         )}
//                         {!!p.byStop?.length && (
//                           <>
//                             <Typography variant="caption" sx={{ fontWeight: 600, mt: 1, display: 'block' }}>By stop:</Typography>
//                             <ul style={{ margin: 0, paddingLeft: 16 }}>
//                               {p.byStop.map(bs => (
//                                 <li key={`${p.prod_ID}-stop-${bs.stop}`} style={{ fontSize: 12 }}>
//                                   Stop {bs.stop}: {bs.qty}
//                                 </li>
//                               ))}
//                             </ul>
//                           </>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             </>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default TrucksTable;


'use client';

import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import { useGetAllProductsQuery } from "@/api/apiSlice";
import { Package, Product } from "./PackagesTable";
import TruckScene, { PackageBlock } from "./LoadThreeDModal";

/* =========================
   Types aligned with new BE
   ========================= */

export interface Allocation {
  vehicle_ID: string;
  totalWeightCapacity: number;
  totalVolumeCapacity: number;
  leftoverWeight: number;
  leftoverVolume: number;
  cost: number;
}

export interface ProductLegendItem {
  prod_ID: string;
  color: string;
  totalQty: number;
  byPackage: { pack_ID: string; qty: number; color?: string }[];
  byStop: { stop: number; qty: number }[];
}

export interface LoadLeg {
  start: { address: string; latitude: number; longitude: number };
  end: { address: string; latitude: number; longitude: number };
  distance: string;
  duration: string;
  loadAfterStop?: number;
  onboardAfterStop?: number;
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
  leftoverWeight: string | number;
  totalVolumeCapacity: number;
  leftoverVolume: number;
  cost: number;
  route?: LoadLeg[];
  loadArrangement: { stop: number; location: string; packages: string[] }[];
  boxPlacements:
  | {
    pkg_ID: string;
    prod_ID?: string;
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
    allowedLayers: number;             // min(height cap, SF cap)
    maxLayers?: number;
    maxLayersByHeight?: number;
    allowedByHeight?: number;          // same as maxLayersByHeight (BE may send either)
    allowedBySF?: number;              // global SF cap across products
    layersUsed?: number;               // how many layers the packer actually used
    oneLayerM3: number;
    rawM3: number;                     // geometric interior shell
    usableM3: number;                  // stacking-rule envelope
    perLineLayers?: { prod_ID: string; pac_ID: string; allowedLayers: number }[];
  };
  productLegend?: ProductLegendItem[];
  occupiedPercent?: number;            // legacy (raw)
  occupiedPercentRaw?: number;         // from BE
  occupiedPercentUsable?: number;      // from BE
  packageDetails?: {                   // optional from BE
    pkg_ID: string;
    volumeM3: number;
    percentOfTruck: number;
    percentOfUsable?: number;
  }[];
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

/* =========================
   Component
   ========================= */

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
    // fixed missing template string in original
    return `${productInfo.product_name}, Weight: ${productInfo.weight} kg, ID: ${productInfo.product_ID}`;
  };

  const getPercentage = (used: number, total: number): number =>
    total ? Math.round((used / total) * 100) : 0;

  // Normalize BE placements to a flat list of blocks (keeps backward compatibility)
  const normalizeBlocks = (
    boxPlacements:
      | {
        pkg_ID: string;
        prod_ID?: string;
        color?: string;
        position: number[];
        dimensions: number[];
      }[]
      | Record<string, { boxes: { position: number[]; dimensions: number[] }[] }>
  ): PackageBlock[] => {
    if (Array.isArray(boxPlacements)) {
      return boxPlacements.map((b) => ({
        pkg_ID: b.pkg_ID,
        prod_ID: b.prod_ID,
        color: b.color || "#999",
        position: [
          (b.position?.[0] ?? 0) as number,
          (b.position?.[1] ?? 0) as number,
          (b.position?.[2] ?? 0) as number,
        ],
        dimensions: [
          (b.dimensions?.[0] ?? 0) as number,
          (b.dimensions?.[1] ?? 0) as number,
          (b.dimensions?.[2] ?? 0) as number,
        ],
        quantity: 1,
      }));
    }

    // Legacy (object) path: no color info — give a stable fallback
    const palette = [
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
    const colorByPkg: Record<string, string> = {};
    let i = 0;

    const out: PackageBlock[] = [];
    Object.entries(boxPlacements).forEach(([pkg_ID, { boxes }]) => {
      if (!colorByPkg[pkg_ID])
        colorByPkg[pkg_ID] = palette[i++ % palette.length];
      boxes.forEach((box) => {
        out.push({
          pkg_ID,
          color: colorByPkg[pkg_ID],
          position: [
            (box.position?.[0] ?? 0) as number,
            (box.position?.[1] ?? 0) as number,
            (box.position?.[2] ?? 0) as number,
          ],
          dimensions: [
            (box.dimensions?.[0] ?? 0) as number,
            (box.dimensions?.[1] ?? 0) as number,
            (box.dimensions?.[2] ?? 0) as number,
          ],
          quantity: 1,
        });
      });
    });
    return out;
  };

  const openTruck = useMemo(
    () => (openTruckIndex != null ? trucks[openTruckIndex] : null),
    [openTruckIndex, trucks]
  );

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

          // Raw interior vs Rule-usable envelope from BE (with safe fallback)
          const volumeUsed = truck.occupiedVolume;
          const volumeTotalRaw =
            truck.truckCapacity?.rawM3 ?? truck.totalVolumeCapacity ?? 0;
          const volumeTotalUsable =
            truck.truckCapacity?.usableM3 ?? volumeTotalRaw;

          const volumePctRaw =
            truck.occupiedPercentRaw ??
            getPercentage(volumeUsed, volumeTotalRaw);
          const volumePctUsable =
            truck.occupiedPercentUsable ??
            getPercentage(volumeUsed, volumeTotalUsable);

          const weightPct = getPercentage(weightUsed, weightTotal);

          const allowedLayers = truck.truckCapacity?.allowedLayers ?? 1;
          const allowedByHeight =
            truck.truckCapacity?.allowedByHeight ??
            truck.truckCapacity?.maxLayersByHeight;
          const allowedBySF = truck.truckCapacity?.allowedBySF;
          const layersUsed = truck.truckCapacity?.layersUsed;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h6">
                      Vehicle: {truck.vehicle_ID}
                    </Typography>
                    <Chip
                      label={
                        allowedLayers <= 1
                          ? "No stacking"
                          : `Up to ${allowedLayers} layers`
                      }
                      color={allowedLayers <= 1 ? "warning" : "success"}
                      size="small"
                    />
                  </Stack>

                  {/* small helper line explaining the caps */}
                  <Typography variant="caption" color="text.secondary">
                    Height cap: {allowedByHeight ?? "—"} • SF cap:{" "}
                    {allowedBySF ?? "—"} • Used: {layersUsed ?? "—"}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Trip cost: <b>{truck.cost.toFixed(2)}</b>
                  </Typography>

                  {/* WEIGHT BAR */}
                  <Box mt={2}>
                    <Typography>
                      Weight: {weightUsed.toFixed(2)} / {weightTotal.toFixed(2)}{" "}
                      kg
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={weightPct}
                      sx={{ height: 10, borderRadius: 5, mt: 1 }}
                    />
                    <Typography variant="caption">{weightPct}% occupied</Typography>
                  </Box>

                  {/* VOLUME BARS */}
                  <Box mt={2}>
                    <Typography>
                      Volume (raw interior): {volumeUsed.toFixed(2)} /{" "}
                      {volumeTotalRaw.toFixed(2)} m³
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={volumePctRaw}
                      sx={{ height: 10, borderRadius: 5, mt: 1 }}
                    />
                    <Typography variant="caption">
                      {volumePctRaw}% of raw interior
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                      Volume (stacking-rule envelope): {volumeUsed.toFixed(2)} /{" "}
                      {volumeTotalUsable.toFixed(2)} m³
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={volumePctUsable}
                      color="secondary"
                      sx={{ height: 10, borderRadius: 5, mt: 1 }}
                    />
                    <Typography variant="caption">
                      {volumePctUsable}% of stacking-rule envelope
                    </Typography>
                  </Box>

                  {!!truck.truckCapacity?.perLineLayers?.length && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Per-line stacking caps
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {truck.truckCapacity.perLineLayers.map((l, idx) => (
                          <li key={`${l.prod_ID}-${l.pac_ID}-${idx}`}>
                            prod <code>{l.prod_ID}</code> → up to{" "}
                            <b>{l.allowedLayers}</b> layer(s)
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        setOpenTruckIndex(
                          openTruckIndex === index ? null : index
                        )
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

      {/* 3D + indexes for the selected card */}
      {openTruck && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ height: "90vh", width: "100%", mb: 3 }}>
            {(() => {
              const blocks = normalizeBlocks(openTruck.boxPlacements);
              const noStack = (openTruck.truckCapacity?.allowedLayers ?? 1) <= 1;
              const safeBlocks: PackageBlock[] = noStack
                ? blocks.map((b) => ({
                  ...b,
                  position: [b.position[0], 0, b.position[2]],
                }))
                : blocks;

              if (process.env.NODE_ENV !== "production") {
                const bad = safeBlocks.find((b) => b.position[1] > 0);
                if (bad)
                  console.error("Invariant: SF<=1 item placed above floor.", bad);
              }

              return (
                <TruckScene
                  vehicleDimensions={{
                    length: openTruck.vehicleDimensions.interiorLengthM,
                    width: openTruck.vehicleDimensions.interiorWidthM,
                    height: openTruck.vehicleDimensions.interiorHeightM,
                  }}
                  truckCapacity={openTruck.truckCapacity}
                  packageBlocks={safeBlocks}
                  productLegend={openTruck.productLegend}
                />
              );
            })()}
          </Box>

          {!!openTruck.loadArrangement?.length && (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Route drops (FILO respected)
              </Typography>
              <ol style={{ paddingLeft: 18 }}>
                {openTruck.loadArrangement.map((s) => (
                  <li key={s.stop}>
                    <Typography variant="body2">
                      <b>Stop {s.stop}</b> — {s.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Packages: {s.packages.join(", ")}
                    </Typography>
                  </li>
                ))}
              </ol>
            </>
          )}

          {!!openTruck.productLegend?.length && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Product index (color-coded)
              </Typography>
              <Grid container spacing={2}>
                {openTruck.productLegend.map((p) => (
                  <Grid item xs={12} sm={6} md={4} key={p.prod_ID}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <span
                            style={{
                              width: 14,
                              height: 14,
                              background: p.color,
                              border: "1px solid #000",
                            }}
                          />
                          <Typography variant="subtitle2">
                            <code>{p.prod_ID}</code> — qty {p.totalQty}
                          </Typography>
                        </Stack>
                        {!!p.byPackage?.length && (
                          <>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              By package:
                            </Typography>
                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                              {p.byPackage.map((bp) => (
                                <li
                                  key={bp.pack_ID}
                                  style={{
                                    fontSize: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 10,
                                      height: 10,
                                      background: bp.color || p.color,
                                      border: "1px solid #000",
                                    }}
                                  />
                                  {bp.pack_ID}: {bp.qty}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {!!p.byStop?.length && (
                          <>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, mt: 1, display: "block" }}
                            >
                              By stop:
                            </Typography>
                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                              {p.byStop.map((bs) => (
                                <li
                                  key={`${p.prod_ID}-stop-${bs.stop}`}
                                  style={{ fontSize: 12 }}
                                >
                                  Stop {bs.stop}: {bs.qty}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TrucksTable;