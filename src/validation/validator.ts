/**
 * Asset Manifest Validator (TypeScript version)
 * Validates TOML manifest for correctness and completeness
 */

import { promises as fs } from 'fs';
import * as toml from '@iarna/toml';
import chalk from 'chalk';
import type { AssetManifest, ValidationResult, AssetConfig, AssetGroup } from '../types/index.js';

export class ManifestValidator {
  private errors: string[] = [];
  private warnings: string[] = [];
  private manifest: AssetManifest | null = null;

  async validate(manifestPath = 'asset-manifest.toml'): Promise<ValidationResult> {
    console.log(chalk.blue.bold('🔍 Validating Asset Manifest\n'));

    this.errors = [];
    this.warnings = [];

    try {
      await this.loadManifest(manifestPath);
      this.validateStructure();
      this.validateAssets();
      this.validateConfiguration();
      this.printResults();
      
      return {
        valid: this.errors.length === 0,
        errors: this.errors,
        warnings: this.warnings,
        assetCount: this.countAssets(),
        groupCount: Object.keys(this.manifest?.assets || {}).length
      };
    } catch (error) {
      this.addError(`Fatal validation error: ${(error as Error).message}`);
      this.printResults();
      
      return {
        valid: false,
        errors: this.errors,
        warnings: this.warnings,
        assetCount: 0,
        groupCount: 0
      };
    }
  }

  private async loadManifest(manifestPath: string): Promise<void> {
    if (!(await fs.access(manifestPath).then(() => true).catch(() => false))) {
      throw new Error(`Manifest not found: ${manifestPath}`);
    }
    
    const content = await fs.readFile(manifestPath, 'utf-8');
    this.manifest = toml.parse(content) as unknown as AssetManifest;
    
    console.log(`✅ Loaded manifest: ${manifestPath}`);
  }

  private validateStructure(): void {
    const required = ['meta', 'categories', 'assets', 'build', 'cli'];
    
    for (const section of required) {
      if (!this.manifest![section as keyof AssetManifest]) {
        this.addError(`Missing required section: [${section}]`);
      }
    }

    // Validate meta section
    if (this.manifest!.meta) {
      const metaRequired = ['name', 'version', 'description'];
      for (const field of metaRequired) {
        if (!this.manifest?.meta?.[field as keyof typeof this.manifest.meta]) {
          this.addError(`Missing meta.${field}`);
        }
      }
    }
  }

  private validateAssets(): void {
    if (!this.manifest!.assets) return;

    let totalAssets = 0;
    
    for (const [groupName, groupConfig] of Object.entries(this.manifest!.assets)) {
      this.validateAssetGroup(groupName, groupConfig);
      
      // Count assets in this group
      for (const [, value] of Object.entries(groupConfig)) {
        if (typeof value === 'object' && 'prompt' in value) {
          totalAssets++;
        }
      }
    }

    console.log(`📊 Found ${totalAssets} assets across ${Object.keys(this.manifest!.assets).length} groups`);
  }

  private validateAssetGroup(groupName: string, groupConfig: AssetGroup): void {
    const required = ['description', 'category', 'format', 'generation_model'];
    
    for (const field of required) {
      if (!groupConfig[field]) {
        this.addError(`Asset group '${groupName}' missing required field: ${field}`);
      }
    }

    // Validate individual assets
    for (const [assetName, assetConfig] of Object.entries(groupConfig)) {
      if (typeof assetConfig === 'object' && assetConfig && 
          !['description', 'category', 'format', 'generation_model', 'subcategory'].includes(assetName)) {
        this.validateAsset(groupName, assetName, assetConfig as AssetConfig);
      }
    }
  }

  private validateAsset(groupName: string, assetName: string, assetConfig: AssetConfig): void {
    const required = ['prompt', 'alt'];
    
    for (const field of required) {
      if (!assetConfig[field]) {
        this.addError(`Asset '${groupName}.${assetName}' missing required field: ${field}`);
      }
    }

    // Validate prompt length
    if (assetConfig.prompt && assetConfig.prompt.length < 10) {
      this.addWarning(`Asset '${groupName}.${assetName}' has very short prompt`);
    }

    if (assetConfig.prompt && assetConfig.prompt.length > 500) {
      this.addWarning(`Asset '${groupName}.${assetName}' has very long prompt (>500 chars)`);
    }
  }

  private validateConfiguration(): void {
    // Validate CLI configuration
    if (this.manifest!.cli) {
      if (!this.manifest!.cli.models) {
        this.addError('CLI configuration missing models section');
      }

      if (!this.manifest!.cli.pricing) {
        this.addWarning('CLI configuration missing pricing section');
      }
    }

    // Validate build configuration
    if (this.manifest!.build) {
      const required = ['output_dir', 'output_file'];
      for (const field of required) {
        if (!this.manifest?.build?.[field as keyof typeof this.manifest.build]) {
          this.addError(`Build configuration missing: ${field}`);
        }
      }
    }
  }

  private addError(message: string): void {
    this.errors.push(message);
  }

  private addWarning(message: string): void {
    this.warnings.push(message);
  }

  private countAssets(): number {
    if (!this.manifest?.assets) return 0;
    
    let count = 0;
    for (const groupConfig of Object.values(this.manifest.assets)) {
      for (const [, value] of Object.entries(groupConfig)) {
        if (typeof value === 'object' && 'prompt' in value) {
          count++;
        }
      }
    }
    return count;
  }

  private printResults(): void {
    console.log(`\n${chalk.blue.bold('📋 Validation Results')}`);
    console.log(`${chalk.blue('─'.repeat(50))}`);

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(`${chalk.green('✅ Manifest is valid!')}`);
      return;
    }

    if (this.errors.length > 0) {
      console.log(`\n${chalk.red.bold(`❌ Errors (${this.errors.length}):`)}`)
      for (const error of this.errors) {
        console.log(`${chalk.red(`  • ${error}`)}`);
      }
    }

    if (this.warnings.length > 0) {
      console.log(`\n${chalk.yellow.bold(`⚠️  Warnings (${this.warnings.length}):`)}`)
      for (const warning of this.warnings) {
        console.log(`${chalk.yellow(`  • ${warning}`)}`);
      }
    }

    if (this.errors.length > 0) {
      console.log(`\n${chalk.red.bold('❌ Validation failed')}`);
    } else {
      console.log(`\n${chalk.green('✅ Validation passed with warnings')}`);
    }
  }
}