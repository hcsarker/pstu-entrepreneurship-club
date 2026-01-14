# Frontend Deployment

This site is built as a static export to `frontend/public`.

Local build:

```bash
node scripts/build-static.js
```

Vercel reads the root `vercel.json`, runs the build command, and deploys `frontend/public`.

If you deploy frontend from the `frontend/` folder directly, verify a `vercel.json` exists or run:

```bash
vercel --prod
```
