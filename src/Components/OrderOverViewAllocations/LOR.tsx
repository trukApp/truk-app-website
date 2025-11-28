// // import React from "react";
// // import { useEditOrderMutation, useGetLocationMasterQuery, useImageUploadingMutation } from "@/api/apiSlice";
// // import { Typography, Paper, Grid, Divider, Box, Button, Backdrop, CircularProgress } from "@mui/material";
// // import { Location } from "../MasterDataComponents/Locations";
// // import jsPDF from "jspdf";
// // import html2canvas from "html2canvas";
// // import QRCode from "qrcode";
// // import { useRef } from "react";

// // interface RoutePoint {
// //     start: { address: string; latitude: number; longitude: number };
// //     end: { address: string; latitude: number; longitude: number };
// //     distance: string;
// //     duration: string;
// // }
// // interface Allocation {
// //     vehicle_ID: string;
// //     cost: number;
// //     totalVolumeCapacity: number;
// //     totalWeightCapacity: number;
// //     occupiedVolume: number;
// //     occupiedWeight: number;
// //     leftoverVolume: number;
// //     leftoverWeight: number;
// //     packages: string[];
// //     route: RoutePoint[];
// //     ship_from: string;
// //     packageInfoDetails?: PackageInfoDetail[];
// // }

// // interface PackageDestinationRadius {
// //     pack_ID: string;
// //     ship_to: string;
// //     destination_radius: string;
// // }

// // interface PackageDetails {
// //     pack_ID: string;
// //     pkg_ID: string;
// //     volumeM3: number;
// //     percentOfTruck: number;
// //     weight_uom: string;
// //     package_weight: string;
// // }

// // interface PackageInfoLine {
// //     pac_ID: string;
// //     prod_ID: string;
// //     quantity: number;
// //     package_info: {
// //         pac_ID: string;
// //         pack_width: string;
// //         package_id: number;
// //         pack_height: string;
// //         pack_length: string;
// //         pack_volume: string;
// //         dimensions_uom: string;
// //         pack_volume_uom: string;
// //         handling_unit_type: string;
// //         packaging_type_name: string;
// //     };
// //     packagingDimensions: {
// //         widthM: number;
// //         heightM: number;
// //         lengthM: number;
// //     };
// // }

// // interface VehicleDimensions {
// //     interiorWidthM: number;
// //     interiorHeightM: number;
// //     interiorLengthM: number;
// // }

// // interface TruckCapacity {
// //     rawM3: number;
// //     usableM3: number;
// //     maxLayers: number;
// //     oneLayerM3: number;
// //     allowedLayers: number;
// // }
// // interface RoutePoint {
// //     start: { address: string; latitude: number; longitude: number };
// //     end: { address: string; latitude: number; longitude: number };
// //     distance: string;
// //     duration: string;
// // }

// // interface Allocation {
// //     cost: number;
// //     route: RoutePoint[];
// //     packages: string[];
// //     vehicle_ID: string;
// //     truckCapacity: TruckCapacity;
// //     leftoverVolume: number;
// //     leftoverWeight: number;
// //     occupiedVolume: number;
// //     occupiedWeight: number;
// //     packageDetails: PackageDetails[];
// //     packageInfoDetails?: PackageInfoDetail[];
// //     occupiedPercent: number;
// //     vehicleDimensions: VehicleDimensions;
// // }

// // interface OrderDoc {
// //     dangerousGoods: string;
// // }

// // interface BillOfLading {
// //     find(arg0: (bol: BillOfLading) => boolean): unknown;
// //     package: string;
// //     // self_bill_url: string;
// //     loaction_ID: string;
// //     bol_to: string;
// //     self_bill_url?: string;
// // }

// // interface BillOfLadingEntry {
// //     bol_to: string;
// //     package: string;
// //     loaction_ID: string;
// //     self_bill_url: string;
// // }
// // interface Order {
// //     ord_id: number;
// //     order_ID: string;
// //     scenario_label: string;
// //     total_cost: string;
// //     allocations: Allocation[];
// //     total_weight: string;
// //     total_distance: string;
// //     start_loc_ID: string;
// //     end_loc_ID: string;
// //     allocated_packages: string[];
// //     unallocated_packages: string[];
// //     allocated_vehicles: string[];
// //     package_dest_radius: PackageDestinationRadius[];
// //     created_at: string;
// //     updated_at: string;
// //     order_docs: OrderDoc[];
// //     order_status: string;
// //     bill_of_lading: BillOfLadingEntry[] | null;
// // }

// // interface AllocationsProps {
// //     allocations: Allocation[];
// //     orderId: string;
// //     allocatedPackageDetails: PackageDetail[];
// //     from: string;
// //     orderStatus: string;
// //     order: Order;
// //     lrInvoices?: string[];
// // }
// // interface Product {
// //     prod_ID: string;
// //     quantity: number;
// //     package_info: string;
// // }
// // interface AdditionalInformation {
// //     reference_id: string;
// //     invoice: string;
// //     department: string;
// //     sales_order_number: string;
// //     po_number: string;
// //     attachment: string;
// // }
// // interface TaxInformation {
// //     sender_gst: string;
// //     receiver_gst: string;
// //     carrier_gst: string;
// //     self_transport: string;
// //     tax_rate: string;
// // }
// // interface PackageDetail {
// //     pac_id: string;
// //     pack_ID: string;
// //     package_status: string;
// //     ship_from: string;
// //     ship_to: string;
// //     pickup_date_time: string;
// //     dropoff_date_time: string;
// //     return_label: boolean;
// //     product_ID: Product[];
// //     bill_to: string;
// //     additional_info: AdditionalInformation;
// //     tax_info: TaxInformation;
// //     package_weight: string;

// // }
// // interface PackageInfoLine {
// //     pac_ID: string;
// //     prod_ID: string;
// //     quantity: number;
// //     package_info: PackageInfo;
// //     packagingDimensions: { widthM: number; heightM: number; lengthM: number };
// // }
// // interface PackageInfo {
// //     pac_ID: string;
// //     pack_width: string;
// //     package_id: number;
// //     pack_height: string;
// //     pack_length: string;
// //     pack_volume: string;
// //     dimensions_uom: string;
// //     pack_volume_uom: string;
// //     handling_unit_type: string;
// //     packaging_type_name: string;
// // }
// // interface PackageInfoDetail {
// //     lines: PackageInfoLine[];
// //     pkg_ID: string;
// // }

// // const LOR: React.FC<AllocationsProps> = ({ allocations, orderId, allocatedPackageDetails, orderStatus, order, lrInvoices }) => {
// //     console.log("LOR Component - Allocations:", allocations);
// //     console.log("LOR Component - Order ID:", orderId);
// //     console.log("LOR Component - Allocated Package Details:", allocatedPackageDetails);
// //     console.log("LOR Component - Order Status:", orderStatus);
// //     console.log("LOR Component - Order:", order);
// //     console.log("LOR Component - LR Invoices:", lrInvoices);
// //     const [editOrder] = useEditOrderMutation();
// //     const { data: locationsData } = useGetLocationMasterQuery({});
// //     const getAllLocations: Location[] = locationsData?.locations?.length > 0 ? locationsData.locations : [];
// //     const [imageUploading] = useImageUploadingMutation();
// //     const [isLoading, setIsLoading] = React.useState(false);
// //     const billOfLadding = order?.bill_of_lading || [];
// //     const pdfRefs = useRef<Record<string, HTMLDivElement | null>>({});


// //     const getLocationDetails = (loc_ID: string): string => {
// //         const location = getAllLocations.find((loc) => loc.loc_ID === loc_ID);
// //         if (!location) return "Location details not available";
// //         return [location.address_1, location.city, location.state, location.country, location.pincode].filter(Boolean).join(", ");
// //     };

// //     const getCustomerDetails = (loc_ID: string) => {
// //         const location = getAllLocations.find((loc) => loc.loc_ID === loc_ID);
// //         if (!location) return null;
// //         return {
// //             name: location.contact_name || "Name not available",
// //             email: location.contact_email || "Email not available",
// //             phone: location.contact_phone_number || "Phone not available",
// //             gst: location.gst || "N/A",
// //         };
// //     };

