/**
 * FLUX Kontext Pro model integration (TypeScript version)
 */

import * as fs from 'fs-extra';
import Replicate from 'replicate';

export interface FluxGenerationOptions {
  prompt: string;
  inputImage?: string;
  aspectRatio?: string;
  promptUpsampling?: boolean;
  seed?: number;
  outputFormat?: 'webp' | 'jpg' | 'png';
  safetyTolerance?: number;
}

export class FluxModel {
  private client: Replicate;
  private readonly modelName = 'black-forest-labs/flux-kontext-pro';
  private readonly aspectRatios = [
    '1:1', '16:10', '21:9', '2:3', '3:2', '4:5', '5:4', '9:16', '9:21',
    'match_input_image'
  ];
  private readonly outputFormats = ['webp', 'jpg', 'png'];

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
   * Upload local image to Replicate and return URL
   */
  async uploadImage(imagePath: string): Promise<string> {
    if (!(await fs.pathExists(imagePath))) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    try {
      const imageStream = fs.createReadStream(imagePath);
      const file = await this.client.files.create(imageStream);
      return file.urls.get;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Generate/edit image using FLUX Kontext Pro
   */
  async generate(options: FluxGenerationOptions): Promise<string> {
    const {
      prompt,
      inputImage = null,
      aspectRatio = '1:1',
      promptUpsampling = true,
      seed = null,
      outputFormat = 'jpg',
      safetyTolerance = 2
    } = options;

    // Validate inputs
    if (!this.aspectRatios.includes(aspectRatio)) {
      throw new Error(`Invalid aspect ratio: ${aspectRatio}`);
    }

    if (!this.outputFormats.includes(outputFormat)) {
      throw new Error(`Invalid output format: ${outputFormat}`);
    }

    // Prepare model inputs
    const modelInput: any = {
      prompt,
      aspect_ratio: aspectRatio,
      prompt_upsampling: promptUpsampling,
      output_format: outputFormat,
      safety_tolerance: safetyTolerance
    };

    // Handle input image
    if (inputImage) {
      if (await fs.pathExists(inputImage)) {
        modelInput.input_image = await this.uploadImage(inputImage);
      } else {
        // Assume it's already a URL
        modelInput.input_image = inputImage;
      }
    }

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
        outputUrl = output as string;
      }

      if (!outputUrl) {
        throw new Error('Model returned no output');
      }

      return outputUrl;
    } catch (error) {
      throw new Error(`Model execution failed: ${error.message}`);
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      name: this.modelName,
      supportedAspectRatios: this.aspectRatios,
      supportedFormats: this.outputFormats,
      costPerImage: 0.015 // $0.015 per image
    };
  }
}