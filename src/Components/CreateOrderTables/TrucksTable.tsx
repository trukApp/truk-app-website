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
  Stack,
} from "@mui/material";
import { useGetAllProductsQuery } from "@/api/apiSlice";
import { Package, Product } from "./PackagesTable";
import TruckScene, { PackageBlock } from "./LoadThreeDModal";

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

const TrucksTable: React.FC<TrucksTableProps> = ({
  trucks,
  unAllocatedPackages,
  selectedPackages,
}) => {
  const { data: productsData } = useGetAllProductsQuery({});
  const allProductsData = productsData?.products || [];
  const [openTruckIndex, setOpenTruckIndex] = useState<number | null>(null);
  const [expandedStops, setExpandedStops] = useState<number[]>([]);

  const toggleStop = (stop: number) => {
    setExpandedStops((prev) =>
      prev.includes(stop) ? prev.filter((s) => s !== stop) : [...prev, stop]
    );
  };

  const getPackageTotalQty = (packID: string): number => {
    let total = 0;
    openTruck?.productLegend?.forEach((prod) => {
      const found = prod.byPackage.find((bp) => bp.pack_ID === packID);
      if (found) total += found.qty;
    });
    return total;
  };
  const getPackageDetails = (packID: string) => {
    return (
      openTruck?.productLegend
        ?.map((prod) => {
          const found = prod.byPackage.find((bp) => bp.pack_ID === packID);
          if (found) {
            return {
              prod_ID: prod.prod_ID,
              prodName: getProductName(prod.prod_ID),
              qty: found.qty,
              color: found.color || prod.color,
            };
          }
          return null;
        })
        .filter((x): x is { prod_ID: string; prodName: string; qty: number; color: string } => x !== null) || []
    );
  };

  const getProductDetails = (productID: string): string => {
    const productInfo = allProductsData.find(
      (product: Product) => product.product_ID === productID
    );
    if (!productInfo) return "Product details not available";
    // fixed missing template string in original
    return `${productInfo.product_name}, Weight: ${productInfo.weight} kg, ID: ${productInfo.product_ID}`;
  };

  const getProductName = (productID: string): string => {
    const productInfo = allProductsData.find(
      (product: Product) => product.product_ID === productID
    );
    return productInfo ? productInfo.product_name : productID;
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
          <Grid container spacing={3}>
            {/* LEFT: 3D Truck Scene */}
            <Grid item xs={12} md={8}>
              <Box sx={{ height: "90vh", width: "100%" }}>
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
                      console.error(
                        "Invariant: SF<=1 item placed above floor.",
                        bad
                      );
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
                    // productLegend={openTruck.productLegend}
                    />
                  );
                })()}
              </Box>
            </Grid>

            {/* RIGHT: Stops + Product Index */}
            <Grid item xs={12} md={4}>
              {!!openTruck.loadArrangement?.length && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: 18 }}>
                    Route drops (FILO respected)
                  </Typography>
                  <ol style={{ paddingLeft: 18 }}>
                    {openTruck.loadArrangement.map((s) => (
                      <li key={s.stop}>
                        <Typography variant="body2" style={{ fontWeight: 500, fontSize: 16 }}>
                          <b>Stop {s.stop}</b> — {s.location}
                        </Typography>

                        {/* Show packages with total qty */}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          style={{ fontSize: 16, marginBottom: 8 }}
                        >
                          Packages:{" "}
                          {s.packages.map((pkgID, i) => (
                            <span key={pkgID}>
                              {pkgID} ({getPackageTotalQty(pkgID)})
                              {i < s.packages.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </Typography>

                        {/* See details toggle */}
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => toggleStop(s.stop)}
                          sx={{ ml: 1 }}
                        >
                          {expandedStops.includes(s.stop) ? "Hide details" : "See details"}
                        </Button>

                        {/* Collapsible product breakdown */}
                        {expandedStops.includes(s.stop) && (
                          <Box sx={{ pl: 2, mt: 1 }}>
                            {s.packages.map((pkgID) => {
                              const details = getPackageDetails(pkgID);
                              return (
                                <Card
                                  key={pkgID}
                                  variant="outlined"
                                  sx={{ mb: 1, p: 1 }}
                                >
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    {pkgID}
                                  </Typography>
                                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                                    {details.map((prod) => (
                                      <li
                                        key={`${pkgID}-${prod.prod_ID}`}
                                        style={{
                                          fontSize: 14,
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 6,
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: 12,
                                            height: 12,
                                            background: prod.color,
                                            border: "1px solid #000",
                                          }}
                                        />
                                        {prod.prodName} ({prod.prod_ID}): {prod.qty}
                                      </li>
                                    ))}
                                  </ul>
                                </Card>
                              );
                            })}
                          </Box>
                        )}
                      </li>
                    ))}
                  </ol>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>

      )}
    </Box>
  );
};

