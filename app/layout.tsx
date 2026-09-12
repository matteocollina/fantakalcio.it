import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import ThemeToggle from "@/app/components/theme-toggle";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon-mc.ico",
    shortcut: "/favicon-mc.ico",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Open Graph image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `(() => {
    const storageKey = "mc-blog-theme";
    const savedTheme = window.localStorage.getItem(storageKey);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : systemTheme;
  })();`;

  return (
    <html lang="it" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K4XJP7DS');`}
        </Script>
        <Script
          id="google-gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-5ZCW8LDWY6"
          strategy="afterInteractive"
        />
        <Script id="google-gtag-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-5ZCW8LDWY6');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K4XJP7DS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-6 py-8 sm:px-10">
          <header className="mb-12 flex items-center justify-between border-b border-[var(--border)] pb-5">
            <Link
              href="/"
              aria-label={siteConfig.name}
              className="transition-colors hover:text-[var(--text-tertiary)]"
            >
              <>
                <Image
                  src="/mc.png"
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full border border-[var(--border)] object-cover sm:hidden"
                />
                <span className="hidden text-lg font-semibold tracking-tight text-[var(--text-primary)] sm:inline">
                  {siteConfig.name}
                </span>
              </>
            </Link>
            <nav aria-label="Main navigation" className="flex items-center gap-6">
              <Link
                href="/blog"
                className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-bg)] hover:text-[var(--accent-fg)]"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-bg)] hover:text-[var(--accent-fg)]"
              >
                About
              </Link>
              <ThemeToggle />
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
