import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";

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
    <ClerkProvider localization={ptBR}>
      <html lang="pt-br" suppressHydrationWarning={true}>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
