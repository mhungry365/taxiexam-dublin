import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const paths = [
    "",
    "/dashboard",
    "/quiz",
    "/mock-exam",
    "/dublin-area",
    "/login",
    "/register",
    "/privacy-policy",
    "/terms"
  ];

  return paths.map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
