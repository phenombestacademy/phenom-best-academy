# Cloudflare Workers deployment

Phenom Best Academy uses TanStack Start with Vite and Cloudflare's official Vite plugin. Supabase remains the managed PostgreSQL, Auth, Storage and application-data backend; Cloudflare Workers is the application runtime.

## Local validation

1. Install dependencies with `npm install`.
2. Run `npm run typecheck` and `npm run lint`.
3. Run `npm run deploy:dry-run` to build the application and validate the Wrangler deployment bundle without publishing it.
4. Use `npm run cf-typegen` when Worker bindings are added or changed.

## Production deployment

1. Authenticate Wrangler against the intended Cloudflare account using `npx wrangler login`.
2. Confirm that the Worker name in `wrangler.jsonc` matches the existing production Worker before deploying. If the production Worker has a different name, change the configuration to that exact name first; otherwise Wrangler may create a separate Worker.
3. Configure required runtime bindings and environment variables in the Cloudflare dashboard or with Wrangler. Store private credentials using `npx wrangler secret put <SECRET_NAME>`; never commit secrets to Git or put them in `wrangler.jsonc`.
4. Confirm production routing, custom domains, compatibility settings, observability and rollback procedure in the Cloudflare account.
5. Deploy with `npm run deploy` only after the production Worker identity and bindings have been verified.

## Supabase connection

Keep Supabase credentials and service-role secrets server-side. Only a publishable/anon key intended for browser use may be exposed to client bundles. Never put a Supabase service-role key, database password, payment secret or AI provider key in a `VITE_*` variable.

## Current operational boundary

This repository configuration does not itself authenticate to Cloudflare, create account-level secrets, configure DNS/routes, or deploy to production. Those actions require the account owner's Cloudflare session and confirmation of the existing production Worker name and bindings.
