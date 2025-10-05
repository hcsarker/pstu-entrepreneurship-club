# Deployment Verification & Troubleshooting

Last diagnostics: All attempted public HTTP requests to the deployed backend returned HTTP 401 (Unauthorized). Your backend code does NOT implement authentication, so this almost certainly means the Vercel project (or environment) is behind Vercel SSO/Protection (Password or Team Auth) and is not publicly accessible without login.

## Observed Responses

| Endpoint            | Status | Notes                                            |
| ------------------- | ------ | ------------------------------------------------ |
| /                   | 401    | Should be 200 with JSON API index.               |
| /health             | 401    | Should be 200 (health payload).                  |
| /api/content/events | 401    | Should list events (or empty array if DB empty). |
| /api/members        | 401    | Should return members list.                      |

## Why 401? (Likely Causes)

1. Vercel Project Protection enabled (Team Settings -> Protection -> Password / SSO required).
2. Preview deployments protected and you are testing a preview URL without a session cookie.
3. Edge Middleware (not present in repo) — unlikely.

## Action Steps to Make API Public

1. In Vercel Dashboard open the backend project.
2. Go to Settings -> Protection.
3. Disable "Require Authentication" (SSO / Password) for Production (or add public allow rules).
4. Redeploy (trigger: Settings change or manual redeploy).

## Environment Variables Checklist

Required (Production):
VARIABLE | PURPOSE | EXAMPLE
---------|---------|--------
MONGO_URI | Connect to Atlas | mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority
NODE_ENV | Optimize prod behavior | production
SEED_KEY | (Optional) Enable dev seeding | (omit in prod)

## Atlas Setup Quick Audit

[ ] Network Access allows Vercel IPs or 0.0.0.0/0 (temporary)
[ ] Database user has readWrite on target database
[ ] Collections created after first write or seed route

## Local Functional Test Commands

```bash
# Install backend deps
cd backend && npm install

# Run locally
node server.js

# New terminal: quick health
curl -i http://localhost:5000/health

# (Optional) seed content (only if SEED_KEY configured in .env)
curl -X POST "http://localhost:5000/api/content/seed?key=$SEED_KEY"
```

## Frontend Data Fallback Logic

`frontend/assets/js/app-dynamic.js` tries to fetch API collections; on 401/timeout it logs a warning and falls back to local mock arrays. This prevents blank UI when API unreachable.

## Post-Unlock Public Verification Script

After disabling protection, run (update BASE to your real domain):

```bash
BASE="https://your-backend-domain.vercel.app"
for p in / /health /api/content/events /api/content/products /api/content/posts /api/content/startups /api/content/team /api/members; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$p"); echo "$code $p"; done
```

Expect 200 everywhere (maybe 404 only if route typo).

## Performance / Hardening Optional Next Steps

- Add `Cache-Control: public,max-age=60` for content lists.
- Add image CDN (Cloudinary) & WebP conversion.
- Add width/height attributes to critical images to reduce CLS.
- Add pagination: `?page=1&limit=20` pattern.
- Add structured logging (e.g., pino) in production.

## Failing Scenario Quick Reference

STATUS | LIKELY CAUSE | FIX
401 | Protection / Auth wall | Disable protection or provide auth
500 | MONGO_URI invalid / network | Verify connection string & IP allowlist
404 | Wrong path | Check server.js endpoints
429 | Rate limit triggered | Lower request rate or increase limit window

## Rollback Strategy

If a deployment goes bad:

1. In Vercel -> Deployments -> Promote previous successful production deployment.
2. Fix locally, redeploy.

## Questions To Clarify (If Issues Persist)

- Is custom domain configured and pointing to production deployment?
- Any serverless function logs showing auth middleware insertion (external)?
- Did you enable preview protection only (use production URL instead)?

Once 401 barrier removed, re-run verification and remove this note if no longer needed.
