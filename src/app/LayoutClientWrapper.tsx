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
import { usePathname } from "next/navigation";

const LayoutClientWrapper = ({ children, session }: { children: React.ReactNode; session: Session | null; }) => {
    const pathname = usePathname();
    console.log("session is :", session)

  const isLandingPage = pathname === "/" 
    return (
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ReduxProvider>
                    <Header />
                    <Toolbar />
                    <Grid
                        sx={{
                            // marginTop: { xs: "40px", md: "60px", },
                            padding: isLandingPage ? '0px' : "15px",
                            backgroundColor: "#ffffff",
                            minHeight: "90vh",
                            marginLeft :isLandingPage ? '0px' : '30px'
                        }}
                    >
                        {children}
                    </Grid>
                    <Footer />
                </ReduxProvider>
            </ThemeProvider>
        </SessionProvider>
    );
};

export default LayoutClientWrapper;
