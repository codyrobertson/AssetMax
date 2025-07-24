/**
 * TypeScript type definitions for AssetMax
 */

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
    model: GenerationModel;
    aspectRatio: string;
    category: string;
    subcategory: string;
    format: string;
  };
}

export interface ManifestConfig {
  projectName: string;
  baseUrl: string;
  outputDir: string;
}

export interface AssetGroup {
  description: string;
  category: AssetCategory;
  subcategory?: string;
  format: AssetFormat;
  generation_model: GenerationModel;
  aspect_ratio?: string;
  [assetName: string]: AssetConfig | string | undefined;
}

export interface AssetConfig {
  prompt: string;
  alt: string;
  aspect_ratio?: string;
  [customField: string]: unknown;
}

export interface AssetManifest {
  meta: {
    name: string;
    version: string;
    description: string;
    base_url: string;
    generated_at?: string;
  };
  categories: Record<string, CategoryDefinition>;
  assets: Record<string, AssetGroup>;
  build: BuildConfig;
  cli: CLIConfig;
  generation: GenerationConfig;
}

export interface CategoryDefinition {
  path: string;
  type: 'image' | 'video' | 'icon';
  formats: AssetFormat[];
}

export interface BuildConfig {
  output_dir: string;
  output_file: string;
  type_definitions: boolean;
  fallback_image: string;
}

export interface CLIConfig {
  models: Record<string, GenerationModel>;
  pricing: Record<string, number>; // More flexible to allow any model string
  output_dir: string;
}

export interface GenerationConfig {
  skip_existing: boolean;
  convert_formats: boolean;
  verify_output: boolean;
  max_retries: number;
}

export type AssetCategory = 'illustrations' | 'photos' | 'videos' | 'icons';
export type AssetFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'svg' | 'gif' | 'mp4' | 'webm' | 'mov';
export type GenerationModel = 'flux-kontext' | 'veo-3-fast' | 'dall-e-3' | 'midjourney';

export interface ScaffoldOptions {
  projectName: string;
  template: 'react' | 'nextjs' | 'vue' | 'vanilla';
  typescript: boolean;
  baseUrl: string;
}

export interface TemplateConfig {
  directories: string[];
  files: Record<string, string>;
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

export interface GenerationOptions {
  manifestFile?: string;
  dryRun?: boolean;
  force?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  assetCount: number;
  groupCount: number;
}

// CLI command options
export interface InitOptions {
  name?: string;
  template: string;
  typescript: boolean;
  baseUrl: string;
}

export interface GenerateManifestOptions {
  assetsDir?: string;
  assetsFile?: string;
  name: string;
  output: string;
  baseUrl: string;
}

export interface CompileOptions {
  input: string;
  output?: string;
}

export interface GenerateOptions {
  input: string;
  dryRun?: boolean;
  force?: boolean;
}

export interface BuildOptions {
  skipGeneration?: boolean;
  force?: boolean;
}

export interface ValidateOptions {
  input: string;
}

// Asset information for scanning
export interface AssetInfo {
  name: string;
  path: string;
  extension: string;
  category: string;
  subcategory?: string | undefined;
  estimatedPrompt: string;
  altText: string;
}

// Generation result
export interface GenerationResult {
  success: boolean;
  assetPath: string;
  cost: number;
  duration: number;
  error?: string;
}

// Progress tracking
export interface GenerationProgress {
  total: number;
  completed: number;
  failed: number;
  totalCost: number;
  currentAsset?: string;
}

export default AssetManifest;