/**
 * Tests for ManifestValidator
 */

import { ManifestValidator } from '../src/validation/validator';
import { promises as fs } from 'fs';
import * as toml from '@iarna/toml';

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
  let validator: ManifestValidator;
  
  beforeEach(() => {
    validator = new ManifestValidator();
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

      (fs.access as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue('mock toml content');
      (toml.parse as jest.Mock).mockReturnValue(validManifest);

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

      (fs.access as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue('mock toml content');
      (toml.parse as jest.Mock).mockReturnValue(invalidManifest);

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

      (fs.access as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue('mock toml content');
      (toml.parse as jest.Mock).mockReturnValue(manifestWithInvalidAssets);

      const result = await validator.validate();

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('missing required field: prompt'))).toBe(true);
      expect(result.errors.some(e => e.includes('missing required field: alt'))).toBe(true);
    });

    it('should handle file not found error', async () => {
      (fs.access as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await validator.validate('nonexistent.toml');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Manifest not found'))).toBe(true);
    });
  });
});