export default TrucksTable;



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
//   Stack,
// } from "@mui/material";
// import { useGetAllProductsQuery } from "@/api/apiSlice";
// import { Package, Product } from "./PackagesTable";
// import TruckScene, { PackageBlock } from "./LoadThreeDModal";

// /* =========================
//    Types
// ========================= */

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
//   color: string;
//   totalQty: number;
//   byPackage: { pack_ID: string; qty: number; color?: string }[];
//   byStop: { stop: number; qty: number }[];
// }

// export interface LoadLeg {
//   start: { address: string; latitude: number; longitude: number };
//   end: { address: string; latitude: number; longitude: number };
//   distance: string;
//   duration: string;
//   loadAfterStop?: number;
//   onboardAfterStop?: number;
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
//   leftoverWeight: string | number;
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
//     allowedByHeight?: number;
//     allowedBySF?: number;
//     layersUsed?: number;
//     oneLayerM3: number;
//     rawM3: number;
//     usableM3: number;
//     perLineLayers?: { prod_ID: string; pac_ID: string; allowedLayers: number }[];
//   };
//   productLegend?: ProductLegendItem[];
//   occupiedPercent?: number;
//   occupiedPercentRaw?: number;
//   occupiedPercentUsable?: number;
//   packageDetails?: {
//     pkg_ID: string;
//     volumeM3: number;
//     percentOfTruck: number;
//     percentOfUsable?: number;
//   }[];
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

// /* =========================
//    Color helpers (stable per product)
// ========================= */

// const DISTINCT_PALETTE = [
//   "#ef4444", "#f97316", "#f59e0b", "#22c55e", "#10b981", "#06b6d4",
//   "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
// ];

// const stableHash = (s: string) => {
//   let h = 5381;
//   for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
//   return Math.abs(h) >>> 0;
// };

// const hexToRgb = (hex: string) => {
//   const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   if (!m) return { r: 0, g: 0, b: 0 };
//   return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
// };
// const rgbToHsl = (r: number, g: number, b: number) => {
//   r /= 255; g /= 255; b /= 255;
//   const max = Math.max(r, g, b), min = Math.min(r, g, b);
//   let h = 0, s = 0, l = (max + min) / 2;
//   if (max !== min) {
//     const d = max - min;
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//     switch (max) {
//       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//       case g: h = (b - r) / d + 2; break;
//       case b: h = (r - g) / d + 4; break;
//     }
//     h *= 60;
//   }
//   return { h, s, l };
// };
// const hueFamily = (hex: string) => {
//   const { r, g, b } = hexToRgb(hex);
//   const { h } = rgbToHsl(r, g, b);
//   // bucket hues into 12 families (0..11)
//   return `${Math.round((h / 360) * 12) % 12}`;
// };

// const buildLegendColorMaps = (legend?: ProductLegendItem[]) => {
//   const byProd = new Map<string, string>();
//   const byProdPack = new Map<string, string>();
//   if (legend?.length) {
//     for (const p of legend) {
//       if (p.color) byProd.set(p.prod_ID, p.color);
//       for (const b of p.byPackage) {
//         if (b.color) byProdPack.set(`${p.prod_ID}::${b.pack_ID}`, b.color);
//       }
//     }
//   }
//   return { byProd, byProdPack };
// };

// /* =========================
//    Component
// ========================= */

// const TrucksTable: React.FC<TrucksTableProps> = ({
//   trucks,
//   unAllocatedPackages,
//   selectedPackages,
// }) => {
//   const { data: productsData } = useGetAllProductsQuery({});
//   const allProductsData = productsData?.products || [];
//   const [openTruckIndex, setOpenTruckIndex] = useState<number | null>(null);
//   const [expandedStops, setExpandedStops] = useState<number[]>([]);

