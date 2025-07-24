"use strict";
/**
 * Veo 3 Fast model integration (TypeScript version)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeoModel = void 0;
const tslib_1 = require("tslib");
const replicate_1 = tslib_1.__importDefault(require("replicate"));
class VeoModel {
    client;
    modelName = 'google-deepmind/veo-3-fast';
    aspectRatios = ['16:9', '9:16', '1:1', '4:3', '3:4'];
    constructor(apiToken) {
        const token = apiToken || process.env.REPLICATE_API_TOKEN;
        if (!token) {
            throw new Error('REPLICATE_API_TOKEN environment variable is required');
        }
        this.client = new replicate_1.default({
            auth: token
        });
    }
    /**
     * Generate video using Veo 3 Fast
     */
    async generate(options) {
        const { prompt, aspectRatio = '16:9', duration = 5, seed = null } = options;
        // Validate inputs
        if (!this.aspectRatios.includes(aspectRatio)) {
            throw new Error(`Invalid aspect ratio: ${aspectRatio}`);
        }
        if (duration < 1 || duration > 30) {
            throw new Error('Duration must be between 1 and 30 seconds');
        }
        // Prepare model inputs
        const modelInput = {
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
            let outputUrl;
            if (Array.isArray(output)) {
                outputUrl = output[0];
            }
            else {
                outputUrl = output;
            }
            if (!outputUrl) {
                throw new Error('Model returned no output');
            }
            return outputUrl;
        }
        catch (error) {
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
            maxDuration: 30,
            costPerVideo: 0.050 // $0.050 per video
        };
    }
}
exports.VeoModel = VeoModel;
//# sourceMappingURL=veo.js.map