// //     const getLogoBase64 = async (): Promise<string> => {
// //         const response = await fetch("/TrukAppLogo.png");
// //         const blob = await response.blob();
// //         return new Promise((resolve) => {
// //             const reader = new FileReader();
// //             reader.onloadend = () => resolve(reader.result as string);
// //             reader.readAsDataURL(blob);
// //         });
// //     };

// //     const generateQRCode = async (url: string): Promise<string> => {
// //         return await QRCode.toDataURL(url, { width: 200, margin: 1 });
// //     };

// //     const generateAndUploadPDF = async (
// //         ref: HTMLDivElement,
// //         fileName: string,
// //         shipToId: string,
// //         orderStatus: string
// //     ) => {
// //         setIsLoading(true);
// //         const pdf = new jsPDF("p", "mm", "a4");
// //         const logoBase64 = await getLogoBase64();

// //         const canvas = await html2canvas(ref, { scale: 2, useCORS: true });
// //         const imgData = canvas.toDataURL("image/png");
// //         const pdfWidth = pdf.internal.pageSize.getWidth();
// //         const imgHeight = (canvas.height * pdfWidth) / canvas.width;

// //         // pdf.addImage(logoBase64, "PNG", 10, 5, 30, 15);
// //         pdf.addImage(logoBase64, "PNG", 10, 5, 50, 15);
// //         pdf.addImage(imgData, "PNG", 0, 25, pdfWidth, imgHeight);

// //         const pdfBlob = pdf.output("blob");
// //         const formData = new FormData();
// //         formData.append("image", pdfBlob, fileName);

// //         const uploadResponse = await imageUploading(formData).unwrap();
// //         const pdfUrl = uploadResponse?.imageUrl;

// //         const qrCode = await generateQRCode(pdfUrl);

// //         const finalPDF = new jsPDF("p", "mm", "a4");
// //         // finalPDF.addImage(logoBase64, "PNG", 10, 5, 30, 15);
// //         finalPDF.addImage(logoBase64, "PNG", 10, 5, 50, 15);
// //         finalPDF.addImage(qrCode, "PNG", 160, 5, 20, 20);
// //         finalPDF.addImage(imgData, "PNG", 0, 25, pdfWidth, imgHeight);

// //         const finalBlob = finalPDF.output("blob");
// //         const finalFormData = new FormData();
// //         finalFormData.append("image", finalBlob, fileName);

// //         const finalUploadResponse = await imageUploading(finalFormData).unwrap();
// //         const finalPdfUrl = finalUploadResponse?.imageUrl;

// //         let bol_to = "";
// //         if (orderStatus === "self assigned") bol_to = "self";
// //         else if (orderStatus === "carrier assignment") bol_to = "carrier";
// //         else if (orderStatus === "bidding") bol_to = "bidding";

// //         await editOrder({
// //             body: {
// //                 bill_of_lading: [
// //                     {
// //                         package: "",
// //                         self_bill_url: finalPdfUrl,
// //                         loaction_ID: shipToId,
// //                         bol_to: bol_to,
// //                     },
// //                 ],
// //             },
// //             params: { order_ID: orderId },
// //         }).unwrap();

// //         setIsLoading(false);
// //     };

// //     return (
// //         <>
// //             <Backdrop sx={{ color: "#ffffff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
// //                 <CircularProgress color="inherit" />
// //             </Backdrop>

// //             {allocations.map((allocation, allocIndex) => {
// //                 const vehiclePackages = allocatedPackageDetails.filter((pkg) => allocation.packages.includes(pkg.pack_ID));
// //                 const packagesByShipTo: Record<string, PackageDetail[]> = {};

// //                 vehiclePackages.forEach((pkg) => {
// //                     if (pkg.ship_to) {
// //                         if (!packagesByShipTo[pkg.ship_to]) packagesByShipTo[pkg.ship_to] = [];
// //                         packagesByShipTo[pkg.ship_to].push(pkg);
// //                     }
// //                 });

// //                 return Object.entries(packagesByShipTo).map(([shipToId, pkgList], index) => {
// //                     const shipperPkg = pkgList[0];
// //                     const shipperDetails = getCustomerDetails(shipperPkg?.ship_from ?? "");
// //                     const consigneeDetails = getCustomerDetails(shipToId);
// //                     const billToDetails = getCustomerDetails(shipperPkg?.bill_to ?? "");
// //                     // const existingBOL = billOfLadding.find((bol: BillOfLading) => bol.loaction_ID === shipToId);
// //                     const existingBOL = billOfLadding.find(
// //                         (bol: BillOfLadingEntry) => bol.loaction_ID === shipToId
// //                     );

// //                     const filteredPackageInfo = allocation.packageInfoDetails?.filter((pkg) =>
// //                         pkgList.some((p) => p.pack_ID === pkg.pkg_ID)
// //                     );

// //                     return (
// //                         <Box key={`${allocIndex}-${index}`} mt={4}>
// //                             <Box textAlign="right" mb={1}>
// //                                 {existingBOL ? (
// //                                     <Button
// //                                         variant="outlined"
// //                                         color="secondary"
// //                                         // onClick={() => window.open(existingBOL.self_bill_url, "_blank")}
// //                                         onClick={() => existingBOL && window.open(existingBOL.self_bill_url, "_blank")}
// //                                     >
// //                                         ⬇ Download BOL
// //                                     </Button>
// //                                 ) : (
// //                                     <Button
// //                                         variant="contained"
// //                                         color="primary"
// //                                         onClick={() =>
// //                                             pdfRefs.current[shipToId] &&
// //                                             generateAndUploadPDF(
// //                                                 pdfRefs.current[shipToId]!,
// //                                                 `BOL-${allocation.vehicle_ID}_${shipToId}.pdf`,
// //                                                 shipToId,
// //                                                 orderStatus
// //                                             )
// //                                         }
// //                                     >
// //                                         ⬆ Generate & Upload BOL
// //                                     </Button>
// //                                 )}
// //                             </Box>

// //                             {/* Assign ref dynamically */}
// //                             {/* <Paper
// //                                 // ref={(el) => (pdfRefs.current[shipToId] = el)}
// //                                 ref={pdfRefs}
// //                                 sx={{ p: 3, backgroundColor: "#fff", border: "1px solid #000", fontSize: "12px" }}
// //                             > */}
// //                             <Paper
// //                                 ref={(el) => {
// //                                     pdfRefs.current[shipToId] = el;
// //                                 }}
// //                                 sx={{ p: 3, backgroundColor: "#fff", border: "1px solid #000", fontSize: "12px" }}
// //                             >

// //                                 {/* Header */}
// //                                 <Box textAlign="center" mb={1}>
// //                                     <Typography variant="h6" sx={{ fontWeight: "bold" }}>BILL OF LADING</Typography>
// //                                 </Box>
// //                                 <Divider sx={{ my: 1 }} />

// //                                 {/* Header Details */}
// //                                 <Grid container spacing={2}>
// //                                     <Grid item xs={4}><Typography>Sales Order: <strong>{shipperPkg?.additional_info?.sales_order_number || "-"}</strong></Typography></Grid>
// //                                     <Grid item xs={4}><Typography>Cust. PO No: <strong>{shipperPkg?.additional_info?.po_number || "-"}</strong></Typography></Grid>
// //                                     <Grid item xs={4}><Typography>Delivery: <strong>{shipperPkg?.pac_id || "-"}</strong></Typography></Grid>
// //                                 </Grid>

// //                                 {/* Shipper / Consignee / Bill To */}
// //                                 <Grid container spacing={2} sx={{ mt: 1 }}>
// //                                     <Grid item xs={4}>
// //                                         <Typography variant="subtitle2">Shipper:</Typography>
// //                                         <Typography>{shipperDetails?.name}</Typography>
// //                                         <Typography>{getLocationDetails(shipperPkg?.ship_from)}</Typography>
// //                                     </Grid>
// //                                     <Grid item xs={4}>
// //                                         <Typography variant="subtitle2">Consigned To:</Typography>
// //                                         <Typography>{consigneeDetails?.name}</Typography>
// //                                         <Typography>{getLocationDetails(shipToId)}</Typography>
// //                                     </Grid>
// //                                     <Grid item xs={4}>
// //                                         <Typography variant="subtitle2">Bill To / Invoice To:</Typography>
// //                                         <Typography>{billToDetails?.name || "—"}</Typography>
// //                                         <Typography>{billToDetails ? getLocationDetails(shipperPkg?.bill_to) : "—"}</Typography>
// //                                     </Grid>
// //                                 </Grid>

