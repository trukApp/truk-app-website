// "use client";
// import React from "react";
// import { Box, Paper, Typography, Grid } from "@mui/material";
// import moment from "moment";
// import { CarrierFormBE } from "../BusinessPartnersForms/CarriersForm";


// interface AllBid {
//     bid_from: string;
//     bid_amount: string;
//     bid_placed_at: string;
// }

// interface Bid {
//     bid_id: number;
//     order_ID: string;
//     bid_value: string;
//     bid_timing: string;
//     bid_start_time: string;
//     bid_end_time?: string | null;
//     all_bids: AllBid[];
// }

// interface BidsOverviewProps {
//     bidsData: Bid[]; // bidsData.data
//     carriers: CarrierFormBE[];
// }

// const BidsOverview: React.FC<BidsOverviewProps> = ({ bidsData, carriers }) => {
//     const getCarrierDetails = (bidFrom: string) => {
//         if (!bidFrom) return null;
//         return carriers.find(
//             (c: CarrierFormBE) =>
//                 c.carrier_ID === bidFrom ||
//                 c.cr_id?.toString() === bidFrom?.toString()
//         );
//     };

//     return (
//         <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
//             <Typography
//                 variant="h6"
//                 gutterBottom
//                 sx={{ color: "#F08C24", fontWeight: "bold", mb: 2 }}
//             >
//                 Bids Overview
//             </Typography>

//             {bidsData.map((bid: Bid, index: number) => (
//                 <Paper
//                     key={index}
//                     sx={{
//                         p: 2,
//                         mb: 2,
//                         borderRadius: 2,
//                         backgroundColor: "#FFF8E1",
//                         boxShadow: 1,
//                     }}
//                 >
//                     {/* Bid Details */}
//                     <Box sx={{ mb: 2 }}>
//                         <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
//                             Bid Details
//                         </Typography>
//                         <Typography variant="body2"><strong>Bid ID:</strong> {bid.bid_id}</Typography>
//                         <Typography variant="body2"><strong>Order ID:</strong> {bid.order_ID}</Typography>
//                         <Typography variant="body2"><strong>Bid Value:</strong> ₹{bid.bid_value}</Typography>
//                         <Typography variant="body2"><strong>Bid Timing:</strong> {bid.bid_timing} hr</Typography>
//                         <Typography variant="body2">
//                             <strong>Start Time:</strong> {moment(bid.bid_start_time).format("DD MMM YYYY HH:mm")}
//                         </Typography>
//                         {bid.bid_end_time && (
//                             <Typography variant="body2">
//                                 <strong>End Time:</strong> {moment(bid.bid_end_time).format("DD MMM YYYY HH:mm")}
//                             </Typography>
//                         )}
//                     </Box>

//                     {/* All Bids in a Row */}
//                     {bid.all_bids?.length > 0 && (
//                         <Box>
//                             <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
//                                 All Bids
//                             </Typography>
//                             <Grid container spacing={2}>
//                                 {bid.all_bids.map((ab: Bid, i: number) => {
//                                     const carrier = getCarrierDetails(ab.bid_from);
//                                     return (
//                                         <Grid item key={i}>
//                                             <Paper
//                                                 sx={{
//                                                     p: 2,
//                                                     minWidth: 200,
//                                                     borderRadius: 2,
//                                                     backgroundColor: "#E3F2FD",
//                                                     boxShadow: 1,
//                                                 }}
//                                             >
//                                                 <Typography variant="body2" sx={{ mb: 1 }}>
//                                                     <strong>Bid From:</strong> {ab.bid_from} → <strong>₹{ab.bid_amount}</strong>
//                                                 </Typography>
//                                                 <Typography variant="body2" sx={{ mb: 1 }}>
//                                                     <strong>Placed At:</strong> {moment(ab.bid_placed_at).format("DD MMM YYYY HH:mm")}
//                                                 </Typography>

