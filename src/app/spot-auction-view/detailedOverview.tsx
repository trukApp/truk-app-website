"use client";
import React, { useState } from "react";
import {
  useGetBidsByOrderIdQuery,
  useGetCarrierMasterQuery,
  useGetOrderByIdQuery,
} from "@/api/apiSlice";
import {
  Backdrop,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Box,
  Dialog,
} from "@mui/material";
import Allocations from "@/Components/OrderOverViewAllocations/Allocations";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import Image from "next/image";
import BidsOverview from "@/Components/SpotAuction/BidsOverview";

export interface OrderDoc {
  [key: string]: string;
}

const OrderDetailedOverview: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_ID") || "";
  const from = searchParams.get("from") ?? "";
  const { data: order, isLoading } = useGetOrderByIdQuery({ orderId });
  const { data: bidsData, isLoading: bidsDataLoading } =
    useGetBidsByOrderIdQuery({ orderId });
  const { data: carriersData, isLoading: isCarrierLoading } =
    useGetCarrierMasterQuery({});
  const allCarriersData = carriersData?.carriers || [];
  const orderData = order?.order;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const allocatedPackageDetails = order?.allocated_packages_details;

  const [openPreview, setOpenPreview] = useState<{
    url: string;
    open: boolean;
  }>({
    url: "",
    open: false,
  });

  const handlePreview = (url: string) => {
    setOpenPreview({ url, open: true });
    setIsGeneratingPDF(false);
  };

  return (
    <Box sx={{ p: { xs: 0.2, md: 2 } }}>
      <Dialog
        open={openPreview.open}
        onClose={() => setOpenPreview({ url: "", open: false })}
        fullWidth
        maxWidth="md"
      >
        {openPreview.url.endsWith(".pdf") ? (
          <embed
            src={openPreview.url}
            type="application/pdf"
            width="100%"
            height="600px"
            style={{ border: "none" }}
          />
        ) : (
          <Image
            src={openPreview.url}
            alt="Preview"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading || bidsDataLoading || isCarrierLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper>
        {orderData && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#F08C24", fontWeight: "bold" }}
              >
                Order Details
              </Typography>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Order ID: <strong>{orderData.order_ID}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Scenario: <strong>{orderData.scenario_label}</strong>
                </Typography>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                                <Typography variant="body1">
                                    Total Cost:{" "}
                                    <strong>₹{parseFloat(orderData.total_cost).toFixed(2)}</strong>
                                </Typography>
                            </Grid> */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Created at:{" "}
                  <strong>
                    {moment(orderData.created_at).format("DD MMM YYYY")}
                  </strong>
                </Typography>
              </Grid>
            </Grid>

            {/* Order Docs */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {orderData?.order_docs?.map((doc: OrderDoc, index: number) => {
                const key = Object.keys(doc)[0];
                const url = doc[key];
                const isPDF = url.endsWith(".pdf");

                return (
                  <Grid item xs={12} md={3} key={index}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, textTransform: "capitalize" }}
                    >
                      {key}
                    </Typography>

                    <Grid
                      spacing={2}
                      container
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        mt: 0.5,
                        ml: 0.5,
                      }}
                      onClick={() => handlePreview(url)}
                    >
                      {isPDF ? (
                        <embed
                          src={url}
                          type="application/pdf"
                          width="50%"
                          height="80px"
                          style={{ border: "1px solid #ccc", borderRadius: 4 }}
                        />
                      ) : (
                        <Image
                          src={url}
                          alt={key}
                          width={150}
                          height={80}
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Typography variant="caption" color="primary">
                        Click to view full screen
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        )}
        {bidsData?.data?.length > 0 && (
          <BidsOverview
            bidsData={bidsData.data}
            carriers={allCarriersData}
            orderId={orderId}
          />
        )}
        {orderData?.allocations && (
          <Allocations
            isGeneratingPDF={isGeneratingPDF}
            allocations={orderData.allocations}
            orderId={orderData.order_ID}
            allocatedPackageDetails={allocatedPackageDetails}
            from={from}
          />
        )}
      </Paper>
    </Box>
  );
};

export default OrderDetailedOverview;
