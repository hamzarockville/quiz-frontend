import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import CustomSidebar from "@/components/ui/custom-sidebar";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CustomSidebar />
        <div className="ml-4 md:ml-52 mr-4">
          <Navbar />
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}


