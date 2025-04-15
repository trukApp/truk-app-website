"use client";

import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/redux-provider";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { ThemeProvider, Grid } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import { ApolloProvider } from "@apollo/client";
import graphclient from "@/lib/apollo-client";
import { SessionProvider } from "next-auth/react";

// export const metadata: Metadata = {
//   title: "Truk app",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ApolloProvider client={graphclient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ReduxProvider>
                <Header />
                <Grid
                  sx={{
                    marginTop: { xs: "20px", md: "33px" },
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
          </ApolloProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
