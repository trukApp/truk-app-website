"use client";
import React, { useRef, useState } from "react";
import { useEditOrderMutation, useGetOrderByIdQuery } from "@/api/apiSlice";
import {
	Backdrop,
	CircularProgress,
	Grid,
	Paper,
	Typography,
	Box,
	Button,
	Tooltip,
	Dialog,
	DialogContent,
	DialogActions,
	IconButton,
	DialogTitle,
} from "@mui/material";
import Allocations from "@/Components/OrderOverViewAllocations/Allocations";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import AdditionalDocuments from "@/Components/CreateOrderTables/AdditionalDocuments";
import CloseIcon from "@mui/icons-material/Close";
import SnackbarAlert from "@/Components/ReusableComponents/SnackbarAlerts";
import BillOfLading from "@/Components/OrderOverViewAllocations/BillOfLading";

export interface OrderDoc {
	[key: string]: string;
}

const OrderDetailedOverview: React.FC = () => {
	// console.log('selectedRoutes create order pagetsx: ', selectedRoutes);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		"success" | "error" | "warning" | "info"
	>("success");
	const pdfRef = useRef<HTMLDivElement>(null);
	const [editOrder, { isLoading: confirmOrderLoading }] =
		useEditOrderMutation();
	const searchParams = useSearchParams();
	const orderId = searchParams.get("order_ID") || "";
	const from = searchParams.get("from") ?? "";
	const { data: order, isLoading } = useGetOrderByIdQuery({ orderId });
	const orderData = order?.order;
	const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [documents, setDocuments] = useState<{ [key: string]: string }[]>([]);

	const handleOpenDialog = () => setOpenDialog(true);
	const handleCloseDialog = () => setOpenDialog(false);
	const allocatedPackageDetails = order?.allocated_packages_details;
	console.log("orderdata :", orderData);
	const [openPreview, setOpenPreview] = useState<{
		url: string;
		open: boolean;
	}>({
		url: "",
		open: false,
	});
	const handlePreview = (url: string) => {
		setOpenPreview({ url, open: true });
	};

	const generatePDF = async () => {
		setIsGeneratingPDF(true);

		await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for re-render

		const input = pdfRef.current;
		if (!input) return;

		const canvas = await html2canvas(input, {
			scale: 1.5, // Lower scale reduces file size and improves performance
			useCORS: true,
			scrollY: -window.scrollY,
		});

		const imgData = canvas.toDataURL("image/jpeg", 0.6); // JPEG and quality=0.6 to reduce size

		const pdf = new jsPDF("p", "mm", "a4");
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = pdf.internal.pageSize.getHeight();

		const imgWidth = pdfWidth;
		const imgHeight = (canvas.height * pdfWidth) / canvas.width;

		let heightLeft = imgHeight;
		let position = 10;

		// First page
		pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
		heightLeft -= pdfHeight;

		// Add remaining pages
		while (heightLeft > 0) {
			position = heightLeft - imgHeight;
			pdf.addPage();
			pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
			heightLeft -= pdfHeight;
		}

		pdf.save("order-details.pdf");
		setIsGeneratingPDF(false);
	};

	const handleUpdateDocuments = async () => {
		// handleCloseDialog()
		const editOrderBody = {
			order_docs: documents,
		};
		console.log("editOrder body", editOrderBody);
		try {
			const response = await editOrder(editOrderBody).unwrap();
			if (response) {
				setSnackbarMessage(`Order updated successfully!`);
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			}
		} catch (error: unknown) {
			console.log(
				"Getting error while creating the order from catch block: ",
				error
			);

			if (
				typeof error === "object" &&
				error !== null &&
				"data" in error &&
				typeof error.data === "object" &&
				error.data !== null &&
				"message" in error.data &&
				typeof error.data.message === "string"
			) {
				if (
					error.data.message ===
					"Some packages are already confirmed in an existing order."
				) {
					setSnackbarMessage(
						`Some packages are already confirmed in an existing order, Please check`
					);
					setSnackbarSeverity("error");
					setSnackbarOpen(true);
				}
			}
		}
	};
	return (
		<Box sx={{ p: { xs: 0.2, md: 2 } }}>
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
						style={{ border: "none" }}
					/>
				) : (
					<Image
						src={openPreview.url}
						alt="Preview"
						style={{ width: "100%", height: "auto" }}
					/>
				)}
			</Dialog>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle sx={{ m: 0, p: 2 }}>
					<IconButton
						aria-label="close"
						onClick={handleCloseDialog}
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
				<DialogContent sx={{ padding: "20px" }}>
					<AdditionalDocuments
						documents={documents}
						setDocuments={setDocuments}
					/>
				</DialogContent>
				<DialogActions sx={{ paddingBottom: "20px", paddingRight: "20px" }}>
					<Button onClick={handleCloseDialog} variant="outlined">
						Cancel
					</Button>
					<Button onClick={handleUpdateDocuments} variant="contained">
						Save
					</Button>
				</DialogActions>
			</Dialog>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={isLoading || confirmOrderLoading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Paper
				ref={pdfRef}
				key={orderData?.order_ID}
				elevation={0}
				sx={{
					border: "none",
					boxShadow: "none",
				}}
			>
				{orderData && (
					<Paper
						sx={{ p: 3, mb: 3, marginLeft: isGeneratingPDF ? "30px" : "2px" }}
					>
						<Grid
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Typography
								variant="h6"
								gutterBottom
								sx={{ color: "#F08C24", fontWeight: "bold" }}
							>
								Order Details
							</Typography>

							{orderData?.order_status === "assignment pending" &&
								!isGeneratingPDF && (
									<Grid
										sx={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "flex-end",
											alignSelf: "flex-end",
										}}
									>
										<Tooltip
											title="Download the full order details as a PDF"
											arrow
										>
											<Button
												type="button"
												sx={{
													backgroundColor: "#F08C24",
													color: "#fff",
													"&:hover": {
														backgroundColor: "#FCF0DE",
														color: "#F08C24",
													},
												}}
												onClick={generatePDF}
											>
												⬇ Download
											</Button>
										</Tooltip>
									</Grid>
								)}
						</Grid>
						<Grid container spacing={1}>
							<Grid item xs={12} md={6}>
								<Typography
									variant="body1"
									sx={{ fontSize: { xs: "15px", md: "17px" } }}
								>
									Order ID: <strong>{orderData.order_ID}</strong>
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography
									variant="body1"
									sx={{ fontSize: { xs: "15px", md: "17px" } }}
								>
									Scenario: <strong>{orderData.scenario_label}</strong>{" "}
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography
									variant="body1"
									sx={{ fontSize: { xs: "15px", md: "17px" } }}
								>
									Total Cost:{" "}
									<strong>
										₹{parseFloat(orderData.total_cost).toFixed(2)}
									</strong>
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography
									variant="body1"
									sx={{ fontSize: { xs: "15px", md: "17px" } }}
								>
									Created at:{" "}
									<strong>
										{moment(orderData.created_at).format("DD MMM YYYY")}
									</strong>
								</Typography>
							</Grid>
						</Grid>

						<Grid container spacing={2}>
							{orderData?.order_docs?.map((doc: OrderDoc, index: number) => {
								const key = Object.keys(doc)[0];
								const url = doc[key];
								const isPDF = url.endsWith(".pdf");

								return (
									<Grid item xs={12} md={3} key={index}>
										<Typography
											variant="subtitle2"
											sx={{ fontWeight: 600, textTransform: "capitalize" }}
										>
											{key}
										</Typography>

										<Grid
											spacing={2}
											container
											sx={{
												cursor: "pointer",
												display: "flex",
												flexDirection: "column",
												marginTop: "1px",
												marginLeft: "1px",
											}}
											onClick={() => handlePreview(url)}
										>
											{isPDF ? (
												<embed
													src={url}
													type="application/pdf"
													width="50%"
													height="80px"
													style={{ border: "1px solid #ccc", borderRadius: 4 }}
												/>
											) : (
												<Image
													src={url}
													alt={key}
													width={150}
													height={80}
													style={{
														border: "1px solid #ccc",
														borderRadius: 4,
														objectFit: "cover",
													}}
												/>
											)}
											<Typography variant="caption" color="primary">
												Click to view full screen
											</Typography>
										</Grid>
									</Grid>
								);
							})}
						</Grid>
						<Grid
							sx={{
								display: "flex",
								flexDirection: "row",
								justifySelf: "flex-end",
								alignSelf: "flex-end",
							}}
						>
							<Button
								sx={{ textDecoration: "underline" }}
								onClick={handleOpenDialog}
							>
								Add Documents
							</Button>
						</Grid>
					</Paper>
				)}

				{orderData?.allocations && (
					<Allocations
						isGeneratingPDF={isGeneratingPDF}
						allocations={orderData.allocations}
						orderId={orderData.order_ID}
						allocatedPackageDetails={allocatedPackageDetails}
						from={from}
					/>
				)}
				{orderData?.allocations && (
					<BillOfLading
						allocations={orderData.allocations}
						orderId={orderData.order_ID}
						allocatedPackageDetails={allocatedPackageDetails}
						from={from}
					/>
				)}
			</Paper>
		</Box>
	);
};

export default OrderDetailedOverview;
