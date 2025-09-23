#!/bin/bash

echo "🚀 PSTU Entrepreneurship Club - Deployment Script"
echo "=================================================="

# Check if user wants to deploy
read -p "Deploy to Vercel? (y/n): " deploy_choice

if [ "$deploy_choice" = "y" ] || [ "$deploy_choice" = "Y" ]; then
    echo "📦 Deploying Backend..."
    cd backend
    vercel --prod
    
    echo "📦 Deploying Frontend..."
    cd ../frontend
    vercel --prod
    
    echo "✅ Deployment Complete!"
    echo "📝 Don't forget to:"
    echo "   1. Update environment variables in Vercel dashboard"
    echo "   2. Update API URL in frontend/assets/js/config.js"
    echo "   3. Test your live application"
else
    echo "❌ Deployment cancelled"
fi