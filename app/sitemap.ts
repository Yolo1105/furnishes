import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: string[] = [
    "",
    "/about",
    "/collections",
    "/inspiration",
    "/style",
    "/budget",
    "/room-planner",
    "/validate",
    "/report",
    "/cart",
    "/playground",
    "/chatbot",
    "/quiz",
  ];

  return routes.map((path) => ({
    url: `${config.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));
}
