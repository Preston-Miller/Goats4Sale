# VibeSec Security Report
Repo: Preston-Miller/Goats4Sale
Scanned: 2026-03-01 01:45:54 UTC
Issues Found: 4

## [SEV-001] CRITICAL -- Generic secret

**File:** server.js
**Type:** JavaScript
**Line:** 16
**Evidence:** `API_KEY = process.env.API_KEY`
**Risk:** The API key is hardcoded in the source code instead of being securely stored. An attacker accesses the source code and retrieves the API key.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove the hardcoded API key and ensure it is set in the environment variables.
**Verify:** Check the source code for the absence of the hardcoded API key.

## [SEV-002] CRITICAL -- Generic secret

**File:** server.js
**Type:** JavaScript
**Line:** 17
**Evidence:** `PASSWORD = process.env.DB_PASSWORD`
**Risk:** The database password is hardcoded in the source code instead of being securely stored. An attacker accesses the source code and retrieves the database password.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove the hardcoded database password and ensure it is set in the environment variables.
**Verify:** Check the source code for the absence of the hardcoded database password.

## [SEV-003] CRITICAL -- Generic secret

**File:** server.js
**Type:** JavaScript
**Line:** 18
**Evidence:** `SECRET = process.env.JWT_SECRET`
**Risk:** The JWT secret is hardcoded in the source code instead of being securely stored. An attacker accesses the source code and retrieves the JWT secret.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove the hardcoded JWT secret and ensure it is set in the environment variables.
**Verify:** Check the source code for the absence of the hardcoded JWT secret.

## [SEV-004] CRITICAL -- Generic secret

**File:** server.js
**Type:** JavaScript
**Line:** 21
**Evidence:** `SECRET = process.env.STRIPE_SECRET`
**Risk:** The Stripe secret key is hardcoded in the source code instead of being securely stored. An attacker accesses the source code and retrieves the Stripe secret key.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove the hardcoded Stripe secret key and ensure it is set in the environment variables.
**Verify:** Check the source code for the absence of the hardcoded Stripe secret key.
