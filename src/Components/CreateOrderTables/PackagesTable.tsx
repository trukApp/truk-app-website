// import React, { useEffect, useState } from 'react';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { useAppSelector, useAppDispatch } from '@/store';
// import { setSelectedPackages } from '@/store/authSlice';

// interface Package {
//     id: number;
//     packageName: string;
//     weight: string;
//     length: string;
//     width: string;
//     volume: string;
//     senderName: string;
//     senderAddress: string;
//     senderPincode: string;
//     senderState: string;
//     senderCountry: string;
//     senderPhone: string;
//     receiverName: string;
//     receiverAddress: string;
//     receiverPincode: string;
//     receiverState: string;
//     receiverCountry: string;
//     receiverPhone: string;
// }

// interface PackagesTableProps {
//     packages: Package[];
// }

// const PackagesTable: React.FC<PackagesTableProps> = ({ packages }) => {
//     const dispatch = useAppDispatch();
//     const selectedPackages = useAppSelector(
//         (state) => state.auth.selectedPackages || [] // Handle nullable field
//     );
// const [selectionModel, setSelectionModel] = useState<number[]>([]);

// useEffect(() => {
//     if (selectedPackages.length > 0) {
//         const selectedRowIds = selectedPackages.map((pkg) =>
//             packages.findIndex((p) => p.packageName === pkg.packageName)
//         );
//         setSelectionModel(selectedRowIds);
//     }
// }, [selectedPackages, packages]);

//     const columns: GridColDef[] = [
//         { field: 'packageName', headerName: 'Package Name', width: 150 },
//         { field: 'weight', headerName: 'Weight', width: 100 },
//         { field: 'volume', headerName: 'Volume', width: 150 },
//         { field: 'senderName', headerName: 'Sender Name', width: 150 },
//         { field: 'senderAddress', headerName: 'Sender Address', width: 200 },
//         { field: 'senderPincode', headerName: 'Sender Pincode', width: 150 },
//         { field: 'receiverName', headerName: 'Receiver Name', width: 150 },
//         { field: 'receiverAddress', headerName: 'Receiver Address', width: 200 },
//         { field: 'receiverPincode', headerName: 'Receiver Pincode', width: 150 },
//     ];

//     const rows = packages.map((pkg, index: number) => ({
//         ...pkg,
//         id: index,
//     }));

//     const handleSelectionChange = (selectionModel: number[]) => {
//         console.log("selectionMode: l", selectionModel)
//         const selectedPackages = selectionModel.map((id) => packages[id]);
//         console.log("selectedPackages: ", selectedPackages)
//         dispatch(setSelectedPackages(selectedPackages));
//     };

//     return (
//         <div style={{ height: 630, width: '100%' }}>
//             <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 checkboxSelection
//                 onRowSelectionModelChange={(model) =>
//                     handleSelectionChange(model as number[])
//                 }
//                 rowSelectionModel={selectionModel}
//             />
//         </div>
//     );
// };

// export default PackagesTable;


import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '@/store';
import { setCreateOrderDesination, setSelectedPackages } from '@/store/authSlice';
import { Product } from '@/app/productmaster/page';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useGetLocationMasterQuery } from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';

interface ProductsTableProps {
    allProductsData: Product[];
    isProductsLoading: boolean;
}

const PackagesTable: React.FC<ProductsTableProps> = ({ allProductsData, isProductsLoading }) => {
    const dispatch = useAppDispatch();
    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);
    const sourceLocation = useAppSelector((state) => state.auth.createOrderDesination);
    console.log("sourceLocation: ", sourceLocation)
    const [selectionModel, setSelectionModel] = useState<number[]>([]);
    const { data: locationsData, error: getLocationsError } = useGetLocationMasterQuery([])
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    console.log("getLocationsError: ", getLocationsError)
    const [locationId, setLocationId] = useState<string>(sourceLocation);

    console.log("selectedPackages: ", selectedPackages)

    useEffect(() => {
        // Update local selection model when Redux state changes
        const selectedIds = selectedPackages.map((product) => product.prod_id);
        setSelectionModel(selectedIds);
    }, [selectedPackages]);

    const columns: GridColDef[] = [
        { field: 'productName', headerName: 'Product Name', width: 150 },
        { field: 'product_ID', headerName: 'Product ID', width: 150 },
        { field: 'product_desc', headerName: 'Product Description', width: 200 },
        { field: 'sales_uom', headerName: 'Sales UOM', width: 150 },
        { field: 'basic_uom', headerName: 'Basic UOM', width: 150 },
        { field: 'weight', headerName: 'Weight', width: 150 },
        { field: 'volume', headerName: 'Volume', width: 150 },
        { field: 'expiration', headerName: 'Expiration Date', width: 180 },
        { field: 'best_before', headerName: 'Best Before Date', width: 180 },
        { field: 'hsn_code', headerName: 'HSN Code', width: 150 },
        { field: 'sku_num', headerName: 'SKU Number', width: 150 },
        {
            field: 'fragile_goods',
            headerName: 'Fragile Goods',
            width: 180,
            valueFormatter: (params: GridCellParams) => (params?.value ? 'Yes' : 'No'),
        },
        {
            field: 'dangerous_goods',
            headerName: 'Dangerous Goods',
            width: 180,
            valueFormatter: (params: GridCellParams) => (params.value ? 'Yes' : 'No'),
        },
    ];

    const rows = allProductsData.map((product: Product) => ({
        id: product.prod_id,
        product_ID: product.product_ID,
        product_desc: product.product_desc,
        sales_uom: product.sales_uom,
        basic_uom: product.basic_uom,
        weight: product.weight,
        volume: product.volume,
        expiration: product.expiration,
        best_before: product.best_before,
        hsn_code: product.hsn_code,
        sku_num: product.sku_num,
        fragile_goods: product.fragile_goods,
        dangerous_goods: product.dangerous_goods,
        productName: product.product_name,
    }));

    const handleSelectionChange = (newSelection: number[]) => {
        setSelectionModel(newSelection);
        const selectedProducts = newSelection
            .map((id) => allProductsData.find((product) => product.prod_id === id))
            .filter((product): product is Product => product !== undefined);

        dispatch(setSelectedPackages(selectedProducts)); // Update Redux state
    };

    return (
        <div>

            <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                    <InputLabel>Location ID</InputLabel>
                    <Select
                        label="Location ID"
                        name="locationId"
                        value={locationId}
                        onChange={(event) => {
                            setLocationId(event.target.value)
                            dispatch(setCreateOrderDesination(event.target.value))
                        }}
                    >
                        {getAllLocations.map((location: Location) => {
                            return (
                                <MenuItem key={location?.loc_ID} value={location?.loc_ID}>
                                    {location.loc_ID}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid sx={{ marginTop: '20px', marginBottom: '20px' }}>
                {isProductsLoading ? (
                    <DataGridSkeletonLoader columns={columns} />
                ) : (
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        checkboxSelection
                        pageSizeOptions={[10, 20, 30]}
                        rowSelectionModel={selectionModel}
                        onRowSelectionModelChange={(model) =>
                            handleSelectionChange(model as number[])
                        }
                    />
                )}

            </Grid>
        </div>
    );
};

export default PackagesTable;