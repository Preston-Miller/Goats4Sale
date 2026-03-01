# Goats4Sale

A minimal web app for **security scanner testing**. It contains intentional vulnerabilities that coding agents often introduce.

## Setup

```bash
npm install
npm start
```

Open http://localhost:3000

## Intentional vulnerabilities (for scanner validation)

### Hardcoded secrets
- **server.js**: API keys, DB password, JWT secret, AWS keys, Stripe secret in plain text
- **/health**: Responds with `X-API-Key` header containing a secret

### .env exposure
- **.env** exists with real-looking credentials and is **not** in `.gitignore` (commented out), so it may be committed
- **GET /debug/env**: Returns raw contents of `.env`
- **GET /api/debug/config**: Returns `process.env` (all environment variables)
- **Static middleware**: `express.static(__dirname)` serves project root, so **GET /.env** returns the file

### Vulnerable dependencies (package.json)
- **lodash@4.17.20** – CVE-2021-23337 (command injection via `_.template`)
- **jsonpath-plus@7.2.0** – CVE-2024-21534 (RCE in older versions; user input passed to JSONPath in GET /api/goats)
- **express@4.17.1** – CVE-2024-43796 (XSS via redirect), CVE-2024-29041 (open redirect); see **GET /redirect?returnUrl=...**

Run `npm audit` to see reported vulnerabilities.

## Routes

| Route | Purpose |
|-------|--------|
| `/` | Home – list goats |
| `/buy?id=1` | Purchase form |
| `/api/goats` | JSON list (optional `?path=` uses jsonpath-plus) |
| `/api/goat/:id/description` | Goat description (lodash template) |
| `/api/buy` | POST to create purchase |
| `/debug/env` | **Exposes .env file** |
| `/api/debug/config` | **Exposes process.env** |
| `/redirect?returnUrl=...` | **Open redirect** (Express CVE) |
| `/health` | **Leaks API key in header** |
| `/.env` | **Served as static file** (if requested) |

Use this app only in isolated test environments.
