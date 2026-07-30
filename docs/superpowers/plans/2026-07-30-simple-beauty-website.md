# Simple Beauty Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, publish, and document a polished static website for the proposed UK online retailer Simple Beauty at `https://beauty-demo.cchk.uk`.

**Architecture:** Astro generates separate static HTML pages and shared components into `dist/`. Cloudflare Workers Static Assets serves the output directly, including a real 404 response, while the browser receives only a tiny progressive-enhancement script for mobile navigation.

**Tech Stack:** Astro, TypeScript, semantic HTML, modern CSS, Node’s built-in test runner, Wrangler, Cloudflare Workers Static Assets

## Global Constraints

- The market is the United Kingdom and the model is a planned online retailer.
- The categories are skincare, makeup, haircare, body care, and beauty tools.
- The public contact details are `contact@beauty-demo.cchk.uk` and “United Kingdom.”
- Every business claim must describe plans or development, never established sales, suppliers, customers, partnerships, stock, or trading history.
- The site must not include commerce, accounts, forms, analytics, tracking, non-essential cookies, a database, or a backend.
- The design uses warm ivory, charcoal, muted rose, muted sage, editorial serif headings, generous spacing, and restrained motion.
- All photography must be locally stored, optimised, licensing-friendly, documented, and free of misleading stock or supplier implications.
- `.env` and all credentials remain outside Git; no secret may use an Astro `PUBLIC_` prefix.
- Cloudflare deployment uses Workers Static Assets, not the deprecated Workers Sites product.
- Production hostname: `https://beauty-demo.cchk.uk`.

## File Map

- `package.json`: dependency pins and local/build/check/deploy scripts.
- `package-lock.json`: reproducible dependency graph.
- `astro.config.mjs`: static output and canonical site URL.
- `tsconfig.json`: strict Astro TypeScript defaults.
- `wrangler.jsonc`: Static Assets, 404 handling, and Custom Domain.
- `.env.example`: credential names with non-secret example values.
- `src/data/site.ts`: the single source of truth for navigation, categories, contact details, and operational steps.
- `src/layouts/BaseLayout.astro`: page shell, metadata, canonical links, Open Graph tags, header, and footer.
- `src/components/Header.astro`: responsive navigation and mobile-menu behaviour.
- `src/components/Footer.astro`: contact and legal links.
- `src/components/CategoryCard.astro`: category image and launch-stage copy.
- `src/pages/index.astro`: home-page sections and calls to action.
- `src/pages/privacy.astro`: accurate privacy notice for a static, tracking-free site.
- `src/pages/terms.astro`: informational-site terms with no fabricated legal entity.
- `src/pages/404.astro`: branded recovery page.
- `src/styles/global.css`: complete responsive visual system.
- `public/images/*.webp`: six optimised editorial photographs.
- `public/favicon.png`: original raster “SB” favicon.
- `public/og.png`: original Simple Beauty social card.
- `public/robots.txt`: crawl rules and sitemap location.
- `IMAGE_CREDITS.md`: photographer, source-page, and licence references.
- `tests/config.test.mjs`: deployment and secret-safety contract.
- `tests/output.test.mjs`: built-page, copy, metadata, image, and link contract.
- `README.md`: setup, build, deployment, Custom Domain, and Email Routing guidance.

---

### Task 1: Static Project and Deployment Contract

**Files:**
- Create: `tests/config.test.mjs`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `wrangler.jsonc`
- Create: `.env.example`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: approved hostname `beauty-demo.cchk.uk`.
- Produces: `npm run build`, `npm run preview`, `npm run check`, `npm run test`, and `npm run deploy`; Astro output in `dist/`; a Wrangler assets-only Worker.

- [ ] **Step 1: Write the failing configuration contract**

```js
// tests/config.test.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Cloudflare serves the Astro build with a custom 404 and domain", async () => {
  const raw = await readFile("wrangler.jsonc", "utf8");
  const config = JSON.parse(raw.replace(/\\/\\/.*$/gm, ""));
  assert.equal(config.name, "simple-beauty");
  assert.equal(config.assets.directory, "./dist");
  assert.equal(config.assets.not_found_handling, "404-page");
  assert.equal(config.assets.html_handling, "auto-trailing-slash");
  assert.deepEqual(config.routes, [
    { pattern: "beauty-demo.cchk.uk", custom_domain: true },
  ]);
  assert.equal("main" in config, false);
});

test("secret-bearing files are ignored and examples contain names only", async () => {
  const ignore = await readFile(".gitignore", "utf8");
  const example = await readFile(".env.example", "utf8");
  assert.match(ignore, /^\\.env$/m);
  assert.match(ignore, /^\\.env\\.\\*$/m);
  assert.match(example, /^CLOUDFLARE_API_TOKEN=$/m);
  assert.match(example, /^CLOUDFLARE_ACCOUNT_ID=$/m);
  assert.match(example, /^GITHUB_PAT=$/m);
});
```

