/**
 * Tests for ManifestGenerator
 */

import { ManifestGenerator } from '../src/generators/manifest-generator';
import { promises as fs } from 'fs';
import * as path from 'path';

// Mock fs
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
  }
}));

describe('ManifestGenerator', () => {
  let generator: ManifestGenerator;
  
  beforeEach(() => {
    generator = new ManifestGenerator();
    jest.clearAllMocks();
  });

  describe('generateFromDirectory', () => {
    it('should scan directory and generate manifest', async () => {
      // Mock directory structure
      const mockFiles = [
        { name: 'hero.png', isFile: () => true, isDirectory: () => false },
        { name: 'icons', isFile: () => false, isDirectory: () => true }
      ];
      
      const mockIconFiles = [
        { name: 'home.png', isFile: () => true, isDirectory: () => false },
        { name: 'menu.png', isFile: () => true, isDirectory: () => false }
      ];

      (fs.readdir as jest.Mock)
        .mockResolvedValueOnce(mockFiles)
        .mockResolvedValueOnce(mockIconFiles);

      const config = {
        projectName: 'test-project',
        baseUrl: '/assets',
        outputDir: 'public/assets'
      };

      const result = await generator.generateFromDirectory('/test/assets', config);
      
      expect(result).toContain('[meta]');
      expect(result).toContain('name = "test-project"');
      expect(result).toContain('base_url = "/assets"');
    });
  });

  describe('generateFromExistingAssets', () => {
    it('should parse existing assets.ts file', async () => {
      const mockAssetsContent = `
        export const heroImages = {
          mainHero: {
            src: '/assets/hero/main_hero.png',
            alt: 'Main hero image'
          }
        };
      `;

      (fs.readFile as jest.Mock).mockResolvedValue(mockAssetsContent);

      const config = {
        projectName: 'test-project',
        baseUrl: '/assets',
        outputDir: 'public/assets'
      };

      const result = await generator.generateFromExistingAssets('/test/assets.ts', config);
      
      expect(result).toContain('[meta]');
      expect(result).toContain('name = "test-project"');
    });
  });
});