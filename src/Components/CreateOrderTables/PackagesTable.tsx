import React, { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '@/store';
import { setFilters, setSelectedPackages } from '@/store/authSlice';
import { Grid, FormControlLabel, Checkbox } from '@mui/material';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';

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
    pac_id: number;
    pack_ID: string;
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

const PackagesTable: React.FC<PackagesTableProps> = ({ allPackagesData, isPackagesLoading }) => {
    const dispatch = useAppDispatch();
    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);
    const [selectionModel, setSelectionModel] = useState<number[]>([]);
    const filters = useAppSelector((state) => state.auth.filters);

    useEffect(() => {
        const selectedIds = selectedPackages.map((pkg) => pkg.pac_id);
        setSelectionModel(selectedIds);
    }, [selectedPackages]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        dispatch(setFilters({ ...filters, [name]: checked }));
    };

    const columns: GridColDef[] = [
        { field: 'pack_ID', headerName: 'Package ID', width: 150 },
        { field: 'ship_from', headerName: 'Ship From', width: 150 },
        { field: 'ship_to', headerName: 'Ship To', width: 150 },
        { field: 'package_info', headerName: 'Package Info', width: 150 },
        { field: 'bill_to', headerName: 'Bill To', width: 150 },
        { field: 'return_label', headerName: 'Return Label', width: 150 },
        { field: 'pickup_date_time', headerName: 'Pickup Date & Time', width: 200 },
        { field: 'dropoff_date_time', headerName: 'Dropoff Date & Time', width: 200 },
        { field: 'tax_rate', headerName: 'Tax Rate', width: 150 },
        {
            field: 'product_details',
            headerName: 'Product Details',
            width: 300,
            renderCell: (params: GridCellParams) => {
                const products = params.value as { prod_ID: string; quantity: number }[]; // Type assertion
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
                const info = params.value as { invoice: string; reference_id: string }; // Type assertion
                return (
                    <div>
                        <div>Invoice: {info?.invoice}</div>
                        <div>Reference: {info?.reference_id}</div>
                    </div>
                );
            },
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
            <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
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
            </Grid>

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
