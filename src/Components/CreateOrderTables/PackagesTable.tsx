import React, { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSelectedPackages } from '@/store/authSlice';
import { Grid, Tooltip } from '@mui/material';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import { useGetLocationMasterQuery, useGetPackageMasterQuery } from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';


export interface Product {
    prod_ID: string;
    quantity: number;
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
    // const filters = useAppSelector((state) => state.auth.filters);
    const { data: locationsData } = useGetLocationMasterQuery({})
    const { data: packagesData } = useGetPackageMasterQuery({})
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const getAllPackages = packagesData?.packages.length > 0 ? packagesData?.packages : []

    const unorderedPackages = allPackagesData.filter(
        (eachPackage) => eachPackage?.package_status !== "ordered"
    );

    const getLocationDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        const details = [
            location.loc_ID,
            location.address_1,
            location.address_2,
            location.city,
            location.state,
            location.country,
            location.pincode
        ].filter(Boolean);

        return details.length > 0 ? details.join(", ") : "Location details not available";
    };

    const getPackageDetails = (pac_ID: string) => {
        const packageInfo = getAllPackages.find((pkg: Package) => pkg.pac_ID === pac_ID);

        if (!packageInfo) return "Package details not available";

        const details = [
            packageInfo.packaging_type_name,
            packageInfo.dimensions,
            // packageInfo.dimensions_uom,
            packageInfo.handling_unit_type,

        ].filter(Boolean);

        return details.length > 0 ? details.join(", ") : "Package details not available";
    };

    useEffect(() => {
        const selectedIds = selectedPackages.map((pkg) => pkg.pac_id);
        setSelectionModel(selectedIds);
    }, [selectedPackages]);

    // const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, checked } = event.target;
    //     dispatch(setFilters({ ...filters, [name]: checked }));
    // };

    const columns: GridColDef[] = [
        { field: 'pack_ID', headerName: 'Package ID', width: 150 },
        // { field: 'ship_from', headerName: 'Ship From', width: 150 },
        {
            field: "ship_from",
            headerName: "Ship from",
            width: 150,
            renderCell: (params) => (
                <Tooltip title={getLocationDetails(params.value)} arrow>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },
        // { field: 'ship_to', headerName: 'Ship To', width: 150 },
        {
            field: "ship_to",
            headerName: "Ship to",
            width: 150,
            renderCell: (params) => (
                <Tooltip title={getLocationDetails(params.value)} arrow>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },
        // { field: 'package_info', headerName: 'Package Info', width: 150 },
        {
            field: "package_info",
            headerName: "Package Info",
            width: 150,
            renderCell: (params) => (
                <Tooltip title={getPackageDetails(params.value)} arrow>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },

        // { field: 'bill_to', headerName: 'Bill To', width: 150 },
        {
            field: "bill_to",
            headerName: "Bill to",
            width: 150,
            renderCell: (params) => (
                <Tooltip title={getLocationDetails(params.value)} arrow>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },
        { field: 'return_label', headerName: 'Return Label', width: 150 },
        { field: 'pickup_date_time', headerName: 'Pickup Date & Time', width: 200 },
        { field: 'dropoff_date_time', headerName: 'Dropoff Date & Time', width: 200 },
        { field: 'tax_rate', headerName: 'Tax Rate', width: 150 },
        {
            field: 'product_details',
            headerName: 'Product Details',
            width: 300,
            renderCell: (params: GridCellParams) => {
                const products = params.value as { prod_ID: string; quantity: number }[];
                return (
                    <div>
                        {products?.map((prod) => (
                            <div key={prod.prod_ID}>{`${prod.prod_ID} (Qty: ${prod.quantity})`}</div>
                        ))}
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
        ship_from: pkg.ship_from,
        ship_to: pkg.ship_to,
        package_info: pkg.package_info,
        bill_to: pkg.bill_to,
        return_label: pkg.return_label,
        pickup_date_time: pkg.pickup_date_time,
        dropoff_date_time: pkg.dropoff_date_time,
        tax_rate: pkg.tax_info.tax_rate,
        product_details: pkg.product_ID,
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
            {/* <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
                {Object.entries(filters).map(([filterKey, filterValue]) => (
                    <Grid item key={filterKey}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filterValue}
                                    onChange={handleFilterChange}
                                    name={filterKey}
                                />
                            }
                            label={filterKey.replace(/([A-Z])/g, ' $1').trim()}
                        />
                    </Grid>
                ))}
            </Grid> */}

            <Grid sx={{ marginTop: '20px', marginBottom: '20px' }}>
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
