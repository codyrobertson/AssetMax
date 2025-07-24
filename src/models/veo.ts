/**
 * Veo 3 Fast model integration (TypeScript version)
 */

import Replicate from 'replicate';

export interface VeoGenerationOptions {
  prompt: string;
  aspectRatio?: string;
  duration?: number;
  seed?: number;
}

export class VeoModel {
  private client: Replicate;
  private readonly modelName = 'google-deepmind/veo-3-fast';
  private readonly aspectRatios = ['16:9', '9:16', '1:1', '4:3', '3:4'];

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
   * Generate video using Veo 3 Fast
   */
  async generate(options: VeoGenerationOptions): Promise<string> {
    const {
      prompt,
      aspectRatio = '16:9',
      duration = 5,
      seed = null
    } = options;

    // Validate inputs
    if (!this.aspectRatios.includes(aspectRatio)) {
      throw new Error(`Invalid aspect ratio: ${aspectRatio}`);
    }

    if (duration < 1 || duration > 30) {
      throw new Error('Duration must be between 1 and 30 seconds');
    }

    // Prepare model inputs
    const modelInput: Record<string, unknown> = {
      prompt,
      aspect_ratio: aspectRatio,
      duration
    };

    // Add seed if provided
    if (seed !== null) {
      modelInput.seed = seed;
    }

    try {
      // Run the model
      const output = await this.client.run(this.modelName, { input: modelInput });
      
      let outputUrl: string;
      if (Array.isArray(output)) {
        outputUrl = output[0] as string;
      } else {
        outputUrl = output as unknown as string;
      }

      if (!outputUrl) {
        throw new Error('Model returned no output');
      }

      return outputUrl;
    } catch (error) {
      throw new Error(`Model execution failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      name: this.modelName,
      supportedAspectRatios: this.aspectRatios,
      maxDuration: 30,
      costPerVideo: 0.050 // $0.050 per video
    };
  }
}