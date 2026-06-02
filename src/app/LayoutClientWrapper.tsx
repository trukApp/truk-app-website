// "use client";

// import { SessionProvider } from "next-auth/react";
// import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import Header from "@/Components/Header";
// import Footer from "@/Components/Footer";
// import ReduxProvider from "@/store/redux-provider";
// import theme from "@/theme";
// import { Grid, Toolbar } from "@mui/material";
// import { Session } from "next-auth";
// import ScrollToTop from "@/Components/ReusableComponents/ScrollToTop";
// import NetworkStatusModal from "@/Components/ReusableComponents/NetworkStatus";
// const LayoutClientWrapper = ({
// 	children,
// 	session,
// }: {
// 	children: React.ReactNode;
// 	session: Session | null;
// }) => {
// 	return (
// 		<SessionProvider session={session}>
// 			<ThemeProvider theme={theme}>
// 				<CssBaseline />
// 				<NetworkStatusModal />

// 				<ReduxProvider>
// 					{/* 🔹 MAIN WRAPPER */}
// 					<div
// 						style={{
// 							display: "flex",
// 							flexDirection: "column",
// 							minHeight: "100vh",
// 						}}
// 					>
// 						<Header />
// 						<Toolbar />

// 						{/* 🔹 CONTENT AREA (GROWS) */}
// 						<Grid
// 							sx={{
// 								flex: 1, // ✅ THIS PUSHES FOOTER DOWN
// 								marginLeft: { xs: "5px", md: "20px" },
// 								padding: "10px",
// 								backgroundColor: "#ffffff",
// 							}}
// 						>
// 							<ScrollToTop />
// 							{children}
// 						</Grid>

// 						{/* 🔹 FOOTER ALWAYS AT BOTTOM */}
// 						<Footer />
// 					</div>
// 				</ReduxProvider>
// 			</ThemeProvider>
// 		</SessionProvider>
// 	);
// };

// export default LayoutClientWrapper;



"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import ReduxProvider from "@/store/redux-provider";
import theme from "@/theme";
import { Box, Toolbar } from "@mui/material";
import { Session } from "next-auth";

import ScrollToTop from "@/Components/ReusableComponents/ScrollToTop";
import NetworkStatusModal from "@/Components/ReusableComponents/NetworkStatus";

// import { SidebarProvider } from "@/context/SidebarContext";
// import SidebarProvider from "/SidebarContext";
import { SidebarProvider } from "@/Components/context/SidebarContext";

const LayoutClientWrapper = ({
	children,
	session,
}: {
	children: React.ReactNode;
	session: Session | null;
}) => {
	return (
		<SessionProvider session={session}>
			<ThemeProvider theme={theme}>
				<CssBaseline />

				<ReduxProvider>
					<SidebarProvider>
						<NetworkStatusModal />

						{/* MAIN APP */}
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								minHeight: "100vh",
								backgroundColor: "#f3f4f6",
							}}
						>
							{/* HEADER */}
							<Header />

							{/* HEADER SPACING */}
							<Toolbar />

							{/* PAGE CONTENT */}
							<Box
								sx={{
									flex: 1,
									display: "flex",
									flexDirection: "column",
									width: "100%",
									overflowX: "hidden",
									transition: "all 0.3s ease",
								}}
							>
								<ScrollToTop />

								{/* PAGE */}
								<Box
									sx={{
										flex: 1,
										width: "100%",
										minHeight: "calc(100vh - 64px)",
									}}
								>
									{children}
								</Box>
							</Box>

							{/* FOOTER */}
							<Footer />
						</Box>
					</SidebarProvider>
				</ReduxProvider>
			</ThemeProvider>
		</SessionProvider>
	);
};

export default LayoutClientWrapper;