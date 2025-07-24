"use strict";
/**
 * Tests for ManifestValidator
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../src/validation/validator");
const fs_1 = require("fs");
const toml = __importStar(require("@iarna/toml"));
// Mock dependencies
jest.mock('fs', () => ({
    promises: {
        access: jest.fn(),
        readFile: jest.fn(),
    }
}));
jest.mock('@iarna/toml');
// Mock console methods to avoid test output noise
const consoleSpy = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
};
describe('ManifestValidator', () => {
    let validator;
    beforeEach(() => {
        validator = new validator_1.ManifestValidator();
        jest.clearAllMocks();
    });
    afterAll(() => {
        consoleSpy.log.mockRestore();
        consoleSpy.error.mockRestore();
    });
    describe('validate', () => {
        it('should validate a correct manifest', async () => {
            const validManifest = {
                meta: {
                    name: 'test-app',
                    version: '1.0.0',
                    description: 'Test app'
                },
                categories: {
                    illustrations: { path: 'illustrations', type: 'image', formats: ['png'] }
                },
                assets: {
                    hero_images: {
                        description: 'Hero images',
                        category: 'illustrations',
                        format: 'png',
                        generation_model: 'flux-kontext',
                        main_hero: {
                            prompt: 'A beautiful hero image',
                            alt: 'Main hero image'
                        }
                    }
                },
                build: {
                    output_dir: 'src/lib',
                    output_file: 'assets.ts'
                },
                cli: {
                    models: { images: 'flux-kontext' },
                    pricing: { 'flux-kontext': 0.015 }
                }
            };
            fs_1.promises.access.mockResolvedValue(true);
            fs_1.promises.readFile.mockResolvedValue('mock toml content');
            toml.parse.mockReturnValue(validManifest);
            const result = await validator.validate();
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.assetCount).toBe(1);
            expect(result.groupCount).toBe(1);
        });
        it('should detect missing required sections', async () => {
            const invalidManifest = {
                meta: {
                    name: 'test-app'
                    // Missing version and description
                }
                // Missing other required sections
            };
            fs_1.promises.access.mockResolvedValue(true);
            fs_1.promises.readFile.mockResolvedValue('mock toml content');
            toml.parse.mockReturnValue(invalidManifest);
            const result = await validator.validate();
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some(e => e.includes('Missing meta.version'))).toBe(true);
        });
        it('should detect invalid asset definitions', async () => {
            const manifestWithInvalidAssets = {
                meta: {
                    name: 'test-app',
                    version: '1.0.0',
                    description: 'Test app'
                },
                categories: {},
                assets: {
                    hero_images: {
                        description: 'Hero images',
                        category: 'illustrations',
                        format: 'png',
                        generation_model: 'flux-kontext',
                        invalid_asset: {
                        // Missing prompt and alt
                        }
                    }
                },
                build: {
                    output_dir: 'src/lib',
                    output_file: 'assets.ts'
                },
                cli: {}
            };
            fs_1.promises.access.mockResolvedValue(true);
            fs_1.promises.readFile.mockResolvedValue('mock toml content');
            toml.parse.mockReturnValue(manifestWithInvalidAssets);
            const result = await validator.validate();
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('missing required field: prompt'))).toBe(true);
            expect(result.errors.some(e => e.includes('missing required field: alt'))).toBe(true);
        });
        it('should handle file not found error', async () => {
            fs_1.promises.access.mockRejectedValue(new Error('File not found'));
            const result = await validator.validate('nonexistent.toml');
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('Manifest not found'))).toBe(true);
        });
    });
});
//# sourceMappingURL=validator.test.js.map