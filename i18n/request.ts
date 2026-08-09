import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

const namespaces = [
  "home",
  "about",
  "header",
  "forms",
  "buttons",
  "tabs",
  "auth",
  "employee",
] as const;

// Keep message namespaces listed above in sync with messages/<locale>/*.json

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  const messages = Object.fromEntries(
    await Promise.all(
      namespaces.map(async (ns) => {
        const mod = await import(`../messages/${locale}/${ns}.json`);
        return [ns, mod.default] as const;
      }),
    ),
  );

  return { locale, messages };
});
