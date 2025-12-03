/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect, ReactNode } from "react";
import { Typography, Paper, Grid, Box, Button, Backdrop, CircularProgress, Dialog, DialogActions, Checkbox, DialogContent, FormControlLabel, DialogTitle, IconButton, SxProps, Theme } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useGetAllPackagesForOrderQuery, useGetAllProductsQuery, useGetLocationMasterQuery } from "@/api/apiSlice";
import JsBarcode from "jsbarcode";
import Image from "next/image";


interface LORProps {
	allocations: Array<{ packages: string[], occupiedWeight?: number, chargeableWeight?: number }>; // Adjust based on actual allocation structure
	orderId: string; // Assuming orderId is a string; change if it's a number
	allocatedPackageDetails: Array<{
		pack_ID: string;
		ship_to?: string;
		package_weight?: number;
		pac_id?: string;
		product_lines?: Array<{ quantity?: number; package_info?: string }>; // If needed from commented code
	}>;
	order: { order_ID?: string; created_at?: string }; // Basic order structure
	lrInvoices: Array<{
		lr_num?: string;
		ship_from?: string;
		ship_to?: string;
		e_way?: string;
		packages_in_data?: Array<{
			pack_ID: string;
			invoice?: string;
			e_way?: string;
		}>;
	}>;
	from?: string;           // ✅ Add this
	orderStatus?: string;
}

interface Location {
	loc_ID: string;
	contact_name?: string;
	contact_email?: string;
	contact_phone_number?: string;
	address_1?: string;
	city?: string;
	state?: string;
	country?: string;
	pincode?: string;
}

interface Product {
	product_ID: string;
	product_name: string;
}

interface PackageProduct {
	prod_ID: string;
	quantity: number;
	package_info?: string;
}

interface Package {
	pac_id?: any;
	package_weight?: number;
	pack_ID: string;
	pickup_date_time?: string;
	product_ID?: PackageProduct[];
	 
}

interface ProductDetails {
	details: string;
	quantity: number;
	pickup_date_time : string | null;
}

interface CellProps {
	children: ReactNode;
	sx?: SxProps<Theme>;
	[key: string]: any; // Allow other Box props
}



