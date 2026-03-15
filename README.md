# Aloha Animal Outreach — Website

Public website for [Aloha Animal Outreach](https://alohaanimaloutreach.org), a volunteer-run 501(c)(3) nonprofit in Honolulu, Hawaii.

Built with **Astro**, **Tailwind CSS**, deployed on **Vercel**.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with `sk_live_` or `sk_test_`) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (starts with `pk_live_` or `pk_test_`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (starts with `whsec_`) |
| `RESEND_API_KEY` | Resend API key for newsletter delivery |
| `RESEND_AUDIENCE_ID` | Resend audience ID for the newsletter contact list |

## Deployment

```bash
vercel --prod
```

The project is pre-configured with `vercel.json` and the `@astrojs/vercel` adapter.

## Adding Shopify Buy Buttons

The `/shop` page has 6 placeholder slots for Shopify Buy Button embed codes. To add a product:

1. Open `src/pages/shop.astro`
2. Find the comment `<!-- SHOPIFY BUY BUTTON: [product name] -->`
3. Replace the comment with the Shopify Buy Button embed code from your Shopify admin

## Updating Impact Stats

The impact counters appear on the Home and Our Mission pages via the shared `ImpactStats` component.

1. Open `src/components/ImpactStats.astro`
2. Find the `stats` array (marked with a `TODO` comment)
3. Update the `value` for each stat:

```js
const stats = [
  { value: 1200, label: 'Animals Spayed/Neutered' },
  { value: 50000, label: 'Pounds of Dog Food Distributed Yearly' },
  { value: 3500, label: 'Vaccines Administered' },
];
```

## Registering the Stripe Webhook

After deployment, register a webhook endpoint in your [Stripe Dashboard](https://dashboard.stripe.com/webhooks):

1. Go to **Developers > Webhooks > Add endpoint**
2. Set the endpoint URL to: `https://your-domain.com/api/stripe-webhook`
3. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
4. Copy the signing secret and add it as `STRIPE_WEBHOOK_SECRET` in your Vercel environment variables

## Adding Logo Files

Drop your logo files into `/public/images/`:

- `logo.svg` — used in the nav (on olive/dark backgrounds)
- `logo-white.svg` — used in the footer (on dark backgrounds)

The `<img>` tags are already wired up with correct dimensions. Just drop in the files and they'll appear.

## Project Structure

```
src/
├── components/        # Shared UI components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── DonationForm.astro
│   ├── ImpactStats.astro
│   ├── ImagePlaceholder.astro
│   ├── NewsletterForm.astro
│   ├── ProgramCard.astro
│   └── StoryCard.astro
├── layouts/
│   └── Layout.astro   # Base HTML layout
├── pages/
│   ├── api/           # Serverless API routes
│   │   ├── create-checkout.ts
│   │   ├── donor-portal.ts
│   │   ├── newsletter.ts
│   │   └── stripe-webhook.ts
│   ├── donate/
│   │   ├── index.astro
│   │   └── thank-you.astro
│   ├── get-involved.astro
│   ├── index.astro
│   ├── our-mission.astro
│   ├── shop.astro
│   └── success-stories.astro
├── styles/
│   └── global.css     # Tailwind + custom theme
public/
└── images/            # Image assets (placeholders)
```
