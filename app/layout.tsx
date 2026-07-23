import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavigationBar from "./nav/page";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Power Track",
    description: "Electricity consumption statistics",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <head></head>
            <body className="min-h-full flex flex-col">
                <ClerkProvider afterSignOutUrl="/sign-in">
                    <NavigationBar />
                    {children}
                    <Toaster />
                </ClerkProvider>
            </body>
        </html>
    );
}