// //                                 {/* Carrier Info */}
// //                                 <Grid container spacing={2} sx={{ mt: 1 }}>
// //                                     {/* <Grid item xs={6}>
// //                                          <Typography>Carrier Name: {assignedOrder?.transporter_name || "-"}</Typography> 
// //                                          <Typography>Carrier ID: {allocation.vehicle_ID || "-"}</Typography>
// //                                     </Grid> */}
// //                                     <Grid item xs={6}>
// //                                         {/* <Typography>Ship Date: {shipperPkg?.pickup_date_time || "-"}</Typography> */}
// //                                         <Typography>
// //                                             Ship Date & Time: {shipperPkg?.pickup_date_time
// //                                                 ? new Intl.DateTimeFormat("en-GB", {
// //                                                     day: "2-digit",
// //                                                     month: "2-digit",
// //                                                     year: "numeric",
// //                                                     hour: "numeric",
// //                                                     minute: "numeric",
// //                                                     hour12: true
// //                                                 }).format(new Date(shipperPkg.pickup_date_time))
// //                                                 : "-"}
// //                                         </Typography>

// //                                         <Typography>BOL No: {shipperPkg?.pac_id || "-"}</Typography>
// //                                     </Grid>
// //                                 </Grid>

// //                                 {/* Goods Table */}
// //                                 <Box mt={2}>
// //                                     <Paper sx={{ border: "1px solid #000" }}>
// //                                         <Grid container sx={{ borderBottom: "1px solid #000", fontWeight: "bold", p: 2, fontSize: "15px" }}>
// //                                             {/* <Grid item xs={2}>Package ID</Grid> */}
// //                                             <Grid item xs={3}>Description</Grid>
// //                                             <Grid item xs={2}>Quantity</Grid>
// //                                             <Grid item xs={2}>Weight</Grid>
// //                                             <Grid item xs={3}>No. of Packages</Grid>
// //                                         </Grid>
// //                                         {filteredPackageInfo?.map((pkg) =>
// //                                             pkg.lines.map((line, j) => {
// //                                                 const packageDetail = allocation.packageDetails?.find(
// //                                                     (p) => p.pack_ID === pkg.pkg_ID
// //                                                 );
// //                                                 const packageWeight = packageDetail?.package_weight || allocation.occupiedWeight || "-";
// //                                                 const weightUom = packageDetail?.weight_uom || "kg";
// //                                                 return (
// //                                                     <Grid container key={`${line.pac_ID}-${j}`} sx={{ p: 2, borderBottom: "1px solid #ddd", fontSize: "15px" }}>
// //                                                         {/* <Grid item xs={2}>{line.package_info?.pac_ID || "-"}</Grid> */}
// //                                                         <Grid item xs={3}>{line.package_info?.handling_unit_type || line.package_info?.packaging_type_name || "-"}</Grid>
// //                                                         <Grid item xs={2}>{line.quantity}</Grid>
// //                                                         <Grid item xs={2}>{packageWeight !== "-" ? `${packageWeight} ${weightUom}` : "-"}</Grid>
// //                                                         <Grid item xs={3}>1</Grid>
// //                                                     </Grid>
// //                                                 );
// //                                             })
// //                                         )}
// //                                     </Paper>
// //                                 </Box>

// //                                 {/* Declaration */}
// //                                 <Box mt={2} sx={{ border: "1px solid #000", p: 2 }}>
// //                                     <Typography sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}>
// //                                         DRIVE WILL NOT REIMBURSE CARRIER FOR CONSIGNEE ADDED ACCESSORIAL CHARGES WITHOUT PRIOR CONSENT
// //                                     </Typography>
// //                                     <Typography sx={{ fontSize: "11px", mb: 2 }}>
// //                                         This is to certify that the here-in named materials are properly classified, described, packaged, marked, and labelled,
// //                                         and are in proper condition for transportation according to applicable regulations of the Department of Transportation.
// //                                     </Typography>
// //                                     <Grid container spacing={2} sx={{ mb: 2 }}>
// //                                         <Grid item xs={6}><Typography>Shipper Signature: ___________________________</Typography></Grid>
// //                                         <Grid item xs={6}><Typography>Date: ___________________________</Typography></Grid>
// //                                     </Grid>
// //                                     <Grid container spacing={2} sx={{ mb: 2 }}>
// //                                         <Grid item xs={6}><Typography>Driver Signature: ___________________________</Typography></Grid>
// //                                         <Grid item xs={6}><Typography>Date: ___________________________</Typography></Grid>
// //                                     </Grid>
// //                                     <Grid container spacing={2} sx={{ mb: 2 }}>
// //                                         <Grid item xs={6}><Typography>Driver License #: ___________________________</Typography></Grid>
// //                                         <Grid item xs={6}><Typography># of Pallets: ______  &nbsp;&nbsp;  # of Cartons: ______</Typography></Grid>
// //                                     </Grid>
// //                                     <Grid container spacing={2} sx={{ mb: 2 }}>
// //                                         <Grid item xs={8}><Typography>All items received in good condition: [ ] Yes &nbsp;&nbsp; [ ] No</Typography></Grid>
// //                                         <Grid item xs={4}><Typography>Date: ___________________________</Typography></Grid>
// //                                     </Grid>
// //                                     <Typography>Customer Signature: ___________________________  &nbsp;&nbsp; Print Name: ___________________________</Typography>
// //                                 </Box>
// //                             </Paper>
// //                         </Box>
// //                     );
// //                 });
// //             })}
// //         </>
// //     );
// // };

// // export default LOR;




// // import React, { useRef, useState } from "react";
// // import { Typography, Paper, Grid, Divider, Box, Button, Backdrop, CircularProgress } from "@mui/material";
// // import jsPDF from "jspdf";
// // import html2canvas from "html2canvas";

// // const Cell = ({ children, sx = {}, ...props }) => (
// //     <Box
// //         {...props}
// //         sx={{
// //             border: "1px solid #333",
// //             px: 1.5,
// //             py: 0.7,
// //             fontSize: "13px",
// //             ...sx
// //         }}
// //     >
// //         {children}
// //     </Box>
// // );

// // const LOR = ({
// //     allocations,
// //     orderId,
// //     allocatedPackageDetails,
// //     orderStatus,
// //     order,
// //     lrInvoices,
// //     locationsData
// // }) => {
// //     const [isLoading, setIsLoading] = useState(false);
// //     const pdfRefs = useRef({});

// //     console.log("allocations: ", allocations)
// //     console.log("orderId: ", orderId)
// //     console.log("allocatedPackageDetails: ", allocatedPackageDetails)
// //     console.log("order: ", order)
// //     console.log("lrInvoices: ", lrInvoices)
// //     const getLocationDetails = (loc_ID) => {
// //         const location = (locationsData?.locations || []).find((loc) => loc.loc_ID === loc_ID);
// //         if (!location) return "Location details not available";
// //         return [
// //             location.address_1,
// //             location.city,
// //             location.state,
// //             location.country,
// //             location.pincode,
// //         ].filter(Boolean).join(", ");
// //     };

// //     const getLocationCode = (loc_ID) => {
// //         const location = (locationsData?.locations || []).find((loc) => loc.loc_ID === loc_ID);
// //         return location?.city || "-";
// //     };
// //     const getFacilityCode = (loc_ID) => {
// //         const location = (locationsData?.locations || []).find((loc) => loc.loc_ID === loc_ID);
// //         return location?.facility_code || "-";
// //     };

// //     const handlePDFDownload = async (ref, fileName) => {
// //         setIsLoading(true);
// //         const pdf = new jsPDF("l", "px", [1322, 432]); // Match screenshot size
// //         const canvas = await html2canvas(ref, { scale: 2, useCORS: true });
// //         const imgData = canvas.toDataURL("image/png");
// //         pdf.addImage(imgData, "PNG", 0, 0, 1322, 432);
// //         pdf.save(fileName);
// //         setIsLoading(false);
// //     };

