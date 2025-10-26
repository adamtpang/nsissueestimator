#!/bin/bash

# Test script for GitHub Issue Cost Estimator
# This script helps you quickly test the application locally

echo "🚀 GitHub Issue Cost Estimator - Local Test"
echo "==========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo ""
    echo "Please create .env.local with your API keys:"
    echo "  cp .env.example .env.local"
    echo "  # Then edit .env.local with your keys"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
    echo ""
fi

# Check environment variables
echo "🔍 Checking configuration..."
if grep -q "your_github_token_here" .env.local; then
    echo "❌ Error: Please update GITHUB_TOKEN in .env.local"
    exit 1
fi

if grep -q "your_anthropic_api_key_here" .env.local; then
    echo "❌ Error: Please update ANTHROPIC_API_KEY in .env.local"
    exit 1
fi

echo "✅ Configuration looks good"
echo ""
echo "🌐 Starting development server..."
echo ""
echo "Once the server starts:"
echo "  → Open: http://localhost:3000"
echo "  → Try analyzing: https://github.com/anthropics/anthropic-quickstarts"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev
