# Simple Beauty Website Design

## Purpose

Simple Beauty is a demonstration website for a proposed UK online beauty
retailer preparing for launch. It will establish a polished, credible presence
at `https://beauty-demo.cchk.uk` without implying that products, suppliers,
customers, partnerships, or commercial operations are already confirmed.

The website is informational only. It will not include shopping, payments,
accounts, inventory, administration, analytics, tracking, or a database.

## Audience and Positioning

- Market: United Kingdom
- Business model: planned online retailer
- Focus: a curated range of Korean and Asian beauty products
- Categories: skincare, makeup, haircare, body care, and beauty tools
- Public location: United Kingdom
- Contact: `contact@beauty-demo.cchk.uk`

Copy will consistently use forward-looking language such as “preparing for
launch,” “currently developing our online platform,” and “product availability
will be announced closer to launch.” It will not contain unsupported business
claims, testimonials, statistics, team biographies, certifications, prices, or
named supplier relationships.

## Information Architecture

The main page will provide a concise narrative through clearly separated
sections:

1. Home hero
2. About Simple Beauty
3. Product categories
4. How we plan to operate
5. Coming soon
6. Contact

Privacy Policy and Terms of Use will be separate pages. A custom 404 page will
help visitors return to the main site. The header will link to the main-page
sections and legal pages will be available from the footer.

## Content

### Home

A launch-focused hero introduces Simple Beauty as a UK beauty retail concept
that is currently being developed. The primary action scrolls to the product
categories and the secondary action opens an email to the contact address.

### About

This section explains the goal of making considered Korean and Asian beauty
discoveries easier to explore in the UK. It describes the concept, not an
existing trading history.

### Product Categories

Five editorial cards introduce skincare, makeup, haircare, body care, and
beauty tools. The cards describe planned areas of exploration rather than
available inventory.

### How We Plan to Operate

This section outlines the intended approach: research product ranges, explore
supply relationships with established brands and distributors, develop the
online platform, and announce availability closer to launch.

### Coming Soon and Contact

Visitors can contact Simple Beauty using a `mailto:` link. There will be no
newsletter form or external form service. The page will display only the
approved email address and “United Kingdom.”

### Legal Pages

The Privacy Policy will accurately state that the static site sets no
non-essential cookies and uses no analytics or contact form. It will explain
that clicking the email link uses the visitor’s email provider.

The Terms of Use will explain the informational, pre-launch nature of the site,
the absence of offers for sale, reasonable limitations on reliance, and
ownership of site content. The copy will avoid inventing a registered company
identity or address.

## Visual Design

The direction is restrained editorial beauty:

- Warm ivory page background
- Charcoal typography
- Muted rose and sage accents
- Elegant serif display headings paired with a clean sans-serif body face
- Generous spacing, fine rules, soft corners, and subtle shadows
- Lightweight motion that respects reduced-motion preferences
- An original text-based “SB” brand mark and favicon

The site will use one strong hero photograph and a coordinated set of category
images. Images will be sourced from licensing-friendly libraries such as
Unsplash or Pexels, stored locally, compressed for the web, and documented with
source and creator credits. Selections will avoid recognisable brand packaging
and will not imply that Simple Beauty stocks a depicted product.

The responsive layout will support small phones through wide desktop screens.
Navigation will collapse into an accessible mobile menu with labelled controls,
keyboard support, and visible focus states.

## Architecture

Astro will generate a fully static site. Shared layouts and components will
provide the header, navigation, footer, SEO metadata, category cards, and
reusable calls to action. No client-side framework runtime will be shipped
unless a small script is needed for the mobile navigation.

The production build will output to `dist/`. Cloudflare Workers Static Assets
will serve that directory. Wrangler configuration will:

- name the Worker;
- use the current compatibility date;
- declare `dist/` as the assets directory;
- use `404-page` not-found handling;
- use automatic trailing-slash handling;
- connect `beauty-demo.cchk.uk` as a Custom Domain.

No secret will appear in Wrangler configuration or source code. Local
Cloudflare and GitHub credentials remain in the ignored `.env` file.

## Request and Error Flow

Cloudflare serves matching static assets directly. Clean page requests resolve
to generated HTML. An unknown path returns the designed 404 page rather than a
single-page-application fallback. Broken or unavailable photography will retain
meaningful alt text and stable layout dimensions.

The email call to action uses the visitor’s configured mail application. The
site does not claim that email sending or receipt is guaranteed.

## SEO and Sharing

Each page will have a unique title, description, canonical URL, Open Graph
metadata, and social-sharing metadata. The project will include a sitemap,
robots rules, favicon, and an original social preview image aligned with the
approved visual identity.

## Testing and Review

Before deployment:

1. Run formatting and relevant static checks.
2. Run the production build.
3. Preview the production output locally.
4. Verify internal navigation and legal-page links.
5. Check representative mobile and desktop viewport layouts.
6. Check for horizontal overflow, missing assets, and browser console errors.
7. Review semantic structure, keyboard navigation, focus states, alt text,
   contrast, and reduced-motion behaviour.
8. Review all copy for unsupported or misleading claims.
9. Confirm `.env`, credentials, and personal information are absent from Git.

After those checks, the repository will be pushed to
`chchingyesstyle/beauty_demo`. Deployment to Cloudflare and connection of the
custom domain will occur only after the verified build is ready.

## Email Routing Documentation

The README will provide separate instructions for configuring Cloudflare Email
Routing so `contact@beauty-demo.cchk.uk` can forward to an existing mailbox. It
will clearly explain that Email Routing handles inbound forwarding only;
sending or replying as the custom-domain address requires a separate mailbox
or outbound email provider.
