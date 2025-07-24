/**
 * Project Scaffolding
 * Sets up AssetMax in new or existing projects
 */

import { promises as fs } from 'fs';

export interface ScaffoldOptions {
  projectName: string;
  template: 'react' | 'nextjs' | 'vue' | 'vanilla';
  typescript: boolean;
  baseUrl: string;
}

interface TemplateConfig {
  directories: string[];
  files: Record<string, string>;
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

export class ProjectScaffolder {
  private readonly templates: Record<string, TemplateConfig> = {
    react: {
      directories: ['src/lib', 'src/components/ui', 'public/assets/stubs'],
      files: {
        'src/components/ui/smart-image.tsx': this.getSmartImageComponent('react'),
        'src/components/ui/smart-video.tsx': this.getSmartVideoComponent('react'),
        'public/assets/stubs/placeholder.png': 'PLACEHOLDER_FILE'
      },
      dependencies: ['@iarna/toml'],
      devDependencies: ['@types/node', 'typescript'],
      scripts: {
        'assets:build': 'assetmax build',
        'assets:generate': 'assetmax generate',
        'assets:compile': 'assetmax compile',
        'assets:validate': 'assetmax validate'
      }
    },
    
    nextjs: {
      directories: ['src/lib', 'src/components/ui', 'public/assets/stubs'],
      files: {
        'src/components/ui/smart-image.tsx': this.getSmartImageComponent('nextjs'),
        'src/components/ui/smart-video.tsx': this.getSmartVideoComponent('nextjs'),
        'public/assets/stubs/placeholder.png': 'PLACEHOLDER_FILE',
        'next.config.js': this.getNextConfig()
      },
      dependencies: ['@iarna/toml', 'next'],
      devDependencies: ['@types/node', 'typescript'],
      scripts: {
        'assets:build': 'assetmax build',
        'assets:generate': 'assetmax generate',
        'assets:compile': 'assetmax compile',
        'assets:validate': 'assetmax validate',
        'prebuild': 'npm run assets:compile'
      }
    },
    
    vue: {
      directories: ['src/lib', 'src/components', 'public/assets/stubs'],
      files: {
        'src/components/SmartImage.vue': this.getSmartImageComponent('vue'),
        'src/components/SmartVideo.vue': this.getSmartVideoComponent('vue'),
        'public/assets/stubs/placeholder.png': 'PLACEHOLDER_FILE'
      },
      dependencies: ['@iarna/toml', 'vue'],
      devDependencies: ['@types/node', 'typescript'],
      scripts: {
        'assets:build': 'assetmax build',
        'assets:generate': 'assetmax generate',
        'assets:compile': 'assetmax compile',
        'assets:validate': 'assetmax validate'
      }
    },
    
    vanilla: {
      directories: ['src/lib', 'assets/stubs'],
      files: {
        'src/lib/asset-loader.js': this.getAssetLoader(),
        'assets/stubs/placeholder.png': 'PLACEHOLDER_FILE'
      },
      dependencies: ['@iarna/toml'],
      devDependencies: ['@types/node', 'typescript'],
      scripts: {
        'assets:build': 'assetmax build',
        'assets:generate': 'assetmax generate',
        'assets:compile': 'assetmax compile',
        'assets:validate': 'assetmax validate'
      }
    }
  };

  async initProject(options: ScaffoldOptions): Promise<void> {
    console.log(`🚀 Initializing AssetMax for ${options.template} project: ${options.projectName}`);
    
    const template = this.templates[options.template];
    if (!template) {
      throw new Error(`Unknown template: ${options.template}`);
    }
    
    // Create directories
    await this.createDirectories(template.directories);
    
    // Create files
    await this.createFiles(template.files);
    
    // Create manifest
    await this.createManifest(options);
    
    // Update package.json
    await this.updatePackageJson(template, options);
    
    // Create TypeScript config if needed
    if (options.typescript) {
      await this.createTsConfig(options.template);
    }
    
    console.log('✅ Project scaffolding complete');
  }

