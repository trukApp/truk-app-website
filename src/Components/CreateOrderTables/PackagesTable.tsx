import React, { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSelectedPackages } from '@/store/authSlice';
import { Grid } from '@mui/material';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import { useGetAllProductsQuery, useGetLocationMasterQuery, useGetPackageMasterQuery } from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';
import moment from 'moment';
import { useQuery } from "@apollo/client";
import { GET_ALL_PACKAGES, } from '@/api/graphqlApiSlice';

export interface Product {
    prod_ID: string;
    quantity: number;
    product_ID: string
}

export interface AdditionalInfo {
    invoice: string;
    reference_id: string;
}

export interface TaxInfo {
    tax_rate: string;
}

export interface Package {
    handling_unit_type: string;
    dimensions_uom: string;
    packaging_type_name: string;
    dimensions: string;
    pac_id: number;
    pack_ID: string;
    pac_ID: string;
    ship_from: string;
    ship_to: string;
    product_ID: Product[];
    package_info: string;
    bill_to: string;
    return_label: number;
    additional_info: AdditionalInfo;
    pickup_date_time: string;
    dropoff_date_time: string;
    tax_info: TaxInfo;
    package_status: string
}

interface PackagesTableProps {
    allPackagesData: Package[];
    isPackagesLoading: boolean;
}

const PackagesTable: React.FC<PackagesTableProps> = ({ allPackagesData, isPackagesLoading }) => {
    const dispatch = useAppDispatch();
    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);
    const [selectionModel, setSelectionModel] = useState<number[]>([]);
    const { data: locationsData } = useGetLocationMasterQuery({})
    const { data: productsData } = useGetAllProductsQuery({})
    const allProductsData = productsData?.products || [];
    const { data: packagesData } = useGetPackageMasterQuery({})
        // graphqlAPI
        const { data: allPackagesDatas, loading: packagesLoading, error: packagesError } = useQuery(GET_ALL_PACKAGES);
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const getAllPackages = packagesData?.packages.length > 0 ? packagesData?.packages : []

    const unorderedPackages = allPackagesData.filter(
        (eachPackage) => eachPackage?.package_status !== "ordered"
    );

    const getLocationDescription = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        const details = [
            location.loc_desc,
            location.address_1,
            location.city,
            location.state,
            location.country,
            location.pincode,
            location.loc_ID
        ].filter(Boolean);

        return details.length > 0 ? details.join(", ") : "Location details not available";
    };

    const getPackageDetails = (pac_ID: string) => {
        const packageInfo = getAllPackages.find((pkg: Package) => pkg.pac_ID === pac_ID);
        if (!packageInfo) return "Package details not available";
        const details = [
            packageInfo.packaging_type_name,
            packageInfo.dimensions,
            packageInfo.handling_unit_type,
            packageInfo.pac_ID
        ].filter(Boolean);
        return details.length > 0 ? details.join(", ") : "Package details not available";
    };

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

    const formatPickupDateTime = (pickupDateTime: string) => {
        return moment(pickupDateTime).format("MMM DD, YYYY h:mm A");
    };

    useEffect(() => {
        const selectedIds = selectedPackages.map((pkg) => pkg.pac_id);
        setSelectionModel(selectedIds);
    }, [selectedPackages]);

    const columns: GridColDef[] = [
        { field: 'pack_ID', headerName: 'Package ID', width: 150 },
        {
            field: "ship_from",
            headerName: "Ship from",
            width: 250,
        },
        {
            field: "ship_to",
            headerName: "Ship to",
            width: 250,
        },
        {
            field: "package_info",
            headerName: "Package Info",
            width: 250,
        },
        {
            field: "bill_to",
            headerName: "Bill to",
            width: 250,
        },
        {
            field: 'return_label',
            headerName: 'Return Label',
            width: 150,
            renderCell: (params: GridCellParams) => {
                const value = params.value === 1;
                return <span>{value ? 'True' : 'False'}</span>;
            },
        },

        { field: 'pickup_date_time', headerName: 'Pickup Date & Time', width: 200 },
        { field: 'dropoff_date_time', headerName: 'Dropoff Date & Time', width: 200 },
        { field: 'tax_rate', headerName: 'Tax Rate', width: 150 },
        {
            field: 'product_details',
            headerName: 'Product Details',
            width: 400,
            renderCell: (params: GridCellParams) => {
                const products = Array.isArray(params.value) ? params.value : [];

                if (!products.length) return <div>No products</div>;

                const productText = products
                    .map((prod) => {
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

        {
            field: 'additional_info',
            headerName: 'Additional Info',
            width: 250,
            renderCell: (params: GridCellParams) => {
                const info = params.value as { invoice: string; reference_id: string };
                return (
                    <div>
                        <div>Invoice: {info?.invoice}</div>
                        <div>Reference: {info?.reference_id}</div>
                    </div>
                );
            },
        },
    ];

    const rows = unorderedPackages.map((pkg: Package) => ({
        id: pkg.pac_id,
        pack_ID: pkg.pack_ID,
        ship_from: getLocationDescription(pkg.ship_from),
        ship_to: getLocationDescription(pkg.ship_to),
        package_info: getPackageDetails(pkg.package_info),
        bill_to: getLocationDescription(pkg.bill_to),
        return_label: pkg.return_label,
        pickup_date_time: formatPickupDateTime(pkg.pickup_date_time),
        dropoff_date_time: formatPickupDateTime(pkg.dropoff_date_time),
        tax_rate: pkg.tax_info.tax_rate,
        product_details: pkg.product_ID ?? [],
        additional_info: pkg.additional_info,
    }));


    const handleSelectionChange = (newSelection: number[]) => {
        setSelectionModel(newSelection);
        const selectedPackages = newSelection
            .map((id) => allPackagesData.find((pkg) => pkg.pac_id === id))
            .filter((pkg): pkg is Package => pkg !== undefined);
        dispatch(setSelectedPackages(selectedPackages));
    };

    return (
        <div>
            <Grid sx={{ marginTop: '5px', marginBottom: '20px' }}>
                {isPackagesLoading ? (
                    <DataGridSkeletonLoader columns={columns} />
                ) : (
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        checkboxSelection
                        pageSizeOptions={[10, 20, 30]}
                        rowSelectionModel={selectionModel}
                        onRowSelectionModelChange={(model) => handleSelectionChange(model as number[])}
                    />
                )}
            </Grid>
        </div>
    );
};

export default PackagesTable;
