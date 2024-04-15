import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "../globals.css";
import Navbar from "@/components/Navbar";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import { ptBR } from "@clerk/localizations";
import Footer from "@/components/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Template Loja Ecommerce de Roupas ",
  description: "Ecommerce de Roupas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
      <ClerkProvider localization={ptBR}>

          <ToasterProvider />
          <Navbar />
          {children}
          <Footer/>
        </ClerkProvider>
      </body>
    </html>
  );
}
