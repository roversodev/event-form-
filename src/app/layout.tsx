import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import SupabaseProvider from "@/providers/SupabaseProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventForm+ | Sistema de Gestão de Eventos e Formulários",
  description: "Crie e gerencie formulários personalizados para seus eventos com uma experiência moderna e intuitiva. Organize inscrições, faça check-in e gerencie seus eventos em um só lugar.",
  keywords: "formulário de eventos, gestão de eventos, sistema de inscrição, check-in eventos, formulários personalizados, gestão de convidados, organização de eventos, sistema de eventos, formulários online, gerenciamento de eventos",
  authors: [{ name: "RoversoDev" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "EventForm+ | Sistema de Gestão de Eventos e Formulários",
    description: "Crie formulários personalizados para seus eventos com uma experiência moderna e intuitiva. Gerencie inscrições e faça check-in em um só lugar.",
    type: "website",
    locale: "pt_BR",
    images: [{
      url: "https://event-form-pi.vercel.app/video/thumbnail.jpg",
      width: 1200,
      height: 630,
      alt: "EventForm+ - Sistema de Gestão de Eventos"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "EventForm+ | Sistema de Gestão de Eventos e Formulários",
    description: "Crie formulários personalizados para seus eventos com uma experiência moderna e intuitiva. Gerencie inscrições e faça check-in em um só lugar.",
    images: [{
      url: "https://event-form-pi.vercel.app/video/thumbnail.jpg",
      width: 1200,
      height: 630,
      alt: "EventForm+ - Sistema de Gestão de Eventos"
    }]
  },
  robots: "index, follow"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${dmSans.className} antialiased`}
        suppressHydrationWarning
      >
        <SupabaseProvider>
          <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            <Navbar />
            {children}
            <Toaster />
            <Footer />
            </ThemeProvider>
          </QueryProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

