#!/bin/bash

# AI Full Stack Builder - Render Deployment Script

echo "🚀 Deploying AI Full Stack Builder to Render..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found"
    exit 1
fi

# Install dependencies locally to verify everything works
echo "📦 Installing dependencies..."
npm ci

# Build the project to verify it builds successfully
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    git status --short
    exit 1
fi

echo "✅ All checks passed!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git push origin main"
echo ""
echo "2. In Render dashboard:"
echo "   - Connect your GitHub repository"
echo "   - Select 'Web Service'"
echo "   - Choose your repository"
echo "   - Render will automatically detect render.yaml"
echo ""
echo "3. Set environment variables in Render:"
echo "   - VITE_API_KEY: Your DeepSeek API key"
echo "   - NODE_ENV: production"
echo ""
echo "� Your app will be deployed automatically!"
