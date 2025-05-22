import {  useGetAssignedOrderByIdQuery, useGetLocationMasterQuery } from "@/api/apiSlice";
import {  Typography,  Paper, Backdrop, CircularProgress } from "@mui/material";
import { Location } from "../MasterDataComponents/Locations"; 

interface RoutePoint {
    start: {
        address: string;
        latitude: number;
        longitude: number;
    };
    end: {
        address: string;
        latitude: number;
        longitude: number;
    };
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
    ship_from:string
}
 interface AllocationsProps {
    allocations: Allocation[];
    orderId: string;
    allocatedPackageDetails: [];
    from: string; 
}
interface Product {
    prod_ID: string;
    quantity: number;
    package_info: string
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
}
export interface ProductDetails {
    product_ID: string;
    product_desc: string;
    product_name: string;
    weight: string;
}

const BillOfLading: React.FC<AllocationsProps> = ({ allocations,orderId, allocatedPackageDetails }) => {
    const { data: locationsData } = useGetLocationMasterQuery({});
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData.locations : [];
 const { data: assignedOrder , isLoading:ordersLoading } = useGetAssignedOrderByIdQuery({ order_ID: orderId })
    
    console.log('assigned :', assignedOrder)
    const getLocationDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        const details = [
            location.address_1,
            location.city,
            location.state,
            location.country,
            location.pincode,
        ].filter(Boolean);
        return details.length > 0 ? details.join(", ") : "Location details not available";
    };

    const getCustomerDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return null;
        return {
            name: location.contact_name || "Name not available",
            email: location.contact_email || "Email not available",
            phone: location.contact_phone_number || "Phone number not available"
        };
    };

    // ✅ Step 1: Gather all relevant packages from allocations
    const allPackages: PackageDetail[] = [];
    allocations.forEach((allocation: Allocation) => {
        const matched = allocatedPackageDetails.filter((pkg: PackageDetail) =>
            allocation.packages.includes(pkg.pack_ID)
        );
        allPackages.push(...matched);
    });

    // ✅ Step 2: Group packages by unique ship_to
    const packagesByShipTo: Record<string, PackageDetail[]> = {};
    allPackages.forEach(pkg => {
        if (pkg.ship_to) {
            if (!packagesByShipTo[pkg.ship_to]) {
                packagesByShipTo[pkg.ship_to] = [];
            }
            packagesByShipTo[pkg.ship_to].push(pkg);
        }
    });

    const personDetails = allPackages[0]
    const shipFromDetails = getCustomerDetails(personDetails?.ship_from ?? "");

    return (
        <>
                        <Backdrop
                            sx={{
                                color: "#ffffff",
                                zIndex: (theme) => theme.zIndex.drawer + 1,
                            }}
                            open={ordersLoading}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
            {Object.entries(packagesByShipTo).map(([shipToId, pkgList], index) => {
                const customerDetails = getCustomerDetails(shipToId);

                return (
                    <Paper key={index} sx={{ p: 2, mt: 3, backgroundColor: "#f8f8f8" }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Bill of Lading (Consignee ID: {shipToId})
                        </Typography>
                        <Typography variant="body2">
                            <strong>Number of Packages to this Consignee:</strong> {pkgList.length}
                        </Typography>

                        <Typography variant="h6" sx={{ mt: 2 }} color="primary" gutterBottom>
                            Shipper Details
                        </Typography>

                        {shipFromDetails ? (
                            <>
                                <Typography variant="body2">
                                    Name: <strong>{shipFromDetails.name}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Email: <strong>{shipFromDetails.email}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Phone: <strong>{shipFromDetails.phone}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Address: <strong>{getLocationDetails(personDetails?.ship_from)}</strong>
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body2">
                                Details not available
                            </Typography>
                        )}
                        <Typography variant="h6" sx={{ mt: 2 }} color="primary" gutterBottom>
                            Consignee Details
                        </Typography>

                        {customerDetails ? (
                            <>
                                <Typography variant="body2">
                                    Name: <strong>{customerDetails.name}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Email: <strong>{customerDetails.email}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Phone: <strong>{customerDetails.phone}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Address: <strong>{getLocationDetails(shipToId)}</strong>
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body2">
                                Details not available
                            </Typography>
                        )}
                        <Typography variant="h6" sx={{ mt: 2 }} color="primary" gutterBottom>
                            Transporter Details
                        </Typography>
                        {customerDetails ? (
                            <>
                                <Typography variant="body2">
                                    Name: <strong>{customerDetails.name}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Email: <strong>{customerDetails.email}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Phone: <strong>{customerDetails.phone}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Address: <strong>{getLocationDetails(shipToId)}</strong>
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body2">
                                Details not available
                            </Typography>
                        )}
                    </Paper>
                );
            })}
        </>
    );
};

export default BillOfLading;
