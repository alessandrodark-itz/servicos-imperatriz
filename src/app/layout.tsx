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

const SITE_URL = "https://www.servitz.com.br";
const OG_TITLE = "Serv-Itz — Encontre Profissionais de Confiança";
const OG_DESCRIPTION =
  "Contrate profissionais verificados de forma rápida, segura e moderna em Imperatriz. Mais de 500 prestadores. Gratuito para clientes.";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const viewport: Viewport = {
  themeColor: "#8A5CFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: OG_TITLE,
    template: "%s | Serv-Itz",
  },
  description: OG_DESCRIPTION,
  keywords: [
    "serviços Imperatriz",
    "prestadores de serviços",
    "profissionais verificados",
    "contratar serviços",
    "Imperatriz Maranhão",
    "Serv-Itz",
  ],
  authors: [{ name: "Serv-Itz", url: SITE_URL }],
  creator: "Serv-Itz",
  publisher: "Serv-Itz",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Serv-Itz",
    locale: "pt_BR",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Serv-Itz — Encontre Profissionais de Confiança em Imperatriz",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@servitz",
    creator: "@servitz",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },

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
    apple: [{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }],
    shortcut: "/icons/icon-192x192.png",
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
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
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
