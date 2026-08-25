"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

type Browser = "chrome" | "edge" | "firefox" | "opera" | "unknown";

const browserStores: Record<Browser, { url: string; label: string; name: string }> = {
  chrome: {
    url: "https://chromewebstore.google.com/detail/trampo",
    label: "Instalar no Chrome",
    name: "Chrome",
  },
  edge: {
    url: "https://microsoftedge.microsoft.com/addons/detail/trampo",
    label: "Instalar no Edge",
    name: "Edge",
  },
  firefox: {
    url: "https://addons.mozilla.org/firefox/addon/trampo",
    label: "Instalar no Firefox",
    name: "Firefox",
  },
  opera: {
    url: "https://addons.opera.com/en/extensions/details/trampo",
    label: "Instalar no Opera",
    name: "Opera",
  },
  unknown: {
    url: "https://chromewebstore.google.com/detail/trampo",
    label: "Instalar Extensão",
    name: "Navegador",
  },
};

function detectBrowser(): Browser {
  if (typeof window === "undefined") return "unknown";

  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("opr") || ua.includes("opera")) return "opera";
  if (ua.includes("edg")) return "edge";
  if (ua.includes("firefox")) return "firefox";
  if (ua.includes("chrome") && !ua.includes("edg")) return "chrome";

  return "unknown";
}

const allBrowsers: { key: Browser; icon: React.ReactNode }[] = [
  {
    key: "chrome",
    icon: (
      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: "edge",
    icon: (
      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.86 17.86c.39-1.12.54-2.28.54-3.48C22.4 8.4 18 4 12.8 4c-3.12 0-5.88 1.2-7.92 3.12A12.13 12.13 0 002 14.4c0 2.04.6 3.96 1.68 5.6h2.04c-.12-.48-.18-.96-.18-1.44 0-3.6 2.4-6.72 5.64-7.68.24-.08.48-.12.72-.12.84 0 1.56.36 2.04.96.48.6.72 1.44.72 2.28 0 .48-.12.96-.24 1.44l-.12.36c-.48 1.32-.84 2.64-.84 3.96 0 .48.06.96.12 1.44h2.04c-.06-.48-.12-.96-.12-1.44 0-1.32.24-2.64.72-3.96.24-.6.48-1.2.84-1.68.36-.48.84-.84 1.44-1.08a3.6 3.6 0 011.8-.48c.72 0 1.44.24 2.04.6.6.36 1.08.96 1.44 1.68z" />
      </svg>
    ),
  },
  {
    key: "firefox",
    icon: (
      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
  {
    key: "opera",
    icon: (
      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-8c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" />
      </svg>
    ),
  },
];

export function BrowserDetectHero() {
  const [browser, setBrowser] = useState<Browser>("unknown");

  useEffect(() => {
    setBrowser(detectBrowser());
  }, []);

  const detected = browserStores[browser];

  return (
    <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a
        href={detected.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-full bg-trampo-primary-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-trampo-primary-500/25 hover:bg-trampo-primary-400 active:bg-trampo-primary-600 transition-all duration-150 active:scale-95"
      >
        <Download className="size-5" />
        {detected.label}
      </a>
    </div>
  );
}

export function BrowserDetectAll() {
  const [browser, setBrowser] = useState<Browser>("unknown");

  useEffect(() => {
    setBrowser(detectBrowser());
  }, []);

  const others = allBrowsers.filter((b) => b.key !== browser);

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {others.map((b) => {
        const store = browserStores[b.key];
        return (
          <a
            key={b.key}
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-50 border border-trampo-border px-3 py-2 text-xs font-semibold text-trampo-muted hover:text-trampo-dark hover:border-trampo-primary-400 transition-all"
          >
            {b.icon}
            {store.name} Web Store
          </a>
        );
      })}
    </div>
  );
}

export function BrowserDetectCTA() {
  const [browser, setBrowser] = useState<Browser>("unknown");

  useEffect(() => {
    setBrowser(detectBrowser());
  }, []);

  const detected = browserStores[browser];

  return (
    <a
      href={detected.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-trampo-primary-500 px-10 py-5 text-base font-bold text-white shadow-2xl shadow-trampo-primary-500/30 hover:bg-trampo-primary-400 transition-transform hover:scale-105 active:scale-95 duration-150"
    >
      <Download className="size-5" />
      {detected.label}
    </a>
  );
}

export function BrowserDetectHeader() {
  const [browser, setBrowser] = useState<Browser>("unknown");

  useEffect(() => {
    setBrowser(detectBrowser());
  }, []);

  const detected = browserStores[browser];

  return (
    <Link
      className="rounded-full bg-trampo-primary-500 px-5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-lg shadow-trampo-primary-500/10 hover:bg-trampo-primary-400 active:bg-trampo-primary-600 transition-all duration-150 active:scale-95"
      href={detected.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Instalar Agora
    </Link>
  );
}
