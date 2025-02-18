// // 'use client';
// // import { useAppSelector, useAppDispatch } from '@/store';
// // import React from 'react';
// // import { Checkbox, FormControlLabel, Grid, Paper, Typography } from '@mui/material';
// // import { setFilters } from '@/store/authSlice';

// // const ConfigSettings = () => {
// //     const dispatch = useAppDispatch();
// //     const filters = useAppSelector((state) => state.auth.filters);

// //     console.log("Redux Filters: ", filters);

// //     const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //         const { name, checked } = event.target;
// //         dispatch(setFilters({
// //             ...filters,
// //             [name]: checked // Update only the selected filter
// //         }));
// //     };

// //     return (
// //         <Paper sx={{ p: 3, width: '350px', borderRadius: 2, boxShadow: 3 }}>
// //             <Typography variant="h6" gutterBottom sx={{ color: '#83214F' }}>
// //                 Config Settings
// //             </Typography>

// //             <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
// //                 {Object.entries(filters).map(([filterKey, filterValue]) => (
// //                     <Grid item xs={12} key={filterKey}>
// //                         <FormControlLabel
// //                             control={
// //                                 <Checkbox
// //                                     checked={filterValue}
// //                                     onChange={handleFilterChange}
// //                                     name={filterKey}
// //                                 />
// //                             }
// //                             label={filterKey.replace(/([A-Z])/g, ' $1').trim()}
// //                         />
// //                     </Grid>
// //                 ))}
// //             </Grid>
// //         </Paper>
// //     );
// // };

// // export default ConfigSettings;



// 'use client';
// import { useAppSelector, useAppDispatch } from '@/store';
// import React from 'react';
// import { Checkbox, FormControlLabel, Grid, Paper, Typography } from '@mui/material';
// import { setFilters } from '@/store/authSlice';

// const ConfigSettings = () => {
//     const dispatch = useAppDispatch();
//     const filters = useAppSelector((state) => state.auth.filters);

//     console.log("Redux Filters: ", filters);

//     const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, checked } = event.target;
//         dispatch(setFilters({
//             ...filters,
//             [name]: checked // Update only the selected filter
//         }));
//     };

//     return (
//         <Paper sx={{ p: 3, width: '350px', borderRadius: 2, boxShadow: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ color: '#83214F' }}>
//                 Config Settings
//             </Typography>

//             <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
//                 {Object.entries(filters).map(([filterKey, filterValue]) => (
//                     <Grid item xs={12} key={filterKey}>
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     checked={typeof filterValue === "boolean" ? filterValue : false} // Ensure correct boolean value
//                                     onChange={handleFilterChange}
//                                     name={filterKey}
//                                 />
//                             }
//                             label={filterKey.replace(/([A-Z])/g, ' $1').trim()}
//                         />
//                     </Grid>
//                 ))}
//             </Grid>
//         </Paper>
//     );
// };

// export default ConfigSettings;


'use client';
import { useAppSelector, useAppDispatch } from '@/store';
import React from 'react';
import { Checkbox, FormControlLabel, Grid, Paper, Typography } from '@mui/material';
import { setFilters } from '@/store/authSlice';

const ConfigSettings = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.auth.filters);

    console.log("Redux Filters BEFORE Rendering:", filters); // Debugging

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        dispatch(setFilters({ ...filters, [name]: checked }));
    };

    return (
        <Paper sx={{ p: 3, width: '350px', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#83214F' }}>
                Config Settings
            </Typography>

            <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
                {Object.entries(filters).map(([filterKey, filterValue]) => (
                    <Grid item xs={12} key={filterKey}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={Boolean(filters[filterKey])} // Ensure it's a boolean value
                                    onChange={handleFilterChange}
                                    name={filterKey}
                                />
                            }
                            label={filterKey.replace(/([A-Z])/g, ' $1').trim()}
                        />

                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default ConfigSettings;
