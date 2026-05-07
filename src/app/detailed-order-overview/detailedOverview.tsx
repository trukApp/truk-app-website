"use client";

import React, { useState } from "react";
import { useEditOrderMutation, useGetOrderByIdQuery } from "@/api/apiSlice";
import {
	Backdrop,
	CircularProgress,
	Grid,
	Paper,
	Typography,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogActions,
	IconButton,
	DialogTitle,
} from "@mui/material";
import Allocations from "@/Components/OrderOverViewAllocations/Allocations";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import Image from "next/image";
import AdditionalDocuments from "@/Components/CreateOrderTables/AdditionalDocuments";
import CloseIcon from "@mui/icons-material/Close";
import SnackbarAlert from "@/Components/ReusableComponents/SnackbarAlerts";
import LOR from "@/Components/OrderOverViewAllocations/LOR";

export interface OrderDocMap {
	[key: string]: string;
}

const OrderDetailedOverview: React.FC = () => {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] =
		useState<"success" | "error" | "warning" | "info">("success");

	const [editOrder, { isLoading: confirmOrderLoading }] =
		useEditOrderMutation();

	const searchParams = useSearchParams();
	const orderId = searchParams.get("order_ID") || "";
	const from = searchParams.get("from") ?? "";

	const { data: order, isLoading } =
		useGetOrderByIdQuery({ orderId });

	const orderData = order?.order;
	const lrInvoices = order?.lr_invoices || [];
	const allocatedPackageDetails = order?.allocated_packages_details;
	console.log("Order Data:", orderData)

	const [openDialog, setOpenDialog] = useState(false);
	const [documents, setDocuments] = useState<OrderDocMap[]>([]);


	const [openPreview, setOpenPreview] = useState<{ url: string; open: boolean }>({
		url: "",
		open: false,
	});
	const handlePreview = (url: string) => {
		setOpenPreview({ url, open: true });
	};

	const handleUpdateDocuments = async () => {
		try {
			const response = await editOrder({
				body: { order_docs: documents },
				params: { order_ID: orderId },
			}).unwrap();

			if (response) {
				setSnackbarMessage("Order updated successfully!");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
				setOpenDialog(false);
			}
		} catch {
			setSnackbarMessage("Failed to update documents");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};
	const orderDocsEntries: [string, string][] =
		orderData?.order_docs ? Object.entries(orderData.order_docs) : [];

	return (
		<Box sx={{ p: { xs: 1, md: 2 } }}>
			<SnackbarAlert
				open={snackbarOpen}
				message={snackbarMessage}
				severity={snackbarSeverity}
				onClose={() => setSnackbarOpen(false)}
			/>
			<Dialog
				open={openPreview.open}
				onClose={() => setOpenPreview({ url: "", open: false })}
				fullWidth
				maxWidth="md"
			>
				{openPreview.url.endsWith(".pdf") ? (
					<embed
						src={openPreview.url}
						type="application/pdf"
						width="100%"
						height="600px"
					/>
				) : (
					<Image src={openPreview.url} alt="Preview" width={900} height={600} />
				)}
			</Dialog>

			{/* ADD DOCUMENTS */}
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>
					Add Documents
					<IconButton
						onClick={() => setOpenDialog(false)}
						sx={{ position: "absolute", right: 8, top: 8 }}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<DialogContent>
					<AdditionalDocuments
						documents={documents}
						setDocuments={setDocuments}
					/>
				</DialogContent>

				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleUpdateDocuments}>
						Save
					</Button>
				</DialogActions>
			</Dialog>

			<Backdrop open={isLoading || confirmOrderLoading}>
				<CircularProgress />
			</Backdrop>

			{orderData && (
				<Paper sx={{ p: 2, mb: 2 }}>
					<Typography
						variant="h6"
						sx={{ color: "#F08C24", fontWeight: "bold", fontSize: '18px' }}
					>
						Order Details
					</Typography>

					<Grid container spacing={1} >
						{/* COLUMN 1 */}
						<Grid item xs={12} md={4}>
							<Typography>
								Order ID: <strong>{orderData.order_ID}</strong>
							</Typography>
							<Typography>
								Total Cost:{" "}
								<strong>₹{Number(orderData.total_cost).toFixed(2)}</strong>
							</Typography>
						</Grid>

						{/* COLUMN 2 */}
						<Grid item xs={12} md={4}>
							<Typography>
								Scenario: <strong>{orderData.scenario_label}</strong>
							</Typography>
							<Typography>
								Created At:{" "}
								<strong>
									{moment(orderData.created_at).format("DD MMM YYYY")}
								</strong>
							</Typography>
						</Grid>

						{/* COLUMN 3   */}
						<Grid item xs={12} md={4}>
							<LOR
								allocations={orderData?.allocations}
								orderId={orderData?.order_ID}
								allocatedPackageDetails={allocatedPackageDetails}
								order={orderData}
								from={from}
								orderStatus={orderData?.order_status}
								lrInvoices={lrInvoices}
							/>
						</Grid>
					</Grid>

					<Grid container spacing={2}  >
						{orderDocsEntries.map(([docKey, url]) => (
							<Grid item xs={12} md={3} key={`${orderData.order_ID}-${docKey}`}>
								<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
									{docKey.replace(/_/g, " ")}
								</Typography>

								<Box
									sx={{ cursor: "pointer", mt: 1 }}
									onClick={() => handlePreview(url)}
								>
									{url.endsWith(".pdf") ? (
										<embed
											src={url}
											style={{ pointerEvents: "none" }}
											type="application/pdf"
											width="45%"
											height="65px"
										/>
									) : (
										<Image src={url} alt={docKey} width={150} height={80} />
									)}
								</Box>
							</Grid>
						))}
					</Grid>

					<Button sx={{ mt: 2 }} variant="outlined" onClick={() => setOpenDialog(true)}>
						Add Documents
					</Button>
				</Paper>
			)}
			{orderData?.allocations && (
				<>
					<Allocations
						allocations={orderData.allocations}
						orderId={orderData.order_ID}
						allocatedPackageDetails={allocatedPackageDetails}
						from={from}
						isGeneratingPDF={false}
					/>
				</>
			)}
		</Box>
	);
};

export default OrderDetailedOverview;
