import React from "react";
import { useEditOrderMutation, useGetLocationMasterQuery, useImageUploadingMutation } from "@/api/apiSlice";
import { Typography, Paper, Grid, Divider, Box, Button, Backdrop, CircularProgress } from "@mui/material";
import { Location } from "../MasterDataComponents/Locations";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { useRef } from "react";

interface RoutePoint {
    start: { address: string; latitude: number; longitude: number };
    end: { address: string; latitude: number; longitude: number };
    distance: string;
    duration: string;
}
interface Allocation {
    vehicle_ID: string;
    cost: number;
    totalVolumeCapacity: number;
    totalWeightCapacity: number;
    occupiedVolume: number;
    occupiedWeight: number;
    leftoverVolume: number;
    leftoverWeight: number;
    packages: string[];
    route: RoutePoint[];
    ship_from: string;
    packageInfoDetails?: PackageInfoDetail[];
}

interface PackageDestinationRadius {
    pack_ID: string;
    ship_to: string;
    destination_radius: string;
}

interface PackageDetails {
    pack_ID: string;
    pkg_ID: string;
    volumeM3: number;
    percentOfTruck: number;
    weight_uom: string;
    package_weight: string;
}

interface PackageInfoLine {
    pac_ID: string;
    prod_ID: string;
    quantity: number;
    package_info: {
        pac_ID: string;
        pack_width: string;
        package_id: number;
        pack_height: string;
        pack_length: string;
        pack_volume: string;
        dimensions_uom: string;
        pack_volume_uom: string;
        handling_unit_type: string;
        packaging_type_name: string;
    };
    packagingDimensions: {
        widthM: number;
        heightM: number;
        lengthM: number;
    };
}

interface VehicleDimensions {
    interiorWidthM: number;
    interiorHeightM: number;
    interiorLengthM: number;
}

interface TruckCapacity {
    rawM3: number;
    usableM3: number;
    maxLayers: number;
    oneLayerM3: number;
    allowedLayers: number;
}
interface RoutePoint {
    start: { address: string; latitude: number; longitude: number };
    end: { address: string; latitude: number; longitude: number };
    distance: string;
    duration: string;
}

interface Allocation {
    cost: number;
    route: RoutePoint[];
    packages: string[];
    vehicle_ID: string;
    truckCapacity: TruckCapacity;
    leftoverVolume: number;
    leftoverWeight: number;
    occupiedVolume: number;
    occupiedWeight: number;
    packageDetails: PackageDetails[];
    packageInfoDetails?: PackageInfoDetail[];
    occupiedPercent: number;
    vehicleDimensions: VehicleDimensions;
}

interface OrderDoc {
    dangerousGoods: string;
}

interface BillOfLading {
    find(arg0: (bol: BillOfLading) => boolean): unknown;
    package: string;
    // self_bill_url: string;
    loaction_ID: string;
    bol_to: string;
    self_bill_url?: string;
}

interface BillOfLadingEntry {
    bol_to: string;
    package: string;
    loaction_ID: string;
    self_bill_url: string;
}
interface Order {
    ord_id: number;
    order_ID: string;
    scenario_label: string;
    total_cost: string;
    allocations: Allocation[];
    total_weight: string;
    total_distance: string;
    start_loc_ID: string;
    end_loc_ID: string;
    allocated_packages: string[];
    unallocated_packages: string[];
    allocated_vehicles: string[];
    package_dest_radius: PackageDestinationRadius[];
    created_at: string;
    updated_at: string;
    order_docs: OrderDoc[];
    order_status: string;
    bill_of_lading: BillOfLadingEntry[] | null;
}

