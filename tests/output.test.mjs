import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const distUrl = (path) => new URL(`../dist/${path}`, import.meta.url);
const read = (path) => readFile(distUrl(path), "utf8");

test("all required pages build", async () => {
  for (const path of [
    "index.html",
    "privacy/index.html",
    "terms/index.html",
    "404.html",
  ]) {
    await access(distUrl(path));
  }
});

test("home copy is explicit about launch status", async () => {
  const html = await read("index.html");

  assert.match(html, /Preparing for launch/i);
  assert.match(html, /currently developing our online platform/i);
  assert.match(
    html,
    /product availability will be announced closer to launch/i,
  );
  assert.match(html, /contact@beauty-demo\.cchk\.uk/);

  for (const category of [
    "Skincare",
    "Makeup",
    "Haircare",
    "Body care",
    "Beauty tools",
  ]) {
    assert.match(html, new RegExp(category, "i"));
  }
});

test("metadata and privacy claims match the static experience", async () => {
  const home = await read("index.html");
  const privacy = await read("privacy/index.html");

  assert.match(
    home,
    /<link rel="canonical" href="https:\/\/beauty-demo\.cchk\.uk\/?"/,
  );
  assert.match(privacy, /do not use analytics/i);
  assert.match(privacy, /do not set non-essential cookies/i);
});

test("images are local, present, labelled, and represented in sharing metadata", async () => {
  const home = await read("index.html");

  assert.doesNotMatch(home, /<img[^>]+src="https?:/i);
  assert.equal((home.match(/<img /g) ?? []).length, 6);
  assert.equal((home.match(/<img [^>]*alt="[^"]+"/g) ?? []).length, 6);
  assert.match(home, /property="og:image"/);

  for (const file of [
    "hero.webp",
    "skincare.webp",
    "makeup.webp",
    "haircare.webp",
    "body-care.webp",
    "beauty-tools.webp",
  ]) {
    await access(distUrl(`images/${file}`));
  }
});
