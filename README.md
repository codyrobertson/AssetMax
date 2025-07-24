# AssetMax

**Manifest-driven asset management with multi-model AI generation**

[![NPM Version](https://img.shields.io/npm/v/assetmax.svg)](https://www.npmjs.com/package/assetmax)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js 18+](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)

AssetMax generates assets from TOML manifests using 9 AI models with automatic cost optimization and TypeScript type generation.

## Installation

```bash
npm install -g assetmax
```

## Quick Start

```bash
# Set API token
export REPLICATE_API_TOKEN="your_token_here"

# Initialize project
assetmax init

# Generate assets
assetmax generate --dry-run  # Preview costs
assetmax generate            # Generate all assets
```

## Commands

### Core Commands

```bash
# Initialize new project
assetmax init [options]
  -n, --name <name>           Project name
  -t, --template <template>   Template (react, nextjs, vue)
  --typescript               Use TypeScript (default: true)
  --base-url <url>           Assets base URL (default: /assets)

# Compile TOML manifest to TypeScript
assetmax compile [options]
  -i, --input <file>         Input manifest (default: asset-manifest.toml)
  -o, --output <file>        Output TypeScript file

# Generate assets from manifest
assetmax generate [options]
  -i, --input <file>         Input manifest (default: asset-manifest.toml)
  --dry-run                  Preview generation without creating assets
  --force                    Regenerate existing assets

# Validate manifest
assetmax validate [options]
  -i, --input <file>         Input manifest (default: asset-manifest.toml)

# Build pipeline (compile + generate + verify)
assetmax build [options]
  --skip-generation          Skip asset generation
  --force                    Force regeneration
```

### Model Commands

```bash
# List all available AI models
assetmax list

# Model management
assetmax model list                    # Same as assetmax list
assetmax model help <model>            # Detailed model information
assetmax model cost <model> <count>    # Calculate generation costs
assetmax model params <model>          # Show model parameters

# Examples
assetmax model help flux-schnell       # Get info about FLUX Schnell
assetmax model cost recraft-v3 10      # Cost for 10 assets with Recraft V3
assetmax model params ideogram-v3-turbo # Show supported parameters
```

### Template Commands

```bash
# List available templates
assetmax template list

# Create from template
assetmax template create <template> [options]
  -n, --name <name>          Project name
```

### Manifest Generation

```bash
# Generate manifest from existing assets
assetmax generate-manifest [options]
  -d, --assets-dir <dir>     Assets directory to scan
  -f, --assets-file <file>   Existing assets.ts file to parse
  -n, --name <name>          Project name
  -o, --output <file>        Output manifest file
  --base-url <url>           Base URL for assets
```

## Multi-Model System

AssetMax supports 9 AI models with automatic cost optimization.

### Model Discovery

```bash
# List all available models with costs
assetmax list

# Get detailed info about a specific model
assetmax model help flux-schnell

# Check model parameters and supported formats
assetmax model params recraft-v3

# Calculate costs before generating
assetmax model cost seedream-3 5
```

### Available Models

```bash
# Fast & economical
flux-schnell         # $0.003 - Fastest generation
imagen-4-fast        # $0.02  - Google's fast model

# Best quality  
seedream-3           # $0.03  - Best overall with text rendering
flux-pro             # $0.04  - Premium FLUX quality

# Specialized
ideogram-v3-turbo    # $0.03  - Best for text-heavy assets
recraft-v3           # $0.04  - Best for brand assets
recraft-v3-svg       # $0.08  - Vector graphics/logos

# High-end
stable-diffusion-3.5-large  # $0.065 - Premium quality
```

### Example Model Discovery

```bash
assetmax list
```

Output:
```
🤖 Available AI Models

📋 Fastest Models:
   FLUX Schnell              $0.003 - Fastest FLUX variant optimized for speed

📋 Economical Models:
   Imagen 4 Fast             $0.020 - Google's fast model
   Seedream 3                $0.030 - Best overall with text rendering
   Ideogram V3 Turbo         $0.030 - Best for text-heavy assets

📋 Premium Models:
   FLUX 1.1 Pro              $0.040 - Premium FLUX quality
   Recraft V3                $0.040 - Best for brand assets

📋 Specialized Models:
   Recraft V3 SVG            $0.080 - Vector graphics/logos
   Stable Diffusion 3.5      $0.065 - Premium quality
```

### Cost Optimization Example

```bash
assetmax generate --dry-run
```

Output:
```
📊 Summary:
   Total assets: 16
   Estimated cost: $0.469
   Models:
     recraft-v3: 3 assets ($0.120)      # Premium branding
     seedream-3: 3 assets ($0.090)      # Social cards  
     flux-pro: 4 assets ($0.160)        # Documentation
     ideogram-v3-turbo: 3 assets ($0.090) # Text features
     flux-schnell: 3 assets ($0.009)    # Simple badges
```

## Manifest Configuration

Create `asset-manifest.toml`:

```toml
[meta]
name = "My Project"
version = "1.0.0"
description = "Project assets"
base_url = "/assets"

[categories.branding]
path = "branding"
type = "image"
formats = ["png", "svg"]

[build]
output_dir = "assets"
output_file = "generated-assets.ts"
type_definitions = true

[cli]
output_dir = "generated"

# Model selection per asset group
[assets.logos]
description = "Brand logos"
category = "branding"
format = "png"
generation_model = "recraft-v3"    # Best for logos
aspect_ratio = "1:1"

[assets.logos.primary_logo]
prompt = "Modern minimalist logo for tech company"
alt = "Company logo"

[assets.social_cards]
description = "Social media cards"
category = "social"
format = "png"
generation_model = "seedream-3"    # Best text rendering
aspect_ratio = "16:9"

[assets.social_cards.og_card]
prompt = "Open Graph card with company branding"
alt = "Social media card"

[assets.badges]
description = "Status badges"
category = "branding"
format = "png"
generation_model = "flux-schnell"  # Cheapest for simple graphics
aspect_ratio = "21:9"

[assets.badges.build_status]
prompt = "Green 'Build: Passing' status badge"
alt = "Build status"
```

## Generated TypeScript

AssetMax compiles your manifest to type-safe TypeScript:

```typescript
// assets/generated-assets.ts (auto-generated)
export const logos = {
  primaryLogo: {
    src: '/assets/branding/primary_logo.png',
    fallback: '/fallback.png',
    alt: 'Company logo',
    aspectRatio: '1:1',
    _meta: {
      prompt: 'Modern minimalist logo for tech company',
      model: 'recraft-v3',
      cost: 0.04
    }
  }
};

export const socialCards = {
  ogCard: {
    src: '/assets/social/og_card.png',
    fallback: '/fallback.png', 
    alt: 'Social media card',
    aspectRatio: '16:9',
    _meta: {
      prompt: 'Open Graph card with company branding',
      model: 'seedream-3',
      cost: 0.03
    }
  }
};
```

## Usage in Code

```typescript
import { logos, socialCards } from './assets/generated-assets';

// React component
function Header() {
  return (
    <img 
      src={logos.primaryLogo.src}
      alt={logos.primaryLogo.alt}
      onError={(e) => e.target.src = logos.primaryLogo.fallback}
    />
  );
}

// Next.js meta tags
export const metadata = {
  openGraph: {
    images: [socialCards.ogCard.src]
  }
};
```

## API Token Setup

Get your token from [Replicate](https://replicate.com/account/api-tokens):

```bash
# Method 1: Export environment variable
export REPLICATE_API_TOKEN="r8_your_token_here"

# Method 2: Create .env file
echo "REPLICATE_API_TOKEN=r8_your_token_here" > .env

# Method 3: Add to shell profile (persistent)
echo 'export REPLICATE_API_TOKEN="r8_your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

## Model Selection Strategy

Choose models based on asset type:

```toml
# Logos & Brand Assets → Use recraft-v3 or recraft-v3-svg
[assets.logos]
generation_model = "recraft-v3"        # Best brand quality

# Social Media Cards → Use seedream-3 or ideogram-v3-turbo  
[assets.social]
generation_model = "seedream-3"        # Best text rendering

# Documentation → Use flux-pro or stable-diffusion-3.5-large
[assets.docs] 
generation_model = "flux-pro"          # High quality

# Simple Graphics → Use flux-schnell or imagen-4-fast
[assets.badges]
generation_model = "flux-schnell"      # Fastest/cheapest
```

## Aspect Ratios

Supported aspect ratios by model:

```bash
# Universal (all models)
1:1, 16:9, 9:16, 4:3, 3:4

# Extended support (most models)  
3:2, 2:3, 4:5, 5:4, 21:9, 9:21, 2:1, 1:2

# SVG models
recraft-v3-svg supports all ratios
```

## Troubleshooting

### Common Issues

```bash
# API token not found
export REPLICATE_API_TOKEN="your_token"

# Invalid aspect ratio
# Check model supports the ratio in dry-run mode

# Model execution failed  
# Verify API token and model availability

# Permission denied
chmod +x node_modules/.bin/assetmax
```

### Debug Mode

```bash
# Verbose output
assetmax generate --dry-run  # See costs and models
assetmax validate            # Check manifest validity
```

## Templates

### React Template

```bash
assetmax init --template react --name my-react-app
```

Creates:
- `asset-manifest.toml` with React-optimized settings
- `src/assets/` directory structure  
- TypeScript definitions
- Component usage examples

### Next.js Template

```bash
assetmax init --template nextjs --name my-next-app
```

Creates:
- Next.js-specific asset paths
- Metadata integration
- Public directory setup
- Image optimization config

## Programmatic Usage

```typescript
import { AssetCLI, AssetCompiler } from 'assetmax';

// Generate assets programmatically
const cli = new AssetCLI();
await cli.run({
  manifestFile: 'asset-manifest.toml',
  dryRun: false,
  force: false
});

// Compile manifest
const compiler = new AssetCompiler();
await compiler.compile('asset-manifest.toml', 'assets/generated.ts');
```

## Performance

- **Generation time**: 10-60 seconds per asset depending on model
- **Cost range**: $0.003-$0.08 per asset  
- **Batch optimization**: Automatic model selection minimizes costs
- **Caching**: Skips existing assets unless forced

## License

MIT

---

Install: `npm install -g assetmax`