// const Cell = ({ children, sx = {}, ...props }) => (
// 	<Box
// 		{...props}
// 		sx={{
// 			border: "1px solid #333",
// 			px: 1.5,
// 			py: 0.7,
// 			fontSize: "13px",
// 			...sx
// 		}}
// 	>
// 		{children}
// 	</Box>
// );
const Cell = ({ children, sx = {}, ...props }: CellProps) => (
	<Box
		{...props}
		sx={{
			border: "1px solid #333",
			px: 1.5,
			py: 0.7,
			fontSize: "13px",
			...sx
		}}
	>
		{children}
	</Box>
);
const LOR = ({ allocations, orderId, allocatedPackageDetails, order, lrInvoices }: LORProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [openPopup, setOpenPopup] = useState(false);
	const [selectedCopy, setSelectedCopy] = useState("CONSIGNOR COPY");
	const pdfRefs = useRef<{ [key: string]: HTMLElement | null }>({});
	// const [currentShipToId, setCurrentShipToId] = useState(null);
	const [currentShipToId, setCurrentShipToId] = useState<string | null>(null);
	const { data: packagesOrderData } = useGetAllPackagesForOrderQuery([]);
	const { data: productsData } = useGetAllProductsQuery({});
	const allProductsData: Product[] = productsData?.products || [];
	const allPackagesData: Package[] = packagesOrderData?.packages || [];
	// Utility functions
	const { data: locationsData } = useGetLocationMasterQuery([])
	const getAllLocations: Location[] = locationsData?.locations.length > 0 ? locationsData?.locations : []
	const getLocationDetails = (loc_ID: string) => {
		const location = (locationsData?.locations || []).find((loc: Location) => loc.loc_ID === loc_ID);
		if (!location) return "Location details not available";
		return [
			// location.locationDescription,
			location.contact_name,
			location.contact_email,
			location.contact_phone_number,
			location.address_1,
			location.city,
			location.state,
			location.country,
			location.pincode,
		].filter(Boolean).join(", ");
	};


	const getLocationCode = (loc_ID: string) => {
		const location = getAllLocations.find(
			(loc: Location) => loc.loc_ID === loc_ID
		);

		if (!location) return "";

		// return only city
		return location.city || "";
	};

	const copyOptions = ["CONSIGNEE COPY", "CONSIGNOR COPY", "TRANSPORTER COPY"];

	// Cancel popup
	const handleCancel = () => {
		setOpenPopup(false);
	};
	console.log("all pcakages:", allPackagesData)
	 
	const getProductsInPackageDetails = (packId: string): ProductDetails => {
		// Step 1: Find the package entry to get pickup date
		const packageEntry = allPackagesData.find((pkg) => pkg.pack_ID === packId);
		const pickupDate = packageEntry?.pickup_date_time || null;

			let pickupDateFormatted: string | null = null;

			if (pickupDate) {
				const dateOnly = pickupDate.split("T")[0];
				const [year, month, day] = dateOnly.split("-");

				pickupDateFormatted = `${day}-${month}-${year}`;  
			}
		// Step 2: get all product entries under this package
		const packProducts = allPackagesData
			.filter((pkg) => pkg.pack_ID === packId)
			.flatMap((pkg) => pkg.product_ID || []);

		// If no products found, return consistent ProductDetails shape
		if (!packProducts.length) {
			return {
				details: "No products found",
				quantity: 0,
				pickup_date_time: pickupDateFormatted,
			};
		}

		let totalQuantity = 0;

		const details = packProducts.map((prod: PackageProduct) => {
			const productInfo = allProductsData.find(
				(p) => p.product_ID === prod.prod_ID
			);

			if (!productInfo) {
				return `Unknown Product (${prod.prod_ID})`;
			}

			totalQuantity += Number(prod.quantity || 0);

			return `${productInfo.product_name}, quantity: ${prod.quantity}`;
		});

		return {
			details: details.join(" || "),
			quantity: totalQuantity,
			pickup_date_time: pickupDateFormatted ,
		};
	};

	const handlePDFDownload = async (
		ref: HTMLElement | null,
		fileName: string,
		selectedCopy: string
	): Promise<void> => {
		setIsLoading(true);

		console.log("Copy selected inside download:", selectedCopy);

		const canvas = await html2canvas(ref as HTMLElement, { scale: 2, useCORS: true });
		const imgData = canvas.toDataURL("image/png");

		// Auto-size PDF to match the canvas
		const pdf = new jsPDF("l", "px", [canvas.width, canvas.height]);

		pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

		pdf.save(fileName);
		setIsLoading(false);
	};


	const handlePrintConfirm = () => {
		setOpenPopup(false);

		if (!currentShipToId) {
			console.error("ShipToID missing");
			return;
		}

		const ref = pdfRefs.current[currentShipToId];

		if (ref) {
			handlePDFDownload(
				ref,
				`LOR-${orderId}.pdf`,
				selectedCopy
			);
		}
	};

	return (
		<>
			<Dialog open={openPopup} onClose={handleCancel}>
				<DialogTitle>
					Select Copy Type
					<IconButton
						onClick={handleCancel}
						sx={{ position: "absolute", right: 8, top: 8 }}
					>
						X
					</IconButton>
				</DialogTitle>

				<DialogContent sx={{ minWidth: 300 }}>
					{copyOptions.map((copy) => (
						<FormControlLabel
							key={copy}
							control={
								<Checkbox
									checked={selectedCopy === copy}
									onChange={() => setSelectedCopy(copy)}
								/>
							}
							label={copy}
						/>
					))}
				</DialogContent>

				<DialogActions>
					<Button variant="contained" onClick={handlePrintConfirm}>
						Print
					</Button>
					<Button variant="outlined" onClick={handleCancel}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog> <div id="labels-container" style={{ position: "absolute", left: "-9999px", top: 0 }}>

</div>


			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={isLoading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			{allocations.map((allocation, allocIndex) => {
				const vehiclePackages = allocatedPackageDetails.filter((pkg) =>
					allocation.packages.includes(pkg.pack_ID)
				);
				// const packagesByShipTo = {};
				const packagesByShipTo: Record<string, Package[]> = {};
				vehiclePackages.forEach((pkg) => {
					if (pkg.ship_to) {
						if (!packagesByShipTo[pkg.ship_to])
							packagesByShipTo[pkg.ship_to] = [];
						packagesByShipTo[pkg.ship_to].push(pkg);
					}
				});

				return Object.entries(packagesByShipTo).map(
					([shipToId, pkgList], index) => {
						const shipperPkg = pkgList[0];

						// Find LR Invoice by matching the package
						const lrData =
							lrInvoices?.find((lr) =>
								lr.packages_in_data?.some(
									(pkg) => pkg.pack_ID === shipperPkg.pack_ID
								)
							) || {};

						console.log("lrData: ", lrData)
						// Use LR's ship_from/ship_to for addresses, LR number for invoice
						const consignorLoc = lrData.ship_from ?? "";
						const consigneeLoc = lrData.ship_to ?? "";
						// const lrNum = lrData.lr_num || "-";
						// Rows for goods table
						// const productRows = (shipperPkg?.product_lines || []).map(
						// 	(pl, idx) => ({
						// 		slNo: idx + 1,
						// 		invoice: lrNum,
						// 		ewb: lrData.e_way ?? "",
						// 		details: pl.package_info ?? "-",
						// 		count: pl.quantity ?? "-",
						// 		deedWeight:
						// 			shipperPkg?.package_weight ??
						// 			allocation?.occupiedWeight ??
						// 			"-",
						// 		chargeableWeight: allocation?.chargeableWeight ?? "-",
						// 		value: "10000", // Replace with value from data if needed
						// 	})
						// );
						// useEffect(() => {
						// 	if (!shipperPkg?.pac_id || !consignorLoc || !consigneeLoc) return;
						// 	if (!getAllLocations || getAllLocations.length === 0) return;

						// 	const from = getLocationCode(consignorLoc);
						// 	const to = getLocationCode(consigneeLoc);
						//     const pkgInfo = getProductsInPackageDetails(shipperPkg?.pac_id);
						// 	const count = pkgInfo.quantity
						// 	console.log("count ", pkgInfo);
						// 	if (!from || !to) return;
						//     if (!pkgInfo) return

						// 	const fromCode = from.slice(0, 3).toUpperCase();
						// 	const toCode = to.slice(0, 3).toUpperCase();

						// 	const barcodeData = `${shipperPkg.pac_id}|${fromCode}|${toCode}|${count}`;

						// 	console.log("Barcode VALUE:", barcodeData);

						// 	JsBarcode(`#barcode-${shipperPkg.pac_id}`, barcodeData, {
						// 		format: "CODE128",
						// 		width: 1,
						// 		height: 40,
						// 		displayValue: true,
						// 	});
						// }, [shipperPkg?.pac_id, consignorLoc, consigneeLoc, getAllLocations]);

						const productRows = (lrData?.packages_in_data || []).map(
							(pkg: { pack_ID: string; invoice?: string; e_way?: string }, idx: number) => {
								const pkgInfo = getProductsInPackageDetails(pkg?.pack_ID || ""); 

								return {
									slNo: idx + 1,
									invoice: pkg.invoice || "-",
									ewb: pkg.e_way ?? "-",
									details: pkgInfo.details,
									count: pkgInfo.quantity,
									deedWeight: shipperPkg?.package_weight ?? allocation?.occupiedWeight ?? "-",
									chargeableWeight: allocation?.chargeableWeight ?? "-",
									value: 0,
								};
							}
						);


						const totalCount = productRows.reduce(
							(a, b) => a + Number(b.count || 0),
							0
						);
						console.log("total count ", totalCount)
						const totalDeedWeight = productRows.reduce(
							(a, b) => a + Number(b.deedWeight || 0),
							0
						);
						const totalChargeableWeight = productRows.reduce(
							(a, b) => a + Number(b.chargeableWeight || 0),
							0
						);
						const totalValue = productRows.reduce(
							(a, b) => a + Number(b.value || 0),
							0
						);
						// eslint-disable-next-line react-hooks/rules-of-hooks
						useEffect(() => {
							if (!shipperPkg?.pac_id || !consignorLoc || !consigneeLoc) return;
							if (!getAllLocations?.length) return;

							// Get FROM / TO
							const from = getLocationCode(consignorLoc);
							const to = getLocationCode(consigneeLoc);
							if (!from || !to) return;

							// --- IMPORTANT: total count of ALL packages ---
							const totalCount = (lrData?.packages_in_data || []).reduce((sum, pkg) => {
								const pkgInfo = getProductsInPackageDetails(pkg.pack_ID);
								return sum + (pkgInfo?.quantity || 0);
							}, 0);

							console.log("TOTAL COUNT:", totalCount);

							// Short codes
							const fromCode = from.slice(0, 3).toUpperCase();
							const toCode = to.slice(0, 3).toUpperCase();

							// Final barcode value
							const barcodeData = `${shipperPkg.pac_id}|${fromCode}|${toCode}|${totalCount}`;

							console.log("Barcode VALUE:", barcodeData);

							JsBarcode(`#barcode-${shipperPkg.pac_id}`, barcodeData, {
								format: "CODE128",
								width: 0.8,
								height: 40,
								displayValue: false,
							});
						}, [shipperPkg.pac_id, consignorLoc, consigneeLoc, lrData?.packages_in_data]);
const handlePrintLabels = async () => {
	const jsPDF = (await import("jspdf")).default;
	const html2canvas = (await import("html2canvas")).default;

	for (const pkg of lrData?.packages_in_data ?? []) {
		const element = document.getElementById(`label-${pkg.pack_ID}`);

		if (!element) continue;

		const canvas = await html2canvas(element, { scale: 3 });
		const imgData = canvas.toDataURL("image/jpeg", 1.0);

		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: [70, 110],
		});

		// Fit label into PDF page
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const imgProps = pdf.getImageProperties(imgData);
		const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

		pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);

		// Save file with invoice name
		pdf.save(`${pkg?.invoice}.pdf`);
	}
};

						return (
							<Box key={`${allocIndex}-${index}`} mt={2}>
								<div
									id="hidden-labels"
									style={{
										position: "absolute",
										top: "-99999px",
										left: "-99999px",
										pointerEvents: "none",
										opacity: 0,
									}}
								>
									{lrData?.packages_in_data?.map((pkg) => {
										const pkgInfo = getProductsInPackageDetails(pkg.pack_ID);
										const fromShort =
											getLocationCode(consignorLoc)?.toUpperCase();
										const toShort =
											getLocationCode(consigneeLoc)?.toUpperCase();

										return (
											<div
												key={pkg.pack_ID}
												id={`label-${pkg.pack_ID}`}
												style={{
													width: "350px",
													padding: "18px",
													border: "2px solid #000",
													background: "#fff",
													fontFamily: "Arial, sans-serif",
													marginBottom: "40px",
												}}
											>
												{/* HEADER */}
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
													}}
												>
													<Grid item xs={2}>
														<Image
															src="/TrukAppLogo.png"
															alt="Logo"
															width={90}
															height={30}
															unoptimized
														/>
													</Grid>

													<div style={{ textAlign: "right", fontSize: "12px" }}>
														<p style={{ margin: 0 }}>
															Date: {pkgInfo?.pickup_date_time}
														</p>
														<p style={{ margin: 0 }}>
															Invoice No: <b>{pkg?.invoice}</b>
														</p>
													</div>
												</div>

												<hr />

												<p
													style={{
														fontSize: "12px",
														textAlign: "center",
														marginTop: "-4px",
													}}
												>
													Package ID : <b>{pkg.pack_ID}</b>
												</p>

												<hr />

												{/* CENTER GRID WITH VERTICAL LINES */}
												<div
													style={{
														display: "flex",
														textAlign: "center",
														marginTop: "10px",
													}}
												>
													{/* BOX 1 */}
													<div style={{ width: "38%", padding: "6px" }}>
														<p style={{ margin: 0, fontSize: "12px" }}>
															Destination
														</p>
														<h4 style={{ margin: 0 }}>{toShort}</h4>
													</div>

													{/* VERTICAL LINE */}
													<div
														style={{
															width: "1px",
															background: "#000",
															margin: "0 4px",
														}}
													/>

													{/* BOX 2 */}
													<div style={{ width: "33%", padding: "6px" }}>
														<p style={{ margin: 0, fontSize: "12px" }}>
															Facility Code
														</p>
														<h4 style={{ margin: 0 }}>{consigneeLoc}</h4>
													</div>

													{/* VERTICAL LINE */}
													<div
														style={{
															width: "1px",
															background: "#000",
															margin: "0 4px",
														}}
													/>

													{/* BOX 3 */}
													<div style={{ width: "28%", padding: "6px" }}>
														<p style={{ margin: 0, fontSize: "12px" }}>
															Item Count
														</p>
														<h4 style={{ margin: 0 }}>{pkgInfo?.quantity}</h4>
													</div>
												</div>

												<hr />

												{/* ORIGIN + DELIVERY TYPE */}
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
													}}
												>
													<div>
														<p style={{ margin: 0, fontSize: "12px" }}>
															Origin
														</p>
														<h4 style={{ margin: 0 }}>{fromShort}</h4>
													</div>

													<div style={{ textAlign: "right" }}>
														<p style={{ margin: 0, fontSize: "12px" }}>
															Delivery Type
														</p>
														<h4 style={{ margin: 0 }}>Standard</h4>
													</div>
												</div>

												<hr />

												<svg id={`barcode-${shipperPkg?.pac_id}`}></svg>
												<Typography>{lrData?.lr_num}</Typography>
											</div>
										);
									})}
								</div>

								<Box display="flex" alignItems="center" justifyContent="center">
									<Typography>
										{" "}
										Generate and Download labels for packages :{" "}
									</Typography>
									<Button variant="contained" onClick={handlePrintLabels}>
										Download
									</Button>
								</Box>

								<Paper
									ref={(el) => {
										pdfRefs.current[shipToId] = el;
									}}
									sx={{
										p: 0.7,
										border: "1px solid #222",
										minWidth: 1300,
										maxWidth: 1322,
										margin: "0 auto",

										fontFamily: "Arial, 'Liberation Sans', sans-serif",
									}}
								>
									{/* Header */}
									<Grid container>
										<Grid item xs={2.5}>
											<Image
												src="/TrukAppLogo.png"
												alt="Logo"
												width={150}
												height={50}
												unoptimized
											/>
										</Grid>

										<Grid item xs={7} sx={{ textAlign: "center" }}>
											<Typography fontWeight={700} fontSize="15px">
												Shadowfax Technologies Pvt. Ltd.
											</Typography>
											<Typography fontSize={13}>
												GSTIN: 07AAVCS6967K1ZS &nbsp;|&nbsp; PAN: AAVCS6967K
											</Typography>
										</Grid>
										<Grid
											item
											xs={2.5}
											sx={{ textAlign: "right", fontSize: 13 }}
										>
											<Typography>
												Order Reference No.: <b>{order?.order_ID || "-"}</b>
											</Typography>
											<Typography>
												Booking Date:{" "}
												<b>{order?.created_at?.split("T")[0] || "-"}</b>
											</Typography>
											{/* <Typography fontWeight={700} fontSize="12px">
												LOR NO.
											</Typography> */}
											<svg id={`barcode-${shipperPkg?.pac_id}`}></svg>

											<Typography>{lrData?.lr_num}</Typography>
										</Grid>
									</Grid>
									{/* Top info table */}
									<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
										<Grid container>
											<Cell sx={{ width: "14%" }}>MODE</Cell>
											<Cell sx={{ width: "20%" }}>LOR TYPE</Cell>
											<Cell sx={{ width: "16%" }}>DELIVERY TYPE</Cell>
											<Cell sx={{ width: "18%" }}>DELIVERY SLOT</Cell>
											<Cell sx={{ width: "32%" }}>
												SIGNATURE & STAMP OF CONSIGNEE
											</Cell>
										</Grid>
										<Grid container>
											<Cell sx={{ width: "14%" }}>Surface</Cell>
											<Cell sx={{ width: "20%" }}>{selectedCopy}</Cell>
											<Cell sx={{ width: "16%" }}>Standard</Cell>
											<Cell sx={{ width: "18%" }}>ALL DAY</Cell>
											{/* <Cell sx={{ width: "32%" }} ></Cell> */}
										</Grid>
									</Grid>
									{/* Consignor/Consignee table - from LR Invoice */}
									<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
										<Cell sx={{ width: "50%" }}>
											<Typography fontWeight={700} fontSize={13}>
												CONSIGNER NAME & ADDRESS
											</Typography>
											<Typography fontSize={13}>
												{getLocationDetails(consignorLoc)}
											</Typography>
										</Cell>
										<Cell sx={{ width: "50%" }}>
											<Typography fontWeight={700} fontSize={13}>
												CONSIGNEE NAME & ADDRESS
											</Typography>
											<Typography fontSize={13}>
												{getLocationDetails(consigneeLoc)}
											</Typography>
										</Cell>
									</Grid>
									{/* Table for goods */}
									<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
										{/* Header row */}
										<Cell sx={{ width: "8%" }}>SL No.</Cell>
										<Cell sx={{ width: "18%" }}>Invoice Number</Cell>
										<Cell sx={{ width: "18%" }}>EWB Number</Cell>
										<Cell sx={{ width: "18%" }}>Product Details</Cell>
										<Cell sx={{ width: "8%" }}>Count</Cell>
										<Cell sx={{ width: "8%" }}>Dead Weight</Cell>
										<Cell sx={{ width: "12%" }}>Chargable Weight</Cell>
										<Cell sx={{ width: "10%" }}>Value</Cell>
										{/* Data rows */}
										{productRows.map((row, idx) => (
											<React.Fragment key={idx}>
												<Cell sx={{ width: "8%" }}>{row.slNo}</Cell>
												<Cell sx={{ width: "18%" }}>{row.invoice}</Cell>
												<Cell sx={{ width: "18%" }}>{row.ewb}</Cell>
												<Cell sx={{ width: "18%" }}>{row.details}</Cell>
												<Cell sx={{ width: "8%" }}>{row.count}</Cell>
												<Cell sx={{ width: "8%" }}>{row.deedWeight}</Cell>
												<Cell sx={{ width: "12%" }}>
													{row.chargeableWeight}
												</Cell>
												<Cell sx={{ width: "10%" }}>{row.value}</Cell>
											</React.Fragment>
										))}
										{/* Total row */}
										{/* <Cell sx={{ width: "26%", borderTop: "2px solid #333" }}>
											TOTAL
										</Cell>
										<Cell sx={{ width: "8%" }}>{totalCount}</Cell>
										<Cell sx={{ width: "8%" }}>{totalDeedWeight}</Cell>
										<Cell sx={{ width: "12%" }}>{totalChargeableWeight}</Cell>
										<Cell sx={{ width: "10%" }}>{totalValue}</Cell> */}
										{/* <Cell sx={{ width: "36%" }}></Cell> */}
									</Grid>
									{/* Declaration */}
									<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
										<Cell sx={{ width: "100%" }}>
											<b>DECLARATION BY THE CONSIGNER</b>
											<br />I hereby solemnly declare that all the particulars
											mentioned on this consignment note are true and correct
											and I have read, understood & accept all the terms and
											conditions mentioned in agreement.
										</Cell>
									</Grid>
									{/* Source, destination, signature */}
									<Grid container sx={{ border: "1px solid #333", mt: 1 }}>
										<Cell sx={{ width: "24%" }}>
											<b>SOURCE</b> : {getLocationCode(consignorLoc)}
											<br />
											Facility Code:{consignorLoc}
										</Cell>
										<Cell sx={{ width: "24%" }}>
											<b>DESTINATION</b> : {getLocationCode(consigneeLoc)}
											<br />
											Facility Code: {consigneeLoc}
										</Cell>
										<Cell
											sx={{
												width: "52%",
												display: "flex",
												justifyContent: "space-between",
												alignItems: "flex-end",
											}}
										>
											<Box
												sx={{
													display: "flex",
													width: "100%",
													justifyContent: "space-between",
												}}
											>
												{selectedCopy === "CONSIGNEE COPY" && (
													<>
														<Typography>Signature of Consignee</Typography>
														<Typography></Typography>
														<Typography>Signature of Transporter</Typography>
													</>
												)}

												{selectedCopy === "CONSIGNOR COPY" && (
													<>
														<Typography>Signature of Consigner</Typography>
														<Typography></Typography>
														<Typography>Signature of Transporter</Typography>
													</>
												)}

												{selectedCopy === "TRANSPORTER COPY" && (
													<>
														<Typography>Signature of Consignee</Typography>
														<Typography>Signature of Consigner</Typography>
														<Typography>Signature of Transporter</Typography>
													</>
												)}
											</Box>
										</Cell>
									</Grid>
								</Paper>
								<Box textAlign="center" mb={10} mt={2}>
									<Button
										variant="contained"
										onClick={() => {
											setCurrentShipToId(shipToId); // store it
											setOpenPopup(true); // open popup
										}}
									>
										PRINT PDF
									</Button>

									<Button
										variant="outlined"
										sx={{ mx: 1, px: 4 }}
										onClick={() => window.close()}
									>
										CLOSE
									</Button>
								</Box>
							</Box>
						);
					}
				);
			})}
		</>
	);
};

export default LOR;
