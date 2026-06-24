import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
    title: "Analytics Dashboard — CoreHardware",
    description: "Indicadores e inteligencia de negocio del ecosistema CoreHardware",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es" className="dark">
            <body className="min-h-screen antialiased">
                <ClerkProvider signInUrl="/sign-in" afterSignOutUrl="/">
                    <Navbar />
                    {children}
                </ClerkProvider>
            </body>
        </html>
    );
}