- [ ] **Step 2: Run the contract and confirm it fails**

Run: `node --test tests/config.test.mjs`

Expected: FAIL because `wrangler.jsonc` and `.env.example` do not exist.

- [ ] **Step 3: Install and pin the minimal toolchain**

Run:

```bash
npm init -y
npm install astro@latest
npm install --save-dev @astrojs/check@latest typescript@latest wrangler@latest
```

Edit `package.json` so its scripts are exactly:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "npm run build && node --test tests/*.test.mjs",
    "deploy": "npm run build && wrangler deploy"
  }
}
```

- [ ] **Step 4: Add exact Astro and Cloudflare configuration**

```js
// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://beauty-demo.cchk.uk",
  output: "static",
  trailingSlash: "never",
});
```

```json
// wrangler.jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "simple-beauty",
  "compatibility_date": "2026-07-30",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  },
  "routes": [
    {
      "pattern": "beauty-demo.cchk.uk",
      "custom_domain": true
    }
  ]
}
```

```dotenv
# .env.example
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
GITHUB_PAT=
```

Use Astro’s strict TypeScript preset in `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 5: Run the configuration contract**

Run: `node --test tests/config.test.mjs`

Expected: 2 tests pass.

- [ ] **Step 6: Commit the foundation**

```bash
git add .gitignore .env.example package.json package-lock.json astro.config.mjs tsconfig.json wrangler.jsonc tests/config.test.mjs
git commit -m "build: configure static Astro site for Cloudflare"
```

---

### Task 2: Truthful Content Model and Static Pages

**Files:**
- Create: `tests/output.test.mjs`
- Create: `src/data/site.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/CategoryCard.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/privacy.astro`
- Create: `src/pages/terms.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: Astro project and `site` URL from Task 1.
- Produces: exported `site` object, `categories` array, and `launchSteps` array; `/`, `/privacy`, `/terms`, and `/404.html`.

- [ ] **Step 1: Write the failing output contract**

```js
// tests/output.test.mjs
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

test("all required pages build", async () => {
  for (const path of ["index.html", "privacy/index.html", "terms/index.html", "404.html"]) {
    await access(new URL(`../dist/${path}`, import.meta.url));
  }
});

test("home copy is explicit about launch status", async () => {
  const html = await read("index.html");
  assert.match(html, /Preparing for launch/i);
  assert.match(html, /currently developing our online platform/i);
  assert.match(html, /product availability will be announced closer to launch/i);
  assert.match(html, /contact@beauty-demo\\.cchk\\.uk/);
  for (const category of ["Skincare", "Makeup", "Haircare", "Body care", "Beauty tools"]) {
    assert.match(html, new RegExp(category, "i"));
  }
});

test("metadata and privacy claims match the static experience", async () => {
  const home = await read("index.html");
  const privacy = await read("privacy/index.html");
  assert.match(home, /<link rel="canonical" href="https:\\/\\/beauty-demo\\.cchk\\.uk\\/?"/);
  assert.match(privacy, /do not use analytics/i);
  assert.match(privacy, /do not set non-essential cookies/i);
});
```

- [ ] **Step 2: Run the production test and confirm it fails**

Run: `npm test`

Expected: FAIL because the source pages have not been created.

- [ ] **Step 3: Create the typed content source**

Define these exact exports in `src/data/site.ts`:

```ts
export const site = {
  name: "Simple Beauty",
  email: "contact@beauty-demo.cchk.uk",
  location: "United Kingdom",
  url: "https://beauty-demo.cchk.uk",
  description:
    "Simple Beauty is preparing a curated online destination for Korean and Asian beauty in the UK.",
} as const;

export const categories = [
  {
    name: "Skincare",
    image: "/images/skincare.webp",
    alt: "Neutral skincare bottles arranged in soft natural light",
    copy: "Thoughtful essentials for cleansing, hydration and everyday skin rituals.",
  },
  {
    name: "Makeup",
    image: "/images/makeup.webp",
    alt: "Makeup brushes and colour products arranged on a neutral surface",
    copy: "Modern colour, complexion and finishing products selected with care.",
  },
  {
    name: "Haircare",
    image: "/images/haircare.webp",
    alt: "Healthy hair photographed in warm editorial light",
    copy: "Scalp, wash-day and styling discoveries for considered routines.",
  },
  {
    name: "Body care",
    image: "/images/body-care.webp",
    alt: "Body-care bottles and textures in a calm spa setting",
    copy: "Everyday cleansing, moisture and body-care rituals.",
  },
  {
    name: "Beauty tools",
    image: "/images/beauty-tools.webp",
    alt: "Beauty brushes and facial tools arranged as a flat lay",
    copy: "Practical tools designed to support simple, effective routines.",
  },
] as const;

