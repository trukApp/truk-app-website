"use client";
import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import moment, { Moment } from "moment";
import { CarrierFormBE } from "../BusinessPartnersForms/CarriersForm";
import { Field, FieldProps, Form, Formik } from "formik";
import * as Yup from "yup";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
    useAssignToLowestBidMutation,
    useCancelAuctionMutation,
    useEditAuctionByOrderIDMutation,
} from "@/api/apiSlice";

interface AllBid {
    bid_from: string;
    bid_amount: string;
    bid_placed_at: string;
}

interface FinalisedFor {
    carrier?: string;
}

interface FinalisedBid {
    value?: string;
}
interface Bid {
    bid_id: number;
    order_ID: string;
    bid_value: string;
    bid_timing: string;
    bid_start_time: string;
    bid_end_time?: string | null;
    all_bids: AllBid[];
    bid_closing_time: string;
    finalised_bid?: {
        finalised_for?: FinalisedFor;
        finalised_bid?: FinalisedBid;
    };
}

interface BidsOverviewProps {
    bidsData: Bid[];
    carriers: CarrierFormBE[];
    orderId: string;
}

const BidsOverview: React.FC<BidsOverviewProps> = ({ bidsData, carriers, orderId }) => {
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
    const [editAuction] = useEditAuctionByOrderIDMutation();
    const [cancelAuction] = useCancelAuctionMutation();
    const [assignAuctionToLowestBid] = useAssignToLowestBidMutation();

    const getCarrierDetails = (bidFrom: string) => {
        if (!bidFrom) return null;
        return carriers.find(
            (c: CarrierFormBE) =>
                c.carrier_ID === bidFrom || c.cr_id?.toString() === bidFrom?.toString()
        );
    };

    const getLowestBid = (all_bids: AllBid[]) => {
        if (!all_bids || all_bids.length === 0) return null;
        return all_bids.reduce((min, curr) =>
            parseFloat(curr.bid_amount) < parseFloat(min.bid_amount) ? curr : min
        );
    };

    const handleCancelClick = (bid: Bid) => {
        setSelectedBid(bid);
        setCancelDialogOpen(true);
    };

    const handleEditClick = (bid: Bid) => {
        setSelectedBid(bid);
        setEditDialogOpen(true);
    };

    const handleEditAuction = async (values: { bid_value: string; bid_end_time: Moment | null }) => {
        if (!selectedBid) return;

        const formattedEndDate = values.bid_end_time
            ? moment(values.bid_end_time).format("YYYY-MM-DDTHH:mm:ss")
            : null;

        const editAuctionBody: { bid_value?: string; bid_closing_time: string | null } = {
            bid_closing_time: formattedEndDate,
        };
        if (!selectedBid.all_bids?.length) {
            editAuctionBody.bid_value = values.bid_value;
        }

        try {
            await editAuction({
                body: editAuctionBody,
                params: { order_ID: orderId },
            }).unwrap();
            setEditDialogOpen(false);
        } catch (error) {
            console.log("Error updating auction: ", error);
        }
    };

    const handleCancelAuction = async () => {
        await cancelAuction({ order_ID: orderId }).unwrap();
        setCancelDialogOpen(false);
    };

    const handleAssignToLowestBid = async () => {
        await assignAuctionToLowestBid({ params: { order_ID: orderId } }).unwrap();
        setCancelDialogOpen(false);
    };

    return (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#F08C24", fontWeight: "bold", mb: 2 }}>
                Bids Overview
            </Typography>

            {bidsData.map((bid: Bid, index: number) => {
                const isFinalized = !!bid.finalised_bid;

                // Determine bid to display: finalized or lowest
                let displayBid: AllBid | null = null;
                if (isFinalized) {
                    // If finalised_for is string (carrier ID), find the matching bid from all_bids
                    if (typeof bid.finalised_bid?.finalised_for === "string") {
                        displayBid = bid.all_bids.find(
                            (b) => b.bid_from === bid.finalised_bid?.finalised_for
                        ) || null;
                    } else {
                        displayBid = {
                            bid_from: bid.finalised_bid?.finalised_for?.carrier ?? "-",
                            bid_amount: bid.finalised_bid?.finalised_bid?.value ?? "-",
                            bid_placed_at: bid.bid_end_time || bid.bid_closing_time,
                        };

                    }
                } else {
                    displayBid = getLowestBid(bid.all_bids);
                }

                const displayCarrier = displayBid ? getCarrierDetails(displayBid.bid_from) : null;

                return (
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
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, gap: 2 }}>
                            {/* Bid Details */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Bid Details
                                </Typography>
                                <Typography variant="body2"><strong>Bid ID:</strong> {bid.bid_id}</Typography>
                                <Typography variant="body2"><strong>Order ID:</strong> {bid.order_ID}</Typography>
                                <Typography variant="body2"><strong>Bid Value:</strong> ₹{bid.bid_value}</Typography>
                                <Typography variant="body2">
                                    <strong>Start Time:</strong> {moment(bid.bid_start_time).format("DD MMM YYYY HH:mm")}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>End Time:</strong> {moment(bid.bid_closing_time).format("DD MMM YYYY HH:mm")}
                                </Typography>
                            </Box>

                            {/* Finalized / Lowest Bid */}
                            {displayBid && (
                                <Paper
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: isFinalized ? "#FFCDD2" : "#C8E6C9",
                                        minWidth: 220,
                                        maxWidth: 260,
                                        position: "relative",
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            position: "absolute",
                                            top: 6,
                                            right: 8,
                                            color: isFinalized ? "#C62828" : "#2E7D32",
                                            fontWeight: "bold",
                                            fontSize: "0.7rem",
                                        }}
                                    >
                                        {isFinalized ? "Finalized Bid" : "Ongoing Lowest Bid"}
                                    </Typography>

                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.8rem" }}>
                                            <strong>Bid From:</strong> {displayBid.bid_from} → <strong>₹{displayBid.bid_amount}</strong>
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.8rem" }}>
                                            <strong>Placed At:</strong> {moment(displayBid.bid_placed_at).format("DD MMM YYYY HH:mm")}
                                        </Typography>

                                        {displayCarrier ? (
                                            <Box>
                                                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                                                    <strong>Name:</strong> {displayCarrier.carrier_name || "-"}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                                                    <strong>Phone:</strong> {displayCarrier.carrier_correspondence?.phone || "-"}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                                                    <strong>Email:</strong> {displayCarrier.carrier_correspondence?.email || "-"}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontStyle: "italic", color: "gray", fontSize: "0.8rem" }}>
                                                Carrier not found
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>
                            )}
                        </Box>

                        {/* All Bids */}
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
                                                <Paper sx={{ p: 2, minWidth: 220, borderRadius: 2, backgroundColor: "#E3F2FD", boxShadow: 1 }}>
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
                                                        <Typography variant="body2" sx={{ fontStyle: "italic", color: "gray" }}>Carrier not found</Typography>
                                                    )}
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        )}

                        {/* Cancel/Edit Buttons (Hide if finalized) */}
                        {!isFinalized && (
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                                <Button size="small" variant="contained" color="error" onClick={() => handleCancelClick(bid)}>Cancel</Button>
                                <Button size="small" variant="outlined" color="primary" onClick={() => handleEditClick(bid)}>Edit Auction</Button>
                            </Box>
                        )}
                    </Paper>
                );
            })}

            {/* Cancel Dialog */}
            {/* <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle sx={{ m: 0, p: 2, marginBottom: 2 }}>
                    Cancel Auction
                    <IconButton aria-label="close" onClick={() => setCancelDialogOpen(false)} sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography sx={{ mb: 2 }}>Are you sure to cancel the Auction or confirm with lowest bid?</Typography>
                </DialogContent>
                <DialogActions sx={{ mt: 2, mb: 2 }}>
                    <Button variant="contained" color="success" onClick={handleAssignToLowestBid}>Confirm Lowest Bid</Button>
                    <Button variant="contained" color="error" onClick={handleCancelAuction}>Cancel Auction</Button>
                </DialogActions>
            </Dialog> */}

            {/* Cancel Dialog */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle sx={{ m: 0, p: 2, marginBottom: 2 }}>
                    Cancel Auction
                    <IconButton
                        aria-label="close"
                        onClick={() => setCancelDialogOpen(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography sx={{ mb: 2 }}>
                        {selectedBid?.all_bids?.length
                            ? "Are you sure to cancel the Auction or confirm with lowest bid?"
                            : "Are you sure to cancel the Auction?"}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ mt: 2, mb: 2 }}>
                    {/* Show confirm only if there are bids */}
                    {(selectedBid?.all_bids?.length ?? 0) > 0 && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleAssignToLowestBid}
                        >
                            Confirm Lowest Bid
                        </Button>
                    )}

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancelAuction}
                    >
                        Cancel Auction
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Bid</DialogTitle>
                <DialogContent>
                    {selectedBid && (
                        <Formik<{
                            bid_start_time: Moment | null;
                            bid_end_time: Moment | null;
                            bid_value: string;
                        }>
                            initialValues={{
                                bid_start_time: moment(selectedBid.bid_start_time),
                                bid_end_time: selectedBid.bid_end_time ? moment(selectedBid.bid_end_time) : null,
                                bid_value: selectedBid.bid_value,
                            }}
                            validationSchema={Yup.object({
                                bid_start_time: Yup.mixed().required("Start time is required"),
                                bid_end_time: Yup.mixed()
                                    .required("End time is required")
                                    .test("is-after-start", "End time must be after start time", function (value) {
                                        const { bid_start_time } = this.parent;
                                        if (!bid_start_time || !value) return false;
                                        return moment(value).isAfter(moment(bid_start_time));
                                    }),
                                bid_value: Yup.string().required("Bid value is required"),
                            })}
                            onSubmit={(values) => handleEditAuction(values)}
                        >
                            {({ values, setFieldValue, touched, errors }) => (
                                <Form>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <Field name="bid_start_time">
                                            {({ field }: FieldProps<Moment | null>) => (
                                                <DateTimePicker
                                                    label="Bid Start Time"
                                                    value={field.value}
                                                    onChange={() => { }}
                                                    disabled
                                                    slotProps={{
                                                        textField: { size: "small", fullWidth: true, margin: "normal", error: Boolean(touched.bid_start_time && errors.bid_start_time), helperText: touched.bid_start_time && errors.bid_start_time },
                                                    }}
                                                />
                                            )}
                                        </Field>

                                        <Field name="bid_end_time">
                                            {({ field }: FieldProps<Moment | null>) => (
                                                <DateTimePicker
                                                    label="Bid End Time"
                                                    // value={field.value}
                                                    value={field.value || moment(selectedBid.bid_closing_time)}
                                                    minDateTime={values.bid_start_time || undefined}
                                                    onChange={(val) => setFieldValue("bid_end_time", val)}
                                                    slotProps={{
                                                        textField: { size: "small", fullWidth: true, margin: "normal", error: Boolean(touched.bid_end_time && errors.bid_end_time), helperText: touched.bid_end_time && errors.bid_end_time },
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </LocalizationProvider>

                                    <Field name="bid_value">
                                        {({ field }: FieldProps<string>) => (
                                            <TextField
                                                {...field}
                                                label="Bid Value"
                                                type="number"
                                                fullWidth
                                                margin="normal"
                                                disabled={!!selectedBid.all_bids?.length}
                                                error={Boolean(touched.bid_value && errors.bid_value)}
                                                helperText={touched.bid_value && errors.bid_value}
                                            />
                                        )}
                                    </Field>

                                    <DialogActions>
                                        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                                        <Button type="submit" variant="contained" color="primary">Save</Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    )}
                </DialogContent>
            </Dialog>
        </Paper>
    );
};

export default BidsOverview;
