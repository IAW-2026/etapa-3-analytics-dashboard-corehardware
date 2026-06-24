import Navbar from "@/components/Navbar";

export default function ProtectedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