//   const toggleStop = (stop: number) => {
//     setExpandedStops((prev) =>
//       prev.includes(stop) ? prev.filter((s) => s !== stop) : [...prev, stop]
//     );
//   };

//   const openTruck = useMemo(
//     () => (openTruckIndex != null ? trucks[openTruckIndex] : null),
//     [openTruckIndex, trucks]
//   );

//   /* ---------- small helpers that reference openTruck safely ---------- */

//   const getPackageTotalQty = (packID: string): number => {
//     let total = 0;
//     openTruck?.productLegend?.forEach((prod) => {
//       const found = prod.byPackage.find((bp) => bp.pack_ID === packID);
//       if (found) total += found.qty;
//     });
//     return total;
//   };

//   const getPackageDetails = (packID: string) => {
//     return (
//       openTruck?.productLegend
//         ?.map((prod) => {
//           const found = prod.byPackage.find((bp) => bp.pack_ID === packID);
//           if (found) {
//             return {
//               prod_ID: prod.prod_ID,
//               prodName: getProductName(prod.prod_ID),
//               qty: found.qty,
//               color: found.color || prod.color,
//             };
//           }
//           return null;
//         })
//         .filter(
//           (x): x is { prod_ID: string; prodName: string; qty: number; color: string } =>
//             x !== null
//         ) || []
//     );
//   };

//   const getProductDetails = (productID: string): string => {
//     const productInfo = allProductsData.find(
//       (product: Product) => product.product_ID === productID
//     );
//     if (!productInfo) return "Product details not available";
//     return `• ${productInfo.product_name}, Weight: ${productInfo.weight} kg (ID: ${productInfo.product_ID})`;
//   };

//   const getProductName = (productID: string): string => {
//     const productInfo = allProductsData.find(
//       (product: Product) => product.product_ID === productID
//     );
//     return productInfo ? productInfo.product_name : productID;
//   };

//   const getPercentage = (used: number, total: number): number =>
//     total ? Math.round((used / total) * 100) : 0;

//   /* =========================
//      Normalize BE placements to blocks
//      - Enforce single color per product (no same-family clashes across products)
//   ========================= */

//   type Normalized = { blocks: PackageBlock[]; prodColors: Record<string, string> };

//   const normalizeBlocks = (
//     boxPlacements:
//       | {
//         pkg_ID: string;
//         prod_ID?: string;
//         color?: string;
//         position: number[];
//         dimensions: number[];
//       }[]
//       | Record<string, { boxes: { position: number[]; dimensions: number[] }[] }>,
//     legend?: ProductLegendItem[]
//   ): Normalized => {
//     const { byProd, byProdPack } = buildLegendColorMaps(legend);
//     const prodColor = new Map<string, string>();
//     const usedFamilies = new Set<string>();

//     const nextPaletteColor = (seed: string) => {
//       const base = stableHash(seed);
//       for (let k = 0; k < DISTINCT_PALETTE.length; k++) {
//         const c = DISTINCT_PALETTE[(base + k) % DISTINCT_PALETTE.length];
//         const fam = hueFamily(c);
//         if (!usedFamilies.has(fam)) return c;
//       }
//       return DISTINCT_PALETTE[base % DISTINCT_PALETTE.length];
//     };

//     const resolveColor = (prod_ID?: string, pkg_ID?: string, beColor?: string) => {
//       if (prod_ID && prodColor.has(prod_ID)) return prodColor.get(prod_ID)!;

//       const choices = [
//         prod_ID && pkg_ID ? byProdPack.get(`${prod_ID}::${pkg_ID}`) : undefined,
//         prod_ID ? byProd.get(prod_ID) : undefined,
//         beColor,
//       ].filter(Boolean) as string[];

//       for (const c of choices) {
//         const fam = hueFamily(c);
//         if (!usedFamilies.has(fam)) {
//           if (prod_ID) {
//             prodColor.set(prod_ID, c);
//             usedFamilies.add(fam);
//           }
//           return c;
//         }
//       }

//       const chosen = nextPaletteColor(prod_ID || pkg_ID || "seed");
//       if (prod_ID) {
//         prodColor.set(prod_ID, chosen);
//         usedFamilies.add(hueFamily(chosen));
//       }
//       return chosen;
//     };

