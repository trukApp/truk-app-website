// import React, { useEffect, useState } from 'react';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { useAppSelector, useAppDispatch } from '@/store';
// import { setSelectedPackages } from '@/store/authSlice';

// interface Package {
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
//     const selectedPackages = useAppSelector((state: any) => state.auth.selectedPackages);
//     const [selectionModel, setSelectionModel] = useState<number[]>([]);

//     useEffect(() => {
//         if (selectedPackages.length > 0) {
//             const selectedRowIds = selectedPackages.map((pkg: any) => packages.findIndex(p => p.packageName === pkg.packageName));
//             setSelectionModel(selectedRowIds);
//         }
//     }, [selectedPackages, packages]);

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

//     const rows = packages.map((pkg, index) => ({
//         id: index,
//         ...pkg,
//     }));

//     const handleSelectionChange = (selectionModel: any) => {
//         // Ensure selectionModel is an array of selected row ids
//         const selectedPackages = selectionModel.map((id: any) => packages[id]);
//         dispatch(setSelectedPackages(selectedPackages));
//     };

//     return (
//         <div style={{ height: 630, width: '100%' }}>
//             <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 checkboxSelection
//                 onRowSelectionModelChange={handleSelectionChange}
//                 rowSelectionModel={selectionModel}
//             />
//         </div>
//     );
// };

// export default PackagesTable;


import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSelectedPackages } from '@/store/authSlice';

interface Package {
    id: number;
    packageName: string;
    weight: string;
    length: string;
    width: string;
    volume: string;
    senderName: string;
    senderAddress: string;
    senderPincode: string;
    senderState: string;
    senderCountry: string;
    senderPhone: string;
    receiverName: string;
    receiverAddress: string;
    receiverPincode: string;
    receiverState: string;
    receiverCountry: string;
    receiverPhone: string;
}

interface PackagesTableProps {
    packages: Package[];
}

const PackagesTable: React.FC<PackagesTableProps> = ({ packages }) => {
    const dispatch = useAppDispatch();
    const selectedPackages = useAppSelector(
        (state) => state.auth.selectedPackages || [] // Handle nullable field
    );
    const [selectionModel, setSelectionModel] = useState<number[]>([]);

    useEffect(() => {
        if (selectedPackages.length > 0) {
            const selectedRowIds = selectedPackages.map((pkg) =>
                packages.findIndex((p) => p.packageName === pkg.packageName)
            );
            setSelectionModel(selectedRowIds);
        }
    }, [selectedPackages, packages]);

    const columns: GridColDef[] = [
        { field: 'packageName', headerName: 'Package Name', width: 150 },
        { field: 'weight', headerName: 'Weight', width: 100 },
        { field: 'volume', headerName: 'Volume', width: 150 },
        { field: 'senderName', headerName: 'Sender Name', width: 150 },
        { field: 'senderAddress', headerName: 'Sender Address', width: 200 },
        { field: 'senderPincode', headerName: 'Sender Pincode', width: 150 },
        { field: 'receiverName', headerName: 'Receiver Name', width: 150 },
        { field: 'receiverAddress', headerName: 'Receiver Address', width: 200 },
        { field: 'receiverPincode', headerName: 'Receiver Pincode', width: 150 },
    ];

    const rows = packages.map((pkg,) => ({
        ...pkg,
    }));

    const handleSelectionChange = (selectionModel: number[]) => {
        const selectedPackages = selectionModel.map((id) => packages[id]);
        dispatch(setSelectedPackages(selectedPackages));
    };

    return (
        <div style={{ height: 630, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                onRowSelectionModelChange={(model) =>
                    handleSelectionChange(model as number[])
                }
                rowSelectionModel={selectionModel}
            />
        </div>
    );
};

export default PackagesTable;
