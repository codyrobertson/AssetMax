# 🚀 AssetMax Publication Instructions

## Quick Start - Automated Publication

```bash
cd /Users/Cody/code_projects/AssetMax
./scripts/publish.sh
```

The script will guide you through the entire process!

## Manual Step-by-Step Instructions

### 1. 🔗 Create GitHub Repository

**Visit:** https://github.com/new

**Settings:**
- Repository name: `assetmax-core`
- Description: `Manifest-driven asset management system with contract-based generation`
- Visibility: **Public**
- ❌ **DON'T** initialize with README (we already have one)

### 2. 📤 Push to GitHub

```bash
cd /Users/Cody/code_projects/AssetMax

# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/assetmax-core.git

# Push to GitHub
git push -u origin main
```

### 3. 📦 Publish to NPM

```bash
# Set NPM registry
npm config set registry https://registry.npmjs.org/

# Login to NPM (follow prompts)
npm login

# Build package
npm run build

# Publish to NPM
npm publish --access public
```

### 4. ⚙️ Configure GitHub Secrets

**Visit:** `https://github.com/USERNAME/assetmax-core/settings/secrets/actions`

**Add these secrets:**

1. **GITHUB_TOKEN** - ✅ Automatically provided by GitHub
2. **NPM_TOKEN** - Get from https://www.npmjs.com/settings/tokens
   - Token type: **Automation**
   - Copy token → Add as `NPM_TOKEN` secret

### 5. 📊 Setup Codecov (Optional)

1. Visit: https://codecov.io/
2. Sign in with GitHub
3. Add repository: `USERNAME/assetmax-core`
4. Copy upload token
5. Add `CODECOV_TOKEN` to GitHub secrets

## 🎯 What Happens After Publication

### ✅ Immediate Benefits
- **NPM Package**: `npm install -g @assetmax/core`
- **Global CLI**: `assetmax init --template react`
- **GitHub Repository**: Source code + documentation
- **Automated CI/CD**: Testing on every push

### 🔄 Automated Workflows
- **Pull Requests**: Automated testing + linting
- **Main Branch Pushes**: 
  - Testing across Node 18/20/21
  - Semantic versioning
  - Changelog generation
  - Automated NPM releases
  - Coverage reporting

### 📈 Usage Analytics
- **NPM Download Stats**: https://npmcharts.com/compare/@assetmax/core
- **GitHub Stats**: Stars, forks, issues
- **Codecov Coverage**: Test coverage reports

## 🚀 Commands Ready for Users

```bash
# Install globally
npm install -g @assetmax/core

# Initialize new project
assetmax init --template react --name my-app

# Generate manifest from existing assets
assetmax generate-manifest --assets-dir ./assets

# Compile TOML to TypeScript
assetmax compile

# Generate AI assets
assetmax generate

# Complete build pipeline
assetmax build
```

## 📋 Package Information

- **Package Name**: `@assetmax/core`
- **Current Version**: `1.0.0`
- **License**: MIT
- **Node Requirement**: `>=18.0.0`
- **TypeScript**: Full support with declarations

## 🎉 Success Checklist

- [ ] GitHub repository created
- [ ] Code pushed to `main` branch
- [ ] NPM package published
- [ ] GitHub secrets configured
- [ ] CI/CD pipeline working
- [ ] Codecov integration (optional)
- [ ] Users can install globally
- [ ] CLI commands work

## 🔧 Troubleshooting

### NPM Publish Issues
```bash
# Check login status
npm whoami

# Verify package name availability
npm view @assetmax/core

# Force publish if needed
npm publish --access public --force
```

### GitHub Issues
```bash
# Check remote
git remote -v

# Force push if needed
git push --force-with-lease origin main
```

### CI/CD Issues
- Check GitHub Actions tab in repository
- Verify secrets are correctly configured
- Ensure Node versions are compatible

---

**🎯 AssetMax is production-ready and enterprise-grade!**