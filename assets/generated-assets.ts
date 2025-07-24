/**
 * Generated Asset Definitions
 * 
 * This file is auto-generated from asset-manifest.toml
 * DO NOT EDIT MANUALLY - Changes will be overwritten
 * 
 * Generated: 2025-07-24T03:09:02.245Z
 * Manifest: AssetMax Core v1.0.0
 */

// Asset base paths
const ASSET_BASE = '/assets';
const PLACEHOLDER_IMAGE = '/fallback.png';

/**
 * AssetMax brand logos and wordmarks
 */
export const logos = {
  primaryLogo: {
    src: `${ASSET_BASE}/branding/primary_logo.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax primary logo',
    aspectRatio: '1:1',
    _meta: {
      prompt: `Modern, clean logo for AssetMax - a minimalist geometric 'A' symbol with interconnected nodes representing asset management, professional tech branding, gradient blue to purple, white background`,
      model: 'recraft-v3',
      aspectRatio: '1:1',
      category: 'branding',
      subcategory: '',
      format: 'png'
    }
  },
  wordmark: {
    src: `${ASSET_BASE}/branding/wordmark.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax wordmark logo',
    aspectRatio: '21:9',
    _meta: {
      prompt: `AssetMax wordmark logo - clean, modern typography with 'AssetMax' text, tech startup style, bold sans-serif font, gradient blue to purple accent, white background`,
      model: 'recraft-v3',
      aspectRatio: '21:9',
      category: 'branding',
      subcategory: '',
      format: 'png'
    }
  },
  iconOnly: {
    src: `${ASSET_BASE}/branding/icon_only.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax app icon',
    aspectRatio: '1:1',
    _meta: {
      prompt: `AssetMax app icon - simplified geometric 'A' symbol with connected nodes, modern flat design, gradient blue to purple, suitable for favicons and app stores`,
      model: 'recraft-v3',
      aspectRatio: '1:1',
      category: 'branding',
      subcategory: '',
      format: 'png'
    }
  },
};

/**
 * Open Graph and social media cards
 */
export const socialCards = {
  ogPrimary: {
    src: `${ASSET_BASE}/social/og_primary.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax Open Graph card',
    aspectRatio: '1:1',
    _meta: {
      prompt: `Open Graph card for AssetMax - modern tech design with 'Manifest-driven asset management' tagline, clean layout with AssetMax logo, gradient background blue to purple, code snippets overlay, 1200x630px`,
      model: 'seedream-3',
      aspectRatio: '1:1',
      category: 'social',
      subcategory: '',
      format: 'png'
    }
  },
  twitterCard: {
    src: `${ASSET_BASE}/social/twitter_card.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax Twitter card',
    aspectRatio: '1:1',
    _meta: {
      prompt: `Twitter card for AssetMax - sleek design showcasing 'AI-powered asset generation' with terminal/CLI interface preview, dark theme with purple accents, AssetMax branding`,
      model: 'seedream-3',
      aspectRatio: '1:1',
      category: 'social',
      subcategory: '',
      format: 'png'
    }
  },
  linkedinCard: {
    src: `${ASSET_BASE}/social/linkedin_card.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax LinkedIn card',
    aspectRatio: '1:1',
    _meta: {
      prompt: `LinkedIn card for AssetMax - professional design highlighting 'Enterprise asset management solution', clean corporate style with screenshots of TypeScript code generation, blue professional theme`,
      model: 'seedream-3',
      aspectRatio: '1:1',
      category: 'social',
      subcategory: '',
      format: 'png'
    }
  },
};

/**
 * GitHub README and documentation images
 */
