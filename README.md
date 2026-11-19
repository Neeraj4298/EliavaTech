# EliavaTech website

Marketing site for EliavaTech: Next.js (App Router), TypeScript, Tailwind CSS,
Prisma + PostgreSQL, Gemini-powered chat assistant, Cloudflare Turnstile.

## Getting started

```bash
npm ci
cp .env.example .env.local   # then fill in what you need
npm run dev                  # http://localhost:3000
```

Without any keys the site runs; forms need an email provider or a database to
accept enquiries, and chat needs `GEMINI_API_KEY`.

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build
```

## Database and migrations

Schema lives in `prisma/schema.prisma`; migrations in `prisma/migrations`.

| Task | Command |
| --- | --- |
| Apply migrations in production / CI | `npm run db:migrate:deploy` |
| Check migration status | `npm run db:migrate:status` |
| Create a migration after editing the schema (development) | `npm run db:migrate:dev -- --name describe_change` |

Always commit the generated `prisma/migrations/*` folder. Run
`db:migrate:deploy` as a release step before the new app version goes live.
`prisma generate` runs automatically after `npm install` (`postinstall`).

## Production checklist

- `DATABASE_URL` set and `npm run db:migrate:deploy` run.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` set (optional,
  recommended for Turnstile spam protection on the contact and pricing forms).
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` set for shared rate limits.
- Client IP: on Vercel nothing to do; elsewhere set `TRUSTED_IP_HEADER` or
  `TRUSTED_PROXY_COUNT` (see `.env.example`).
- Email: either `GMAIL_APP_PASSWORD` + `SMTP_USER`, or `RESEND_API_KEY` with a
  verified-domain `RESEND_FROM_EMAIL`.
- `GEMINI_API_KEY` set. `NEXT_PUBLIC_SITE_URL` set to the live domain.
- Social profile URLs (`NEXT_PUBLIC_*_URL`) filled in.
- Blog posts are published by setting `draft: false` in the post's frontmatter
  after review. Drafts are hidden in production, excluded from the sitemap and
  marked `noindex`.

## Notes

- Public business details (email, phone, service area) live in
  `content/site.ts`; founder details in `content/founders.ts`.
- The Content Security Policy is set in `next.config.ts`.
