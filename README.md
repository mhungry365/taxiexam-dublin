# Himalayan Gold Dog Chew

Fresh Next.js 15 App Router e-commerce project for Himalayan Gold Dog Chew, an Irish launch brand importing traditional yak churpi / Himalayan dog chews from Nepal.

## Stack

- Next.js 15, React, TypeScript, Tailwind CSS, shadcn-style UI primitives
- Supabase Postgres and Auth
- Stripe Checkout and webhook order handling
- Zod, React Hook Form
- Vitest
- Vercel-ready deployment

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with a fresh Supabase project and Stripe test keys. Do not reuse keys or project IDs from older apps.

## Supabase

Apply `supabase/migrations/0001_initial_schema.sql` to a new Supabase project owned by `free2learng@gmail.com` where possible. Then seed demo products:

```bash
npm run seed
```

Enable Google OAuth in Supabase Auth after creating a fresh Google OAuth client for this brand. Set redirect URLs for local development and the Vercel production domain.

## Stripe

Create fresh Stripe products or use dynamic Checkout line items from `/api/checkout`. Add a webhook endpoint:

```text
POST https://your-domain.com/api/stripe/webhook
```

Listen for `checkout.session.completed`, then set `STRIPE_WEBHOOK_SECRET`.

## Vercel Deployment

1. Create a new GitHub repository for this project.
2. Import the repository into a new Vercel project.
3. Add all environment variables from `.env.example`.
4. Deploy from the main branch.
5. Update Supabase Auth URLs and Stripe webhook URLs to the production domain.

## Compliance Notes

Final packaging, label claims, import documentation, privacy terms, and returns wording must be reviewed against Irish/EU pet food, consumer, data protection, and import regulations before launch.
