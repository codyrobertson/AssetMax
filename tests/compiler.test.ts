/**
 * Tests for AssetCompiler
 */

import { AssetCompiler } from '../src/core/compiler';
import { promises as fs } from 'fs';
import * as toml from '@iarna/toml';

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
  let compiler: AssetCompiler;
  
  beforeEach(() => {
    compiler = new AssetCompiler();
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

      (fs.access as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue('mock toml content');
      (toml.parse as unknown as jest.Mock).mockReturnValue(mockManifest);
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await compiler.compile();

      expect(fs.writeFile).toHaveBeenCalledWith(
        'src/lib/assets.ts',
        expect.stringContaining('export const heroImages'),
        'utf-8'
      );
    });

    it('should throw error if manifest not found', async () => {
      (fs.access as jest.Mock).mockRejectedValue(new Error('File not found'));

      await expect(compiler.compile()).rejects.toThrow('Manifest not found');
    });
  });
});