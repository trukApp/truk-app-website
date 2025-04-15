import { useAppSelector } from '@/store';
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { DataGrid, GridCellParams, } from '@mui/x-data-grid';
import { Truck } from './TrucksTable'
import { Product } from './PackagesTable';
import { useGetAllProductsQuery, useGetLocationMasterQuery } from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { GET_ALL_LOCATIONS, GET_ALL_PRODUCTS } from '@/api/graphqlApiSlice';

interface TrucksTableProps {
    trucks: Truck[];
}

interface PackageDetails {
    stop: string;
    location: string;
    packages: [];
}

const ReviewCreateOrder: React.FC<TrucksTableProps> = ({ trucks }) => {
    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);
    const selectedTrucks = trucks
    // const { data: locationsData } = useGetLocationMasterQuery({})
    const {data:locationsData } = useQuery(GET_ALL_LOCATIONS, {
        variables: { page:1, limit: 10 },
      });
     const getAllLocations = locationsData?.getAllLocations.locations.length > 0 ? locationsData?.getAllLocations.locations : []
    console.log("selectedPackages: ", selectedPackages)
 const getLocationDescription = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
     const details = [
            location.loc_ID,
            location.loc_desc,
            location.address_1,
            location.city,
            location.state,
            location.pincode,
            
        ].filter(Boolean);

        return details.length > 0 ? details.join(", ") : "Location details not available";
    };
    // const { data: productsData } = useGetAllProductsQuery({})
    const { data: productsData } = useQuery(GET_ALL_PRODUCTS, {
        variables: {  },
      });

    const allProductsData = productsData?.getAllProducts.products || [];

    const getProductDetails = (productID: string) => {
        const productInfo = allProductsData.find((product: Product) => product.product_ID === productID);
        if (!productInfo) return "Package details not available";
        const details = [
            productInfo.product_name,
            productInfo.weight,
            productInfo.product_ID,
        ].filter(Boolean);
        return details.length > 0 ? details.join("-") : "Product details not available";
    };

    const packageColumns = [
        { field: 'pack_ID', headerName: 'Package ID', width:150 },
        { field: 'ship_from', headerName: 'Ship From', width:250 },
        { field: 'ship_to', headerName: 'Ship To', width:250 },
        {
            field: 'products',
            headerName: 'Product Details',
            width: 400,
            renderCell: (params: GridCellParams) => {
                console.log("params.value: ", params.value)
                const products = Array.isArray(params.value) ? params.value : [];

                if (!products.length) return <div>No products</div>;

                const productText = products
                    .map((prod: Product) => {
                        const detail = getProductDetails(prod.prod_ID);
                        return `${detail} (Qty: ${prod.quantity})`;
                    })
                    .join(', ');

                return (
                    <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                        {productText}
                    </div>
                );
            },
        },
        { field: 'invoice', headerName: 'Invoice', width:150 },
        { field: 'reference_id', headerName: 'Reference ID', width:150  },
        { field: 'pickup_date_time', headerName: 'Pickup Date & Time', width:180  },
        { field: 'dropoff_date_time', headerName: 'Dropoff Date & Time', width:180  },
        { field: 'tax_info', headerName: 'Tax Info', width:150  },
        // { field: 'return_label', headerName: 'Return Label', flex: 1 }
        {
            field: 'return_label',
            headerName: 'Return Label',
            width: 150,
            renderCell: (params: GridCellParams) => {
                const value = params.value === 1;
                return <span>{value ? 'True' : 'False'}</span>;
            },
        },
    ];

    const packageRows = selectedPackages.map((pkg, index) => ({
        id: index,
        pack_ID: pkg.pack_ID,
        ship_from: getLocationDescription(pkg.ship_from),
        ship_to: getLocationDescription(pkg.ship_to),
        products: pkg.product_ID || [],
        invoice: pkg.additional_info?.invoice || 'N/A',
        reference_id: pkg.additional_info?.reference_id || 'N/A',
        pickup_date_time : moment(pkg.pickup_date_time).format("DD MMM YYYY, hh:mm A"),
        dropoff_date_time: moment(pkg.dropoff_date_time).format("DD MMM YYYY, hh:mm A"),
        tax_info: pkg.tax_info?.tax_rate || 'N/A',
        return_label: pkg.return_label ? 'Yes' : 'No'
    }));

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#83214F' }}>Selected Packages</Typography>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={packageRows}
                        columns={packageColumns}
                        pageSizeOptions={[5, 10, 20]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    />
                </div>
            </Paper>
            <Grid>
                <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#83214F' }}>
                        Load and Route Optimised vehicles
                    </Typography>

                    <Grid container spacing={2}>
                        {selectedTrucks?.map((vehicle: Truck, index: number) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        backgroundColor: "white",
                                        marginTop: 3
                                    }}
                                >
                                    <Typography variant="subtitle1" gutterBottom>
                                        Vehicle ID: <strong>{vehicle.vehicle_ID}</strong>
                                    </Typography>
                                    <Typography>
                                        Total Weight Capacity: <strong>{vehicle?.totalWeightCapacity?.toFixed(2)} kg</strong>
                                    </Typography>
                                    <Typography>
                                        Leftover Weight: <strong>{parseFloat(vehicle?.leftoverWeight)?.toFixed(2)} kg</strong>
                                    </Typography>
                                    <Typography>
                                        Total Volume Capacity: <strong>{vehicle?.totalVolumeCapacity?.toFixed(2)} m³</strong>
                                    </Typography>
                                    <Typography>
                                        Leftover Volume: <strong>{vehicle.leftoverVolume.toFixed(2)} m³</strong>
                                    </Typography>
                                    <Typography>
                                        Estimated Cost: <strong>₹{vehicle.cost.toFixed(2)}</strong>
                                    </Typography>
                                    {vehicle.loadArrangement && vehicle.loadArrangement.length > 0 ? (
                                        <Box sx={{ mt: 2, height: 300, backgroundColor: "white", borderRadius: 1, overflow: "hidden" }}>
                                            <DataGrid
                                                rows={vehicle.loadArrangement.map((item: PackageDetails, i) => ({
                                                    id: item.stop || i + 1,
                                                    location: (item.location) || "N/A",
                                                    packages: item.packages ? item.packages.join(", ") : "N/A",
                                                }))}
                                                columns={[
                                                    { field: "id", headerName: "Load Arrangement", width: 100 },
                                                    { field: "location", headerName: "Delivery Address", width: 300 },
                                                    { field: "packages", headerName: "Packages", width: 200 },
                                                ]}
                                                pageSizeOptions={[5, 10]}
                                                disableRowSelectionOnClick
                                                sx={{
                                                    "& .MuiDataGrid-columnHeaders": {
                                                        backgroundColor: "#f5f5f5",
                                                        fontWeight: "bold",
                                                    },
                                                    "& .MuiDataGrid-cell": {
                                                        padding: "8px",
                                                    },
                                                    "& .MuiDataGrid-footerContainer": {
                                                        display: "none",
                                                    },
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Typography sx={{ mt: 1, fontStyle: "italic", color: "gray" }}>
                                            No load arrangement data available.
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                </Paper>

            </Grid>


        </Box>
    );
};

export default ReviewCreateOrder;
