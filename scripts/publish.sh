#!/bin/bash

# AssetMax Publication Script
# Complete automation for GitHub + NPM publishing

set -e

echo "🚀 AssetMax Publication Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the AssetMax root directory.${NC}"
    exit 1
fi

# Check if git is configured
if ! git config user.email > /dev/null; then
    echo -e "${RED}❌ Error: Git user.email not configured.${NC}"
    echo "Run: git config --global user.email 'your@email.com'"
    exit 1
fi

if ! git config user.name > /dev/null; then
    echo -e "${RED}❌ Error: Git user.name not configured.${NC}"
    echo "Run: git config --global user.name 'Your Name'"
    exit 1
fi

echo -e "${BLUE}📋 Pre-publication checks...${NC}"

# Validate package.json
if ! npm run validate > /dev/null 2>&1; then
    echo -e "${RED}❌ Package validation failed. Run 'npm run validate' to see issues.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Package validation passed${NC}"

# Build the package
echo -e "${BLUE}🏗️  Building package...${NC}"
npm run build

echo -e "${GREEN}✅ Build completed${NC}"

# GitHub Repository Creation
echo -e "${YELLOW}🔗 GitHub Repository Setup${NC}"
echo "Please create a GitHub repository manually:"
echo "1. Visit: https://github.com/new"
echo "2. Repository name: assetmax-core"
echo "3. Description: Manifest-driven asset management system with contract-based generation"
echo "4. Public repository"
echo "5. DON'T initialize with README (we already have one)"
echo ""
read -p "Press Enter after creating the GitHub repository..."

# Get GitHub username and repository URL
read -p "Enter your GitHub username: " GITHUB_USERNAME
REPO_URL="https://github.com/${GITHUB_USERNAME}/assetmax-core.git"

echo -e "${BLUE}📤 Setting up Git remote...${NC}"
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push -u origin main

echo -e "${GREEN}✅ Pushed to GitHub: ${REPO_URL}${NC}"

# NPM Publishing
echo -e "${YELLOW}📦 NPM Publishing Setup${NC}"
echo "Setting up NPM registry..."
npm config set registry https://registry.npmjs.org/

echo "Please log in to NPM:"
npm login

echo -e "${BLUE}📦 Publishing to NPM...${NC}"
npm publish --access public

echo -e "${GREEN}✅ Published to NPM: @assetmax/core${NC}"

# GitHub Secrets Configuration
echo -e "${YELLOW}⚙️  GitHub Secrets Configuration${NC}"
echo "Configure these secrets in your GitHub repository:"
echo "Visit: ${REPO_URL}/settings/secrets/actions"
echo ""
echo "Required secrets:"
echo "1. GITHUB_TOKEN (automatically provided by GitHub)"
echo "2. NPM_TOKEN (get from https://www.npmjs.com/settings/tokens)"
echo "   - Token type: Automation"
echo "   - Copy the token and add it as NPM_TOKEN secret"
echo ""

# Codecov setup
echo -e "${YELLOW}📊 Codecov Setup (Optional)${NC}"
echo "For coverage reporting:"
echo "1. Visit: https://codecov.io/"
echo "2. Sign in with GitHub"
echo "3. Add your repository: ${GITHUB_USERNAME}/assetmax-core"
echo "4. Copy the upload token"
echo "5. Add CODECOV_TOKEN to GitHub secrets"
echo ""

echo -e "${GREEN}🎉 Publication Complete!${NC}"
echo ""
echo "📋 Summary:"
echo "✅ GitHub Repository: ${REPO_URL}"
echo "✅ NPM Package: https://www.npmjs.com/package/@assetmax/core"
echo "✅ CI/CD Pipeline: Ready (configure secrets for automation)"
echo ""
echo "🔄 Next commits will trigger:"
echo "  - Automated testing on Node 18/20/21"
echo "  - Semantic versioning and releases"
echo "  - Automated NPM publishing"
echo "  - Coverage reporting"
echo ""
echo "🚀 AssetMax is now live and ready for use!"