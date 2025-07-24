/**
 * Model Registry - Centralized configuration for all supported image generation models
 */

export interface ModelConfig {
  name: string;
  description: string;
  provider: string;
  replicateModel: string;
  costPerImage: number;
  supportedAspectRatios: string[];
  supportedFormats: string[];
  defaultParams: Record<string, unknown>;
  specialFeatures: string[];
  useCase: string[];
}

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  // FLUX Models
  'flux-schnell': {
    name: 'FLUX Schnell',
    description: 'Fastest FLUX variant optimized for speed (4-step inference)',
    provider: 'Black Forest Labs',
    replicateModel: 'black-forest-labs/flux-schnell',
    costPerImage: 0.003,
    supportedAspectRatios: ['1:1', '16:9', '21:9', '3:2', '2:3', '4:5', '5:4', '3:4', '4:3', '9:16', '9:21'],
    supportedFormats: ['webp', 'jpg', 'png'],
    defaultParams: {
      go_fast: true,
      num_inference_steps: 4,
      output_format: 'webp',
      output_quality: 80
    },
    specialFeatures: ['Extremely fast generation', 'fp8 quantization', 'Multiple outputs'],
    useCase: ['Rapid prototyping', 'Bulk generation', 'Development testing']
  },

  'flux-dev': {
    name: 'FLUX Dev',
    description: '12B parameter model for high-quality image generation',
    provider: 'Black Forest Labs',
    replicateModel: 'black-forest-labs/flux-dev',
    costPerImage: 0.03,
    supportedAspectRatios: ['1:1', '16:9', '21:9', '3:2', '2:3', '4:5', '5:4', '3:4', '4:3', '9:16', '9:21'],
    supportedFormats: ['webp', 'jpg', 'png'],
    defaultParams: {
      guidance: 3,
      num_inference_steps: 28,
      output_format: 'webp'
    },
    specialFeatures: ['High quality output', 'Image-to-image mode', 'Safety checker'],
    useCase: ['Professional assets', 'Marketing materials', 'High-quality graphics']
  },

  'flux-pro': {
    name: 'FLUX 1.1 Pro',
    description: 'Latest FLUX with 6x faster generation and improved quality',
    provider: 'Black Forest Labs',
    replicateModel: 'black-forest-labs/flux-1.1-pro',
    costPerImage: 0.04,
    supportedAspectRatios: ['1:1', '16:9', '3:2', '2:3', '4:5', '5:4', '9:16', '3:4', '4:3'],
    supportedFormats: ['webp', 'jpg', 'png'],
    defaultParams: {
      prompt_upsampling: true,
      safety_tolerance: 2,
      output_format: 'webp',
      output_quality: 90
    },
    specialFeatures: ['Image prompts', 'Prompt upsampling', 'Adjustable safety'],
    useCase: ['Professional branding', 'Complex compositions', 'Brand consistency']
  },

  // Google Models
  'imagen-4-fast': {
    name: 'Imagen 4 Fast',
    description: 'Fast version of Imagen 4 optimized for speed and cost',
    provider: 'Google',
    replicateModel: 'google/imagen-4-fast',
    costPerImage: 0.02,
    supportedAspectRatios: ['1:1', '9:16', '16:9', '3:4', '4:3'],
    supportedFormats: ['jpg', 'png'],
    defaultParams: {
      output_format: 'jpg',
      safety_filter_level: 'block_only_high'
    },
    specialFeatures: ['Google safety filtering', 'Fast generation', 'Cost effective'],
    useCase: ['Quick iterations', 'Budget projects', 'Safe content generation']
  },

  // ByteDance Models
  'seedream-3': {
    name: 'Seedream 3',
    description: 'Best overall model with native 2K resolution and excellent text rendering',
    provider: 'ByteDance',
    replicateModel: 'bytedance/seedream-3',
    costPerImage: 0.03,
    supportedAspectRatios: ['1:1', '3:4', '4:3', '16:9', '9:16', '2:3', '3:2', '21:9'],
    supportedFormats: ['webp', 'jpeg'],
    defaultParams: {
      size: 'regular',
      guidance_scale: 2.5,
      aspect_ratio: '16:9'
    },
    specialFeatures: ['Native 2K resolution', '94% text accuracy', 'Bilingual support'],
    useCase: ['Text-heavy assets', 'High-resolution graphics', 'Professional quality']
  },

  // Ideogram Models
  'ideogram-v3-turbo': {
    name: 'Ideogram V3 Turbo',
    description: 'Fastest Ideogram variant, excellent for text rendering',
    provider: 'Ideogram AI',
    replicateModel: 'ideogram-ai/ideogram-v3-turbo',
    costPerImage: 0.03,
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:2', '2:3', '3:4', '4:5', '5:4'],
    supportedFormats: ['jpg', 'png', 'webp'],
    defaultParams: {
      style: 'Auto',
      magic_prompt: 'Auto'
    },
    specialFeatures: ['Superior text rendering', 'Style reference', 'Inpainting support'],
    useCase: ['Text-based designs', 'Typography', 'Brand materials with text']
  },

  // Recraft Models
  'recraft-v3': {
    name: 'Recraft V3',
    description: 'SOTA model, #1 on Hugging Face leaderboard',
    provider: 'Recraft AI',
    replicateModel: 'recraft-ai/recraft-v3',
    costPerImage: 0.04,
    supportedAspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16', '21:9', '9:21', '2:3', '3:2'],
    supportedFormats: ['webp'],
    defaultParams: {
      size: '1024x1024',
      style: 'any'
    },
    specialFeatures: ['Brand customization', 'Exact brand colors', 'Text generation'],
    useCase: ['Brand assets', 'Marketing materials', 'Professional graphics']
  },

  'recraft-v3-svg': {
    name: 'Recraft V3 SVG',
    description: 'Specialized SVG generation for logos and icons',
    provider: 'Recraft AI',
    replicateModel: 'recraft-ai/recraft-v3-svg',
    costPerImage: 0.08,
    supportedAspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    supportedFormats: ['svg'],
    defaultParams: {
      size: '1024x1024',
      style: 'any'
    },
    specialFeatures: ['True SVG output', 'Perfect for logos', 'Scalable graphics'],
    useCase: ['Logos', 'Icons', 'Vector graphics', 'Brand identity']
  },

  // Stability AI Models
  'stable-diffusion-3.5-large': {
    name: 'Stable Diffusion 3.5 Large',
    description: '8.1B parameter model with superior quality and prompt adherence',
    provider: 'Stability AI',
    replicateModel: 'stability-ai/stable-diffusion-3.5-large',
    costPerImage: 0.065,
    supportedAspectRatios: ['1:1', '16:9', '21:9', '3:2', '2:3', '4:5', '5:4', '3:4', '4:3', '9:16', '9:21'],
    supportedFormats: ['webp', 'jpg', 'png'],
    defaultParams: {
      cfg: 3.5,
      steps: 35,
      output_format: 'webp',
      output_quality: 90,
      prompt_strength: 0.85
    },
    specialFeatures: ['Query-Key Normalization', 'Image-to-image mode', 'Diverse outputs'],
    useCase: ['High-end graphics', 'Artistic projects', 'Complex compositions']
  }
};