//                                                 {carrier ? (
//                                                     <Box>
//                                                         <Typography variant="body2"><strong>Name:</strong> {carrier.carrier_name || "-"}</Typography>
//                                                         <Typography variant="body2"><strong>Phone:</strong> {carrier.carrier_correspondence?.phone || "-"}</Typography>
//                                                         <Typography variant="body2"><strong>Email:</strong> {carrier.carrier_correspondence?.email || "-"}</Typography>
//                                                         {/* <Typography variant="body2"><strong>Vehicle:</strong> {carrier.vehicle_types_handling?.join(", ") || "-"}</Typography> */}
//                                                     </Box>
//                                                 ) : (
//                                                     <Typography variant="body2" sx={{ fontStyle: "italic", color: "gray" }}>
//                                                         Carrier not found
//                                                     </Typography>
//                                                 )}
//                                             </Paper>
//                                         </Grid>
//                                     );
//                                 })}
//                             </Grid>
//                         </Box>
//                     )}
//                 </Paper>
//             ))}
//         </Paper>
//     );
// };

// export default BidsOverview;



"use client";
import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import moment from "moment";
import { CarrierFormBE } from "../BusinessPartnersForms/CarriersForm";

interface AllBid {
    bid_from: string;
    bid_amount: string;
    bid_placed_at: string;
}

interface Bid {
    bid_id: number;
    order_ID: string;
    bid_value: string;
    bid_timing: string;
    bid_start_time: string;
    bid_end_time?: string | null;
    all_bids: AllBid[];
}

interface BidsOverviewProps {
    bidsData: Bid[];
    carriers: CarrierFormBE[];
}

const BidsOverview: React.FC<BidsOverviewProps> = ({ bidsData, carriers }) => {
    const getCarrierDetails = (bidFrom: string) => {
        if (!bidFrom) return null;
        return carriers.find(
            (c: CarrierFormBE) =>
                c.carrier_ID === bidFrom ||
                c.cr_id?.toString() === bidFrom?.toString()
        );
    };

    return (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#F08C24", fontWeight: "bold", mb: 2 }}
            >
                Bids Overview
            </Typography>

            {bidsData.map((bid: Bid, index: number) => (
                <Paper
                    key={index}
                    sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor: "#FFF8E1",
                        boxShadow: 1,
                    }}
                >
                    {/* Bid Details */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                            Bid Details
                        </Typography>
                        <Typography variant="body2"><strong>Bid ID:</strong> {bid.bid_id}</Typography>
                        <Typography variant="body2"><strong>Order ID:</strong> {bid.order_ID}</Typography>
                        <Typography variant="body2"><strong>Bid Value:</strong> ₹{bid.bid_value}</Typography>
                        <Typography variant="body2"><strong>Bid Timing:</strong> {bid.bid_timing} hr</Typography>
                        <Typography variant="body2">
                            <strong>Start Time:</strong> {moment(bid.bid_start_time).format("DD MMM YYYY HH:mm")}
                        </Typography>
                        {bid.bid_end_time && (
                            <Typography variant="body2">
                                <strong>End Time:</strong> {moment(bid.bid_end_time).format("DD MMM YYYY HH:mm")}
                            </Typography>
                        )}
                    </Box>

                    {/* All Bids in a Row */}
                    {bid.all_bids?.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                                All Bids
                            </Typography>
                            <Grid container spacing={2}>
                                {bid.all_bids.map((ab: AllBid, i: number) => {
                                    const carrier = getCarrierDetails(ab.bid_from);
                                    return (
                                        <Grid item key={i}>
                                            <Paper
                                                sx={{
                                                    p: 2,
                                                    minWidth: 220,
                                                    borderRadius: 2,
                                                    backgroundColor: "#E3F2FD",
                                                    boxShadow: 1,
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Bid From:</strong> {ab.bid_from} → <strong>₹{ab.bid_amount}</strong>
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Placed At:</strong> {moment(ab.bid_placed_at).format("DD MMM YYYY HH:mm")}
                                                </Typography>

                                                {carrier ? (
                                                    <Box>
                                                        <Typography variant="body2"><strong>Name:</strong> {carrier.carrier_name || "-"}</Typography>
                                                        <Typography variant="body2"><strong>Phone:</strong> {carrier.carrier_correspondence?.phone || "-"}</Typography>
                                                        <Typography variant="body2"><strong>Email:</strong> {carrier.carrier_correspondence?.email || "-"}</Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "gray" }}>
                                                        Carrier not found
                                                    </Typography>
                                                )}
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}
                </Paper>
            ))}
        </Paper>
    );
};

export default BidsOverview;
