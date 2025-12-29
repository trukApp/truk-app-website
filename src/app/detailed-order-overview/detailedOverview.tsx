// "use client";
// import React, { useState } from "react";
// import { useEditOrderMutation, useGetOrderByIdQuery } from "@/api/apiSlice";
// import {
// 	Backdrop,
// 	CircularProgress,
// 	Grid,
// 	Paper,
// 	Typography,
// 	Box,
// 	Button,
// 	Dialog,
// 	DialogContent,
// 	DialogActions,
// 	IconButton,
// 	DialogTitle,
// } from "@mui/material";
// import Allocations from "@/Components/OrderOverViewAllocations/Allocations";
// import { useSearchParams } from "next/navigation";
// import moment from "moment";
// import Image from "next/image";
// import AdditionalDocuments from "@/Components/CreateOrderTables/AdditionalDocuments";
// import CloseIcon from "@mui/icons-material/Close";
// import SnackbarAlert from "@/Components/ReusableComponents/SnackbarAlerts";
// // import BillOfLading from "@/Components/OrderOverViewAllocations/BillOfLading";
// import LOR from "@/Components/OrderOverViewAllocations/LOR";
// // import LOR 

// export interface OrderDoc {
// 	[key: string]: string;
// }

// const OrderDetailedOverview: React.FC = () => {
// 	const [snackbarOpen, setSnackbarOpen] = useState(false);
// 	const [snackbarMessage, setSnackbarMessage] = useState("");
// 	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
// 	const [editOrder, { isLoading: confirmOrderLoading }] =
// 		useEditOrderMutation();
// 	const searchParams = useSearchParams();
// 	const orderId = searchParams.get("order_ID") || "";
// 	const from = searchParams.get("from") ?? "";
// 	const { data: order, isLoading } = useGetOrderByIdQuery({ orderId });
// 	const orderData = order?.order;
// 	const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
// 	const [openDialog, setOpenDialog] = useState(false);
// 	const [documents, setDocuments] = useState<{ [key: string]: string }[]>([]);
// 	const lrInvoices = order?.lr_invoices || [];
// 	console.log(orderData)

// 	const handleOpenDialog = () => setOpenDialog(true);
// 	const handleCloseDialog = () => setOpenDialog(false);
// 	const allocatedPackageDetails = order?.allocated_packages_details;

// 	const [openPreview, setOpenPreview] = useState<{
// 		url: string;
// 		open: boolean;
// 	}>({
// 		url: "",
// 		open: false,
// 	});
// 	const handlePreview = (url: string) => {
// 		setOpenPreview({ url, open: true });
// 		setIsGeneratingPDF(false);
// 	};



// 	const handleUpdateDocuments = async () => {
// 		// handleCloseDialog()
// 		const editOrderBody = {
// 			order_docs: documents,
// 		};
// 		try {
// 			const response = await editOrder({
// 				body: editOrderBody,
// 				params: { order_ID: orderId } // Pass as query param
// 			}).unwrap();
// 			if (response) {
// 				setSnackbarMessage(`Order updated successfully!`);
// 				setSnackbarSeverity("success");
// 				setSnackbarOpen(true);
// 			}
// 		} catch (error: unknown) {
// 			if (
// 				typeof error === "object" &&
// 				error !== null &&
// 				"data" in error &&
// 				typeof error.data === "object" &&
// 				error.data !== null &&
// 				"message" in error.data &&
// 				typeof error.data.message === "string"
// 			) {
// 				if (
// 					error.data.message ===
// 					"Some packages are already confirmed in an existing order."
// 				) {
// 					setSnackbarMessage(
// 						`Some packages are already confirmed in an existing order, Please check`
// 					);
// 					setSnackbarSeverity("error");
// 					setSnackbarOpen(true);
// 				}
// 			}
// 		}
// 	}


// 	return (
// 		<Box sx={{ p: { xs: 0.2, md: 2 } }}>
// 			<SnackbarAlert
// 				open={snackbarOpen}
// 				message={snackbarMessage}
// 				severity={snackbarSeverity}
// 				onClose={() => setSnackbarOpen(false)}
// 			/>
// 			<Dialog
// 				open={openPreview.open}
// 				onClose={() => setOpenPreview({ url: "", open: false })}
// 				fullWidth
// 				maxWidth="md"
// 			>
// 				{openPreview.url.endsWith(".pdf") ? (
// 					<embed
// 						src={openPreview.url}
// 						type="application/pdf"
// 						width="100%"
// 						height="600px"
// 						style={{ border: "none" }}
// 					/>
// 				) : (
// 					<Image
// 						src={openPreview.url}
// 						alt="Preview"
// 						style={{ width: "100%", height: "auto" }}
// 					/>
// 				)}
// 			</Dialog>