export const githubAssets = {
  heroBanner: {
    src: `${ASSET_BASE}/documentation/hero_banner.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax GitHub hero banner',
    aspectRatio: '21:9',
    _meta: {
      prompt: `GitHub README hero banner for AssetMax - wide banner showing 'Manifest-driven Asset Management' with code snippets, CLI interface, and generated assets preview, modern developer tool aesthetic`,
      model: 'flux-pro',
      aspectRatio: '21:9',
      category: 'documentation',
      subcategory: '',
      format: 'png'
    }
  },
  architectureDiagram: {
    src: `${ASSET_BASE}/documentation/architecture_diagram.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax architecture diagram',
    aspectRatio: '1:1',
    _meta: {
      prompt: `Technical architecture diagram for AssetMax - clean flowchart showing TOML manifest → TypeScript compilation → AI generation → Asset output, modern diagram style with icons and arrows`,
      model: 'flux-pro',
      aspectRatio: '1:1',
      category: 'documentation',
      subcategory: '',
      format: 'png'
    }
  },
  cliDemo: {
    src: `${ASSET_BASE}/documentation/cli_demo.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax CLI demo',
    aspectRatio: '1:1',
    _meta: {
      prompt: `CLI demo screenshot for AssetMax - terminal interface showing 'assetmax generate' command in action with colorful output, progress indicators, and generated file list, dark terminal theme`,
      model: 'flux-pro',
      aspectRatio: '1:1',
      category: 'documentation',
      subcategory: '',
      format: 'png'
    }
  },
  workflowIllustration: {
    src: `${ASSET_BASE}/documentation/workflow_illustration.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax workflow illustration',
    aspectRatio: '4:3',
    _meta: {
      prompt: `Developer workflow illustration - developer using AssetMax to generate assets from manifest files, modern isometric style illustration, person at computer with floating asset files`,
      model: 'flux-pro',
      aspectRatio: '4:3',
      category: 'documentation',
      subcategory: '',
      format: 'png'
    }
  },
};

/**
 * Feature highlight graphics
 */
export const features = {
  aiGeneration: {
    src: `${ASSET_BASE}/documentation/ai_generation.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AI generation feature',
    aspectRatio: '1:1',
    _meta: {
      prompt: `AI generation feature highlight - split screen showing text prompt on left and generated image on right, with 'AI-Powered Generation' title, modern UI design`,
      model: 'ideogram-v3-turbo',
      aspectRatio: '1:1',
      category: 'documentation',
      subcategory: '',
      format: 'png'
    }
  },
  typescriptSupport: {
    src: `${ASSET_BASE}/documentation/typescript_support.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'TypeScript support feature',
    aspectRatio: '1:1',
    _meta: {
      prompt: `TypeScript integration feature - code editor showing TypeScript asset definitions with IntelliSense autocomplete, 'Type-Safe Assets' title, VS Code theme`,
      model: 'ideogram-v3-turbo',
      aspectRatio: '1:1',
      category: 'documentation',
      subcategory: '',
      format: 'png'
    }
  },
  manifestDriven: {
    src: `${ASSET_BASE}/documentation/manifest_driven.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Manifest-driven workflow',
    aspectRatio: '1:1',
    _meta: {
      prompt: `Manifest-driven workflow - TOML file with asset definitions connected by arrows to generated files, 'Configuration as Code' title, clean technical diagram`,
      model: 'ideogram-v3-turbo',
      aspectRatio: '1:1',
      category: 'documentation',
      subcategory: '',
      format: 'png'
    }
  },
};

/**
 * Project badges and shields
 */
export const badges = {
  versionBadge: {
    src: `${ASSET_BASE}/branding/version_badge.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'AssetMax version badge',
    aspectRatio: '21:9',
    _meta: {
      prompt: `npm version badge for AssetMax - clean shield design showing 'AssetMax v1.0.0', npm package style, red npm colors`,
      model: 'flux-schnell',
      aspectRatio: '21:9',
      category: 'branding',
      subcategory: '',
      format: 'png'
    }
  },
  buildStatus: {
    src: `${ASSET_BASE}/branding/build_status.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Build status badge',
    aspectRatio: '21:9',
    _meta: {
      prompt: `Build status badge - green 'Build: Passing' shield with checkmark icon, GitHub Actions style, clean and professional`,
      model: 'flux-schnell',
      aspectRatio: '21:9',
      category: 'branding',
      subcategory: '',
      format: 'png'
    }
  },
  coverageBadge: {
    src: `${ASSET_BASE}/branding/coverage_badge.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Test coverage badge',
    aspectRatio: '21:9',
    _meta: {
      prompt: `Test coverage badge - blue '100% Coverage' shield with test tube icon, clean shield design matching standard badge style`,
      model: 'flux-schnell',
      aspectRatio: '21:9',
      category: 'branding',
      subcategory: '',
      format: 'png'
    }
  },
};

// Type Definitions
export interface AssetDefinition {
  src: string;
  fallback: string;
  alt: string;
  ageRange?: string;
  style?: string;
  category?: string;
  duration?: number;
  aspectRatio?: string;
  _meta: {
    prompt: string;
    model: string;
    aspectRatio: string;
    category: string;
    subcategory: string;
    format: string;
  };
}

// Manifest Metadata
export const ASSET_MANIFEST = {
  name: 'AssetMax Core',
  version: '1.0.0',
  description: 'Manifest-driven asset management system with contract-based generation',
  generatedAt: '2025-07-24T03:09:02.247Z',
  totalAssets: 16
};