// //     return (
// //         <>
// //             <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
// //                 <CircularProgress color="inherit" />
// //             </Backdrop>
// //             {allocations.map((allocation, allocIndex) => {
// //                 const vehiclePackages = allocatedPackageDetails.filter((pkg) => allocation.packages.includes(pkg.pack_ID));
// //                 const packagesByShipTo = {};
// //                 vehiclePackages.forEach((pkg) => {
// //                     if (pkg.ship_to) {
// //                         if (!packagesByShipTo[pkg.ship_to]) packagesByShipTo[pkg.ship_to] = [];
// //                         packagesByShipTo[pkg.ship_to].push(pkg);
// //                     }
// //                 });
// //                 return Object.entries(packagesByShipTo).map(([shipToId, pkgList], index) => {
// //                     const shipperPkg = pkgList[0];
// //                     const lrData = lrInvoices?.find(lr => lr.packages_in_data?.[0]?.pack_ID === shipperPkg.pack_ID) || {};
// //                     const productRows = (shipperPkg?.product_lines || []).map((pl, idx) => ({
// //                         slNo: idx + 1,
// //                         invoice: lrData?.invoice ?? "-",
// //                         ewb: lrData?.e_way ?? "-",
// //                         details: pl.package_info ?? "-",
// //                         count: pl.quantity ?? "-",
// //                         deedWeight: shipperPkg?.package_weight ?? "-",
// //                         chargeableWeight: allocation?.chargeableWeight ?? "-",
// //                         value: "10000" // You can update this as per your data
// //                     }));

// //                     const totalCount = productRows.reduce((a, b) => a + Number(b.count || 0), 0);
// //                     const totalDeedWeight = productRows.reduce((a, b) => a + Number(b.deedWeight || 0), 0);
// //                     const totalChargeableWeight = productRows.reduce((a, b) => a + Number(b.chargeableWeight || 0), 0);
// //                     const totalValue = productRows.reduce((a, b) => a + Number(b.value || 0), 0);

// //                     return (
// //                         <Box key={`${allocIndex}-${index}`} mt={4}>
// //                             <Box textAlign="center" mb={1}>
// //                                 <Button
// //                                     variant="contained"
// //                                     color="primary"
// //                                     onClick={() => pdfRefs.current[shipToId] && handlePDFDownload(pdfRefs.current[shipToId], `LOR-${orderId}-${shipToId}.pdf`)}
// //                                     sx={{ mx: 1, px: 4, bgcolor: "#334eaf", fontWeight: 700 }}
// //                                 >
// //                                     PRINT PDF
// //                                 </Button>
// //                                 <Button variant="outlined" sx={{ mx: 1, px: 4 }} onClick={() => window.close()}>
// //                                     CLOSE
// //                                 </Button>
// //                             </Box>
// //                             <Paper
// //                                 ref={(el) => {
// //                                     pdfRefs.current[shipToId] = el;
// //                                 }}
// //                                 sx={{
// //                                     p: 0.7,
// //                                     border: "1px solid #222",
// //                                     minWidth: 1300,
// //                                     maxWidth: 1322,
// //                                     margin: "0 auto",
// //                                     fontFamily: "Arial, 'Liberation Sans', sans-serif"
// //                                 }}
// //                             >
// //                                 {/* Logo and Header */}
// //                                 <Grid container>
// //                                     <Grid item xs={2.5}><img alt="logo" src="https://shadowfax.in/wp-content/uploads/2023/07/shadowfax-logo.svg" style={{ height: 32 }} /></Grid>
// //                                     <Grid item xs={7} sx={{ textAlign: "center" }}>
// //                                         <Typography fontWeight={700} fontSize="15px">Shadowfax Technologies Pvt. Ltd.</Typography>
// //                                         <Typography fontSize={13}>GSTIN: 07AAVCS6967K1ZS &nbsp;|&nbsp; PAN: AAVCS6967K</Typography>
// //                                     </Grid>
// //                                     <Grid item xs={2.5} sx={{ textAlign: "right", fontSize: 13 }}>
// //                                         <Typography>Order Reference No.: <b>{order?.order_ID || "-"}</b></Typography>
// //                                         <Typography>Booking Date: <b>{order?.created_at?.split('T')[0] || "-"}</b></Typography>
// //                                         {/* Barcode/lor number block */}
// //                                         <Typography fontWeight={700} fontSize="12px">LOR NO.</Typography>
// //                                         <Typography fontSize={13}>SFLR245423CON</Typography>
// //                                     </Grid>
// //                                 </Grid>
// //                                 {/* Top header table */}
// //                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
// //                                     <Grid container>
// //                                         <Cell sx={{ width: "14%" }}>MODE</Cell>
// //                                         <Cell sx={{ width: "20%" }}>LOR TYPE</Cell>
// //                                         <Cell sx={{ width: "16%" }}>DELIVERY TYPE</Cell>
// //                                         <Cell sx={{ width: "18%" }}>DELIVERY SLOT</Cell>
// //                                         <Cell sx={{ width: "32%" }}>SIGNATURE & STAMP OF CONSIGNEE</Cell>
// //                                     </Grid>
// //                                     <Grid container>
// //                                         <Cell sx={{ width: "14%" }}>Surface</Cell>
// //                                         <Cell sx={{ width: "20%" }}>CONSIGNER COPY</Cell>
// //                                         <Cell sx={{ width: "16%" }}>Standard</Cell>
// //                                         <Cell sx={{ width: "18%" }}>ALL DAY</Cell>
// //                                         <Cell sx={{ width: "32%" }}></Cell>
// //                                     </Grid>
// //                                 </Grid>
// //                                 {/* Consignor/Consignee table */}
// //                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
// //                                     <Cell sx={{ width: "50%" }}>
// //                                         <Typography fontWeight={700} fontSize={13}>CONSIGNER NAME & ADDRESS</Typography>
// //                                         <Typography fontSize={13}>
// //                                             Bengaluru - Connect B2B Test<br />
// //                                             Bengaluru, Whitefield for Test, Bengaluru, Whitefield for Test, Bengaluru
// //                                         </Typography>
// //                                     </Cell>
// //                                     <Cell sx={{ width: "50%" }}>
// //                                         <Typography fontWeight={700} fontSize={13}>CONSIGNEE NAME & ADDRESS</Typography>
// //                                         <Typography fontSize={13}>
// //                                             Gurgaon - Test Connect B2B<br />
// //                                             Gurgaon, Udyog Vihar Test, Gurgaon, Udyog Vihar Test, Gurgaon
// //                                         </Typography>
// //                                     </Cell>
// //                                 </Grid>
// //                                 {/* Table for goods */}
// //                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
// //                                     {/* Header row */}
// //                                     <Cell sx={{ width: "8%" }}>SL No.</Cell>
// //                                     <Cell sx={{ width: "18%" }}>Invoice Number</Cell>
// //                                     <Cell sx={{ width: "18%" }}>EWB Number</Cell>
// //                                     <Cell sx={{ width: "18%" }}>Product Details</Cell>
// //                                     <Cell sx={{ width: "8%" }}>Count</Cell>
// //                                     <Cell sx={{ width: "8%" }}>Dead Weight</Cell>
// //                                     <Cell sx={{ width: "12%" }}>Chargable Weight</Cell>
// //                                     <Cell sx={{ width: "10%" }}>Value</Cell>
// //                                     {/* Data row */}
// //                                     <Cell sx={{ width: "8%" }}>1</Cell>
// //                                     <Cell sx={{ width: "18%" }}>Testinv</Cell>
// //                                     <Cell sx={{ width: "18%" }}></Cell>
// //                                     <Cell sx={{ width: "18%" }}>testp</Cell>
// //                                     <Cell sx={{ width: "8%" }}>2</Cell>
// //                                     <Cell sx={{ width: "8%" }}>1</Cell>
// //                                     <Cell sx={{ width: "12%" }}>1</Cell>
// //                                     <Cell sx={{ width: "10%" }}>10000</Cell>
// //                                     {/* Total row */}
// //                                     <Cell sx={{ width: "26%", borderTop: "2px solid #333" }}>TOTAL</Cell>
// //                                     <Cell sx={{ width: "8%" }}>2</Cell>
// //                                     <Cell sx={{ width: "8%" }}>1</Cell>
// //                                     <Cell sx={{ width: "12%" }}>1</Cell>
// //                                     <Cell sx={{ width: "10%" }}>10000</Cell>
// //                                     <Cell sx={{ width: "36%" }}></Cell>
// //                                 </Grid>
// //                                 {/* Declaration */}
// //                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
// //                                     <Cell sx={{ width: "100%" }}>
// //                                         <b>DECLARATION BY THE CONSIGNER</b>
// //                                         <br />
// //                                         I hereby solemnly declare that all the particulars mentioned on this consignment note are true and correct and I have read, understood & accept all the terms and conditions mentioned in agreement.
// //                                     </Cell>
// //                                 </Grid>
// //                                 {/* Source, destination, signature */}
// //                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
// //                                     <Cell sx={{ width: "24%" }}>
// //                                         <b>SOURCE</b><br />
// //                                         BLR<br />
// //                                         Facility Code:<br />
// //                                         L001941
// //                                     </Cell>
// //                                     <Cell sx={{ width: "24%" }}>
// //                                         <b>DESTINATION</b><br />
// //                                         GGN<br />
// //                                         Facility Code:<br />
// //                                         L001939
// //                                     </Cell>
// //                                     <Cell sx={{ width: "52%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
// //                                         <Typography>Signature of Consigner</Typography>
// //                                         <Typography>Signature of Transporter</Typography>
// //                                     </Cell>
// //                                 </Grid>
// //                             </Paper>
// //                         </Box>
// //                     );
// //                 });
// //             })}
// //         </>
// //     );
// // };

