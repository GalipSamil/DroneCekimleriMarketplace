# Deployment Checklist

## 1. Production secret files

- Create `.env.production` from [.env.production.example](c:/Users/kralg/Desktop/DroneCekimleriMarketpalce/.env.production.example).
- Do not commit `.env.production`.
- Replace all placeholder values:
  - `DOMAIN`
  - `LETSENCRYPT_EMAIL`
  - database credentials
  - `JWT_SECRET`
  - SMTP credentials

## 2. Production stack

- Use [docker-compose.production.yml](c:/Users/kralg/Desktop/DroneCekimleriMarketpalce/docker-compose.production.yml) for real deployment.
- This stack runs:
  - `db` internally
  - `api` internally
  - `frontend` internally
  - `edge` as the public entrypoint on `80/443`
- HTTPS termination is handled by Caddy with [Caddyfile.production](c:/Users/kralg/Desktop/DroneCekimleriMarketpalce/infra/docker/caddy/Caddyfile.production).

Validate the config before first deploy:

```powershell
docker compose --env-file .env.production -f docker-compose.production.yml config
```

Start the production stack:

```powershell
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

## 3. Application behavior in production

- `ASPNETCORE_ENVIRONMENT` must stay `Production`.
- `RunSeedOnStartup` must stay `false`.
- Swagger is disabled by default in production.
- Data Protection keys are persisted to a Docker volume.
- Frontend uses same-origin `/api` by default. Only set `VITE_API_URL` if you intentionally serve the API from a different public domain.

## 4. Database

- Production PostgreSQL must have PostGIS enabled.
- If you prefer manual migration control, set `RUN_MIGRATIONS_ON_STARTUP=false` and apply migrations before opening traffic.
- Never expose the database port publicly.

## 5. DNS and HTTPS

- Point `DOMAIN` and optionally `www.DOMAIN` to the server running the `edge` service.
- Ports `80` and `443` must be reachable from the internet for automatic TLS issuance.
- If another reverse proxy or CDN already terminates TLS, adapt the Caddy layer instead of exposing the API directly.

## 6. Final smoke checks

- Confirm `https://your-domain` loads without console errors.
- Confirm `https://your-domain/healthz` returns `200`.
- Confirm login works.
- Confirm contact form works.
- Confirm password reset mails work if enabled.
- Confirm SignalR chat connects.
- Confirm API logs do not show seed/demo initialization on production.
