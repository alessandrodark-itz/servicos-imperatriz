import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdminMessagesProvider from "@/components/AdminMessagesProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Servicos Imperatriz - Conectando Voce aos Melhores Profissionais",
  description:
    "Encontre prestadores de servicos em Imperatriz. Beleza, manutencao, pet shop, delivery, saude e muito mais. Cadastre-se gratuitamente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-geist-sans)] bg-[#05010a] text-white">
        <AdminMessagesProvider>
          {children}
        </AdminMessagesProvider>
      </body>
    </html>
  );
}