// // export default LOR;


// import React, { useRef, useState } from "react";
// import { Typography, Paper, Grid, Box, Button, Backdrop, CircularProgress } from "@mui/material";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const Cell = ({ children, sx = {}, ...props }) => (
//     <Box
//         {...props}
//         sx={{
//             border: "1px solid #333",
//             px: 1.5,
//             py: 0.7,
//             fontSize: "13px",
//             ...sx
//         }}
//     >
//         {children}
//     </Box>
// );

// const LOR = ({
//     allocations,
//     orderId,
//     allocatedPackageDetails,
//     order,
//     lrInvoices,
//     locationsData
// }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const pdfRefs = useRef({});

//     // Get location details from location master
//     const getLocationDetails = (loc_ID) => {
//         const location = (locationsData?.locations || []).find((loc) => loc.loc_ID === loc_ID);
//         if (!location) return "Location details not available";
//         return [
//             location.locationDescription,
//             location.address_1,
//             location.city,
//             location.state,
//             location.country,
//             location.pincode,
//         ].filter(Boolean).join(", ");
//     };

//     const getLocationCode = (loc_ID) => {
//         const location = (locationsData?.locations || []).find((loc) => loc.loc_ID === loc_ID);
//         return location?.city || "-";
//     };
//     const getFacilityCode = (loc_ID) => {
//         const location = (locationsData?.locations || []).find((loc) => loc.loc_ID === loc_ID);
//         return location?.facility_code || "-";
//     };

//     const handlePDFDownload = async (ref, fileName) => {
//         setIsLoading(true);
//         const pdf = new jsPDF("l", "px", [1322, 432]);
//         const canvas = await html2canvas(ref, { scale: 2, useCORS: true });
//         const imgData = canvas.toDataURL("image/png");
//         pdf.addImage(imgData, "PNG", 0, 0, 1322, 432);
//         pdf.save(fileName);
//         setIsLoading(false);
//     };

//     // Map allocations and packages
//     return (
//         <>
//             <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
//                 <CircularProgress color="inherit" />
//             </Backdrop>
//             {allocations.map((allocation, allocIndex) => {
//                 const vehiclePackages = allocatedPackageDetails.filter((pkg) => allocation.packages.includes(pkg.pack_ID));
//                 const packagesByShipTo = {};
//                 vehiclePackages.forEach((pkg) => {
//                     if (pkg.ship_to) {
//                         if (!packagesByShipTo[pkg.ship_to]) packagesByShipTo[pkg.ship_to] = [];
//                         packagesByShipTo[pkg.ship_to].push(pkg);
//                     }
//                 });
//                 return Object.entries(packagesByShipTo).map(([shipToId, pkgList], index) => {
//                     const shipperPkg = pkgList[0];
//                     const consignorLoc = shipperPkg?.ship_from;
//                     const consigneeLoc = shipToId;
//                     const sourceLoc = shipperPkg?.ship_from;
//                     const destLoc = shipToId;

//                     // Build product rows dynamically
//                     const productRows = (shipperPkg?.product_lines || []).map((pl, idx) => {
//                         // Find Invoice/EWB from lrInvoices if available
//                         const lrData = lrInvoices?.find(lr => lr.packages_in_data?.[0]?.pack_ID === shipperPkg.pack_ID) || {};
//                         return {
//                             slNo: idx + 1,
//                             invoice: lrData?.invoice ?? shipperPkg?.additional_info?.invoice ?? "-",
//                             ewb: lrData?.e_way ?? shipperPkg?.additional_info?.ewb_number ?? "",
//                             details: pl.package_info ?? "-",
//                             count: pl.quantity ?? "-",
//                             deedWeight: shipperPkg?.package_weight ?? allocation?.occupiedWeight ?? "-",
//                             chargeableWeight: allocation?.chargeableWeight ?? "-",
//                             value: "10000" // Replace or map with your package value if available
//                         };
//                     });

//                     const totalCount = productRows.reduce((a, b) => a + Number(b.count || 0), 0);
//                     const totalDeedWeight = productRows.reduce((a, b) => a + Number(b.deedWeight || 0), 0);
//                     const totalChargeableWeight = productRows.reduce((a, b) => a + Number(b.chargeableWeight || 0), 0);
//                     const totalValue = productRows.reduce((a, b) => a + Number(b.value || 0), 0);

//                     return (
//                         <Box key={`${allocIndex}-${index}`} mt={2}>
//                             <Box textAlign="center" mb={1}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={() => pdfRefs.current[shipToId] && handlePDFDownload(pdfRefs.current[shipToId], `LOR-${orderId}-${shipToId}.pdf`)}
//                                     sx={{ mx: 1, px: 4, bgcolor: "#334eaf", fontWeight: 700 }}
//                                 >
//                                     PRINT PDF
//                                 </Button>
//                                 <Button variant="outlined" sx={{ mx: 1, px: 4 }} onClick={() => window.close()}>
//                                     CLOSE
//                                 </Button>
//                             </Box>
//                             <Paper
//                                 ref={(el) => {
//                                     pdfRefs.current[shipToId] = el;
//                                 }}
//                                 sx={{
//                                     p: 0.7,
//                                     border: "1px solid #222",
//                                     minWidth: 1300,
//                                     maxWidth: 1322,
//                                     margin: "0 auto",
//                                     fontFamily: "Arial, 'Liberation Sans', sans-serif"
//                                 }}
//                             >
//                                 {/* Header */}
//                                 <Grid container>
//                                     <Grid item xs={2.5}><img alt="logo" src="https://shadowfax.in/wp-content/uploads/2023/07/shadowfax-logo.svg" style={{ height: 32 }} /></Grid>
//                                     <Grid item xs={7} sx={{ textAlign: "center" }}>
//                                         <Typography fontWeight={700} fontSize="15px">Shadowfax Technologies Pvt. Ltd.</Typography>
//                                         <Typography fontSize={13}>GSTIN: 07AAVCS6967K1ZS &nbsp;|&nbsp; PAN: AAVCS6967K</Typography>
//                                     </Grid>
//                                     <Grid item xs={2.5} sx={{ textAlign: "right", fontSize: 13 }}>
//                                         <Typography>Order Reference No.: <b>{order?.order_ID || "-"}</b></Typography>
//                                         <Typography>Booking Date: <b>{order?.created_at?.split('T')[0] || "-"}</b></Typography>
//                                         <Typography fontWeight={700} fontSize="12px">LOR NO.</Typography>
//                                         <Typography fontSize={13}>{shipperPkg?.pac_id ?? "-"}</Typography>
//                                     </Grid>
//                                 </Grid>
//                                 {/* Top info table */}
//                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
//                                     <Grid container>
//                                         <Cell sx={{ width: "14%" }}>MODE</Cell>
//                                         <Cell sx={{ width: "20%" }}>LOR TYPE</Cell>
//                                         <Cell sx={{ width: "16%" }}>DELIVERY TYPE</Cell>
//                                         <Cell sx={{ width: "18%" }}>DELIVERY SLOT</Cell>
//                                         <Cell sx={{ width: "32%" }}>SIGNATURE & STAMP OF CONSIGNEE</Cell>
//                                     </Grid>
//                                     <Grid container>
//                                         <Cell sx={{ width: "14%" }}>Surface</Cell>
//                                         <Cell sx={{ width: "20%" }}>CONSIGNER COPY</Cell>
//                                         <Cell sx={{ width: "16%" }}>Standard</Cell>
//                                         <Cell sx={{ width: "18%" }}>ALL DAY</Cell>
//                                         <Cell sx={{ width: "32%" }}></Cell>
//                                     </Grid>
//                                 </Grid>
//                                 {/* Consignor/Consignee table */}
//                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
//                                     {/* <Cell sx={{ width: "50%" }}>
//                                         <Typography fontWeight={700} fontSize={13}>CONSIGNER NAME & ADDRESS</Typography>
//                                         <Typography fontSize={13}>{getLocationDetails(consignorLoc)}</Typography>
//                                     </Cell>
//                                     <Cell sx={{ width: "50%" }}>
//                                         <Typography fontWeight={700} fontSize={13}>CONSIGNEE NAME & ADDRESS</Typography>
//                                         <Typography fontSize={13}>{getLocationDetails(consigneeLoc)}</Typography>
//                                     </Cell> */}
//                                     <Cell sx={{ width: "50%" }}>
//                                         <Typography fontWeight={700} fontSize={13}>CONSIGNER NAME & ADDRESS</Typography>
//                                         <Typography fontSize={13}>{getLocationDetails(shipperPkg?.ship_from)}</Typography>
//                                     </Cell>
//                                     <Cell sx={{ width: "50%" }}>
//                                         <Typography fontWeight={700} fontSize={13}>CONSIGNEE NAME & ADDRESS</Typography>
//                                         <Typography fontSize={13}>{getLocationDetails(shipToId)}</Typography>
//                                     </Cell>