//     // Modern array shape from BE
//     if (Array.isArray(boxPlacements)) {
//       const blocks = boxPlacements.map((b) => {
//         const color = resolveColor(b.prod_ID, b.pkg_ID, b.color);
//         return {
//           pkg_ID: b.pkg_ID,
//           prod_ID: b.prod_ID,
//           color,
//           position: [
//             (b.position?.[0] ?? 0) as number,
//             (b.position?.[1] ?? 0) as number,
//             (b.position?.[2] ?? 0) as number,
//           ],
//           dimensions: [
//             (b.dimensions?.[0] ?? 0) as number,
//             (b.dimensions?.[1] ?? 0) as number,
//             (b.dimensions?.[2] ?? 0) as number,
//           ],
//           quantity: 1,
//         };
//       });
//       return { blocks, prodColors: Object.fromEntries(prodColor) };
//     }

//     // Legacy object shape (no prod_ID/color info)
//     const out: PackageBlock[] = [];
//     Object.entries(boxPlacements).forEach(([pkg_ID, { boxes }]) => {
//       const color = resolveColor(undefined, pkg_ID, undefined);
//       boxes.forEach((box) => {
//         out.push({
//           pkg_ID,
//           color,
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
//     return { blocks: out, prodColors: Object.fromEntries(prodColor) };
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
//                   {productList.map((prod: any, i: number) => (
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

//           const volumeUsed = truck.occupiedVolume;
//           const volumeTotalRaw =
//             truck.truckCapacity?.rawM3 ?? truck.totalVolumeCapacity ?? 0;
//           const volumeTotalUsable =
//             truck.truckCapacity?.usableM3 ?? volumeTotalRaw;

//           const volumePctRaw =
//             truck.occupiedPercentRaw ?? getPercentage(volumeUsed, volumeTotalRaw);
//           const volumePctUsable =
//             truck.occupiedPercentUsable ??
//             getPercentage(volumeUsed, volumeTotalUsable);

//           const weightPct = getPercentage(weightUsed, weightTotal);

//           const allowedLayers = truck.truckCapacity?.allowedLayers ?? 1;
//           const allowedByHeight =
//             truck.truckCapacity?.allowedByHeight ??
//             truck.truckCapacity?.maxLayersByHeight;
//           const allowedBySF = truck.truckCapacity?.allowedBySF;
//           const layersUsed = truck.truckCapacity?.layersUsed;

//           return (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card elevation={3}>
//                 <CardContent>
//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     alignItems="center"
//                     justifyContent="space-between"
//                   >
//                     <Typography variant="h6">
//                       Vehicle: {truck.vehicle_ID}
//                     </Typography>
//                     <Chip
//                       label={
//                         allowedLayers <= 1 ? "No stacking" : `Up to ${allowedLayers} layers`
//                       }
//                       color={allowedLayers <= 1 ? "warning" : "success"}
//                       size="small"
//                     />
//                   </Stack>

//                   <Typography variant="caption" color="text.secondary">
//                     Height cap: {allowedByHeight ?? "—"} • SF cap:{" "}
//                     {allowedBySF ?? "—"} • Used: {layersUsed ?? "—"}
//                   </Typography>

//                   <Typography variant="body2" sx={{ mt: 1 }}>
//                     Trip cost: <b>{truck.cost.toFixed(2)}</b>
//                   </Typography>

//                   {/* WEIGHT BAR */}
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

//                   {/* VOLUME BARS */}
//                   <Box mt={2}>
//                     <Typography>
//                       Volume (raw interior): {volumeUsed.toFixed(2)} /{" "}
//                       {volumeTotalRaw.toFixed(2)} m³
//                     </Typography>
//                     <LinearProgress
//                       variant="determinate"
//                       value={volumePctRaw}
//                       sx={{ height: 10, borderRadius: 5, mt: 1 }}
//                     />
//                     <Typography variant="caption">
//                       {volumePctRaw}% of raw interior
//                     </Typography>

//                     <Typography sx={{ mt: 1 }}>
//                       Volume (stacking-rule envelope): {volumeUsed.toFixed(2)} /{" "}
//                       {volumeTotalUsable.toFixed(2)} m³
//                     </Typography>
//                     <LinearProgress
//                       variant="determinate"
//                       value={volumePctUsable}
//                       color="secondary"
//                       sx={{ height: 10, borderRadius: 5, mt: 1 }}
//                     />
//                     <Typography variant="caption">
//                       {volumePctUsable}% of stacking-rule envelope
//                     </Typography>
//                   </Box>

