"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { absoluteUrl } from "@/lib/seo";
import { ChevronDown, Menu, X } from "lucide-react";

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Trampo",
  url: absoluteUrl("/"),
  logo: absoluteUrl("/assets/logo-dark.png"),
};

const webSiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Trampo",
  url: absoluteUrl("/"),
  inLanguage: "pt-BR",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [extensaoOpen, setExtensaoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-trampo-dark antialiased">
      {/* Sticky Header */}
      <header className="fixed top-0 z-50 w-full border-b border-trampo-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logo-dark.png"
                alt="Trampo Logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden gap-8 text-sm font-medium tracking-tight md:flex">
            {/* Extensão Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-trampo-muted transition-colors hover:text-trampo-dark">
                Extensão
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="rounded-xl border border-trampo-border bg-white p-2 shadow-xl shadow-neutral-100/60 min-w-[180px]">
                  <Link
                    href="/extensao"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-trampo-muted hover:bg-trampo-primary-50 hover:text-trampo-primary-600 transition-colors"
                  >
                    Instalar
                  </Link>
                  <Link
                    href="/extensao/suporte"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-trampo-muted hover:bg-trampo-primary-50 hover:text-trampo-primary-600 transition-colors"
                  >
                    Suporte
                  </Link>
                </div>
              </div>
            </div>

            <a className="text-trampo-muted transition-colors hover:text-trampo-dark" href="#funcionalidades">
              Funcionalidades
            </a>
            <a className="text-trampo-muted transition-colors hover:text-trampo-dark" href="#sobre">
              Sobre
            </a>
            <a className="text-trampo-muted transition-colors hover:text-trampo-dark" href="#depoimentos">
              Depoimentos
            </a>
            <a className="text-trampo-muted transition-colors hover:text-trampo-dark" href="#precos">
              Preços
            </a>
          </nav>

          <div className="flex items-center gap-5">
            <Link className="hidden text-sm font-medium tracking-tight text-trampo-muted transition-colors hover:text-trampo-dark md:block" href="/login">
              Entrar
            </Link>
            <Link
              className="hidden rounded-full bg-trampo-primary-500 px-5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-lg shadow-trampo-primary-500/10 hover:bg-trampo-primary-400 active:bg-trampo-primary-600 transition-all duration-150 active:scale-95 md:block"
              href="/register"
            >
              Começar Agora
            </Link>
            {/* Mobile Hamburger */}
            <button
              className="flex size-10 items-center justify-center rounded-lg text-trampo-muted hover:bg-neutral-100 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-trampo-border px-6 py-4">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Image
              src="/assets/logo-dark.png"
              alt="Trampo Logo"
              width={100}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </Link>
          <button
            className="flex size-9 items-center justify-center rounded-lg text-trampo-muted hover:bg-neutral-100"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          {/* Extensão Accordion */}
          <div>
            <button
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-trampo-dark hover:bg-neutral-50 transition-colors"
              onClick={() => setExtensaoOpen(!extensaoOpen)}
            >
              Extensão
              <ChevronDown
                className={`size-4 text-trampo-muted transition-transform duration-200 ${
                  extensaoOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                extensaoOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-4 pt-1 pb-2 space-y-1">
                <Link
                  href="/extensao"
                  className="block rounded-lg px-3 py-2.5 text-sm text-trampo-muted hover:bg-trampo-primary-50 hover:text-trampo-primary-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Instalar
                </Link>
                <Link
                  href="/extensao/suporte"
                  className="block rounded-lg px-3 py-2.5 text-sm text-trampo-muted hover:bg-trampo-primary-50 hover:text-trampo-primary-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Suporte
                </Link>
              </div>
            </div>
          </div>

          <a
            className="rounded-lg px-3 py-3 text-sm font-medium text-trampo-dark hover:bg-neutral-50 transition-colors"
            href="#funcionalidades"
            onClick={() => setMobileOpen(false)}
          >
            Funcionalidades
          </a>
          <a
            className="rounded-lg px-3 py-3 text-sm font-medium text-trampo-dark hover:bg-neutral-50 transition-colors"
            href="#sobre"
            onClick={() => setMobileOpen(false)}
          >
            Sobre
          </a>
          <a
            className="rounded-lg px-3 py-3 text-sm font-medium text-trampo-dark hover:bg-neutral-50 transition-colors"
            href="#depoimentos"
            onClick={() => setMobileOpen(false)}
          >
            Depoimentos
          </a>
          <a
            className="rounded-lg px-3 py-3 text-sm font-medium text-trampo-dark hover:bg-neutral-50 transition-colors"
            href="#precos"
            onClick={() => setMobileOpen(false)}
          >
            Preços
          </a>
        </nav>

        <div className="border-t border-trampo-border px-6 py-6 space-y-3">
          <Link
            className="block w-full rounded-full border border-trampo-border py-2.5 text-center text-sm font-bold text-trampo-muted hover:text-trampo-dark hover:border-trampo-dark transition-colors"
            href="/login"
            onClick={() => setMobileOpen(false)}
          >
            Entrar
          </Link>
          <Link
            className="block w-full rounded-full bg-trampo-primary-500 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/10 hover:bg-trampo-primary-400 transition-colors"
            href="/register"
            onClick={() => setMobileOpen(false)}
          >
            Começar Agora
          </Link>
        </div>
      </div>

      <main className="pt-20">
        {children}
      </main>

      {/* Dark Footer */}
      <footer className="bg-trampo-dark text-white border-t border-neutral-900 py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-5">
            {/* Logo */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/assets/logo-light.png"
                  alt="Trampo Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Produto */}
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                Produto
              </h3>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-[0.1em]">
                <li>
                  <a className="text-neutral-400 transition-colors hover:text-white" href="#funcionalidades">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <Link className="text-neutral-400 transition-colors hover:text-white" href="/extensao">
                    Extensão
                  </Link>
                </li>
                <li>
                  <a className="text-neutral-400 transition-colors hover:text-white" href="#precos">
                    Preços
                  </a>
                </li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                Empresa
              </h3>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-[0.1em]">
                <li>
                  <a className="text-neutral-400 transition-colors hover:text-white" href="#sobre">
                    Sobre
                  </a>
                </li>
                <li>
                  <a className="text-neutral-400 transition-colors hover:text-white" href="#depoimentos">
                    Depoimentos
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                Legal
              </h3>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-[0.1em]">
                <li>
                  <Link className="text-neutral-400 transition-colors hover:text-white" href="/politica-privacidade">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link className="text-neutral-400 transition-colors hover:text-white" href="/licenca">
                    Licença
                  </Link>
                </li>
              </ul>
            </div>

            {/* Conta */}
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                Conta
              </h3>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-[0.1em]">
                <li>
                  <Link className="text-neutral-400 transition-colors hover:text-white" href="/login">
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link className="text-neutral-400 transition-colors hover:text-white" href="/register">
                    Cadastro
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-neutral-800 pt-8 text-center text-[11px] font-medium tracking-wider text-neutral-500">
            © 2026 Trampo. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Structured Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteStructuredData) }}
      />
    </div>
  );
}