//                                 </Grid>
//                                 {/* Table for goods */}
//                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
//                                     {/* Header row */}
//                                     <Cell sx={{ width: "8%" }}>SL No.</Cell>
//                                     <Cell sx={{ width: "18%" }}>Invoice Number</Cell>
//                                     <Cell sx={{ width: "18%" }}>EWB Number</Cell>
//                                     <Cell sx={{ width: "18%" }}>Product Details</Cell>
//                                     <Cell sx={{ width: "8%" }}>Count</Cell>
//                                     <Cell sx={{ width: "8%" }}>Dead Weight</Cell>
//                                     <Cell sx={{ width: "12%" }}>Chargable Weight</Cell>
//                                     <Cell sx={{ width: "10%" }}>Value</Cell>
//                                     {/* Data rows */}
//                                     {productRows.map((row, idx) => (
//                                         <React.Fragment key={idx}>
//                                             <Cell sx={{ width: "8%" }}>{row.slNo}</Cell>
//                                             <Cell sx={{ width: "18%" }}>{row.invoice}</Cell>
//                                             <Cell sx={{ width: "18%" }}>{row.ewb}</Cell>
//                                             <Cell sx={{ width: "18%" }}>{row.details}</Cell>
//                                             <Cell sx={{ width: "8%" }}>{row.count}</Cell>
//                                             <Cell sx={{ width: "8%" }}>{row.deedWeight}</Cell>
//                                             <Cell sx={{ width: "12%" }}>{row.chargeableWeight}</Cell>
//                                             <Cell sx={{ width: "10%" }}>{row.value}</Cell>
//                                         </React.Fragment>
//                                     ))}
//                                     {/* Total row */}
//                                     <Cell sx={{ width: "26%", borderTop: "2px solid #333" }}>TOTAL</Cell>
//                                     <Cell sx={{ width: "8%" }}>{totalCount}</Cell>
//                                     <Cell sx={{ width: "8%" }}>{totalDeedWeight}</Cell>
//                                     <Cell sx={{ width: "12%" }}>{totalChargeableWeight}</Cell>
//                                     <Cell sx={{ width: "10%" }}>{totalValue}</Cell>
//                                     <Cell sx={{ width: "36%" }}></Cell>
//                                 </Grid>
//                                 {/* Declaration */}
//                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
//                                     <Cell sx={{ width: "100%" }}>
//                                         <b>DECLARATION BY THE CONSIGNER</b>
//                                         <br />
//                                         I hereby solemnly declare that all the particulars mentioned on this consignment note are true and correct and I have read, understood & accept all the terms and conditions mentioned in agreement.
//                                     </Cell>
//                                 </Grid>
//                                 {/* Source, destination, signature */}
//                                 <Grid container sx={{ border: "1px solid #333", mt: 1 }}>
//                                     <Cell sx={{ width: "24%" }}>
//                                         <b>SOURCE</b><br />
//                                         {getLocationCode(sourceLoc)}<br />
//                                         Facility Code:<br />
//                                         {getFacilityCode(sourceLoc)}
//                                     </Cell>
//                                     <Cell sx={{ width: "24%" }}>
//                                         <b>DESTINATION</b><br />
//                                         {getLocationCode(destLoc)}<br />
//                                         Facility Code:<br />
//                                         {getFacilityCode(destLoc)}
//                                     </Cell>
//                                     <Cell sx={{ width: "52%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
//                                         <Typography>Signature of Consigner</Typography>
//                                         <Typography>Signature of Transporter</Typography>
//                                     </Cell>
//                                 </Grid>
//                             </Paper>
//                         </Box>
//                     );
//                 });
//             })}
//         </>
//     );
// };

// export default LOR;



import React, { useRef, useState, useEffect } from "react";
import { Typography, Paper, Grid, Box, Button, Backdrop, CircularProgress, Dialog, DialogActions, Checkbox, DialogContent, FormControlLabel, DialogTitle, IconButton } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useGetAllPackagesForOrderQuery, useGetAllProductsQuery, useGetLocationMasterQuery } from "@/api/apiSlice";
import JsBarcode from "jsbarcode";
 
const Cell = ({ children, sx = {}, ...props }) => (
    <Box
        {...props}
        sx={{
            border: "1px solid #333",
            px: 1.5,
            py: 0.7,
            fontSize: "13px",
            ...sx
        }}
    >
        {children}
    </Box>
);

