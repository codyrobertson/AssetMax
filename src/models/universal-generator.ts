/**
 * Universal Image Generator - Handles all supported models through a unified interface
 */

import Replicate from 'replicate';
import { ModelConfig, ModelName, getModelConfig } from './model-registry';

export interface GenerationOptions {
  prompt: string;
  model: ModelName;
  aspectRatio?: string;
  width?: number;
  height?: number;
  seed?: number;
  outputFormat?: string;
  style?: string;
  guidance?: number;
  steps?: number;
  [key: string]: unknown;
}

export interface GenerationResult {
  url: string;
  model: ModelName;
  cost: number;
  metadata: {
    prompt: string;
    aspectRatio?: string;
    seed?: number;
    [key: string]: unknown;
  };
}

export class UniversalImageGenerator {
  private client: Replicate;

  constructor(apiToken?: string) {
    const token = apiToken || process.env.REPLICATE_API_TOKEN;
    
    if (!token) {
      throw new Error('REPLICATE_API_TOKEN environment variable is required');
    }

    this.client = new Replicate({
      auth: token
    });
  }

  /**
   * Generate image using specified model
   */
  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const modelConfig = getModelConfig(options.model);
    
    // Validate aspect ratio
    if (options.aspectRatio && !modelConfig.supportedAspectRatios.includes(options.aspectRatio)) {
      throw new Error(
        `Invalid aspect ratio '${options.aspectRatio}' for model '${options.model}'. ` +
        `Supported ratios: ${modelConfig.supportedAspectRatios.join(', ')}`
      );
    }

    // Prepare model-specific input
    const modelInput = this.prepareModelInput(options, modelConfig);

    try {
      // Run the model
      const output = await this.client.run(modelConfig.replicateModel as `${string}/${string}`, { 
        input: modelInput 
      });
      
      // Extract URL from output (different models return different formats)
      const imageUrl = this.extractImageUrl(output, modelConfig);
      
      if (!imageUrl) {
        throw new Error(`Model '${options.model}' returned no output`);
      }

      return {
        url: imageUrl,
        model: options.model,
        cost: modelConfig.costPerImage,
        metadata: {
          prompt: options.prompt,
          ...(options.aspectRatio && { aspectRatio: options.aspectRatio }),
          ...(options.seed !== undefined && { seed: options.seed }),
          modelConfig: modelConfig.name
        }
      };
    } catch (error) {
      throw new Error(
        `Model '${options.model}' execution failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Prepare model-specific input parameters
   */
  private prepareModelInput(
    options: GenerationOptions, 
    config: ModelConfig
  ): Record<string, unknown> {
    const input: Record<string, unknown> = {
      prompt: options.prompt,
      ...config.defaultParams
    };

    // Handle model-specific parameter mapping
    switch (config.provider) {
      case 'Black Forest Labs':
        this.prepareFluxInput(input, options, config);
        break;
      case 'Google':
        this.prepareGoogleInput(input, options, config);
        break;
      case 'ByteDance':
        this.prepareByteDanceInput(input, options, config);
        break;
      case 'Ideogram AI':
        this.prepareIdeogramInput(input, options, config);
        break;
      case 'Recraft AI':
        this.prepareRecraftInput(input, options, config);
        break;
      case 'Stability AI':
        this.prepareStabilityInput(input, options, config);
        break;
    }

    // Add common parameters
    if (options.seed !== undefined) {
      input.seed = options.seed;
    }

    return input;
  }

  private prepareFluxInput(
    input: Record<string, unknown>, 
    options: GenerationOptions, 
    config: ModelConfig
  ): void {
    if (options.aspectRatio) {
      input.aspect_ratio = options.aspectRatio;
    }
    if (options.guidance !== undefined) {
      input.guidance = options.guidance;
    }
    if (options.steps !== undefined) {
      input.num_inference_steps = options.steps;
    }
    if (options.outputFormat) {
      input.output_format = options.outputFormat;
    }

    // FLUX Pro specific parameters
    if (config.name.includes('Pro')) {
      if (options.width) input.width = options.width;
      if (options.height) input.height = options.height;
    }
  }

  private prepareGoogleInput(
    input: Record<string, unknown>, 
    options: GenerationOptions, 
    config: ModelConfig
  ): void {
    if (options.aspectRatio) {
      input.aspect_ratio = options.aspectRatio;
    }
    if (options.outputFormat) {
      input.output_format = options.outputFormat;
    }
  }

  private prepareByteDanceInput(
    input: Record<string, unknown>, 
    options: GenerationOptions, 
    config: ModelConfig
  ): void {
    if (options.aspectRatio) {
      input.aspect_ratio = options.aspectRatio;
    }
    if (options.width && options.height) {
      input.width = options.width;
      input.height = options.height;
    }
    if (options.guidance !== undefined) {
      input.guidance_scale = options.guidance;
    }
  }

  private prepareIdeogramInput(
    input: Record<string, unknown>, 
    options: GenerationOptions, 
    config: ModelConfig
  ): void {
    if (options.aspectRatio) {
      input.aspect_ratio = options.aspectRatio;
    }
    if (options.style) {
      input.style = options.style;
    }
  }

  private prepareRecraftInput(
    input: Record<string, unknown>, 
    options: GenerationOptions, 
    config: ModelConfig
  ): void {
    if (options.aspectRatio) {
      input.aspect_ratio = options.aspectRatio;
    }
    if (options.style) {
      input.style = options.style;
    }
    if (options.width && options.height) {
      input.size = `${options.width}x${options.height}`;
    }
  }

  private prepareStabilityInput(
    input: Record<string, unknown>, 
    options: GenerationOptions, 
    config: ModelConfig
  ): void {
    if (options.aspectRatio) {
      input.aspect_ratio = options.aspectRatio;
    }
    if (options.guidance !== undefined) {
      input.cfg = options.guidance;
    }
    if (options.steps !== undefined) {
      input.steps = options.steps;
    }
    if (options.outputFormat) {
      input.output_format = options.outputFormat;
    }
  }

  /**
   * Extract image URL from model output
   */
  private extractImageUrl(output: unknown, config: ModelConfig): string {
    if (typeof output === 'string') {
      return output;
    }

    if (Array.isArray(output)) {
      if (output.length > 0 && typeof output[0] === 'string') {
        return output[0];
      }
    }

    if (typeof output === 'object' && output !== null) {
      const obj = output as Record<string, unknown>;
      
      // Try common property names
      for (const prop of ['url', 'image', 'output', 'result']) {
        if (typeof obj[prop] === 'string') {
          return obj[prop] as string;
        }
      }
    }

    console.warn(`Unexpected output format from ${config.name}:`, output);
    throw new Error(`Unable to extract image URL from ${config.name} output`);
  }

  /**
   * Get model information
   */
  getModelInfo(modelName: ModelName): ModelConfig {
    return getModelConfig(modelName);
  }

  /**
   * List all available models
   */
  listModels(): ModelConfig[] {
    return Object.values(getModelConfig as any);
  }

  /**
   * Check if model is available (has required API token)
   */
  isModelAvailable(modelName: ModelName): boolean {
    try {
      getModelConfig(modelName);
      return !!process.env.REPLICATE_API_TOKEN;
    } catch {
      return false;
    }
  }
}