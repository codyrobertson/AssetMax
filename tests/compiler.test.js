"use strict";
/**
 * Tests for AssetCompiler
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
const compiler_1 = require("../src/core/compiler");
const fs_1 = require("fs");
const toml = __importStar(require("@iarna/toml"));
// Mock dependencies
jest.mock('fs', () => ({
    promises: {
        access: jest.fn(),
        readFile: jest.fn(),
        writeFile: jest.fn(),
        mkdir: jest.fn(),
    }
}));
jest.mock('@iarna/toml');
describe('AssetCompiler', () => {
    let compiler;
    beforeEach(() => {
        compiler = new compiler_1.AssetCompiler();
        jest.clearAllMocks();
    });
    describe('compile', () => {
        it('should compile TOML manifest to TypeScript', async () => {
            const mockManifest = {
                meta: {
                    name: 'test-app',
                    version: '1.0.0',
                    description: 'Test app',
                    base_url: '/assets'
                },
                build: {
                    output_dir: 'src/lib',
                    output_file: 'assets.ts',
                    fallback_image: '/assets/placeholder.png'
                },
                assets: {
                    hero_images: {
                        description: 'Hero images',
                        category: 'illustrations',
                        format: 'png',
                        generation_model: 'flux-kontext',
                        main_hero: {
                            prompt: 'Hero image prompt',
                            alt: 'Main hero image'
                        }
                    }
                }
            };
            fs_1.promises.access.mockResolvedValue(true);
            fs_1.promises.readFile.mockResolvedValue('mock toml content');
            toml.parse.mockReturnValue(mockManifest);
            fs_1.promises.mkdir.mockResolvedValue(undefined);
            fs_1.promises.writeFile.mockResolvedValue(undefined);
            await compiler.compile();
            expect(fs_1.promises.writeFile).toHaveBeenCalledWith('src/lib/assets.ts', expect.stringContaining('export const heroImages'), 'utf-8');
        });
        it('should throw error if manifest not found', async () => {
            fs_1.promises.access.mockRejectedValue(new Error('File not found'));
            await expect(compiler.compile()).rejects.toThrow('Manifest not found');
        });
    });
});
//# sourceMappingURL=compiler.test.js.map