import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdminMessagesProvider from "@/components/AdminMessagesProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#8A5CFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Serv-Itz - Conectando Você aos Melhores Profissionais",
  description:
    "Encontre prestadores de serviços em Imperatriz. Beleza, manutenção, pet shop, delivery, saúde e muito mais. Cadastre-se gratuitamente.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Serv-Itz",
    startupImage: ["/icons/icon-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Serv-Itz - Conectando Você aos Melhores Profissionais",
    description: "Encontre prestadores de serviços em Imperatriz com qualidade e confiança.",
    type: "website",
    locale: "pt_BR",
  },
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
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Serv-Itz" />
        <meta name="application-name" content="Serv-Itz" />
        <meta name="msapplication-TileColor" content="#8A5CFF" />
        <meta name="msapplication-TileImage" content="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col font-[var(--font-geist-sans)] bg-[#05010a] text-white pb-[env(safe-area-inset-bottom,0px)]">
        <AdminMessagesProvider>
          {children}
          <BottomNav />
          <InstallPrompt />
        </AdminMessagesProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