export const launchSteps = [
  ["01", "Research", "Reviewing product categories and the needs of UK beauty shoppers."],
  ["02", "Relationships", "Exploring supply relationships with established beauty brands and distributors."],
  ["03", "Platform", "Currently developing our online platform and customer experience."],
  ["04", "Launch", "Product availability will be announced closer to launch."],
] as const;
```

- [ ] **Step 4: Build shared components and the base layout**

Implement `BaseLayout.astro` with required `title` and `description` props,
canonical URL construction from `Astro.url.pathname`, `/og.png` metadata,
`theme-color`, `favicon.png`, and shared `Header`/`Footer`.

Implement `Header.astro` with:

```ts
const links = [
  ["/#about", "About"],
  ["/#categories", "Categories"],
  ["/#approach", "Our approach"],
  ["/#contact", "Contact"],
] as const;
```

The menu button must use `aria-expanded`, `aria-controls="site-nav"`, and a
24-line inline script that toggles the menu, closes it after link activation,
closes it on Escape, and returns focus to the button.

Implement `CategoryCard.astro` with required props:

```ts
interface Props {
  name: string;
  image: string;
  alt: string;
  copy: string;
  featured?: boolean;
}
```

- [ ] **Step 5: Build the four pages with approved copy**

`index.astro` must include:

- an eyebrow reading “Preparing for launch · United Kingdom”;
- the headline “A simpler way to discover what’s next in beauty.”;
- a statement that the platform is currently being developed;
- the five category cards from `categories`;
- the four planned operating steps from `launchSteps`;
- a coming-soon panel stating availability will be announced closer to launch;
- a `mailto:contact@beauty-demo.cchk.uk` call to action.

`privacy.astro` must state:

- no analytics;
- no contact form;
- no non-essential cookies;
- server logs may be processed by the hosting provider for security and operation;
- email is handled by the visitor’s email service and the recipient’s mailbox provider;
- privacy questions go to the approved contact address.

`terms.astro` must state:

- the site is informational and pre-launch;
- no product is offered for sale;
- category information may change before launch;
- no unsupported guarantee is made;
- site content belongs to Simple Beauty or is used under licence;
- questions go to the approved contact address.

`404.astro` must render “That page isn’t part of the routine” and a link to `/`.

- [ ] **Step 6: Run the build contract**

Run: `npm test`

Expected: All page existence, launch-copy, metadata, and privacy tests pass.

- [ ] **Step 7: Commit the content and page structure**

```bash
git add src tests/output.test.mjs
git commit -m "feat: add truthful Simple Beauty content and pages"
```

---

### Task 3: Editorial Design, Photography, and Social Preview

**Files:**
- Create: `src/styles/global.css`
- Create: `public/images/hero.webp`
- Create: `public/images/skincare.webp`
- Create: `public/images/makeup.webp`
- Create: `public/images/haircare.webp`
- Create: `public/images/body-care.webp`
- Create: `public/images/beauty-tools.webp`
- Create: `public/favicon.png`
- Create: `public/og.png`
- Create: `IMAGE_CREDITS.md`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `tests/output.test.mjs`

**Interfaces:**
- Consumes: image paths and alt text exported by `src/data/site.ts`.
- Produces: local responsive imagery, full visual system, reduced-motion support, brand favicon, and social preview.

- [ ] **Step 1: Extend the failing output contract for local assets**

```js
test("images are local, present, and labelled", async () => {
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
    await access(new URL(`../dist/images/${file}`, import.meta.url));
  }
});
```

- [ ] **Step 2: Run the test and confirm the asset contract fails**

Run: `npm test`

Expected: FAIL because the local images and global stylesheet are absent.

- [ ] **Step 3: Download and optimise the chosen licensed photographs**

Use the free Unsplash downloads below, crop them to the approved editorial
composition, export WebP at 82 quality, and keep each file below 350 KB:

```text
Hero: Shamblen Studios — https://unsplash.com/photos/xwM61TPMlYk
Skincare: Ela De Pure — https://unsplash.com/photos/LlC_feChWqc
Makeup: Jazmin Quaynor — https://unsplash.com/photos/FoeIOgztCXo
Haircare: Fleur Kaan — https://unsplash.com/photos/w4Dj3MshHQ0
Body care: Ela De Pure — https://unsplash.com/photos/lGxeKOA6aps
Beauty tools: Cherrydeck — https://unsplash.com/photos/xYSoOJ1Uz2I
Alternate crop: Annie Spratt — https://unsplash.com/photos/dDNnVA2Cc5I
```

Record creator, source page, access date `2026-07-30`, and “Unsplash License” in
`IMAGE_CREDITS.md`. Inspect every crop before use and reject any frame with
prominent packaging text.

- [ ] **Step 4: Implement the complete responsive design system**

Set these tokens at the top of `src/styles/global.css`:

```css
:root {
  --ink: #24231f;
  --ivory: #f8f5ee;
  --paper: #fffdf8;
  --rose: #c98482;
  --rose-soft: #ead0cc;
  --sage: #7d8b72;
  --sage-soft: #dfe5d9;
  --line: rgba(36, 35, 31, 0.14);
  --serif: "Iowan Old Style", "Baskerville", "Times New Roman", serif;
  --sans: "Avenir Next", "Segoe UI", sans-serif;
  --container: min(1180px, calc(100% - 40px));
}
```

The stylesheet must cover:

- skip link and visible `:focus-visible` states;
- sticky translucent header and accessible mobile menu;
- two-column hero with an offset image and small botanical CSS shapes;
- responsive five-card category grid;
- numbered operating-step rail;
- high-contrast coming-soon panel;
- legal-page reading width;
- branded 404 composition;
- breakpoints at 900px and 640px;
- `overflow-wrap` for email links;
- `@media (prefers-reduced-motion: reduce)` disabling transitions and smooth scroll.

- [ ] **Step 5: Create the original favicon and one social card**

Create the raster favicon from the “SB” monogram in the approved palette. Then
make exactly one image-generation request for a 1200×630 social card using this
brief:

```text
Create a complete 1200×630 social preview card for “Simple Beauty”, a
pre-launch UK online destination for Korean and Asian beauty. Warm ivory
background, charcoal editorial serif title, muted rose and sage accents,
restrained product-still-life photography, generous negative space. Include
only the exact text “Simple Beauty” and “A simpler way to discover what’s next
in beauty.” No logos from other brands, no prices, no product claims, no extra
words.
```

Inspect the returned card at full size. If its exact text is incorrect, omit
`og:image` rather than shipping misleading artwork.

- [ ] **Step 6: Run static and production checks**

Run:

```bash
npm run check
npm test
```

Expected: Astro reports zero errors and all Node tests pass.

- [ ] **Step 7: Commit the finished presentation**

```bash
git add src public tests/output.test.mjs
git commit -m "feat: add editorial design and local imagery"
```

---

### Task 4: Documentation and Full Quality Review

**Files:**
- Create: `README.md`
- Create: `public/robots.txt`
- Modify: `tests/output.test.mjs`

**Interfaces:**
- Consumes: all build and deployment commands from Tasks 1–3.
- Produces: reproducible setup instructions, current Cloudflare guidance, sitemap/robots discovery, and evidence that the site is ready to publish.

- [ ] **Step 1: Add the failing internal-link and sensitive-copy checks**

```js
test("every internal document link resolves in dist", async () => {
  const pages = ["index.html", "privacy/index.html", "terms/index.html", "404.html"];
  const html = (await Promise.all(pages.map(read))).join("\\n");
  const hrefs = [...html.matchAll(/href="(\\/[^"#?]*)/g)].map((match) => match[1]);
  for (const href of new Set(hrefs)) {
    const relative = href === "/" ? "index.html" : `${href.replace(/^\\//, "")}/index.html`;
    await access(new URL(`../dist/${relative}`, import.meta.url));
  }
});

test("built pages contain no secret-shaped values or unsupported claims", async () => {
  const html = await read("index.html");
  assert.doesNotMatch(html, /(?:ghp_|github_pat_|CF_API_TOKEN|CLOUDFLARE_API_TOKEN)/i);
  assert.doesNotMatch(html, /best[- ]selling|thousands of customers|official partner|in stock/i);
});
```

- [ ] **Step 2: Run the test and confirm robots or link coverage fails**

Run: `npm test`

Expected: FAIL until final routes and discovery files are complete.

- [ ] **Step 3: Write the operational README**

Document these exact workflows:

```bash
npm install
npm run dev
npm run check
npm test
npm run preview
npm run deploy
```

Explain that deployment reads `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` from the operator’s environment, while neither value is
bundled into the site. Explain that `routes[].custom_domain: true` asks
Cloudflare to create the DNS record and certificate for
`beauty-demo.cchk.uk`, and that an existing CNAME at that hostname must be
removed first.

Add a separate Email Routing section with these steps:

1. Enable Email Routing for the `cchk.uk` zone.
2. Verify the destination mailbox.
3. Create the custom address `contact@beauty-demo.cchk.uk`.
4. Route it to the verified destination mailbox.
5. Send an external test message and confirm forwarding.
6. State that Email Routing receives and forwards only; sending or replying as
   `contact@beauty-demo.cchk.uk` requires a mailbox or outbound email provider.

- [ ] **Step 4: Add discovery files and finish automated checks**

Install and configure Astro’s official sitemap integration:

```bash
npm install @astrojs/sitemap@latest
```

Update `astro.config.mjs` to:

```js
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://beauty-demo.cchk.uk",
  output: "static",
  trailingSlash: "never",
  integrations: [sitemap()],
});
```

Create `public/robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://beauty-demo.cchk.uk/sitemap-index.xml
```

Update the output contract to assert:

```js
test("crawl discovery files are emitted", async () => {
  await access(new URL("../dist/robots.txt", import.meta.url));
  await access(new URL("../dist/sitemap-index.xml", import.meta.url));
});
```

Run:

```bash
npm run check
npm test
git diff --check
git status --short
git ls-files .env
```

Expected: checks pass, `.env` prints nothing, and only intended files are
modified.

- [ ] **Step 5: Perform browser quality assurance**

Serve the production build with `npm run preview`, then inspect it at:

- 390×844 for a small mobile viewport;
- 768×1024 for a tablet viewport;
- 1440×900 for desktop.

At each size verify:

- no horizontal overflow;
- hero and category crops remain legible;
- mobile menu opens, closes, traps no focus, and responds to Escape;
- all navigation, legal, home, and email links are correct;
- no broken images or console errors;
- keyboard focus is visible;
- reduced-motion mode removes non-essential animation.

Review every sentence against the approved design specification and search the
built output for `customer`, `partner`, `stock`, `available now`, `registered`,
and `certified`; retain only clearly qualified pre-launch uses.

- [ ] **Step 6: Commit the documentation and QA contract**

```bash
git add README.md public/robots.txt astro.config.mjs package.json package-lock.json tests/output.test.mjs
git commit -m "docs: add Cloudflare operations and quality checks"
```

---

### Task 5: GitHub Publication and Cloudflare Deployment

**Files:**
- Modify only if deployment reveals a verified configuration issue: `wrangler.jsonc`

**Interfaces:**
- Consumes: passing `npm run check`, `npm test`, clean secret scan, `GITHUB_PAT`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID`.
- Produces: `main` on `chchingyesstyle/beauty_demo` and a live `https://beauty-demo.cchk.uk`.

