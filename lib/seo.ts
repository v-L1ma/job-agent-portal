import type { Metadata } from "next";

const DEFAULT_SITE_URL = "http://localhost:3000";
const vercelSiteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

function normalizeSiteUrl(rawUrl?: string): string {
  if (!rawUrl) {
    return DEFAULT_SITE_URL;
  }

  try {
    return new URL(rawUrl).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? vercelSiteUrl
);
export const metadataBase = new URL(siteUrl);

const isLocalhost =
  metadataBase.hostname === "localhost" || metadataBase.hostname === "127.0.0.1";
const isPreviewEnvironment = process.env.VERCEL_ENV === "preview";

export const allowIndexing =
  process.env.NODE_ENV === "production" && !isPreviewEnvironment && !isLocalhost;

export const defaultRobots: Metadata["robots"] = allowIndexing
  ? {
      index: true,
      follow: true,
    }
  : {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

export function withCanonical(path: string): Metadata["alternates"] {
  const canonical = path.startsWith("/") ? path : `/${path}`;

  return { canonical };
}

export function absoluteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, siteUrl).toString();
}