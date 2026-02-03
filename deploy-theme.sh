#!/bin/bash

# EcoDrop Theme Toggle - Deployment Script
# This script helps deploy the new theme toggle system

echo "🚀 EcoDrop Theme Toggle Deployment Script"
echo "===================================="

# Check if required files exist
echo "📋 Checking required files..."

REQUIRED_FILES=(
    "src/context/theme-context.tsx"
    "src/components/ui/theme-toggle.tsx"
    "src/app/layout.tsx"
    "src/components/layout/header.tsx"
    "src/app/profile/page.tsx"
    "src/app/globals.css"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing - please ensure file is created"
        exit 1
    fi
done

echo ""
echo "🧹 Cleaning old theme files..."

# Remove old theme files if they exist
OLD_THEME_FILES=(
    "src/components/ui/dark-mode-toggle.tsx"  # Example old file
    "src/hooks/use-theme.ts"             # Example old hook
)

for file in "${OLD_THEME_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "🗑️  Removing old file: $file"
        rm "$file"
    fi
done

echo ""
echo "🔧 Running TypeScript check..."

# Check TypeScript compilation
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    echo "Please fix compilation errors before deployment"
    exit 1
fi

echo ""
echo "📦 Building for production..."

# Build the project
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    echo "Please fix build errors before deployment"
    exit 1
fi

echo ""
echo "🎯 Deployment ready!"
echo "==================="
echo "✅ All theme toggle files are in place"
echo "✅ TypeScript compilation passed"  
echo "✅ Production build successful"
echo ""
echo "📱 Features included:"
echo "   • Header theme toggle with animations"
echo "   • Global theme state management"
echo "   • Cross-tab synchronization"
echo "   • Toast notifications"
echo "   • Mobile-responsive design"
echo "   • Accessibility compliance"
echo ""
echo "🚀 Ready to deploy to your platform!"
echo ""
echo "Popular platforms:"
echo "   • Vercel: vercel --prod"
echo "   • Netlify: netlify deploy --prod"
echo "   • Railway: railway up"