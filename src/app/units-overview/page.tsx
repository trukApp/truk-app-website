'use client'
import React, { useState, useMemo } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Grid, Tooltip, Typography, MenuItem, TextField } from '@mui/material';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import DataGridSkeletonLoader from '@/Components/ReusableComponents/DataGridSkeletonLoader';
import { useGetAllPackagesForOrderQuery, useGetAllProductsQuery, useGetLocationMasterQuery, useGetPackageMasterQuery } from '@/api/apiSlice';
import { Location } from '@/Components/MasterDataComponents/Locations';
import moment from 'moment';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);

export interface Product {
    prod_ID: string;
    quantity: number;
    product_ID: string;
}

export interface AdditionalInfo {
    invoice: string;
    reference_id: string;
}

export interface TaxInfo {
    tax_rate: string;
}

export interface Package {
    package_status: string;
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
}

const PackagesTable = () => {
    const [dateFilter, setDateFilter] = useState<string>('All');

    const { data: locationsData } = useGetLocationMasterQuery({});
    const { data: packagesData } = useGetPackageMasterQuery({});
    const { data: packagesOrderData, isLoading: isPackagesLoading } = useGetAllPackagesForOrderQuery([]);

    const allPackagesData = packagesOrderData?.packages || [];
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : [];
    const getAllPackages = packagesData?.packages.length > 0 ? packagesData?.packages : [];



    const { data: productsData } = useGetAllProductsQuery({});
    const allProductsData = productsData?.products || [];

    const getLocationDescription = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return 'Location details not available';
        const details = [
            location.loc_ID,
            location.loc_desc,
            location.address_1,
            location.city,
            location.state,
            location.country,
            location.pincode
        ].filter(Boolean);
        return details.length > 0 ? details.join(', ') : 'Location details not available';
    };

    const getPackageDetails = (pac_ID: string) => {
        const packageInfo = getAllPackages.find((pkg: Package) => pkg.pac_ID === pac_ID);
        if (!packageInfo) return 'Package details not available';
        const details = [
            packageInfo.packaging_type_name,
            packageInfo.dimensions,
            packageInfo.handling_unit_type
        ].filter(Boolean);
        return details.length > 0 ? details.join(', ') : 'Package details not available';
    };

    const getProductDetails = (productID: string) => {
        const productInfo = allProductsData.find((product: Product) => product.product_ID === productID);
        if (!productInfo) return 'Package details not available';
        const details = [
            productInfo.product_name,
            productInfo.weight
        ].filter(Boolean);
        return details.length > 0 ? details.join('-') : 'Product details not available';
    };

    const formatPickupDateTime = (pickupDateTime: string) => {
        return moment(pickupDateTime).format('MMM DD, YYYY h:mm A');
    };


    const getLocationDetails = (loc_ID: string) => {
        const location = getAllLocations.find((loc: Location) => loc.loc_ID === loc_ID);
        if (!location) return "Location details not available";
        const details = [
            location.address_1,
            location.address_2,
            location.city,
            location.state,
            location.country,
            location.pincode
        ].filter(Boolean);

        return details.length > 0 ? details.join(", ") : "Location details not available";
    };


    const columns: GridColDef[] = [
			{ field: "pack_ID", headerName: "Package ID", width: 150 },
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
			{ field: "return_label", headerName: "Return Label", width: 150 },
			{
				field: "pickup_date_time",
				headerName: "Pickup Date & Time",
				width: 200,
				sortable: true,
				sortComparator: (v1, v2, param1, param2) =>
					new Date(
						param1.api.getCellValue(param1.id, "pickup_date_time_raw")
					).getTime() -
					new Date(
						param2.api.getCellValue(param2.id, "pickup_date_time_raw")
					).getTime(),
			},
			{
				field: "dropoff_date_time",
				headerName: "Dropoff Date & Time",
				width: 200,
				sortable: true,
				sortComparator: (v1, v2, param1, param2) =>
					new Date(
						param1.api.getCellValue(param1.id, "dropoff_date_time_raw")
					).getTime() -
					new Date(
						param2.api.getCellValue(param2.id, "dropoff_date_time_raw")
					).getTime(),
			},
			{ field: "tax_rate", headerName: "Tax Rate", width: 150 },
			{
				field: "product_details",
				headerName: "Product Details",
				width: 400,
				renderCell: (params: GridCellParams) => {
					const products = Array.isArray(params.value) ? params.value : [];
					if (!products.length) return <div>No products</div>;

					const productText = products
						.map((prod) => {
							const detail = getProductDetails(prod.prod_ID);
							return `${detail} (Qty: ${prod.quantity})`;
						})
						.join(", ");

					return (
						<div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
							{productText}
						</div>
					);
				},
			},
			{
				field: "additional_info",
				headerName: "Additional Info",
				width: 250,
				renderCell: (params: GridCellParams) => {
					const info = params.value as {
						invoice: string;
						reference_id: string;
					};
					return (
						<div>
							<div>Invoice: {info?.invoice}</div>
							<div>Reference: {info?.reference_id}</div>
						</div>
					);
				},
			},
			{
				field: "package_status",
				headerName: "Package Status",
				width: 200,
				renderCell: (params) => (
					<Typography
						sx={{
							color: params.value === "ordered" ? "green" : "#F08C24",
							fontSize: "14px",
							marginTop: 2,
							fontWeight: 600,
						}}
					>
						{params.value === "ordered" ? "Order placed" : "Not ordered"}
					</Typography>
				),
			},
		];

    const rows = allPackagesData.map((pkg: Package) => ({
			id: pkg.pac_id,
			pack_ID: pkg.pack_ID,
			ship_from: getLocationDescription(pkg.ship_from),
			ship_to: getLocationDescription(pkg.ship_to),
			package_info: getPackageDetails(pkg.package_info),
			bill_to: getLocationDescription(pkg.bill_to),
			return_label: pkg.return_label,
			pickup_date_time_raw: pkg?.pickup_date_time
				? new Date(pkg.pickup_date_time)
				: null,
			dropoff_date_time_raw: pkg?.dropoff_date_time
				? new Date(pkg.dropoff_date_time)
				: null,
			pickup_date_time: formatPickupDateTime(pkg.pickup_date_time),
			dropoff_date_time: formatPickupDateTime(pkg.dropoff_date_time),
			tax_rate: pkg.tax_info.tax_rate,
			product_details: pkg.product_ID ?? [],
			additional_info: pkg.additional_info,
		}));

    // Filter rows based on dateFilter
    const filteredRows = useMemo(() => {
        if (dateFilter === 'All') return rows;
        const today = dayjs();

        return rows.filter((row: ReturnType<typeof rows[number]>) => {
            const pickupDate = dayjs(row.pickup_date_time);
            switch (dateFilter) {
                case 'Today':
                    return pickupDate.isSame(today, 'day');
                case 'Yesterday':
                    return pickupDate.isSame(today.subtract(1, 'day'), 'day');
                case 'This Week':
                    return pickupDate.isSame(today, 'week');
                case 'This Month':
                    return pickupDate.isSame(today, 'month');
                case 'This Year':
                    return pickupDate.isSame(today, 'year');
                default:
                    return true;
            }
        });
    }, [rows, dateFilter]);

    return (
        <Grid sx={{ margin: 3 }}>
            <Grid container spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
                <Grid item xs={12} md={3}>
                    <TextField
                        size="small"
                        fullWidth
                        select
                        label="Date Filter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Today">Today</MenuItem>
                        <MenuItem value="Yesterday">Yesterday</MenuItem>
                        <MenuItem value="This Week">This Week</MenuItem>
                        <MenuItem value="This Month">This Month</MenuItem>
                        <MenuItem value="This Year">This Year</MenuItem>
                    </TextField>
                </Grid>
            </Grid>


            <Typography variant="body1" sx={{ mb: 2, color: 'gray', mt: 1 }}>
                This page displays all package units associated. You can view package details like shipping addresses, product contents, tax rates, pickup/drop-off timings, and more.
            </Typography>

            <Grid sx={{ marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
                {isPackagesLoading ? (
                    <DataGridSkeletonLoader columns={columns} />
                ) : (
                    <DataGrid
                        columns={columns}
                        rows={filteredRows}
                        pageSizeOptions={[10, 20, 30]}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default PackagesTable;
