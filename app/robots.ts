import type { MetadataRoute } from "next";
import { absoluteUrl, allowIndexing } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth",
          "/dashboard",
          "/vagas",
          "/curriculo",
          "/preferencias",
          "/perfil",
          "/plataformas",
          "/respostas",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}