interface AllocationsProps {
    allocations: Allocation[];
    orderId: string;
    allocatedPackageDetails: PackageDetail[];
    from: string;
    orderStatus: string;
    order: Order;
}
interface Product {
    prod_ID: string;
    quantity: number;
    package_info: string;
}
interface AdditionalInformation {
    reference_id: string;
    invoice: string;
    department: string;
    sales_order_number: string;
    po_number: string;
    attachment: string;
}
interface TaxInformation {
    sender_gst: string;
    receiver_gst: string;
    carrier_gst: string;
    self_transport: string;
    tax_rate: string;
}
interface PackageDetail {
    pac_id: string;
    pack_ID: string;
    package_status: string;
    ship_from: string;
    ship_to: string;
    pickup_date_time: string;
    dropoff_date_time: string;
    return_label: boolean;
    product_ID: Product[];
    bill_to: string;
    additional_info: AdditionalInformation;
    tax_info: TaxInformation;
    package_weight: string;

}
interface PackageInfoLine {
    pac_ID: string;
    prod_ID: string;
    quantity: number;
    package_info: PackageInfo;
    packagingDimensions: { widthM: number; heightM: number; lengthM: number };
}
interface PackageInfo {
    pac_ID: string;
    pack_width: string;
    package_id: number;
    pack_height: string;
    pack_length: string;
    pack_volume: string;
    dimensions_uom: string;
    pack_volume_uom: string;
    handling_unit_type: string;
    packaging_type_name: string;
}
interface PackageInfoDetail {
    lines: PackageInfoLine[];
    pkg_ID: string;
}

