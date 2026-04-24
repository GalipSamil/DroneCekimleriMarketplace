# Docker Local Test

## 1. What this setup runs

- `db`: PostgreSQL + PostGIS (custom image built from `postgres:15`)
- `api`: ASP.NET Core backend
- `frontend`: React app served by Nginx

Frontend is available at `http://localhost:8080`.
Backend is available directly at `http://localhost:5025`.

Docker frontend build uses Vite `docker` mode, so it ignores `frontend/.env.production` and falls back to same-origin `/api`.

## 2. Start everything

```bash
docker compose up --build
```

- Local compose reads values from root `.env`.
- If you need a fresh local env file, copy [.env.example](c:/Users/kralg/Desktop/DroneCekimleriMarketpalce/.env.example) to `.env`.

## 3. Stop everything

```bash
docker compose down
```

If you also want to delete the database volume:

```bash
docker compose down -v
```

## 4. Useful commands

Show running containers:

```bash
docker compose ps
```

Show logs:

```bash
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f db
```

## 5. How networking works

- Browser opens `http://localhost:8080`
- Nginx serves the React build
- Requests to `/api/*` are proxied to the `api` container
- SignalR requests to `/chathub` are proxied to the `api` container
- The `api` container connects to PostgreSQL using host `db`

## 6. Default local credentials

- Admin email: `admin@drone.com`
- Admin password: `Admin+1234`

## 7. Notes

- This Docker setup is for local learning and testing.
- SMTP and other secrets are read from root `.env`; they are no longer hardcoded in `docker-compose.yml`.
- Real deployment should use [docker-compose.production.yml](c:/Users/kralg/Desktop/DroneCekimleriMarketpalce/docker-compose.production.yml) together with [.env.production.example](c:/Users/kralg/Desktop/DroneCekimleriMarketpalce/.env.production.example).
- Database migrations run automatically when the API container starts.