- [ ] **Step 1: Re-run the complete release gate**

Run:

```bash
npm run check
npm test
git diff --check
test -z "$(git status --porcelain)"
test -z "$(git ls-files .env)"
```

Expected: every command succeeds and no secret file is tracked.

- [ ] **Step 2: Push without persisting the GitHub token**

Load `GITHUB_PAT` from `.env` into the current process without printing it.
Push using a one-command HTTP authorization header. Do not put the token in the
remote URL, credential store, shell trace, Git config, or command output.

Verify:

```bash
git ls-remote --symref origin HEAD
```

Expected: the remote HEAD points to `refs/heads/main`.

- [ ] **Step 3: Deploy the verified build**

Load the Cloudflare account ID and API token from `.env` without printing them,
then run `npx wrangler deploy`. The configured Custom Domain must remain
`beauty-demo.cchk.uk`.

Expected: Wrangler reports a successful deployment and the custom-domain
binding.

- [ ] **Step 4: Verify production**

Check:

```bash
curl --fail --silent --show-error --head https://beauty-demo.cchk.uk/
curl --fail --silent --show-error https://beauty-demo.cchk.uk/privacy
curl --silent --show-error --output /dev/null --write-out "%{http_code}\\n" https://beauty-demo.cchk.uk/not-a-real-page
```

Expected: home and privacy return success; the unknown path returns `404`.
Open the live domain and repeat the navigation, console, image, and responsive
checks against production.

- [ ] **Step 5: Record the deployment result**

If production verification reveals no source change, do not create a deployment
commit. Report the GitHub repository, live domain, tests run, and the remaining
manual Email Routing steps. If a configuration correction was required, repeat
the release gate, commit only that correction, push, redeploy, and verify again.