  private async createDirectories(directories: string[]): Promise<void> {
    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }

  private async createFiles(files: Record<string, string>): Promise<void> {
    for (const [filePath, content] of Object.entries(files)) {
      if (content === 'PLACEHOLDER_FILE') {
        // Create a simple placeholder image (1x1 transparent PNG)
        const placeholderContent = Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
          'base64'
        );
        await fs.writeFile(filePath, placeholderContent);
      } else {
        await fs.writeFile(filePath, content);
      }
      console.log(`📄 Created file: ${filePath}`);
    }
  }

  private async createManifest(options: ScaffoldOptions): Promise<void> {
    const manifest = this.getDefaultManifest(options);
    await fs.writeFile('asset-manifest.toml', manifest);
    console.log('📋 Created asset-manifest.toml');
  }

  private async updatePackageJson(template: TemplateConfig, options: ScaffoldOptions): Promise<void> {
    interface PackageJsonStructure {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      scripts?: Record<string, string>;
      [key: string]: unknown;
    }
    
    let packageJson: PackageJsonStructure = {};
    
    try {
      const existing = await fs.readFile('package.json', 'utf-8');
      packageJson = JSON.parse(existing);
    } catch {
      // Create new package.json
      packageJson = {
        name: options.projectName,
        version: '1.0.0',
        description: `${options.projectName} with AssetMax`,
        main: 'index.js',
        scripts: {},
        dependencies: {},
        devDependencies: {}
      };
    }
    
    // Add dependencies
    for (const dep of template.dependencies) {
      if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
        packageJson.dependencies = packageJson.dependencies || {};
        packageJson.dependencies[dep] = 'latest';
      }
    }
    
