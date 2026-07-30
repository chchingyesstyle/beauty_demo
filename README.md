# Simple Beauty

A static pre-launch website for Simple Beauty, a proposed UK online retailer
exploring Korean and Asian skincare, makeup, haircare, body care, and beauty
tools.

Live site: [beauty-demo.cchk.uk](https://beauty-demo.cchk.uk)

## What the site includes

- A responsive launch page with About, Categories, Our Approach, Coming Soon,
  and Contact sections
- Separate Privacy Policy, Terms of Use, and 404 pages
- Local, optimised photography with [source credits](./IMAGE_CREDITS.md)
- Canonical, Open Graph, X, sitemap, robots, and favicon metadata
- No shopping, accounts, forms, analytics, tracking, database, or
  non-essential cookies

The copy deliberately describes the business as being developed. It does not
claim that products, suppliers, partnerships, customers, or sales are already
confirmed.

## Requirements

- Node.js 22.12 or newer
- pnpm 11 or newer

## Local development

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The terminal prints the local address, normally `http://localhost:4321`.

Run type and content checks:

```bash
pnpm check
pnpm test
```

`pnpm test` creates a production build and verifies the required pages, launch
wording, metadata, images, internal links, crawl files, and secret-safety
contract.

Preview the production build:

```bash
pnpm preview
```

## Cloudflare Workers Static Assets

The site builds into `dist/`. `wrangler.jsonc` configures that directory as a
Workers Static Assets deployment with custom 404 handling and
`beauty-demo.cchk.uk` as a Custom Domain.

Copy `.env.example` to `.env` and set:

```dotenv
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
GITHUB_PAT=
```

Never commit `.env`. Wrangler recognises `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` as local authentication variables. The website itself
does not receive or expose them.

Deploy the verified build:

```bash
pnpm deploy
```

Cloudflare Custom Domains create the DNS record and TLS certificate for the
Worker. The `cchk.uk` zone must be active in the same Cloudflare account. If a
CNAME already exists at `beauty-demo.cchk.uk`, remove that conflicting record
before deployment.

Current Cloudflare references:

- [Workers Static Assets configuration](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
- [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Wrangler system environment variables](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/)

## Cloudflare Email Routing

Email Routing can forward incoming mail addressed to
`contact@beauty-demo.cchk.uk`:

1. In Cloudflare, open **Compute → Email Service → Email Routing**.
2. Onboard the `cchk.uk` domain and allow Cloudflare to add the required MX,
   SPF, and DKIM records.
3. Under **Destination Addresses**, enter the existing mailbox that should
   receive forwarded messages.
4. Open Cloudflare’s verification email and verify that destination.
5. Under **Routing Rules**, create a rule whose email pattern is
   `contact@beauty-demo.cchk.uk`.
6. Choose **Send to an email** and select the verified destination.
7. Send a test from a different external mailbox and confirm delivery.

Email Routing handles incoming mail and forwarding. It does not send or reply
as `contact@beauty-demo.cchk.uk`; replies normally come from the destination
mailbox. Sending from the custom address requires a separate mailbox or
outbound email provider.

Current Cloudflare references:

- [Route emails](https://developers.cloudflare.com/email-service/get-started/route-emails/)
- [Routing rules and destination addresses](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/)
- [Email Routing limitations](https://developers.cloudflare.com/email-service/reference/postmaster/#sending-or-replying-to-an-email-from-your-cloudflare-domain)

## Repository

The configured GitHub remote is
[chchingyesstyle/beauty_demo](https://github.com/chchingyesstyle/beauty_demo).
The GitHub token is used only for an authenticated push and must not be stored
in the remote URL or repository configuration.