// 			<Dialog
// 				open={openDialog}
// 				onClose={handleCloseDialog}
// 				fullWidth
// 				maxWidth="md"
// 			>
// 				<DialogTitle sx={{ m: 0, p: 2 }}>
// 					<IconButton
// 						aria-label="close"
// 						onClick={handleCloseDialog}
// 						sx={{
// 							position: "absolute",
// 							right: 8,
// 							top: 8,
// 							color: (theme) => theme.palette.grey[500],
// 						}}
// 					>
// 						<CloseIcon />
// 					</IconButton>
// 				</DialogTitle>
// 				<DialogContent sx={{ padding: "20px" }}>
// 					<AdditionalDocuments
// 						documents={documents}
// 						setDocuments={setDocuments}
// 					/>
// 				</DialogContent>
// 				<DialogActions sx={{ paddingBottom: "20px", paddingRight: "20px" }}>
// 					<Button onClick={handleCloseDialog} variant="outlined">
// 						Cancel
// 					</Button>
// 					<Button onClick={handleUpdateDocuments} variant="contained">
// 						Save
// 					</Button>
// 				</DialogActions>
// 			</Dialog>
// 			<Backdrop
// 				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
// 				open={isLoading || confirmOrderLoading}
// 			>
// 				<CircularProgress color="inherit" />
// 			</Backdrop>
// 			<Paper
// 			>
// 				{orderData && (
// 					<Paper
// 						sx={{ p: 3, mb: 3 }}
// 					>
// 						<Grid
// 							sx={{
// 								display: "flex",
// 								flexDirection: "row",
// 								justifyContent: "space-between",
// 							}}
// 						>
// 							<Typography
// 								variant="h6"
// 								gutterBottom
// 								sx={{ color: "#F08C24", fontWeight: "bold" }}
// 							>
// 								Order Details
// 							</Typography>
// 						</Grid>
// 						<Grid container spacing={1}>
// 							<Grid item xs={12} md={6}>
// 								<Typography
// 									variant="body1"
// 									sx={{ fontSize: { xs: "15px", md: "17px" } }}
// 								>
// 									Order ID: <strong>{orderData.order_ID}</strong>
// 								</Typography>
// 							</Grid>
// 							<Grid item xs={12} md={6}>
// 								<Typography
// 									variant="body1"
// 									sx={{ fontSize: { xs: "15px", md: "17px" } }}
// 								>
// 									Scenario: <strong>{orderData.scenario_label}</strong>{" "}
// 								</Typography>
// 							</Grid>
// 							<Grid item xs={12} md={6}>
// 								<Typography
// 									variant="body1"
// 									sx={{ fontSize: { xs: "15px", md: "17px" } }}
// 								>
// 									Total Cost:{" "}
// 									<strong>
// 										₹{parseFloat(orderData.total_cost).toFixed(2)}
// 									</strong>
// 								</Typography>
// 							</Grid>
// 							<Grid item xs={12} md={6}>
// 								<Typography
// 									variant="body1"
// 									sx={{ fontSize: { xs: "15px", md: "17px" } }}
// 								>
// 									Created at:{" "}
// 									<strong>
// 										{moment(orderData.created_at).format("DD MMM YYYY")}
// 									</strong>
// 								</Typography>
// 							</Grid>
// 						</Grid>

// 						<Grid container spacing={2}>
// 							{orderData?.order_docs?.map((doc: OrderDoc, index: number) => {
// 								const key = Object.keys(doc)[0];
// 								const url = doc[key];
// 								const isPDF = url.endsWith(".pdf");

// 								return (
// 									<Grid item xs={12} md={3} key={index}>
// 										<Typography
// 											variant="subtitle2"
// 											sx={{ fontWeight: 600, textTransform: "capitalize" }}
// 										>
// 											{key}
// 										</Typography>

// 										<Grid
// 											spacing={2}
// 											container
// 											sx={{
// 												cursor: "pointer",
// 												display: "flex",
// 												flexDirection: "column",
// 												marginTop: "1px",
// 												marginLeft: "1px",
// 											}}
// 											onClick={() => handlePreview(url)}
// 										>
// 											{isPDF ? (
// 												<embed
// 													src={url}
// 													type="application/pdf"
// 													width="50%"
// 													height="80px"
// 													style={{ border: "1px solid #ccc", borderRadius: 4 }}
// 												/>
// 											) : (
// 												<Image
// 													src={url}
// 													alt={key}
// 													width={150}
// 													height={80}
// 													style={{
// 														border: "1px solid #ccc",
// 														borderRadius: 4,
// 														objectFit: "cover",
// 													}}
// 												/>
// 											)}
// 											<Typography variant="caption" color="primary">
// 												Click to view full screen
// 											</Typography>
// 										</Grid>
// 									</Grid>
// 								);
// 							})}
// 						</Grid>
// 						<Grid
// 							sx={{
// 								display: "flex",
// 								flexDirection: "row",
// 								justifySelf: "flex-end",
// 								alignSelf: "flex-end",
// 							}}
// 						>
// 							<Button
// 								sx={{ textDecoration: "underline" }}
// 								onClick={handleOpenDialog}
// 							>
// 								Add Documents
// 							</Button>
// 						</Grid>
// 					</Paper>
// 				)}

