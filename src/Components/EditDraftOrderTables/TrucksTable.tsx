"use client";

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
  // cost: number;
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
  chargeableWeight: number;
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
    allowedLayers: number;
    maxLayers?: number;
    maxLayersByHeight?: number;
    allowedByHeight?: number;
    allowedBySF?: number;
    layersUsed?: number;
    oneLayerM3: number;
    rawM3: number;
    usableM3: number;
    perLineLayers?: {
      prod_ID: string;
      pac_ID: string;
      allowedLayers: number;
    }[];
  };
  productLegend?: ProductLegendItem[];
  occupiedPercent?: number;
  occupiedPercentRaw?: number;
  occupiedPercentUsable?: number;
  packageDetails?: {
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

  const getProductName = (productID: string): string => {
    const productInfo = allProductsData.find(
      (product: Product) => product.product_ID === productID,
    );
    return productInfo ? productInfo.product_name : productID;
  };

  const getProductDetails = (productID: string): string => {
    const p = allProductsData.find((x: Product) => x.product_ID === productID);
    if (!p) return "Product details not available";
    return ` ${p.product_name}, Weight: ${p.weight} kg, ID: ${p.product_ID}`;
  };

  const getPercentage = (used: number, total: number): number =>
    total ? Math.round((used / total) * 100) : 0;

  /** Normalize BE placements to blocks for the 3D scene */
  const normalizeBlocks = (
    boxPlacements:
      | {
          pkg_ID: string;
          prod_ID?: string;
          color?: string;
          position: number[];
          dimensions: number[];
        }[]
      | Record<
          string,
          { boxes: { position: number[]; dimensions: number[] }[] }
        >,
  ): PackageBlock[] => {
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
    let i = 0;
    const colorByPkg: Record<string, string> = {};
    const out: PackageBlock[] = [];

    const pushBlock = (b: {
      pkg_ID: string;
      prod_ID?: string;
      color?: string;
      position: number[];
      dimensions: number[];
    }) => {
      out.push({
        pkg_ID: b.pkg_ID,
        prod_ID: b.prod_ID,
        color: b.color || "#999",
        position: [
          b.position?.[0] ?? 0,
          b.position?.[1] ?? 0, // BE y is already from 0
          b.position?.[2] ?? 0,
        ],
        dimensions: [
          b.dimensions?.[0] ?? 0,
          b.dimensions?.[1] ?? 0,
          b.dimensions?.[2] ?? 0,
        ],
      });
    };

    if (Array.isArray(boxPlacements)) {
      boxPlacements.forEach(pushBlock);
    } else {
      Object.entries(boxPlacements).forEach(([pkg_ID, { boxes }]) => {
        if (!colorByPkg[pkg_ID])
          colorByPkg[pkg_ID] = palette[i++ % palette.length];
        boxes.forEach((box) =>
          pushBlock({
            pkg_ID,
            position: box.position,
            dimensions: box.dimensions,
            color: colorByPkg[pkg_ID],
          }),
        );
      });
    }

    return out;
  };

  const openTruck = useMemo(
    () => (openTruckIndex != null ? trucks[openTruckIndex] : null),
    [openTruckIndex, trucks],
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
                (p) => p.pack_ID === pkg.pack_ID,
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

                  <Typography variant="caption" color="text.secondary">
                    Height cap: {allowedByHeight ?? "—"} • SF cap:{" "}
                    {allowedBySF ?? "—"} • Used: {layersUsed ?? "—"}
                  </Typography>
                  <Box mt={2}>
                    <Typography>
                      Chargeable Weight: {truck?.chargeableWeight} kg
                    </Typography>
                  </Box>
                  {/* <Typography variant="body2" sx={{ mt: 1 }}>
                    Trip cost: <b>{truck.cost.toFixed(2)}</b>
                  </Typography> */}

                  {/* Weight bar */}
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
                    <Typography variant="caption">
                      {weightPct}% occupied
                    </Typography>
                  </Box>

                  {/* Volume bars */}
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
                          openTruckIndex === index ? null : index,
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
                  const noStack =
                    (openTruck.truckCapacity?.allowedLayers ?? 1) <= 1;

                  // Force Y=0 for no stacking (BE will already send y=0 in this case)
                  const safeBlocks: PackageBlock[] = blocks.map((b) => ({
                    ...b,
                    position: [
                      b.position[0] ?? 0,
                      noStack ? 0 : (b.position[1] ?? 0),
                      b.position[2] ?? 0,
                    ],
                  }));

                  return (
                    <TruckScene
                      vehicleDimensions={{
                        length: openTruck.vehicleDimensions.interiorLengthM,
                        width: openTruck.vehicleDimensions.interiorWidthM,
                        height: openTruck.vehicleDimensions.interiorHeightM,
                      }}
                      truckCapacity={openTruck.truckCapacity}
                      packageBlocks={safeBlocks}
                    />
                  );
                })()}
              </Box>
            </Grid>

            {/* RIGHT: Stops + Product Index */}
            <Grid item xs={12} md={4}>
              {!!openTruck.loadArrangement?.length && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, fontWeight: 600, fontSize: 18 }}
                  >
                    Route drops (FILO respected)
                  </Typography>
                  <ol style={{ paddingLeft: 18 }}>
                    {openTruck.loadArrangement.map((s) => (
                      <li key={s.stop}>
                        <Typography
                          variant="body2"
                          style={{ fontWeight: 500, fontSize: 16 }}
                        >
                          <b>Stop {s.stop}</b> — {s.location}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          style={{ fontSize: 16, marginBottom: 8 }}
                        >
                          Packages:{" "}
                          {s.packages.map((pkgID, i) => (
                            <span key={pkgID}>
                              {pkgID}
                              {i < s.packages.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            setExpandedStops((prev) =>
                              prev.includes(s.stop)
                                ? prev.filter((x) => x !== s.stop)
                                : [...prev, s.stop],
                            );
                          }}
                          sx={{ ml: 1 }}
                        >
                          {expandedStops.includes(s.stop)
                            ? "Hide details"
                            : "See details"}
                        </Button>

                        {expandedStops.includes(s.stop) && (
                          <Box sx={{ pl: 2, mt: 1 }}>
                            {s.packages.map((pkgID) => {
                              const details =
                                openTruck.productLegend
                                  ?.map((prod) => {
                                    const found = prod.byPackage.find(
                                      (bp) => bp.pack_ID === pkgID,
                                    );
                                    return found
                                      ? {
                                          prod_ID: prod.prod_ID,
                                          prodName: getProductName(
                                            prod.prod_ID,
                                          ),
                                          qty: found.qty,
                                          color: found.color || prod.color,
                                        }
                                      : null;
                                  })
                                  .filter(Boolean) || [];
                              return (
                                <Card
                                  key={pkgID}
                                  variant="outlined"
                                  sx={{ mb: 1, p: 1 }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ mb: 1 }}
                                  >
                                    {pkgID}
                                  </Typography>
                                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                                    {details.map((prod) => (
                                      <li
                                        key={`${pkgID}-${prod?.prod_ID}`}
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
                                            background: prod?.color,
                                            border: "1px solid #000",
                                          }}
                                        />
                                        {prod?.prodName} ({prod?.prod_ID}):{" "}
                                        {prod?.qty}
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