    for (const dep of template.devDependencies) {
      if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
        packageJson.devDependencies = packageJson.devDependencies || {};
        packageJson.devDependencies[dep] = 'latest';
      }
    }
    
    // Add scripts
    packageJson.scripts = { ...(packageJson.scripts || {}), ...template.scripts };
    
    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2));
    console.log('📦 Updated package.json');
  }

  private async createTsConfig(template: string): Promise<void> {
    const tsConfig = {
      compilerOptions: {
        target: 'es2020',
        module: 'esnext',
        moduleResolution: 'node',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        allowSyntheticDefaultImports: true,
        ...(template === 'nextjs' && {
          jsx: 'preserve',
          lib: ['dom', 'dom.iterable', 'es6'],
          incremental: true,
          plugins: [{ name: 'next' }]
        }),
        ...(template === 'react' && {
          jsx: 'react-jsx',
          lib: ['dom', 'dom.iterable', 'es6']
        })
      },
      include: ['src/**/*', 'asset-manifest.toml'],
      exclude: ['node_modules', 'dist', 'build']
    };
    
    await fs.writeFile('tsconfig.json', JSON.stringify(tsConfig, null, 2));
    console.log('⚙️  Created tsconfig.json');
  }

  private getDefaultManifest(options: ScaffoldOptions): string {
    return `# AssetMax Manifest
# Auto-generated for ${options.projectName}

[meta]
name = "${options.projectName}"
version = "1.0.0"
description = "Asset manifest for ${options.projectName}"
base_url = "${options.baseUrl}"

[categories]
illustrations = { path = "illustrations", type = "image", formats = ["png", "jpg", "webp"] }
photos = { path = "photos", type = "image", formats = ["webp", "jpg"] }
videos = { path = "videos", type = "video", formats = ["mp4"] }
icons = { path = "icons", type = "icon", formats = ["png"] }

[assets.hero_images]
description = "Hero images for landing pages"
category = "illustrations"
format = "png"
generation_model = "flux-kontext"

  [assets.hero_images.main_hero]
  prompt = "Modern hero illustration with vibrant colors and engaging composition"
  alt = "Main hero image for landing page"
  aspect_ratio = "16:9"

[assets.ui_icons]
description = "User interface icons"
category = "icons"
format = "png"
generation_model = "flux-kontext"

  [assets.ui_icons.home]
  prompt = "Home icon in modern flat design style"
  alt = "Home navigation icon"

  [assets.ui_icons.menu]
  prompt = "Menu icon in modern flat design style"
  alt = "Menu navigation icon"

[build]
output_dir = "src/lib"
output_file = "assets.ts"
type_definitions = true
fallback_image = "${options.baseUrl}/stubs/placeholder.png"

[cli]
models = { images = "flux-kontext", videos = "veo-3-fast" }
pricing = { "flux-kontext" = 0.015, "veo-3-fast" = 0.050 }
output_dir = "public/assets"

[generation]
skip_existing = true
convert_formats = true
verify_output = true
max_retries = 3
`;
  }

  private getSmartImageComponent(framework: string): string {
    switch (framework) {
      case 'react':
      case 'nextjs':
        return `import React, { useState } from 'react';

interface SmartImageProps {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  assetType?: 'icon' | 'illustration' | 'photo';
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  fallback,
  alt,
  className = '',
  assetType = 'illustration'
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={\`smart-image \${className}\`}>
      <img
        src={error ? fallback : src}
        alt={alt}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        className={\`\${loading ? 'loading' : ''} \${assetType}\`}
      />
    </div>
  );
};`;

      case 'vue':
        return `<template>
  <div :class="[\`smart-image \${className}\`]">
    <img
      :src="error ? fallback : src"
      :alt="alt"
      @error="error = true"
      @load="loading = false"
      :class="[loading ? 'loading' : '', assetType]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  assetType?: 'icon' | 'illustration' | 'photo';
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  assetType: 'illustration'
});

const error = ref(false);
const loading = ref(true);
</script>`;

      default:
        return '';
    }
  }

  private getSmartVideoComponent(framework: string): string {
    switch (framework) {
      case 'react':
      case 'nextjs':
        return `import React, { useState } from 'react';

interface SmartVideoProps {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const SmartVideo: React.FC<SmartVideoProps> = ({
  src,
  fallback,
  alt,
  className = '',
  autoPlay = false,
  loop = false,
  muted = true
}) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <img src={fallback} alt={alt} className={className} />
    );
  }

  return (
    <video
      src={src}
      className={\`smart-video \${className}\`}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      onError={() => setError(true)}
    />
  );
};`;

      case 'vue':
        return `<template>
  <video
    v-if="!error"
    :src="src"
    :class="[\`smart-video \${className}\`]"
    :autoplay="autoPlay"
    :loop="loop"
    :muted="muted"
    @error="error = true"
  />
  <img
    v-else
    :src="fallback"
    :alt="alt"
    :class="className"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  autoPlay: false,
  loop: false,
  muted: true
});

const error = ref(false);
</script>`;

      default:
        return '';
    }
  }

  private getAssetLoader(): string {
    return `/**
 * Asset Loader for Vanilla JS
 */

export class AssetLoader {
  constructor(baseUrl = '/assets') {
    this.baseUrl = baseUrl;
    this.cache = new Map();
  }

  async loadAsset(assetDefinition) {
    const { src, fallback, alt } = assetDefinition;
    
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    try {
      const response = await fetch(src);
      if (response.ok) {
        this.cache.set(src, src);
        return src;
      } else {
        throw new Error(\`Asset not found: \${src}\`);
      }
    } catch (error) {
      console.warn(\`Failed to load asset \${src}, using fallback\`);
      return fallback;
    }
  }

  createImage(assetDefinition, className = '') {
    const img = document.createElement('img');
    img.alt = assetDefinition.alt;
    img.className = className;
    
    this.loadAsset(assetDefinition).then(src => {
      img.src = src;
    });
    
    return img;
  }
}`;
  }

  private getNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placeholder.it'],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config) => {
    // Support for TOML files
    config.module.rules.push({
      test: /\\.toml$/,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;`;
  }
}