//                   <Box mt={2}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() =>
//                         setOpenTruckIndex(openTruckIndex === index ? null : index)
//                       }
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

//       {/* 3D + indexes for the selected card */}
//       {openTruck && (
//         <Box sx={{ mt: 4 }}>
//           <Grid container spacing={3}>
//             {/* LEFT: 3D Truck Scene */}
//             <Grid item xs={12} md={8}>
//               <Box sx={{ height: "90vh", width: "100%" }}>
//                 {(() => {
//                   const { blocks } = normalizeBlocks(
//                     openTruck.boxPlacements,
//                     openTruck.productLegend
//                   );

//                   const noStack = (openTruck.truckCapacity?.allowedLayers ?? 1) <= 1;
//                   const safeBlocks: PackageBlock[] = noStack
//                     ? blocks.map((b) => ({
//                       ...b,
//                       position: [b.position[0], 0, b.position[2]],
//                     }))
//                     : blocks;

//                   if (process.env.NODE_ENV !== "production") {
//                     const bad = safeBlocks.find((b) => b.position[1] > 0 && noStack);
//                     if (bad)
//                       console.error("Invariant: SF<=1 item placed above floor.", bad);
//                   }

//                   return (
//                     <TruckScene
//                       vehicleDimensions={{
//                         length: openTruck.vehicleDimensions.interiorLengthM,
//                         width: openTruck.vehicleDimensions.interiorWidthM,
//                         height: openTruck.vehicleDimensions.interiorHeightM,
//                       }}
//                       truckCapacity={openTruck.truckCapacity}
//                       packageBlocks={safeBlocks}
//                     />
//                   );
//                 })()}
//               </Box>
//             </Grid>

//             {/* RIGHT: Stops + Product Index */}
//             <Grid item xs={12} md={4}>
//               {!!openTruck.loadArrangement?.length && (
//                 <Box sx={{ mb: 3 }}>
//                   <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: 18 }}>
//                     Route drops (FILO respected)
//                   </Typography>
//                   <ol style={{ paddingLeft: 18 }}>
//                     {openTruck.loadArrangement.map((s) => (
//                       <li key={s.stop}>
//                         <Typography variant="body2" style={{ fontWeight: 500, fontSize: 16 }}>
//                           <b>Stop {s.stop}</b> — {s.location}
//                         </Typography>

//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                           style={{ fontSize: 16, marginBottom: 8 }}
//                         >
//                           Packages:{" "}
//                           {s.packages.map((pkgID, i) => (
//                             <span key={pkgID}>
//                               {pkgID} ({getPackageTotalQty(pkgID)})
//                               {i < s.packages.length - 1 ? ", " : ""}
//                             </span>
//                           ))}
//                         </Typography>

//                         <Button
//                           variant="text"
//                           size="small"
//                           onClick={() => toggleStop(s.stop)}
//                           sx={{ ml: 1 }}
//                         >
//                           {expandedStops.includes(s.stop) ? "Hide details" : "See details"}
//                         </Button>

//                         {expandedStops.includes(s.stop) && (
//                           <Box sx={{ pl: 2, mt: 1 }}>
//                             {s.packages.map((pkgID) => {
//                               const details = getPackageDetails(pkgID);
//                               return (
//                                 <Card key={pkgID} variant="outlined" sx={{ mb: 1, p: 1 }}>
//                                   <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                                     {pkgID}
//                                   </Typography>
//                                   <ul style={{ margin: 0, paddingLeft: 16 }}>
//                                     {details.map((prod) => (
//                                       <li
//                                         key={`${pkgID}-${prod.prod_ID}`}
//                                         style={{
//                                           fontSize: 14,
//                                           display: "flex",
//                                           alignItems: "center",
//                                           gap: 6,
//                                         }}
//                                       >
//                                         <span
//                                           style={{
//                                             width: 12,
//                                             height: 12,
//                                             background: prod.color,
//                                             border: "1px solid #000",
//                                           }}
//                                         />
//                                         {prod.prodName} ({prod.prod_ID}): {prod.qty}
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 </Card>
//                               );
//                             })}
//                           </Box>
//                         )}
//                       </li>
//                     ))}
//                   </ol>
//                 </Box>
//               )}
//             </Grid>
//           </Grid>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default TrucksTable;