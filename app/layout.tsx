import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { absoluteUrl, defaultRobots, metadataBase } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "BuscaVagas | Automacao de candidaturas com IA",
    template: "%s | BuscaVagas",
  },
  description:
    "Automatize sua busca por emprego, personalize curriculos com IA e acompanhe candidaturas em um unico painel.",
  alternates: {
    canonical: "/",
  },
  robots: defaultRobots,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "BuscaVagas",
    title: "BuscaVagas | Automacao de candidaturas com IA",
    description:
      "Encontre vagas relevantes, gere curriculos personalizados e acompanhe resultados com apoio de IA.",
    images: [
      {
        url: absoluteUrl("/assets/img-4.jpg"),
        width: 1200,
        height: 630,
        alt: "Painel da plataforma BuscaVagas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuscaVagas | Automacao de candidaturas com IA",
    description:
      "Gerencie sua busca de vagas com automacao, IA e visibilidade do funil de candidaturas.",
    images: [absoluteUrl("/assets/img-4.jpg")],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const enableAnalytics =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {gtmId ? (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        ) : null}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        ) : null}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {enableAnalytics ? <Analytics /> : null}
        </ThemeProvider>
      </body>
    </html>
  );
}
