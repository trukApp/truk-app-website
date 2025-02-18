'use client'
import React from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Grid, Tooltip, Typography } from '@mui/material';
import DataGridSkeletonLoader from '@/Components/ReusableComponents/DataGridSkeletonLoader';
import { useGetAllPackagesForOrderQuery, useGetLocationMasterQuery, useGetPackageMasterQuery } from '@/api/apiSlice';
import { Location } from '@/Components/MasterDataComponents/Locations';


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

interface PackagesTableProps {
    allPackagesData: Package[];
    isPackagesLoading: boolean;
}

const PackagesTable: React.FC<PackagesTableProps> = () => {
    const { data: locationsData } = useGetLocationMasterQuery({})
    const { data: packagesData } = useGetPackageMasterQuery({})
    const { data: packagesOrderData, error: allProductsFectchingError, isLoading: isPackagesLoading } = useGetAllPackagesForOrderQuery([]);
        if (allProductsFectchingError) {
    }
    const allPackagesData = packagesOrderData?.packages || [];
    console.log("allpcakages :", allPackagesData)
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const getAllPackages = packagesData?.packages.length > 0 ? packagesData?.packages : []
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
    const getPackageDetails = (pac_ID: string) => {
    const packageInfo = getAllPackages.find((pkg: Package) => pkg.pac_ID === pac_ID);
    
    if (!packageInfo) return "Package details not available";

        const details = [
        packageInfo.packaging_type_name,
        packageInfo.dimensions,
        packageInfo.handling_unit_type,
        
    ].filter(Boolean);

    return details.length > 0 ? details.join(", ") : "Package details not available";
};
    const columns: GridColDef[] = [
        { field: 'pack_ID', headerName: 'Package ID', width: 150 }, 
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
        {
    field: 'package_status',
    headerName: 'Package Status',
    width: 200,
    renderCell: (params) => (
      <Typography
        sx={{
          color: params.value === 'ordered' ? 'green' : '#83214F', fontSize:'14px',marginTop:2,fontWeight:600
          
        }}
      >
        {params.value === 'ordered' ? 'Order placed' : 'Not ordered'}
      </Typography>
    ),
  },
 

    ];

    const rows = allPackagesData.map((pkg: Package) => ({
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
        package_status: pkg.package_status
 


    }));


    return (
        <Grid sx={{margin:3}}>
            <Typography variant='h5' sx={{textAlign:'center', fontWeight:'bold'}} >All Packages(units) for order</Typography>
            <Grid sx={{ marginTop: '20px', marginBottom: '20px', marginLeft:'20px', marginRight:'20px' }}>
                {isPackagesLoading ? (
                    <DataGridSkeletonLoader columns={columns} />
                ) : (
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        // checkboxSelection
                        pageSizeOptions={[10, 20, 30]}
                        // rowSelectionModel={selectionModel}
                        // onRowSelectionModelChange={(model) => handleSelectionChange(model as number[])}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default PackagesTable;
