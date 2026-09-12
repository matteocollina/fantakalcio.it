const DEFAULT_SITE_URL = "https://fantakalcio.it/";

export const siteConfig = {
  name: "fantakalcio.it",
  description: "Notizie e approfondimenti sul fantacalcio, ogni giorno.",
  locale: "it_IT",
  siteUrl: DEFAULT_SITE_URL,
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.siteUrl).toString();
}
