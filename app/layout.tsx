import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from 'next/font/google'
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Analytics Dashboard — CoreHardware",
    description: "Indicadores e inteligencia de negocio del ecosistema CoreHardware",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
            <body className="bg-zinc-950 text-zinc-50 antialiased">
                <ClerkProvider signInUrl="/sign-in" afterSignOutUrl="/">
                    {children}
                </ClerkProvider>
            </body>
        </html>
    );
}
