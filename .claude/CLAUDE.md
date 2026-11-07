# CLAUDE.md

Guidelines and commands for working with the Shortly codebase.

## Project Overview
Shortly is a high-performance URL shortener built with:
- **Backend**: Go (Gin framework), Redis (cache-aside pattern), MySQL 8.0, and Docker
- **Frontend**: React 18, Vite, Tailwind CSS, TypeScript
- **Features**: Sub-millisecond cached redirects, custom slugs, TTL expiration, bcrypt-protected links, rate limiting (60 req/min per IP), and one-time management tokens

---

## Development & Testing Commands

### Backend (Go)
```bash
# Run all unit tests
cd api && go test -v ./...

# Run tests with race detector
cd api && go test -race -v ./...

# Run local development server (requires MySQL & Redis running)
cd api && go run ./cmd/server/main.go
```

### Docker Compose (Full Stack)
```bash
# Start all services (Go API, MySQL, Redis) in the background
docker compose up -d --build

# Inspect service logs
docker compose logs -f api

# Stop and tear down containers
docker compose down

# Wipe persistent database & cache volumes for a clean slate
docker compose down -v
```

### Frontend (React / Vite)
```bash
# Install dependencies
cd web && npm install

# Start Vite local development server (with /api proxy to localhost:8080)
cd web && npm run dev

# Typecheck and build production bundle
cd web && npm run build
```

---

## Architecture & Code Guidelines
- **Cache-Aside Pattern**: Redirect hot-path queries `GET /:slug` check Redis (`url:{slug}`) first. On cache miss, it reads from MySQL and pre-warms Redis with the remaining TTL.
- **Slug Resolution**: Auto-generated slugs use 8-character cryptographically random base62 strings. Custom slugs enforce 5–50 alphanumeric and hyphen characters with collision handling (`slug-2`, etc.).
- **Security**: Link passwords use `bcrypt` cost factor 10. Management tokens use 32-character random base62 strings hashed with SHA-256 before database storage.
- **Rate Limiting**: Rate limiter is configured at 60 requests/minute per IP across redirect and password verification endpoints.
