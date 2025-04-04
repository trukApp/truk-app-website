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
import client from "@/lib/apollo-client";

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
        <ApolloProvider client={client}>
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
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// // import localFont from "next/font/local";
// import "./globals.css";
// import ReduxProvider from "@/store/redux-provider";
// import Header from "@/Components/Header";
// import Footer from "@/Components/Footer";
// import { ThemeProvider, Grid } from '@mui/material';
// import CssBaseline from "@mui/material/CssBaseline";
// import theme from "@/theme";


// // const geistSans = localFont({
// //   src: "./fonts/GeistVF.woff",
// //   variable: "--font-geist-sans",
// //   weight: "100 900",
// // });
// // const geistMono = localFont({
// //   src: "./fonts/GeistMonoVF.woff",
// //   variable: "--font-geist-mono",
// //   weight: "100 900",
// // });

// export const metadata: Metadata = {
//   title: "Truk app",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <ReduxProvider>
//             <Header />
//             <Grid sx={{ marginTop: { xs: '20px', md: '33px' }, padding: '15px', backgroundColor: "#FAF1F8", minHeight: '70vh' }}>
//               {children}
//             </Grid>
//             <Footer />
//           </ReduxProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