export type ModelName = keyof typeof MODEL_REGISTRY;

export const MODEL_CATEGORIES = {
  fastest: ['flux-schnell', 'imagen-4-fast'],
  best_quality: ['seedream-3', 'flux-pro', 'stable-diffusion-3.5-large'],
  best_text: ['ideogram-v3-turbo', 'seedream-3'],
  best_logos: ['recraft-v3-svg', 'recraft-v3'],
  most_economical: ['flux-schnell', 'imagen-4-fast'],
  best_overall: ['seedream-3', 'recraft-v3']
} as const;

/**
 * Get model configuration by name
 */
export function getModelConfig(modelName: ModelName): ModelConfig {
  const config = MODEL_REGISTRY[modelName];
  if (!config) {
    throw new Error(`Unknown model: ${modelName}`);
  }
  return config;
}

/**
 * Get models by category
 */
export function getModelsByCategory(category: keyof typeof MODEL_CATEGORIES): ModelConfig[] {
  return MODEL_CATEGORIES[category]
    .map(name => MODEL_REGISTRY[name])
    .filter((config): config is ModelConfig => config !== undefined);
}

/**
 * Get all available models
 */
export function getAllModels(): ModelConfig[] {
  return Object.values(MODEL_REGISTRY);
}

/**
 * Find best model for use case
 */
export function getBestModelForUseCase(useCase: string): ModelConfig[] {
  return getAllModels().filter(model => 
    model.useCase.some(uc => 
      uc.toLowerCase().includes(useCase.toLowerCase())
    )
  );
}