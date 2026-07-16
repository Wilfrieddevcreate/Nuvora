import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/connexion",
          "/inscription",
          "/confirmation",
          "/mot-de-passe-oublie",
          "/dashboard",
          "/admin",
          "/onboarding",
          "/compte",
        ],
      },
    ],
    sitemap: "https://nuvora.app/sitemap.xml",
  };
}
