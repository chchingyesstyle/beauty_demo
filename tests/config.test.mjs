import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Cloudflare serves the Astro build with a custom 404 and domain", async () => {
  const raw = await readFile("wrangler.jsonc", "utf8");
  const config = JSON.parse(raw.replace(/\/\/.*$/gm, ""));

  assert.equal(config.name, "simple-beauty");
  assert.equal(config.assets.directory, "./dist");
  assert.equal(config.assets.not_found_handling, "404-page");
  assert.equal(config.assets.html_handling, "auto-trailing-slash");
  assert.equal(config.compatibility_date, "2026-07-29");
  assert.deepEqual(config.routes, [
    { pattern: "beauty-demo.cchk.uk", custom_domain: true },
  ]);
  assert.equal("main" in config, false);

  const astro = await readFile("astro.config.mjs", "utf8");
  assert.match(astro, /trailingSlash:\s*"always"/);
});

test("secret-bearing files are ignored and examples contain names only", async () => {
  const ignore = await readFile(".gitignore", "utf8");
  const example = await readFile(".env.example", "utf8");

  assert.match(ignore, /^\.env$/m);
  assert.match(ignore, /^\.env\.\*$/m);
  assert.match(example, /^CLOUDFLARE_API_TOKEN=$/m);
  assert.match(example, /^CLOUDFLARE_ACCOUNT_ID=$/m);
  assert.match(example, /^GITHUB_PAT=$/m);
});
