import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import SupabaseProvider from "@/providers/SupabaseProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";
import { SupportButton } from "@/components/SupportButton";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventFlow+ | Plataforma Completa de Gestão de Eventos e Check-in",
  description: "Simplifique a gestão dos seus eventos com o EventFlow+. Sistema completo com formulários personalizados, check-in digital, dashboard em tempo real e gestão de convidados. A solução moderna para organizadores de eventos.",
  keywords: "gestão de eventos, check-in digital, sistema de eventos, formulários para eventos, gerenciamento de convidados, plataforma de eventos, controle de presença, dashboard de eventos, inscrições online, organização de eventos, RSVP online, lista de convidados digital",
  authors: [{ name: "RoversoDev" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "EventFlow+ | Plataforma Completa de Gestão de Eventos e Check-in",
    description: "Transforme a gestão dos seus eventos com formulários personalizados, check-in digital e análises em tempo real. A solução completa para organizadores de eventos modernos.",
    type: "website",
    locale: "pt_BR",
    images: [{
      url: "https://eventflow.roversodev.com.br/dashboard.png",
      width: 1200,
      height: 630,
      alt: "EventFlow+ - Plataforma Moderna de Gestão de Eventos"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "EventFlow+ | Plataforma Completa de Gestão de Eventos e Check-in",
    description: "Transforme a gestão dos seus eventos com formulários personalizados, check-in digital e análises em tempo real. A solução completa para organizadores de eventos modernos.",
    images: [{
      url: "https://eventflow.roversodev.com.br/dashboard.png",
      width: 1200,
      height: 630,
      alt: "EventFlow+ - Plataforma Moderna de Gestão de Eventos"
    }]
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://eventflow.roversodev.com.br"
  }
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
            <Footer />
            <SupportButton />
            <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