// 				{orderData?.allocations && (
// 					<>
// 						<Allocations
// 							isGeneratingPDF={isGeneratingPDF}
// 							allocations={orderData.allocations}
// 							orderId={orderData.order_ID}
// 							allocatedPackageDetails={allocatedPackageDetails}
// 							from={from}
// 						/>
// 						{/* {orderData?.order_status === null || orderData?.order_status === "assignment pending" ? (
// 							<BillOfLading
// 								allocations={orderData.allocations}
// 								orderId={orderData.order_ID}
// 								allocatedPackageDetails={allocatedPackageDetails}
// 								order={orderData}
// 								from={from}
// 								orderStatus={orderData.order_status}
// 							/>

// 						) : null} */}
// 						<LOR
// 							allocations={orderData.allocations}
// 							orderId={orderData.order_ID}
// 							allocatedPackageDetails={allocatedPackageDetails}
// 							order={orderData}
// 							from={from}
// 							orderStatus={orderData.order_status}
// 							lrInvoices={lrInvoices}
// 						/>
// 					</>
// 				)}



// 			</Paper>
// 		</Box>
// 	);
// };

// export default OrderDetailedOverview;



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

/* ---------------- TYPES ---------------- */

export interface OrderDocMap {
	[key: string]: string;
}

/* ---------------- COMPONENT ---------------- */

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

	const [openDialog, setOpenDialog] = useState(false);
	const [documents, setDocuments] = useState<OrderDocMap[]>([]);

	const [openPreview, setOpenPreview] = useState<{
		url: string;
		open: boolean;
	}>({ url: "", open: false });

	/* ---------------- HANDLERS ---------------- */

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

	/* ---------------- SAFE DOC PARSING ---------------- */

	const orderDocsEntries: [string, string][] =
		orderData?.order_docs
			? Object.entries(orderData.order_docs)
			: [];

	/* ---------------- UI ---------------- */

	return (
		<Box sx={{ p: { xs: 1, md: 2 } }}>
			<SnackbarAlert
				open={snackbarOpen}
				message={snackbarMessage}
				severity={snackbarSeverity}
				onClose={() => setSnackbarOpen(false)}
			/>

			{/* PREVIEW DIALOG */}
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
					<Image
						src={openPreview.url}
						alt="Preview"
						width={900}
						height={600}
						style={{ width: "100%", height: "auto" }}
					/>
				)}
			</Dialog>

			{/* ADD DOCUMENTS DIALOG */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
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

			{/* LOADER */}
			<Backdrop open={isLoading || confirmOrderLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>

			{/* ORDER DETAILS */}
			{orderData && (
				<Paper sx={{ p: 3, mb: 3 }}>
					<Typography variant="h6" sx={{ color: "#F08C24", fontWeight: "bold" }}>
						Order Details
					</Typography>

					<Grid container spacing={1} mt={1}>
						<Grid item xs={12} md={6}>
							Order ID: <strong>{orderData.order_ID}</strong>
						</Grid>
						<Grid item xs={12} md={6}>
							Scenario: <strong>{orderData.scenario_label}</strong>
						</Grid>
						<Grid item xs={12} md={6}>
							Total Cost: <strong>₹{Number(orderData.total_cost).toFixed(2)}</strong>
						</Grid>
						<Grid item xs={12} md={6}>
							Created At:{" "}
							<strong>{moment(orderData.created_at).format("DD MMM YYYY")}</strong>
						</Grid>
					</Grid>

					{/* DOCUMENTS */}
					<Grid container spacing={2} mt={2}>
						{orderDocsEntries.map(([key, url], index) => {
							const isPDF = url.endsWith(".pdf");

							return (
								<Grid item xs={12} md={3} key={index}>
									<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
										{key.replace(/_/g, " ")}
									</Typography>

									<Box
										sx={{ cursor: "pointer", mt: 1 }}
										onClick={() => handlePreview(url)}
									>
										{isPDF ? (
											<embed src={url} type="application/pdf" width="100%" height="80px" />
										) : (
											<Image
												src={url}
												alt={key}
												width={150}
												height={80}
												style={{ borderRadius: 4 }}
											/>
										)}
									</Box>

									<Typography variant="caption" color="primary">
										Click to view
									</Typography>
								</Grid>
							);
						})}
					</Grid>

					<Button sx={{ mt: 2 }} onClick={() => setOpenDialog(true)}>
						Add Documents
					</Button>
				</Paper>
			)}

			{/* ALLOCATIONS & LOR */}
			{orderData?.allocations && (
				<>
					<Allocations
						allocations={orderData.allocations}
						orderId={orderData.order_ID}
						allocatedPackageDetails={allocatedPackageDetails}
						from={from}
						isGeneratingPDF={false}
					/>

					<LOR
						allocations={orderData.allocations}
						orderId={orderData.order_ID}
						allocatedPackageDetails={allocatedPackageDetails}
						order={orderData}
						from={from}
						orderStatus={orderData.order_status}
						lrInvoices={lrInvoices}
					/>
				</>
			)}
		</Box>
	);
};

export default OrderDetailedOverview;
