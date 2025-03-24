"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
// import ReduxProvider from "@/store/ReduxProvider";
import ReduxProvider from "@/store/redux-provider";
import theme from "@/theme";
import { Grid } from "@mui/material";

const LayoutClientWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ReduxProvider>
                    <Header />
                    <Grid
                        sx={{
                            marginTop: { xs: "20px", md: "60px", },
                            padding: "15px",
                            backgroundColor: "#FAF1F8",
                            minHeight: "70vh",
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
