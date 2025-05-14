import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Styledroot } from "./Styledroot";
import "./globals.css";

export const metadata: Metadata = {
  title: "Park Note App",
  description: "A simple app to help me remember where me parked my car ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Styledroot>{children}</Styledroot>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
