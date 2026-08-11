import { readFileSync } from "node:fs";
import { join } from "node:path";
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
  "admin",
] as const;

type Namespace = (typeof namespaces)[number];

// Keep message namespaces listed above in sync with messages/<locale>/*.json

async function loadNamespace(
  locale: string,
  ns: Namespace,
): Promise<Record<string, unknown>> {
  if (process.env.NODE_ENV === "development") {
    const filePath = join(process.cwd(), "messages", locale, `${ns}.json`);
    return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
  }

  const mod = await import(`../messages/${locale}/${ns}.json`);
  return mod.default as Record<string, unknown>;
}

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
        const payload = await loadNamespace(locale, ns);
        return [ns, payload] as const;
      }),
    ),
  );

  return { locale, messages };
});
