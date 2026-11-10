import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/brand/ThemeProvider";
import { Cursor } from "@/components/brand/Cursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ChatWidget } from "@/components/chat/ChatWidget";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://eliavatech.com"
  ),
  title: {
    default: "EliavaTech | Building What's Next.",
    template: "%s | EliavaTech",
  },
  description:
    "Websites, software and AI automation that help growing businesses operate smarter.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EliavaTech | Building What's Next.",
    description:
      "Websites, software and AI automation that help growing businesses operate smarter.",
    url: "/",
    siteName: "EliavaTech",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EliavaTech | Building What's Next.",
    description:
      "Websites, software and AI automation that help growing businesses operate smarter.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text font-sans selection:bg-primary/20 selection:text-text">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-pill focus:bg-primary focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-white"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <Cursor />
          <Navbar />
          <SmoothScroll>
            <main id="main-content" className="flex-1 flex flex-col pt-20">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
          <ChatWidget mode="floating" />
        </ThemeProvider>
      </body>
    </html>
  );
}


