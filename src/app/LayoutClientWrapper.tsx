"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import ReduxProvider from "@/store/redux-provider";
import theme from "@/theme";
import { Grid, Toolbar } from "@mui/material";
import { Session } from "next-auth";
import ScrollToTop from "@/Components/ReusableComponents/ScrollToTop";
import NetworkStatusModal from "@/Components/ReusableComponents/NetworkStatus";
// import { usePathname } from "next/navigation";

// const LayoutClientWrapper = ({
// 	children,
// 	session,
// }: {
// 	children: React.ReactNode;
// 	session: Session | null;
// }) => {
// 	// const pathname = usePathname();
// 	// const isLandingPage = pathname === "/"
// 	return (
// 		<SessionProvider session={session}>
// 			<ThemeProvider theme={theme}>
// 				<CssBaseline />
// 				<NetworkStatusModal />
// 				<ReduxProvider>
// 					<Header />
// 					<Toolbar />
// 					<Grid
// 						sx={{
// 							marginLeft: { xs: "5px", md: "20px" },
// 							padding: "10px",
// 							backgroundColor: "#ffffff",
// 							minHeight: "90vh",
// 						}}
// 					>
// 						<ScrollToTop />
// 						{children}
// 					</Grid>
// 					<Footer />
// 				</ReduxProvider>
// 			</ThemeProvider>
// 		</SessionProvider>
// 	);
// };
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
				<NetworkStatusModal />

				<ReduxProvider>
					{/* 🔹 MAIN WRAPPER */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							minHeight: "100vh",
						}}
					>
						<Header />
						<Toolbar />

						{/* 🔹 CONTENT AREA (GROWS) */}
						<Grid
							sx={{
								flex: 1, // ✅ THIS PUSHES FOOTER DOWN
								marginLeft: { xs: "5px", md: "20px" },
								padding: "10px",
								backgroundColor: "#ffffff",
							}}
						>
							<ScrollToTop />
							{children}
						</Grid>

						{/* 🔹 FOOTER ALWAYS AT BOTTOM */}
						<Footer />
					</div>
				</ReduxProvider>
			</ThemeProvider>
		</SessionProvider>
	);
};

export default LayoutClientWrapper;
