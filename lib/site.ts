const DEFAULT_SITE_URL = "https://fantakalcio.it/";

function normalizeSiteUrl(value: string | undefined) {
  if (!value) {
    return DEFAULT_SITE_URL;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export const siteConfig = {
  name: "fantakalcio.it",
  description: "Fantakalcio, blog in italiano dedicato al fantacalcio.",
  locale: "it_IT",
  siteUrl: normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      process.env.VERCEL_PROJECT_PRODUCTION_URL ??
      process.env.VERCEL_URL,
  ),
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.siteUrl).toString();
}
