#!/bin/bash

echo "🚀 PSTU Entrepreneurship Club - Deployment Script"
echo "=================================================="

command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI not found. Install with: npm i -g vercel"; exit 1; }

set -e

echo "📦 Deploying Backend (linked project expected)..."
pushd backend >/dev/null
# Ensure this folder is linked to the correct Vercel project first using: vercel link
vercel --prod --yes
popd >/dev/null

echo "📦 Deploying Frontend (linked project expected)..."
pushd frontend >/dev/null
# Ensure this folder is linked to the correct Vercel project first using: vercel link
vercel --prod --yes
popd >/dev/null

echo "✅ Deployment Complete!"
echo "📝 Remember:"
echo "   1) Backend env vars set in its Vercel project"
echo "   2) Frontend points to your API domain (assets/js/config.js)"
echo "   3) Test both live URLs"


npx -y vercel@latest --cwd backend --prod --yes
 npx -y vercel@latest --cwd frontend --prod --yes
 npx -y vercel@latest whoami
    echo "✅ Deployment Complete!"