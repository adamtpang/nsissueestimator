#!/bin/bash

# Quick Vercel Deployment Script
# This script helps you deploy to Vercel quickly

echo "🚀 GitHub Issue Cost Estimator - Vercel Deployment"
echo "=================================================="
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI"
        echo "Please install manually: npm install -g vercel"
        exit 1
    fi
    echo "✅ Vercel CLI installed"
    echo ""
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Make sure to add environment variables in Vercel dashboard after deployment"
    echo ""
fi

# Ensure latest changes are pushed
echo "📤 Checking git status..."
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes:"
    git status -s
    echo ""
    read -p "Do you want to commit and push these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        echo "Enter commit message:"
        read commit_msg
        git commit -m "$commit_msg"
        git push origin master
        echo "✅ Changes pushed"
    else
        echo "⚠️  Continuing with deployment without committing changes"
    fi
else
    echo "✅ No uncommitted changes"
fi
echo ""

# Run build test
echo "🔨 Testing build locally..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi
echo "✅ Build successful"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "Important: After first deployment, add environment variables:"
echo "  - GITHUB_TOKEN (from your .env.local)"
echo "  - ANTHROPIC_API_KEY (from your .env.local)"
echo ""
echo "Starting deployment..."
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "✅ Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "1. Add environment variables in Vercel dashboard if not done:"
    echo "   https://vercel.com/dashboard"
    echo "2. Test your deployment URL"
    echo "3. Update README.md with your hosted URL"
    echo ""
    echo "To add environment variables via CLI:"
    echo "  vercel env add GITHUB_TOKEN"
    echo "  vercel env add ANTHROPIC_API_KEY"
    echo ""
else
    echo "❌ Deployment failed"
    echo "Check the error messages above"
    echo "See VERCEL_DEPLOY.md for troubleshooting"
fi
