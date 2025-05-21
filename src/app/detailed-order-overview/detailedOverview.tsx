'use client';
import React, { useRef, useState } from "react";
import { useGetOrderByIdQuery } from "@/api/apiSlice";
import { Backdrop, CircularProgress, Grid, Paper, Typography, Box } from "@mui/material";
import Allocations from "@/Components/OrderOverViewAllocations/Allocations";
import { useSearchParams } from 'next/navigation';
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CustomButtonFilled } from "@/Components/ReusableComponents/ButtonsComponent";

const OrderDetailedOverview: React.FC = () => {
      const pdfRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_ID') || '';
    const from = searchParams.get('from') ?? '';
    const { data: order, isLoading } = useGetOrderByIdQuery({ orderId });
    const orderData = order?.order;
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const allocatedPackageDetails = order?.allocated_packages_details
    console.log('orderdata :', orderData)

const generatePDF = async () => {
  setIsGeneratingPDF(true);

  await new Promise(resolve => setTimeout(resolve, 0)); // Wait for re-render

  const input = pdfRef.current;
  if (!input) return;

  const canvas = await html2canvas(input, {
    scale: 1.5, // Lower scale reduces file size and improves performance
    useCORS: true,
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.6); // JPEG and quality=0.6 to reduce size

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10;

  // First page
  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Add remaining pages
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save("order-details.pdf");

  setIsGeneratingPDF(false);
};

    return (
        <Box sx={{ p: { xs: 0.2, md: 2 } }}>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {orderData?.order_status === 'assignment pending' && (
                <Grid sx={{display:'flex', flexDirection:'row' , justifyContent:'flex-end'}}>
                <CustomButtonFilled type='button' onClick={generatePDF} style={{ marginBottom: "10px" }}>
                    Download order details
                </CustomButtonFilled>
            </Grid>
            )
            }
            

            <Paper ref={pdfRef} key={orderData?.order_ID}   elevation={0}
                sx={{
                    border: "none",
                    boxShadow: "none",
                }}>
            {orderData && (
                <Paper sx={{ p: 3, mb: 3, marginLeft: isGeneratingPDF ? '30px': '2px' }}>
                    <Typography variant="h6" gutterBottom sx={{ color: "#F08C24", fontWeight: 'bold' }}>
                        Order Details
                    </Typography>
                    <Grid container spacing={1} sx={{ mt: { xs: 0.2, md: 2 } }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" sx={{ fontSize: { xs: '15px', md: '17px' } }}>Order ID: <strong>{orderData.order_ID}</strong></Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" sx={{ fontSize: { xs: '15px', md: '17px' } }}>Scenario:  <strong>{orderData.scenario_label}</strong> </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" sx={{ fontSize: { xs: '15px', md: '17px' } }}>Total Cost: <strong>₹{parseFloat(orderData.total_cost).toFixed(2)}</strong></Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" sx={{ fontSize: { xs: '15px', md: '17px' } }}>Created at: <strong>{moment(orderData.created_at).format("DD MMM YYYY")}</strong></Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {orderData?.allocations && <Allocations isGeneratingPDF={isGeneratingPDF} allocations={orderData.allocations} orderId={orderData.order_ID} allocatedPackageDetails={allocatedPackageDetails} from={from} />}
            </Paper>
        </Box>
    );
};

export default OrderDetailedOverview;