const LOR = ({
    allocations,
    orderId,
    allocatedPackageDetails,
    order,
    lrInvoices,
    // locationsData
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
		const [selectedCopy, setSelectedCopy] = useState("CONSIGNOR COPY");
    const pdfRefs = useRef({});
    const [currentShipToId, setCurrentShipToId] = useState(null);
    const { data: packagesOrderData, isLoading: isPackagesLoading } = useGetAllPackagesForOrderQuery([]);
   const { data: productsData } = useGetAllProductsQuery({});
    const allProductsData = productsData?.products || [];
    const allPackagesData = packagesOrderData?.packages || [];
    // Utility functions
     const { data: locationsData, error: getLocationsError } = useGetLocationMasterQuery([])
        const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const getLocationDetails = (loc_ID) => {
        const location = (locationsData?.locations || []).find((loc) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        return [
            // location.locationDescription,
            location.contact_name,
            location.contact_email,
            location.contact_phone_number,
            location.address_1,
            location.city,
            location.state,
            location.country,
            location.pincode,
        ].filter(Boolean).join(", ");
    };

  
    const getLocationCode = (loc_ID: string) => {
			const location = getAllLocations.find(
				(loc: Location) => loc.loc_ID === loc_ID
			);

			if (!location) return "";

			// return only city
			return location.city || "";
		};

const copyOptions = ["CONSIGNEE COPY", "CONSIGNOR COPY", "TRANSPORTER COPY"];

// Open popup instead of printing directly
const handleOpenPopup = () => {
	setOpenPopup(true);
};

// Cancel popup
const handleCancel = () => {
	setOpenPopup(false);
};
const getProductsInPackageDetails = (packId: string) => {
	// Step 1: get all product entries under this package
	const packProducts = allPackagesData
		.filter((pkg) => pkg.pack_ID === packId)
		.flatMap((pkg) => pkg.product_ID || []);
	// product_ID is itself an array like [{prod_ID, quantity, package_info}]

	if (!packProducts.length) return "No products found";

let totalQuantity = 0;
	const details = packProducts.map((prod) => {
		const productInfo = allProductsData.find(
			(p) => p.product_ID === prod.prod_ID
		);

		if (!productInfo) {
			return `Unknown Product (${prod.prod_ID})`;
		}
totalQuantity += Number(prod.quantity || 0);
		return `${productInfo.product_name}, quantity: ${prod.quantity}`;
	});

	 
	// return
    //  details.join(" || ");
    return { details: details.join(" || "), quantity: totalQuantity };
  

};

    // const handlePDFDownload = async (ref, fileName) => {
    //     setIsLoading(true);
    //     const pdf = new jsPDF("l", "px", [1322, 432]);
    //     const canvas = await html2canvas(ref, { scale: 2, useCORS: true });
    //     const imgData = canvas.toDataURL("image/png");
    //     pdf.addImage(imgData, "PNG", 0, 0, 1322, 432);
    //     pdf.save(fileName);
    //     setIsLoading(false);
    // };

   const handlePDFDownload = async (ref, fileName, selectedCopy) => {
			setIsLoading(true);

			console.log("Copy selected inside download:", selectedCopy);

			const canvas = await html2canvas(ref, { scale: 2, useCORS: true });
			const imgData = canvas.toDataURL("image/png");

			// Auto-size PDF to match the canvas
			const pdf = new jsPDF("l", "px", [canvas.width, canvas.height]);

			pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

			pdf.save(fileName);
			setIsLoading(false);
		};


const handlePrintConfirm = () => {
	setOpenPopup(false);

	if (!currentShipToId) {
		console.error("ShipToID missing");
		return;
	}

	const ref = pdfRefs.current[currentShipToId];

	if (ref) {
		handlePDFDownload(
			ref,
			`LOR-${orderId}.pdf`,
			selectedCopy
		);
	}
};

    return (
			<>
				<Dialog open={openPopup} onClose={handleCancel}>
					<DialogTitle>
						Select Copy Type
						<IconButton
							onClick={handleCancel}
							sx={{ position: "absolute", right: 8, top: 8 }}
						>
							X
						</IconButton>
					</DialogTitle>

					<DialogContent sx={{ minWidth: 300 }}>
						{copyOptions.map((copy) => (
							<FormControlLabel
								key={copy}
								control={
									<Checkbox
										checked={selectedCopy === copy}
										onChange={() => setSelectedCopy(copy)}
									/>
								}
								label={copy}
							/>
						))}
					</DialogContent>

					<DialogActions>
						<Button variant="contained" onClick={handlePrintConfirm}>
							Print
						</Button>
						<Button variant="outlined" onClick={handleCancel}>
							Cancel
						</Button>
					</DialogActions>
				</Dialog>

				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={isLoading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
				{allocations.map((allocation, allocIndex) => {
					const vehiclePackages = allocatedPackageDetails.filter((pkg) =>
						allocation.packages.includes(pkg.pack_ID)
					);
					const packagesByShipTo = {};
					vehiclePackages.forEach((pkg) => {
						if (pkg.ship_to) {
							if (!packagesByShipTo[pkg.ship_to])
								packagesByShipTo[pkg.ship_to] = [];
							packagesByShipTo[pkg.ship_to].push(pkg);
						}
					});

					return Object.entries(packagesByShipTo).map(
						([shipToId, pkgList], index) => {
							const shipperPkg = pkgList[0];

							// Find LR Invoice by matching the package
							const lrData =
								lrInvoices?.find((lr) =>
									lr.packages_in_data?.some(
										(pkg) => pkg.pack_ID === shipperPkg.pack_ID
									)
								) || {};

							// Use LR's ship_from/ship_to for addresses, LR number for invoice
							const consignorLoc = lrData.ship_from;
							const consigneeLoc = lrData.ship_to;
							const lrNum = lrData.lr_num || "-";
 
							// Rows for goods table
							// const productRows = (shipperPkg?.product_lines || []).map(
							// 	(pl, idx) => ({
							// 		slNo: idx + 1,
							// 		invoice: lrNum,
							// 		ewb: lrData.e_way ?? "",
							// 		details: pl.package_info ?? "-",
							// 		count: pl.quantity ?? "-",
							// 		deedWeight:
							// 			shipperPkg?.package_weight ??
							// 			allocation?.occupiedWeight ??
							// 			"-",
							// 		chargeableWeight: allocation?.chargeableWeight ?? "-",
							// 		value: "10000", // Replace with value from data if needed
							// 	})
							// );
// useEffect(() => {
// 	if (!shipperPkg?.pac_id || !consignorLoc || !consigneeLoc) return;
// 	if (!getAllLocations || getAllLocations.length === 0) return;

// 	const from = getLocationCode(consignorLoc);
// 	const to = getLocationCode(consigneeLoc);
//     const pkgInfo = getProductsInPackageDetails(shipperPkg?.pac_id);
// 	const count = pkgInfo.quantity
// 	console.log("count ", pkgInfo);
// 	if (!from || !to) return;
//     if (!pkgInfo) return

// 	const fromCode = from.slice(0, 3).toUpperCase();
// 	const toCode = to.slice(0, 3).toUpperCase();

// 	const barcodeData = `${shipperPkg.pac_id}|${fromCode}|${toCode}|${count}`;

// 	console.log("Barcode VALUE:", barcodeData);

// 	JsBarcode(`#barcode-${shipperPkg.pac_id}`, barcodeData, {
// 		format: "CODE128",
// 		width: 1,
// 		height: 40,
// 		displayValue: true,
// 	});
// }, [shipperPkg?.pac_id, consignorLoc, consigneeLoc, getAllLocations]);





							const productRows = (lrData?.packages_in_data || []).map(
								(pkg, idx) => {
									const pkgInfo = getProductsInPackageDetails(pkg?.pack_ID);
 
									return {
										slNo: idx + 1,
										invoice: pkg.invoice,
										ewb: pkg.e_way ?? "-",
										details: pkgInfo?.details,
										count: pkgInfo?.quantity,
										deedWeight:
											shipperPkg?.package_weight ??
											allocation?.occupiedWeight ??
											"-",
										chargeableWeight: allocation?.chargeableWeight ?? "-",
										// value: "10000",
									};
								}
							);

							const totalCount = productRows.reduce(
								(a, b) => a + Number(b.count || 0),
								0
							);
							console.log("total count ", totalCount)
							const totalDeedWeight = productRows.reduce(
								(a, b) => a + Number(b.deedWeight || 0),
								0
							);
							const totalChargeableWeight = productRows.reduce(
								(a, b) => a + Number(b.chargeableWeight || 0),
								0
							);
							const totalValue = productRows.reduce(
								(a, b) => a + Number(b.value || 0),
								0
							);
useEffect(() => {
	if (!shipperPkg?.pac_id || !consignorLoc || !consigneeLoc) return;
	if (!getAllLocations?.length) return;

	// Get FROM / TO
	const from = getLocationCode(consignorLoc);
	const to = getLocationCode(consigneeLoc);
	if (!from || !to) return;

	// --- IMPORTANT: total count of ALL packages ---
	const totalCount = (lrData?.packages_in_data || []).reduce((sum, pkg) => {
		const pkgInfo = getProductsInPackageDetails(pkg.pack_ID);
		return sum + (pkgInfo?.quantity || 0);
	}, 0);

	console.log("TOTAL COUNT:", totalCount);

	// Short codes
	const fromCode = from.slice(0, 3).toUpperCase();
	const toCode = to.slice(0, 3).toUpperCase();

	// Final barcode value
	const barcodeData = `${shipperPkg.pac_id}|${fromCode}|${toCode}|${totalCount}`;

	console.log("Barcode VALUE:", barcodeData);

	JsBarcode(`#barcode-${shipperPkg.pac_id}`, barcodeData, {
		format: "CODE128",
		width: 0.8,
		height: 40,
		displayValue: false,
	});
}, [
	shipperPkg?.pac_id,
	consignorLoc,
	consigneeLoc,
	getAllLocations,
	lrData?.packages_in_data, // <-- IMPORTANT: Watch package changes
]);

							return (
								<Box key={`${allocIndex}-${index}`} mt={2}>
									{/* <Box textAlign="center" mb={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => pdfRefs.current[shipToId] && handlePDFDownload(pdfRefs.current[shipToId], `LOR-${orderId}-${shipToId}.pdf`)}
                                    sx={{ mx: 1, px: 4, bgcolor: "#334eaf", fontWeight: 700 }}
                                >
                                    PRINT PDF
                                </Button>
                                <Button variant="outlined" sx={{ mx: 1, px: 4 }} onClick={() => window.close()}>
                                    CLOSE
                                </Button>
                            </Box> */}

									<Paper
										ref={(el) => {
											pdfRefs.current[shipToId] = el;
										}}
										sx={{
											p: 0.7,
											border: "1px solid #222",
											minWidth: 1300,
											maxWidth: 1322,
											margin: "0 auto",

											fontFamily: "Arial, 'Liberation Sans', sans-serif",
										}}
									>
										{/* Header */}
										<Grid container>
											<Grid item xs={2.5}>
												<img
													alt="logo"
													src="https://shadowfax.in/wp-content/uploads/2023/07/shadowfax-logo.svg"
													style={{ height: 32 }}
												/>
											</Grid>
											<Grid item xs={7} sx={{ textAlign: "center" }}>
												<Typography fontWeight={700} fontSize="15px">
													Shadowfax Technologies Pvt. Ltd.
												</Typography>
												<Typography fontSize={13}>
													GSTIN: 07AAVCS6967K1ZS &nbsp;|&nbsp; PAN: AAVCS6967K
												</Typography>
											</Grid>
											<Grid
												item
												xs={2.5}
												sx={{ textAlign: "right", fontSize: 13 }}
											>
												<Typography>
													Order Reference No.: <b>{order?.order_ID || "-"}</b>
												</Typography>
												<Typography>
													Booking Date:{" "}
													<b>{order?.created_at?.split("T")[0] || "-"}</b>
												</Typography>
												<Typography fontWeight={700} fontSize="12px">
													LOR NO.
												</Typography>
												<svg id={`barcode-${shipperPkg?.pac_id}`}></svg>

												<Typography>{shipperPkg?.pac_id}</Typography>
											</Grid>
										</Grid>
										{/* Top info table */}
										<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
											<Grid container>
												<Cell sx={{ width: "14%" }}>MODE</Cell>
												<Cell sx={{ width: "20%" }}>LOR TYPE</Cell>
												<Cell sx={{ width: "16%" }}>DELIVERY TYPE</Cell>
												<Cell sx={{ width: "18%" }}>DELIVERY SLOT</Cell>
												<Cell sx={{ width: "32%" }}>
													SIGNATURE & STAMP OF CONSIGNEE
												</Cell>
											</Grid>
											<Grid container>
												<Cell sx={{ width: "14%" }}>Surface</Cell>
												<Cell sx={{ width: "20%" }}>{selectedCopy}</Cell>
												<Cell sx={{ width: "16%" }}>Standard</Cell>
												<Cell sx={{ width: "18%" }}>ALL DAY</Cell>
												<Cell sx={{ width: "32%" }}></Cell>
											</Grid>
										</Grid>
										{/* Consignor/Consignee table - from LR Invoice */}
										<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
											<Cell sx={{ width: "50%" }}>
												<Typography fontWeight={700} fontSize={13}>
													CONSIGNER NAME & ADDRESS
												</Typography>
												<Typography fontSize={13}>
													{getLocationDetails(consignorLoc)}
												</Typography>
											</Cell>
											<Cell sx={{ width: "50%" }}>
												<Typography fontWeight={700} fontSize={13}>
													CONSIGNEE NAME & ADDRESS
												</Typography>
												<Typography fontSize={13}>
													{getLocationDetails(consigneeLoc)}
												</Typography>
											</Cell>
										</Grid>
										{/* Table for goods */}
										<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
											{/* Header row */}
											<Cell sx={{ width: "8%" }}>SL No.</Cell>
											<Cell sx={{ width: "18%" }}>Invoice Number</Cell>
											<Cell sx={{ width: "18%" }}>EWB Number</Cell>
											<Cell sx={{ width: "18%" }}>Product Details</Cell>
											<Cell sx={{ width: "8%" }}>Count</Cell>
											<Cell sx={{ width: "8%" }}>Dead Weight</Cell>
											<Cell sx={{ width: "12%" }}>Chargable Weight</Cell>
											<Cell sx={{ width: "10%" }}>Value</Cell>
											{/* Data rows */}
											{productRows.map((row, idx) => (
												<React.Fragment key={idx}>
													<Cell sx={{ width: "8%" }}>{row.slNo}</Cell>
													<Cell sx={{ width: "18%" }}>{row.invoice}</Cell>
													<Cell sx={{ width: "18%" }}>{row.ewb}</Cell>
													<Cell sx={{ width: "18%" }}>{row.details}</Cell>
													<Cell sx={{ width: "8%" }}>{row.count}</Cell>
													<Cell sx={{ width: "8%" }}>{row.deedWeight}</Cell>
													<Cell sx={{ width: "12%" }}>
														{row.chargeableWeight}
													</Cell>
													<Cell sx={{ width: "10%" }}>{row.value}</Cell>
												</React.Fragment>
											))}
											{/* Total row */}
											<Cell sx={{ width: "26%", borderTop: "2px solid #333" }}>
												TOTAL
											</Cell>
											<Cell sx={{ width: "8%" }}>{totalCount}</Cell>
											<Cell sx={{ width: "8%" }}>{totalDeedWeight}</Cell>
											<Cell sx={{ width: "12%" }}>{totalChargeableWeight}</Cell>
											<Cell sx={{ width: "10%" }}>{totalValue}</Cell>
											<Cell sx={{ width: "36%" }}></Cell>
										</Grid>
										{/* Declaration */}
										<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
											<Cell sx={{ width: "100%" }}>
												<b>DECLARATION BY THE CONSIGNER</b>
												<br />I hereby solemnly declare that all the particulars
												mentioned on this consignment note are true and correct
												and I have read, understood & accept all the terms and
												conditions mentioned in agreement.
											</Cell>
										</Grid>
										{/* Source, destination, signature */}
										<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
											<Cell sx={{ width: "24%" }}>
												<b>SOURCE</b> : {getLocationCode(consignorLoc)}
												<br />
												Facility Code:{consignorLoc}
											</Cell>
											<Cell sx={{ width: "24%" }}>
												<b>DESTINATION</b> : {getLocationCode(consigneeLoc)}
												<br />
												Facility Code: {consigneeLoc}
											</Cell>
											<Cell
												sx={{
													width: "52%",
													display: "flex",
													justifyContent: "space-between",
													alignItems: "flex-end",
												}}
											>
												<Box
													sx={{
														display: "flex",
														width: "100%",
														justifyContent: "space-between",
													}}
												>
													{selectedCopy === "CONSIGNEE COPY" && (
														<>
															<Typography>Signature of Consignee</Typography>
															<Typography></Typography>
															<Typography>Signature of Transporter</Typography>
														</>
													)}

													{selectedCopy === "CONSIGNOR COPY" && (
														<>
															<Typography>Signature of Consigner</Typography>
															<Typography></Typography>
															<Typography>Signature of Transporter</Typography>
														</>
													)}

													{selectedCopy === "TRANSPORTER COPY" && (
														<>
															<Typography>Signature of Consignee</Typography>
															<Typography>Signature of Consigner</Typography>
															<Typography>Signature of Transporter</Typography>
														</>
													)}
												</Box>
											</Cell>
										</Grid>
									</Paper>

									<Box textAlign="center" mb={10} mt={2}>
										<Button
											variant="contained"
											onClick={() => {
												setCurrentShipToId(shipToId); // store it
												setOpenPopup(true); // open popup
											}}
										>
											PRINT PDF
										</Button>

										<Button
											variant="outlined"
											sx={{ mx: 1, px: 4 }}
											onClick={() => window.close()}
										>
											CLOSE
										</Button>
									</Box>
								</Box>
							);
						}
					);
				})}
			</>
		);
};

export default LOR;
