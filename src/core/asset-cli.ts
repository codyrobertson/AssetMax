/**
 * Asset Generation CLI
 * Reads manifest and generates missing assets using AI models
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import * as toml from '@iarna/toml';
import chalk from 'chalk';
import ora from 'ora';
import { FluxModel } from '../models/flux.js';
import { VeoModel } from '../models/veo.js';
import type { 
  AssetManifest, 
  GenerationOptions, 
  GenerationResult,
  GenerationProgress
} from '../types/index.js';

export class AssetCLI {
  private manifest: AssetManifest | null = null;
  private models: Map<string, FluxModel | VeoModel> = new Map();
  private progress: GenerationProgress = {
    total: 0,
    completed: 0,
    failed: 0,
    totalCost: 0
  };

  async run(options: GenerationOptions = {}): Promise<void> {
    const manifestFile = options.manifestFile || 'asset-manifest.toml';
    
    console.log(chalk.blue.bold('🎨 AssetMax Generator Starting...\n'));
    
    await this.loadManifest(manifestFile);
    await this.initModels();
    
    const assetsToGenerate = await this.getAssetsToGenerate(options.force);
    
    if (assetsToGenerate.length === 0) {
      console.log(chalk.green('✅ All assets already exist!'));
      return;
    }
    
    if (options.dryRun) {
      this.showDryRun(assetsToGenerate);
      return;
    }
    
    await this.generateAssets(assetsToGenerate);
    this.showSummary();
  }

  private async loadManifest(manifestPath: string): Promise<void> {
    if (!(await fs.access(manifestPath).then(() => true).catch(() => false))) {
      throw new Error(`Manifest not found: ${manifestPath}`);
    }
    
    const content = await fs.readFile(manifestPath, 'utf-8');
    this.manifest = toml.parse(content) as unknown as AssetManifest;
    
    console.log(`📋 Loaded manifest: ${this.manifest.meta.name} v${this.manifest.meta.version}`);
  }

  private async initModels(): Promise<void> {
    // Initialize AI models based on manifest configuration
    try {
      this.models.set('flux-kontext', new FluxModel());
      console.log('✅ Flux Kontext Pro model initialized');
    } catch (error) {
      console.warn('⚠️  Flux model unavailable:', (error as Error).message);
    }
    
    try {
      this.models.set('veo-3-fast', new VeoModel());
      console.log('✅ Veo 3 Fast model initialized');
    } catch (error) {
      console.warn('⚠️  Veo model unavailable:', (error as Error).message);
    }
  }

  private async getAssetsToGenerate(force = false): Promise<AssetToGenerate[]> {
    const assets: AssetToGenerate[] = [];
    
    for (const [groupName, groupConfig] of Object.entries(this.manifest!.assets)) {
      const category = groupConfig.category;
      const subcategory = groupConfig.subcategory;
      const format = groupConfig.format;
      const model = groupConfig.generation_model;
      
      for (const [assetName, assetConfig] of Object.entries(groupConfig)) {
        if (typeof assetConfig === 'object' && 'prompt' in assetConfig) {
          const fileName = `${assetName}.${format}`;
          const relativePath = subcategory 
            ? `${category}/${subcategory}/${fileName}`
            : `${category}/${fileName}`;
          const outputPath = path.join(this.manifest!.cli.output_dir, relativePath);
          
          const exists = await fs.access(outputPath).then(() => true).catch(() => false);
          
          if (!exists || force) {
            assets.push({
              name: assetName,
              groupName,
              outputPath,
              relativePath,
              prompt: assetConfig.prompt,
              model,
              aspectRatio: assetConfig.aspect_ratio || groupConfig.aspect_ratio || '1:1',
              format,
              cost: this.manifest?.cli?.pricing?.[model] || 0
            });
          }
        }
      }
    }
    
    return assets;
  }

  private showDryRun(assets: AssetToGenerate[]): void {
    console.log(chalk.cyan.bold('🔍 DRY RUN - Assets to generate:\n'));
    
    const totalCost = assets.reduce((sum, asset) => sum + asset.cost, 0);
    const modelCounts = assets.reduce((counts, asset) => {
      counts[asset.model] = (counts[asset.model] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    console.log(`📊 Summary:`);
    console.log(`   Total assets: ${assets.length}`);
    console.log(`   Estimated cost: $${totalCost.toFixed(3)}`);
    console.log(`   Models:`);
    
    for (const [model, count] of Object.entries(modelCounts)) {
      const modelCost = count * (this.manifest!.cli.pricing[model] || 0);
      console.log(`     ${model}: ${count} assets ($${modelCost.toFixed(3)})`);
    }
    
    console.log('\n📋 Assets:');
    for (const asset of assets) {
      console.log(`   ${chalk.yellow(asset.name)} → ${asset.relativePath} (${asset.model})`);
    }
  }

  private async generateAssets(assets: AssetToGenerate[]): Promise<void> {
    this.progress.total = assets.length;
    
    const spinner = ora(`Generating ${assets.length} assets...`).start();
    
    for (const asset of assets) {
      this.progress.currentAsset = asset.name;
      spinner.text = `Generating ${asset.name} (${this.progress.completed + 1}/${this.progress.total})`;
      
      try {
        const result = await this.generateSingleAsset(asset);
        
        if (result.success) {
          this.progress.completed++;
          this.progress.totalCost += result.cost;
        } else {
          this.progress.failed++;
          console.warn(`\n⚠️  Failed to generate ${asset.name}: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        this.progress.failed++;
        console.error(`\n❌ Error generating ${asset.name}:`, (error as Error).message);
      }
    }
    
    spinner.succeed(`Generated ${this.progress.completed} assets`);
  }

  private async generateSingleAsset(asset: AssetToGenerate): Promise<GenerationResult> {
    const model = this.models.get(asset.model);
    if (!model) {
      return {
        success: false,
        assetPath: asset.outputPath,
        cost: 0,
        duration: 0,
        error: `Model ${asset.model} not available`
      };
    }
    
    const startTime = Date.now();
    
    try {
      // Ensure output directory exists
      await fs.mkdir(path.dirname(asset.outputPath), { recursive: true });
      
      // Generate asset
      let outputUrl: string;
      if (asset.model.includes('veo')) {
        // Video generation
        outputUrl = await model.generate({
          prompt: asset.prompt,
          aspectRatio: asset.aspectRatio
        });
      } else {
        // Image generation
        outputUrl = await model.generate({
          prompt: asset.prompt,
          aspectRatio: asset.aspectRatio,
          outputFormat: asset.format === 'png' ? 'png' : 'jpg'
        });
      }
      
      // Download generated asset
      await this.downloadAsset(outputUrl, asset.outputPath);
      
      // Convert format if needed
      if (asset.format === 'png' && path.extname(asset.outputPath) !== '.png') {
        await this.convertToPng(asset.outputPath);
      }
      
      const duration = Date.now() - startTime;
      
      return {
        success: true,
        assetPath: asset.outputPath,
        cost: asset.cost,
        duration
      };
    } catch (error) {
      return {
        success: false,
        assetPath: asset.outputPath,
        cost: 0,
        duration: Date.now() - startTime,
        error: (error as Error).message
      };
    }
  }

  private async downloadAsset(url: string, outputPath: string): Promise<void> {
    const axios = (await import('axios')).default;
    const response = await axios.get(url, { responseType: 'stream' });
    
    const writer = require('fs').createWriteStream(outputPath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  private async convertToPng(filePath: string): Promise<void> {
    // Use sips on macOS to convert to PNG
    if (process.platform === 'darwin') {
      const { spawn } = require('child_process');
      const newPath = filePath.replace(/\.[^.]+$/, '.png');
      
      return new Promise((resolve, reject) => {
        const sips = spawn('sips', ['-s', 'format', 'png', filePath, '--out', newPath]);
        sips.on('close', (code: number) => {
          if (code === 0) {
            // Remove original file
            fs.unlink(filePath).then(resolve).catch(reject);
          } else {
            reject(new Error(`sips conversion failed with code ${code}`));
          }
        });
      });
    }
  }

  private showSummary(): void {
    console.log(chalk.green.bold('\n🎉 Generation Complete!\n'));
    
    console.log(`📊 Summary:`);
    console.log(`   ✅ Generated: ${chalk.green(this.progress.completed)} assets`);
    console.log(`   ❌ Failed: ${chalk.red(this.progress.failed)} assets`);
    console.log(`   💰 Total cost: ${chalk.yellow(`$${this.progress.totalCost.toFixed(3)}`)}`);
    
    if (this.progress.failed > 0) {
      console.log(chalk.yellow('\n⚠️  Some assets failed to generate. Check the logs above for details.'));
    }
  }
}

interface AssetToGenerate {
  name: string;
  groupName: string;
  outputPath: string;
  relativePath: string;
  prompt: string;
  model: string;
  aspectRatio: string;
  format: string;
  cost: number;
}