const BillOfLading: React.FC<AllocationsProps> = ({ allocations, orderId, allocatedPackageDetails, orderStatus, order }) => {
    const [editOrder] = useEditOrderMutation();
    const { data: locationsData } = useGetLocationMasterQuery({});
    const getAllLocations: Location[] = locationsData?.locations?.length > 0 ? locationsData.locations : [];
    // const { data: assignedOrder, isLoading: ordersLoading } = useGetAssignedOrderByIdQuery({ order_ID: orderId });
    const [imageUploading] = useImageUploadingMutation();
    const [isLoading, setIsLoading] = React.useState(false);
    const billOfLadding = order?.bill_of_lading || [];

    // ✅ Refs for PDFs
    // const pdfRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const pdfRefs = useRef<Record<string, HTMLDivElement | null>>({});


    const getLocationDetails = (loc_ID: string): string => {
        const location = getAllLocations.find((loc) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        return [location.address_1, location.city, location.state, location.country, location.pincode].filter(Boolean).join(", ");
    };

    const getCustomerDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc) => loc.loc_ID === loc_ID);
        if (!location) return null;
        return {
            name: location.contact_name || "Name not available",
            email: location.contact_email || "Email not available",
            phone: location.contact_phone_number || "Phone not available",
            gst: location.gst || "N/A",
        };
    };

    const getLogoBase64 = async (): Promise<string> => {
        const response = await fetch("/TrukAppLogo.png");
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    };

    const generateQRCode = async (url: string): Promise<string> => {
        return await QRCode.toDataURL(url, { width: 200, margin: 1 });
    };

    const generateAndUploadPDF = async (
        ref: HTMLDivElement,
        fileName: string,
        shipToId: string,
        orderStatus: string
    ) => {
        setIsLoading(true);
        const pdf = new jsPDF("p", "mm", "a4");
        const logoBase64 = await getLogoBase64();

        const canvas = await html2canvas(ref, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // pdf.addImage(logoBase64, "PNG", 10, 5, 30, 15);
        pdf.addImage(logoBase64, "PNG", 10, 5, 50, 15);
        pdf.addImage(imgData, "PNG", 0, 25, pdfWidth, imgHeight);

        const pdfBlob = pdf.output("blob");
        const formData = new FormData();
        formData.append("image", pdfBlob, fileName);

        const uploadResponse = await imageUploading(formData).unwrap();
        const pdfUrl = uploadResponse?.imageUrl;

        const qrCode = await generateQRCode(pdfUrl);

        const finalPDF = new jsPDF("p", "mm", "a4");
        // finalPDF.addImage(logoBase64, "PNG", 10, 5, 30, 15);
        finalPDF.addImage(logoBase64, "PNG", 10, 5, 50, 15);
        finalPDF.addImage(qrCode, "PNG", 160, 5, 20, 20);
        finalPDF.addImage(imgData, "PNG", 0, 25, pdfWidth, imgHeight);

        const finalBlob = finalPDF.output("blob");
        const finalFormData = new FormData();
        finalFormData.append("image", finalBlob, fileName);

        const finalUploadResponse = await imageUploading(finalFormData).unwrap();
        const finalPdfUrl = finalUploadResponse?.imageUrl;

        let bol_to = "";
        if (orderStatus === "self assigned") bol_to = "self";
        else if (orderStatus === "carrier assignment") bol_to = "carrier";
        else if (orderStatus === "bidding") bol_to = "bidding";

        await editOrder({
            body: {
                bill_of_lading: [
                    {
                        package: "",
                        self_bill_url: finalPdfUrl,
                        loaction_ID: shipToId,
                        bol_to: bol_to,
                    },
                ],
            },
            params: { order_ID: orderId },
        }).unwrap();

        setIsLoading(false);
    };

    return (
        <>
            <Backdrop sx={{ color: "#ffffff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {allocations.map((allocation, allocIndex) => {
                const vehiclePackages = allocatedPackageDetails.filter((pkg) => allocation.packages.includes(pkg.pack_ID));
                const packagesByShipTo: Record<string, PackageDetail[]> = {};

                vehiclePackages.forEach((pkg) => {
                    if (pkg.ship_to) {
                        if (!packagesByShipTo[pkg.ship_to]) packagesByShipTo[pkg.ship_to] = [];
                        packagesByShipTo[pkg.ship_to].push(pkg);
                    }
                });

                return Object.entries(packagesByShipTo).map(([shipToId, pkgList], index) => {
                    const shipperPkg = pkgList[0];
                    const shipperDetails = getCustomerDetails(shipperPkg?.ship_from ?? "");
                    const consigneeDetails = getCustomerDetails(shipToId);
                    const billToDetails = getCustomerDetails(shipperPkg?.bill_to ?? "");
                    // const existingBOL = billOfLadding.find((bol: BillOfLading) => bol.loaction_ID === shipToId);
                    const existingBOL = billOfLadding.find(
                        (bol: BillOfLadingEntry) => bol.loaction_ID === shipToId
                    );

                    const filteredPackageInfo = allocation.packageInfoDetails?.filter((pkg) =>
                        pkgList.some((p) => p.pack_ID === pkg.pkg_ID)
                    );

                    return (
                        <Box key={`${allocIndex}-${index}`} mt={4}>
                            <Box textAlign="right" mb={1}>
                                {existingBOL ? (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        // onClick={() => window.open(existingBOL.self_bill_url, "_blank")}
                                        onClick={() => existingBOL && window.open(existingBOL.self_bill_url, "_blank")}
                                    >
                                        ⬇ Download BOL
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            pdfRefs.current[shipToId] &&
                                            generateAndUploadPDF(
                                                pdfRefs.current[shipToId]!,
                                                `BOL-${allocation.vehicle_ID}_${shipToId}.pdf`,
                                                shipToId,
                                                orderStatus
                                            )
                                        }
                                    >
                                        ⬆ Generate & Upload BOL
                                    </Button>
                                )}
                            </Box>

                            {/* Assign ref dynamically */}
                            {/* <Paper
                                // ref={(el) => (pdfRefs.current[shipToId] = el)}
                                ref={pdfRefs}
                                sx={{ p: 3, backgroundColor: "#fff", border: "1px solid #000", fontSize: "12px" }}
                            > */}
                            <Paper
                                ref={(el) => {
                                    pdfRefs.current[shipToId] = el;
                                }}
                                sx={{ p: 3, backgroundColor: "#fff", border: "1px solid #000", fontSize: "12px" }}
                            >

                                {/* Header */}
                                <Box textAlign="center" mb={1}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>BILL OF LADING</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />

                                {/* Header Details */}
                                <Grid container spacing={2}>
                                    <Grid item xs={4}><Typography>Sales Order: <strong>{shipperPkg?.additional_info?.sales_order_number || "-"}</strong></Typography></Grid>
                                    <Grid item xs={4}><Typography>Cust. PO No: <strong>{shipperPkg?.additional_info?.po_number || "-"}</strong></Typography></Grid>
                                    <Grid item xs={4}><Typography>Delivery: <strong>{shipperPkg?.pac_id || "-"}</strong></Typography></Grid>
                                </Grid>

                                {/* Shipper / Consignee / Bill To */}
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle2">Shipper:</Typography>
                                        <Typography>{shipperDetails?.name}</Typography>
                                        <Typography>{getLocationDetails(shipperPkg?.ship_from)}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle2">Consigned To:</Typography>
                                        <Typography>{consigneeDetails?.name}</Typography>
                                        <Typography>{getLocationDetails(shipToId)}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle2">Bill To / Invoice To:</Typography>
                                        <Typography>{billToDetails?.name || "—"}</Typography>
                                        <Typography>{billToDetails ? getLocationDetails(shipperPkg?.bill_to) : "—"}</Typography>
                                    </Grid>
                                </Grid>

                                {/* Carrier Info */}
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    {/* <Grid item xs={6}>
                                         <Typography>Carrier Name: {assignedOrder?.transporter_name || "-"}</Typography> 
                                         <Typography>Carrier ID: {allocation.vehicle_ID || "-"}</Typography>
                                    </Grid> */}
                                    <Grid item xs={6}>
                                        {/* <Typography>Ship Date: {shipperPkg?.pickup_date_time || "-"}</Typography> */}
                                        <Typography>
                                            Ship Date & Time: {shipperPkg?.pickup_date_time
                                                ? new Intl.DateTimeFormat("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    hour12: true
                                                }).format(new Date(shipperPkg.pickup_date_time))
                                                : "-"}
                                        </Typography>

                                        <Typography>BOL No: {shipperPkg?.pac_id || "-"}</Typography>
                                    </Grid>
                                </Grid>

                                {/* Goods Table */}
                                <Box mt={2}>
                                    <Paper sx={{ border: "1px solid #000" }}>
                                        <Grid container sx={{ borderBottom: "1px solid #000", fontWeight: "bold", p: 2, fontSize: "15px" }}>
                                            {/* <Grid item xs={2}>Package ID</Grid> */}
                                            <Grid item xs={3}>Description</Grid>
                                            <Grid item xs={2}>Quantity</Grid>
                                            <Grid item xs={2}>Weight</Grid>
                                            <Grid item xs={3}>No. of Packages</Grid>
                                        </Grid>
                                        {filteredPackageInfo?.map((pkg) =>
                                            pkg.lines.map((line, j) => {
                                                const packageDetail = allocation.packageDetails?.find(
                                                    (p) => p.pack_ID === pkg.pkg_ID
                                                );
                                                const packageWeight = packageDetail?.package_weight || allocation.occupiedWeight || "-";
                                                const weightUom = packageDetail?.weight_uom || "kg";
                                                return (
                                                    <Grid container key={`${line.pac_ID}-${j}`} sx={{ p: 2, borderBottom: "1px solid #ddd", fontSize: "15px" }}>
                                                        {/* <Grid item xs={2}>{line.package_info?.pac_ID || "-"}</Grid> */}
                                                        <Grid item xs={3}>{line.package_info?.handling_unit_type || line.package_info?.packaging_type_name || "-"}</Grid>
                                                        <Grid item xs={2}>{line.quantity}</Grid>
                                                        <Grid item xs={2}>{packageWeight !== "-" ? `${packageWeight} ${weightUom}` : "-"}</Grid>
                                                        <Grid item xs={3}>1</Grid>
                                                    </Grid>
                                                );
                                            })
                                        )}
                                    </Paper>
                                </Box>

                                {/* Declaration */}
                                <Box mt={2} sx={{ border: "1px solid #000", p: 2 }}>
                                    <Typography sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}>
                                        DRIVE WILL NOT REIMBURSE CARRIER FOR CONSIGNEE ADDED ACCESSORIAL CHARGES WITHOUT PRIOR CONSENT
                                    </Typography>
                                    <Typography sx={{ fontSize: "11px", mb: 2 }}>
                                        This is to certify that the here-in named materials are properly classified, described, packaged, marked, and labelled,
                                        and are in proper condition for transportation according to applicable regulations of the Department of Transportation.
                                    </Typography>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={6}><Typography>Shipper Signature: ___________________________</Typography></Grid>
                                        <Grid item xs={6}><Typography>Date: ___________________________</Typography></Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={6}><Typography>Driver Signature: ___________________________</Typography></Grid>
                                        <Grid item xs={6}><Typography>Date: ___________________________</Typography></Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={6}><Typography>Driver License #: ___________________________</Typography></Grid>
                                        <Grid item xs={6}><Typography># of Pallets: ______  &nbsp;&nbsp;  # of Cartons: ______</Typography></Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={8}><Typography>All items received in good condition: [ ] Yes &nbsp;&nbsp; [ ] No</Typography></Grid>
                                        <Grid item xs={4}><Typography>Date: ___________________________</Typography></Grid>
                                    </Grid>
                                    <Typography>Customer Signature: ___________________________  &nbsp;&nbsp; Print Name: ___________________________</Typography>
                                </Box>
                            </Paper>
                        </Box>
                    );
                });
            })}
        </>
    );
};

export default BillOfLading;


