import Providers from "@/components/Providers";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Files Manager",
  description: "App to manage your files",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Providers>
            <Navbar />
            <div className="min-h-screen">{children}</div>
            <Toaster />
            <Footer />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
