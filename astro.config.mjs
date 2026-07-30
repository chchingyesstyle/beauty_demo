import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://beauty-demo.cchk.uk",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
});
