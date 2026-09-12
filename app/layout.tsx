import type { Metadata } from "next";
import Link from "next/link";
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
    icon: "/icon.svg",
    shortcut: "/icon.svg",
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
        alt: `${siteConfig.name} - anteprima notizie`,
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
    const storageKey = "fantakalcio-theme";
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
        <div className="min-h-full">
          <div className="border-b border-white/10 bg-[var(--masthead)] text-white">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] sm:px-6">
              <span></span>
              <span className="hidden text-white/60 sm:inline">Notizie · Analisi · Consigli</span>
            </div>
          </div>
          <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6">
              <Link
                href="/"
                aria-label={siteConfig.name}
                className="group flex items-center gap-3"
              >
                <span className="grid size-10 place-items-center bg-[var(--sport)] text-lg font-black italic text-white shadow-[4px_4px_0_var(--masthead)] transition-transform group-hover:-translate-y-0.5">
                  F
                </span>
                <span className="text-xl font-black uppercase italic tracking-[-0.04em] text-[var(--text-primary)] sm:text-2xl">
                  fantakalcio<span className="text-[var(--sport)]">.it</span>
                </span>
              </Link>
              <nav aria-label="Navigazione principale" className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="px-2 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:text-[var(--sport)] sm:px-3 sm:text-sm"
              >
                Ultime
              </Link>
              <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
          <footer className="mt-16 border-t border-[var(--border)] bg-[var(--masthead)] text-white">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="font-black uppercase italic tracking-tight">fantakalcio.it</p>
              <p className="text-white/55">Notizie e idee per giocare meglio, fino all&apos;ultimo bonus.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
