# AssetMax

**Manifest-driven asset management system with contract-based generation**

[![NPM Version](https://img.shields.io/npm/v/@assetmax/core.svg)](https://www.npmjs.com/package/@assetmax/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js 18+](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Replicate](https://img.shields.io/badge/Powered%20by-Replicate-orange)](https://replicate.com/)

AssetMax is a powerful TypeScript library that provides a standardized approach to managing assets in modern web applications. Define your assets once in a TOML manifest, generate TypeScript definitions automatically, and create assets using AI models.

## ✨ Features

- 🏗️ **Contract-based system** - TOML manifest as single source of truth
- 🎯 **Type-safe generation** - Full TypeScript support with auto-generated definitions  
- 🤖 **AI-powered creation** - Generate assets using Flux Kontext Pro and Veo 3 Fast
- 📦 **Framework agnostic** - Works with React, Next.js, Vue, and vanilla JavaScript
- 🚀 **Zero configuration** - CLI reads directly from manifest
- 🎨 **Template system** - Pre-built templates for common project types

## 🚀 Quick Start

### Installation

```bash
npm install -g @assetmax/core
```

### Initialize a new project

```bash
assetmax init --template react --name my-app
```

### Generate assets from manifest

```bash
assetmax build --generate
```

## Commands

### Image Generation

```bash
./bin/asset image "<prompt>" [options]

Options:
  -i, --input-image <path>    Input image for editing
  -o, --output <path>         Output file path
  -a, --aspect-ratio <ratio>  Aspect ratio (1:1, 16:9, etc.)
  -f, --format <format>       Output format (jpg, png, webp)
  -s, --seed <number>         Random seed
  --safety <number>           Safety tolerance (0-6)
  --no-upsampling            Disable prompt improvement
  --no-download              Return URL only
```

### Video Generation

```bash
./bin/asset video "<prompt>" [options]

Options:
  -n, --negative-prompt <text>  What to discourage
  -o, --output <path>          Output file path  
  -s, --seed <number>          Random seed
  --no-enhance                 Disable prompt enhancement
  --no-download                Return URL only
```

## Examples

### Images

```bash
# Basic generation
./bin/asset image "Futuristic cityscape at night"

# Specific dimensions and format
./bin/asset image "Abstract art" -a "16:9" -f png -o abstract.png

# Edit existing image
./bin/asset image "Add sunglasses" -i portrait.jpg -a match_input_image

# Reproducible generation
./bin/asset image "Random art" -s 12345 -o art_12345.jpg
```

### Videos

```bash
# Basic video generation
./bin/asset video "Dancing robot in a neon city"

# With negative prompts
./bin/asset video "Beautiful nature scene" -n "blurry, low quality"

# Reproducible with custom output
./bin/asset video "Cat playing piano" -s 42 -o cat_piano.mp4

# Disable prompt enhancement  
./bin/asset video "Exact prompt as-is" --no-enhance
```

## Configuration

### API Token Setup

Get your API token from [Replicate](https://replicate.com/account/api-tokens) and set it up:

```bash
# Method 1: Create .env file (recommended)
echo "REPLICATE_API_TOKEN=your_token_here" > .env

# Method 2: Export environment variable
export REPLICATE_API_TOKEN=your_token_here

# Method 3: Add to ~/.env for global access
echo "REPLICATE_API_TOKEN=your_token_here" >> ~/.env
```

The tool automatically looks for `REPLICATE_API_TOKEN` in these locations (in order):
1. `.env` file in current directory
2. `.env.local` file  
3. `~/.env` file in home directory
4. System environment variables

### Troubleshooting

**"REPLICATE_API_TOKEN not found"**
- Check that your .env file exists and contains the token
- Verify the token is valid on [Replicate](https://replicate.com/account/api-tokens)
- Try exporting the token directly: `export REPLICATE_API_TOKEN=your_token`

**Module not found errors**
```bash
npm install
```

**Permission denied**
```bash
chmod +x bin/asset
```

## Project Structure

```
asset-cli/
├── package.json           # Node.js project configuration
├── bin/
│   └── asset             # Executable binary
├── src/
│   ├── index.js          # Main CLI entry point
│   ├── config.js         # Configuration management
│   ├── commands/         # Command implementations
│   │   ├── image.js      # Image generation commands
│   │   └── video.js      # Video generation commands
│   ├── models/           # AI model integrations
│   │   ├── flux.js       # FLUX Kontext Pro
│   │   └── veo.js        # Google Veo 3 Fast
│   └── utils/            # Utility functions
│       └── download.js   # File download utilities
└── .env                  # Environment variables
```

## Dependencies

### Production
- **commander** - Command-line argument parsing
- **replicate** - Replicate API client
- **axios** - HTTP client for downloads
- **dotenv** - Environment variable loading
- **chalk** - Terminal colors
- **ora** - Loading spinners
- **progress** - Download progress bars
- **fs-extra** - Enhanced file system operations

### Development
- **jest** - Testing framework
- **eslint** - Code linting

## Advanced Usage

### Global Installation

```bash
# Install globally to use 'asset' command anywhere
npm install -g .

# Now you can use it from anywhere
asset image "My prompt" -o image.jpg
asset video "My video prompt" -o video.mp4
```

### Programmatic Usage

```javascript
const FluxModel = require('./src/models/flux');
const VeoModel = require('./src/models/veo');

// Generate image programmatically
const flux = new FluxModel();
const imageUrl = await flux.generate({
    prompt: "A beautiful landscape",
    aspectRatio: "16:9"
});

// Generate video programmatically  
const veo = new VeoModel();
const videoUrl = await veo.generate({
    prompt: "Dancing robot"
});
```

### Batch Processing

```bash
# Generate multiple variations
for i in {1..5}; do
  ./bin/asset image "Abstract art variation $i" -s $i -o "abstract_$i.jpg"
done

# Process directory of images
for img in photos/*.jpg; do
  ./bin/asset image "Make this vintage style" -i "$img" -o "vintage_$(basename $img)"
done
```

## Performance & Costs

### Model Comparison

| Model | Type | Speed | Quality | Cost | Best For |
|-------|------|-------|---------|------|----------|
| FLUX Kontext Pro | Image | ~10-30s | Excellent | $0.0055/run | Photo editing, style transfer |
| Veo 3 Fast | Video | ~2-5min | High | $0.05/run | Quick video content, social media |

### Optimization Tips

- Use `--no-download` for testing prompts quickly
- Cache successful seeds for reproducible results
- Use appropriate aspect ratios to avoid cropping
- Batch similar requests to minimize API overhead

## Scripts

```bash
# Development
npm run dev          # Run with inspector
npm start           # Run normally
npm test            # Run tests (if configured)
npm run lint        # Lint code (if configured)

# Usage
./bin/asset --help   # Show help
./bin/asset image --help    # Image command help
./bin/asset video --help    # Video command help
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Make your changes
5. Test: `npm test` (if tests exist)
6. Commit: `git commit -am 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

## License

MIT License - see LICENSE file for details

---

Made with ❤️ by TACO Labs