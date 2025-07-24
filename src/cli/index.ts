/**
 * AssetMax CLI
 * Project scaffolding and asset management CLI
 */

import { Command } from 'commander';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as toml from '@iarna/toml';
import { SingleBar, Presets } from 'cli-progress';
import { generateManifest } from '../generators/manifest-generator.js';
import { AssetCompiler } from '../core/compiler.js';
import { AssetCLI } from '../core/asset-cli.js';
import { ProjectScaffolder } from '../scaffolding/project-scaffolder.js';
import { ManifestValidator } from '../validation/validator.js';
import { getAllModels, getModelConfig } from '../models/model-registry.js';
import { TemplateManager } from '../templates/template-manager.js';

// Type definitions
interface AssetToGenerate {
  name: string;
  groupName: string;
  category: string;
  subcategory?: string;
  format: string;
  aspectRatio: string;
  outputPath: string;
  prompt?: string;
}

interface PlaceholderOptions {
  width: number;
  height: number;
  assetName: string;
  category: string;
  subcategory?: string;
  style: string;
  prompt?: string;
}

interface PlaceholderStyle {
  bgColor: string;
  borderColor: string;
  textColor: string;
  showBorder: boolean;
}

interface VerificationResults {
  issues: string[];
  warnings: string[];
  fixed: number;
}

const program = new Command();

program
  .name('assetmax')
  .description('Manifest-driven asset management for modern web projects')
  .version('1.0.0');

// Initialize new project
program
  .command('init')
  .description('Initialize AssetMax in a new or existing project')
  .option('-n, --name <name>', 'Project name')
  .option('-t, --template <template>', 'Project template (react, nextjs, vue)', 'react')
  .option('--typescript', 'Use TypeScript configuration', true)
  .option('--base-url <url>', 'Base URL for assets', '/assets')
  .action(async (options) => {
    try {
      const scaffolder = new ProjectScaffolder();
      await scaffolder.initProject({
        projectName: options.name || path.basename(process.cwd()),
        template: options.template,
        typescript: options.typescript,
        baseUrl: options.baseUrl
      });
      console.log('🎉 AssetMax initialized successfully!');
    } catch (error) {
      console.error('❌ Initialization failed:', (error as Error).message);
      process.exit(1);
    }
  });

// Generate manifest from existing assets
program
  .command('generate-manifest')
  .description('Auto-generate manifest from existing assets')
  .option('-d, --assets-dir <dir>', 'Assets directory to scan')
  .option('-f, --assets-file <file>', 'Existing assets.ts file to parse')
  .option('-n, --name <name>', 'Project name', path.basename(process.cwd()))
  .option('-o, --output <file>', 'Output manifest file', 'asset-manifest.toml')
  .option('--base-url <url>', 'Base URL for assets', '/assets')
  .action(async (options) => {
    try {
      await generateManifest({
        assetsDir: options.assetsDir,
        assetsFile: options.assetsFile,
        projectName: options.name,
        baseUrl: options.baseUrl,
        outputFile: options.output
      });
    } catch (error) {
      console.error('❌ Manifest generation failed:', (error as Error).message);
      process.exit(1);
    }
  });

// Compile manifest to TypeScript
program
  .command('compile')
  .description('Compile TOML manifest to TypeScript')
  .option('-i, --input <file>', 'Input manifest file', 'asset-manifest.toml')
  .option('-o, --output <file>', 'Output TypeScript file')
  .action(async (options) => {
    try {
      const compiler = new AssetCompiler();
      await compiler.compile(options.input, options.output);
      console.log('✅ Compilation complete');
    } catch (error) {
      console.error('❌ Compilation failed:', (error as Error).message);
      process.exit(1);
    }
  });

// Generate missing assets
program
  .command('generate')
  .description('Generate missing assets from manifest')
  .option('-i, --input <file>', 'Input manifest file', 'asset-manifest.toml')
  .option('--dry-run', 'Show what would be generated without actually generating')
  .option('--force', 'Regenerate existing assets')
  .action(async (options) => {
    try {
      const cli = new AssetCLI();
      await cli.run({
        manifestFile: options.input,
        dryRun: options.dryRun,
        force: options.force
      });
    } catch (error) {
      console.error('❌ Asset generation failed:', (error as Error).message);
      process.exit(1);
    }
  });

// Build pipeline
program
  .command('build')
  .description('Run complete build pipeline: compile → generate → verify')
  .option('--skip-generation', 'Skip asset generation step')
  .option('--force', 'Force regeneration of existing assets')
  .action(async (options) => {
    try {
      console.log('🏗️  Starting AssetMax build pipeline...\n');
      
      // Step 1: Compile
      console.log('📝 Compiling manifest...');
      const compiler = new AssetCompiler();
      await compiler.compile();
      
      // Step 2: Generate (optional)
      if (!options.skipGeneration) {
        console.log('🎨 Generating assets...');
        const cli = new AssetCLI();
        await cli.run({ force: options.force });
      }
      
      // Step 3: Verify
      console.log('✅ Verifying build...');
      await verifyBuild();
      
      console.log('\n🎉 Build pipeline complete!');
    } catch (error) {
      console.error('❌ Build failed:', (error as Error).message);
      process.exit(1);
    }
  });

// Validate manifest
program
  .command('validate')
  .description('Validate manifest structure and completeness')
  .option('-i, --input <file>', 'Input manifest file', 'asset-manifest.toml')
  .action(async (options) => {
    try {
      const validator = new ManifestValidator();
      await validator.validate(options.input);
    } catch (error) {
      console.error('❌ Validation failed:', (error as Error).message);
      process.exit(1);
    }
  });

// List available models
program
  .command('list')
  .description('List all available AI models')
  .action(async () => {
    try {
      const allModels = getAllModels();
      
      console.log('🤖 Available AI Models\n');
      
      // Group by category for better display
      const categories = {
        fastest: allModels.filter(m => m.costPerImage <= 0.01),
        economical: allModels.filter(m => m.costPerImage > 0.01 && m.costPerImage <= 0.03),
        premium: allModels.filter(m => m.costPerImage > 0.03 && m.costPerImage <= 0.05),
        specialized: allModels.filter(m => m.costPerImage > 0.05)
      };
      
      for (const [category, models] of Object.entries(categories)) {
        if (models.length === 0) continue;
        
        console.log(`📋 ${category.charAt(0).toUpperCase() + category.slice(1)} Models:`);
        for (const model of models) {
          console.log(`   ${model.name.padEnd(25)} $${model.costPerImage.toFixed(3).padStart(5)} - ${model.description}`);
        }
        console.log('');
      }
      
      console.log('💡 Use "assetmax model help <model-name>" for detailed information');
    } catch (error) {
      console.error('❌ Failed to list models:', (error as Error).message);
      process.exit(1);
    }
  });

// Model management commands
program
  .command('model')
  .description('AI model information and management')
  .addCommand(
    new Command('list')
      .description('List all available models')
      .action(async () => {
        // Redirect to main list command
        await program.parseAsync(['node', 'assetmax', 'list']);
      })
  )
  .addCommand(
    new Command('help')
      .description('Get detailed information about a model')
      .argument('<model>', 'Model name (e.g., flux-schnell, recraft-v3)')
      .action(async (modelName) => {
        try {
          const model = getModelConfig(modelName);
          
          console.log(`🤖 ${model.name}\n`);
          console.log(`Provider: ${model.provider}`);
          console.log(`Description: ${model.description}`);
          console.log(`Cost per image: $${model.costPerImage}`);
          console.log(`Replicate model: ${model.replicateModel}\n`);
          
          console.log('📐 Supported aspect ratios:');
          console.log(`   ${model.supportedAspectRatios.join(', ')}\n`);
          
          console.log('📄 Supported formats:');
          console.log(`   ${model.supportedFormats.join(', ')}\n`);
          
          console.log('⚡ Special features:');
          model.specialFeatures.forEach(feature => console.log(`   • ${feature}`));
          console.log('');
          
          console.log('🎯 Best use cases:');
          model.useCase.forEach(useCase => console.log(`   • ${useCase}`));
          console.log('');
          
          console.log('⚙️ Default parameters:');
          for (const [key, value] of Object.entries(model.defaultParams)) {
            console.log(`   ${key}: ${JSON.stringify(value)}`);
          }
        } catch (error) {
          console.error('❌ Model not found:', (error as Error).message);
          console.log('\n💡 Use "assetmax list" to see available models');
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('cost')
      .description('Calculate cost for generating assets')
      .argument('<model>', 'Model name')
      .argument('<count>', 'Number of assets')
      .action(async (modelName, count) => {
        try {
          const model = getModelConfig(modelName);
          const assetCount = parseInt(count);
          
          if (isNaN(assetCount) || assetCount <= 0) {
            throw new Error('Asset count must be a positive number');
          }
          
          const totalCost = model.costPerImage * assetCount;
          
          console.log(`💰 Cost Calculation\n`);
          console.log(`Model: ${model.name}`);
          console.log(`Cost per asset: $${model.costPerImage}`);
          console.log(`Number of assets: ${assetCount}`);
          console.log(`Total cost: $${totalCost.toFixed(3)}`);
          
          // Show cost comparison
          if (assetCount > 1) {
            console.log(`\nAverage cost per asset: $${(totalCost / assetCount).toFixed(3)}`);
          }
        } catch (error) {
          console.error('❌ Cost calculation failed:', (error as Error).message);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('params')
      .description('Show supported parameters for a model')
      .argument('<model>', 'Model name')
      .action(async (modelName) => {
        try {
          const model = getModelConfig(modelName);
          
          console.log(`⚙️ ${model.name} Parameters\n`);
          
          console.log('📐 Aspect ratios:');
          model.supportedAspectRatios.forEach(ratio => console.log(`   ${ratio}`));
          console.log('');
          
          console.log('📄 Output formats:');
          model.supportedFormats.forEach(format => console.log(`   ${format}`));
          console.log('');
          
          console.log('🔧 Default parameters:');
          for (const [key, value] of Object.entries(model.defaultParams)) {
            console.log(`   ${key}: ${JSON.stringify(value)}`);
          }
          console.log('');
          
          // Provider-specific parameters
          console.log('📋 Provider-specific options:');
          switch (model.provider) {
            case 'Black Forest Labs':
              console.log('   • guidance: Control prompt adherence (1-10)');
              console.log('   • steps: Number of inference steps');
              console.log('   • width/height: Custom dimensions (FLUX Pro only)');
              break;
            case 'Google':
              console.log('   • safety_filter_level: Content filtering level');
              break;
            case 'ByteDance':
              console.log('   • size: Image size preset (small, regular, big)');
              console.log('   • guidance_scale: Prompt adherence control');
              break;
            case 'Ideogram AI':
              console.log('   • style: Visual style (Auto, Realistic, Design)');
              console.log('   • magic_prompt: Automatic prompt enhancement');
              break;
            case 'Recraft AI':
              console.log('   • style: Art style selection');
              console.log('   • size: Custom dimensions as WxH');
              break;
            case 'Stability AI':
              console.log('   • cfg: Classifier-free guidance scale');
              console.log('   • steps: Diffusion steps');
              console.log('   • prompt_strength: Prompt influence');
              break;
          }
        } catch (error) {
          console.error('❌ Failed to show parameters:', (error as Error).message);
          process.exit(1);
        }
      })
  );

// Add template commands
program
  .command('template')
  .description('Manage manifest templates')
  .addCommand(
    new Command('list')
      .description('List available templates')
      .action(async () => {
        const manager = new TemplateManager();
        await manager.listTemplates();
      })
  )
  .addCommand(
    new Command('create')
      .description('Create manifest from template')
      .argument('<template>', 'Template name')
      .option('-n, --name <name>', 'Project name')
      .action(async (template, options) => {
        try {
          const manager = new TemplateManager();
          await manager.createFromTemplate(template, {
            projectName: options.name || path.basename(process.cwd())
          });
        } catch (error) {
          console.error('❌ Template creation failed:', (error as Error).message);
          process.exit(1);
        }
      })
  );

// Verify assets and configuration
program
  .command('verify')
  .description('Check for errors in assets and configuration')
  .option('-i, --input <file>', 'Input manifest file', 'asset-manifest.toml')
  .option('--fix', 'Attempt to fix common issues automatically')
  .action(async (options) => {
    try {
      await verifyAssets(options.input, options.fix);
    } catch (error) {
      console.error('❌ Verification failed:', (error as Error).message);
      process.exit(1);
    }
  });

// Generate placeholder images for manifest assets
program
  .command('placeholder')
  .description('Generate placeholder images for assets defined in manifest')
  .option('-i, --input <file>', 'Input manifest file', 'asset-manifest.toml')
  .option('--all', 'Generate placeholders for all assets')
  .option('--group <name>', 'Generate placeholders for specific asset group')
  .option('--asset <name>', 'Generate placeholder for specific asset')
  .option('--width <pixels>', 'Override width (maintains aspect ratio)', '')
  .option('--height <pixels>', 'Override height (maintains aspect ratio)', '')
  .option('--style <style>', 'Placeholder style (wireframe, solid, branded)', 'wireframe')
  .option('--dry-run', 'Show what would be generated without creating files')
  .action(async (options) => {
    try {
      await generateManifestPlaceholders(options);
    } catch (error) {
      console.error('❌ Placeholder generation failed:', (error as Error).message);
      process.exit(1);
    }
  });

async function verifyAssets(manifestPath: string, fix: boolean = false): Promise<void> {
  console.log('🔍 Verifying assets and configuration...\n');
  
  const results = createVerificationResults();

  // Check if manifest exists
  try {
    await fs.access(manifestPath);
  } catch {
    results.issues.push(`Manifest file not found: ${manifestPath}`);
    reportVerificationResults(results);
    throw new Error('Critical verification errors found');
  }

  // Load and validate manifest
  try {
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest = toml.parse(content) as any;
    
    console.log(`📋 Loaded manifest: ${manifest.meta?.name || 'Unknown'} v${manifest.meta?.version || '0.0.0'}`);

    // Check meta section
    if (!manifest.meta) {
      results.issues.push('Missing [meta] section in manifest');
    } else {
      if (!manifest.meta.name) results.warnings.push('Missing meta.name');
      if (!manifest.meta.version) results.warnings.push('Missing meta.version');
    }

    // Check CLI configuration
    if (!manifest.cli) {
      results.issues.push('Missing [cli] section in manifest');
    } else {
      if (!manifest.cli.output_dir) {
        results.issues.push('Missing cli.output_dir in manifest');
      } else {
        // Check if output directory exists
        const outputDir = manifest.cli.output_dir;
        try {
          await fs.access(outputDir);
        } catch {
          if (fix) {
            await fs.mkdir(outputDir, { recursive: true });
            console.log(`✅ Created missing output directory: ${outputDir}`);
            results.fixed++;
          } else {
            results.issues.push(`Output directory does not exist: ${outputDir}`);
          }
        }
      }
    }

    // Check assets section
    if (!manifest.assets || Object.keys(manifest.assets).length === 0) {
      results.warnings.push('No assets defined in manifest');
    } else {
      for (const [groupName, groupConfig] of Object.entries(manifest.assets)) {
        const group = groupConfig as any;
        
        // Check required group fields
        if (!group.category) results.warnings.push(`Group ${groupName}: missing category`);
        if (!group.format) results.warnings.push(`Group ${groupName}: missing format`);
        if (!group.generation_model) {
          results.warnings.push(`Group ${groupName}: missing generation_model`);
        } else {
          // Validate model exists
          try {
            getModelConfig(group.generation_model);
          } catch {
            results.issues.push(`Group ${groupName}: invalid generation_model "${group.generation_model}"`);
          }
        }

        // Check individual assets
        for (const [assetName, assetConfig] of Object.entries(group)) {
          if (typeof assetConfig === 'object' && assetConfig && 'prompt' in assetConfig) {
            const asset = assetConfig as any;
            if (!asset.prompt || asset.prompt.trim() === '') {
              results.warnings.push(`Asset ${groupName}.${assetName}: empty or missing prompt`);
            }
            
            // Check if asset file exists
            const fileName = `${assetName}.${group.format}`;
            const relativePath = group.subcategory 
              ? `${group.category}/${group.subcategory}/${fileName}`
              : `${group.category}/${fileName}`;
            const fullPath = path.join(manifest.cli.output_dir, relativePath);
            
            try {
              await fs.access(fullPath);
            } catch {
              results.warnings.push(`Asset file missing: ${relativePath}`);
            }
          }
        }
      }
    }

    reportVerificationResults(results);

    if (results.issues.length === 0) {
      console.log('\n🎉 Verification passed! No critical issues found.');
      if (results.warnings.length > 0) {
        console.log('💡 Consider addressing warnings to improve your asset configuration.');
      }
    } else {
      throw new Error(`${results.issues.length} critical issues found`);
    }

  } catch (error) {
    if (error instanceof Error && error.message.includes('critical issues')) {
      throw error;
    }
    results.issues.push(`Failed to parse manifest: ${error instanceof Error ? error.message : 'Unknown error'}`);
    reportVerificationResults(results);
    throw new Error('Manifest parsing failed');
  }
}

async function generateManifestPlaceholders(options: {
  input: string;
  all?: boolean;
  group?: string;
  asset?: string;
  width?: string;
  height?: string;
  style: string;
  dryRun?: boolean;
}): Promise<void> {
  console.log('🎨 Generating manifest-based placeholders...\n');

  // Validate that at least one filter is specified
  if (!options.all && !options.group && !options.asset) {
    throw new Error('Must specify --all, --group <name>, or --asset <name>');
  }

  // Load manifest
  if (!(await fs.access(options.input).then(() => true).catch(() => false))) {
    throw new Error(`Manifest file not found: ${options.input}`);
  }

  const content = await fs.readFile(options.input, 'utf-8');
  const manifest = toml.parse(content) as any;

  if (!manifest.assets || Object.keys(manifest.assets).length === 0) {
    throw new Error('No assets defined in manifest');
  }

  console.log(`📋 Loaded manifest: ${manifest.meta?.name || 'Unknown'} v${manifest.meta?.version || '0.0.0'}`);

  // Collect assets to generate
  const assetsToGenerate: AssetToGenerate[] = [];

  for (const [groupName, groupConfig] of Object.entries(manifest.assets)) {
    const group = groupConfig as any;

    // Apply filters
    if (options.group && groupName !== options.group) continue;

    for (const [assetName, assetConfig] of Object.entries(group)) {
      if (typeof assetConfig === 'object' && assetConfig && 'prompt' in assetConfig) {
        // Apply asset filter
        if (options.asset && assetName !== options.asset) continue;

        const asset = assetConfig as any;
        const fileName = `${assetName}.${group.format}`;
        const relativePath = group.subcategory 
          ? `${group.category}/${group.subcategory}/${fileName}`
          : `${group.category}/${fileName}`;
        const outputPath = path.join(manifest.cli.output_dir, relativePath);

        assetsToGenerate.push({
          name: assetName,
          groupName,
          category: group.category,
          subcategory: group.subcategory,
          format: group.format,
          aspectRatio: asset.aspect_ratio || group.aspect_ratio || '1:1',
          outputPath,
          prompt: asset.prompt
        });
      }
    }
  }

  if (assetsToGenerate.length === 0) {
    console.log('ℹ️  No assets found matching the specified criteria');
    return;
  }

  console.log(`🎯 Found ${assetsToGenerate.length} assets to generate placeholders for:\n`);

  // Show what will be generated
  for (const asset of assetsToGenerate) {
    const dimensions = aspectRatioToPixels(asset.aspectRatio, options.width, options.height);
    console.log(`📄 ${asset.name}`);
    console.log(`   Group: ${asset.groupName}`);
    console.log(`   Path: ${path.relative(process.cwd(), asset.outputPath)}`);
    console.log(`   Dimensions: ${dimensions.width}x${dimensions.height} (${asset.aspectRatio})`);
    console.log(`   Style: ${options.style}`);
    console.log('');
  }

  if (options.dryRun) {
    console.log('🔍 Dry run complete - no files created');
    return;
  }

  // Generate placeholders with progress indication and concurrency
  console.log('⚡ Generating placeholders...\n');
  
  const progressBar = new SingleBar({
    format: 'Progress [{bar}] {percentage}% | {value}/{total} | {asset}',
    barCompleteChar: '█',
    barIncompleteChar: '░'
  }, Presets.shades_classic);
  
  progressBar.start(assetsToGenerate.length, 0, { asset: 'Starting...' });
  
  // Process assets in concurrent batches for better performance
  const CONCURRENCY_LIMIT = 10;
  const results: string[] = [];
  
  for (let i = 0; i < assetsToGenerate.length; i += CONCURRENCY_LIMIT) {
    const batch = assetsToGenerate.slice(i, i + CONCURRENCY_LIMIT);
    
    const batchPromises = batch.map(async (asset) => {
      const dimensions = aspectRatioToPixels(asset.aspectRatio, options.width, options.height);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(asset.outputPath), { recursive: true });

      // Create intelligent placeholder content
      const placeholderOpts: PlaceholderOptions = {
        ...dimensions,
        assetName: asset.name,
        category: asset.category,
        style: options.style,
      };
      
      if (asset.subcategory !== undefined) {
        placeholderOpts.subcategory = asset.subcategory;
      }
      
      if (asset.prompt !== undefined) {
        placeholderOpts.prompt = asset.prompt;
      }
      
      const svg = createPlaceholderSVG(placeholderOpts);

      // Save as SVG (extensionless for now, can be converted later)
      const svgPath = asset.outputPath.replace(/\.[^.]+$/, '.svg');
      await fs.writeFile(svgPath, svg);
      
      return `${asset.name} → ${path.relative(process.cwd(), svgPath)}`;
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Update progress bar
    const completed = Math.min(i + CONCURRENCY_LIMIT, assetsToGenerate.length);
    const currentAsset = completed < assetsToGenerate.length 
      ? assetsToGenerate[completed]?.name || 'Processing...' 
      : 'Complete';
    progressBar.update(completed, { asset: currentAsset });
  }
  
  progressBar.stop();
  
  // Show results
  console.log('\n✅ Generated placeholders:');
  results.forEach(result => console.log(`  ${result}`));

  console.log(`\n🎉 Generated ${assetsToGenerate.length} placeholder assets`);
  console.log('💡 Placeholders saved as SVG files - use online converters for PNG/JPG if needed');
  console.log(`⚡ Performance: Processed ${assetsToGenerate.length} assets with ${CONCURRENCY_LIMIT} concurrent operations`);
}

function isValidNumber(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim() !== '' && !isNaN(parseInt(value));
}

function parseAspectRatio(aspectRatio: string): [number, number] {
  // Handle direct pixel specifications
  if (aspectRatio.includes('x') && aspectRatio.includes('px')) {
    const match = aspectRatio.match(/(\d+)px?\s*x\s*(\d+)px?/i);
    if (match && match[1] && match[2]) {
      return [parseInt(match[1]), parseInt(match[2])];
    }
  }

  // Parse aspect ratio (e.g., "16:9", "1:1", "4:3")
  const parts = aspectRatio.split(':').map(p => parseFloat(p.trim()));
  if (parts.length === 2 && parts.every(p => !isNaN(p) && p > 0)) {
    const width = parts[0];
    const height = parts[1];
    if (width !== undefined && height !== undefined) {
      return [width, height];
    }
  }

  // Fallback to square
  console.warn(`⚠️  Invalid aspect ratio "${aspectRatio}", using 1:1`);
  return [1, 1];
}

function aspectRatioToPixels(aspectRatio: string, widthOverride?: string, heightOverride?: string): { width: number; height: number } {
  const [ratioWidth, ratioHeight] = parseAspectRatio(aspectRatio);
  
  // Direct pixel specification
  if (aspectRatio.includes('px')) {
    return { width: ratioWidth, height: ratioHeight };
  }
  
  const ratio = ratioWidth / ratioHeight;

  // Apply overrides while maintaining aspect ratio
  if (isValidNumber(widthOverride)) {
    const width = parseInt(widthOverride);
    return { width, height: Math.round(width / ratio) };
  }

  if (isValidNumber(heightOverride)) {
    const height = parseInt(heightOverride);
    return { width: Math.round(height * ratio), height };
  }

  // Smart defaults based on aspect ratio
  if (ratio === 1) return { width: 400, height: 400 }; // Square
  if (Math.abs(ratio - 16/9) < 0.01) return { width: 800, height: 450 }; // Widescreen
  if (Math.abs(ratio - 4/3) < 0.01) return { width: 640, height: 480 }; // Classic
  if (Math.abs(ratio - 3/2) < 0.01) return { width: 600, height: 400 }; // Photo
  if (ratio > 2) return { width: 800, height: Math.round(800 / ratio) }; // Wide banners
  if (ratio < 0.5) return { width: Math.round(400 * ratio), height: 400 }; // Tall banners
  
  // Default proportional sizing
  const baseSize = 500;
  return { 
    width: Math.round(baseSize * Math.sqrt(ratio)), 
    height: Math.round(baseSize / Math.sqrt(ratio))
  };
}

function getPlaceholderStyle(style: string): PlaceholderStyle {
  const styles: Record<string, PlaceholderStyle> = {
    wireframe: {
      bgColor: '#f8f9fa',
      borderColor: '#dee2e6',
      textColor: '#6c757d',
      showBorder: true
    },
    solid: {
      bgColor: '#e9ecef',
      borderColor: '#adb5bd',
      textColor: '#495057',
      showBorder: false
    },
    branded: {
      bgColor: '#007bff',
      borderColor: '#0056b3',
      textColor: '#ffffff',
      showBorder: false
    }
  };

  return styles[style] ?? {
    bgColor: '#f8f9fa',
    borderColor: '#dee2e6', 
    textColor: '#6c757d',
    showBorder: true
  };
}

function createPlaceholderSVG(options: PlaceholderOptions): string {
  const { width, height, assetName, category, subcategory, style, prompt } = options;
  const currentStyle = getPlaceholderStyle(style);

  // Calculate responsive font sizes
  const titleSize = Math.max(12, Math.min(width, height) / 12);
  const subtitleSize = Math.max(10, titleSize * 0.7);
  const metaSize = Math.max(8, titleSize * 0.5);

  // Build category path
  const categoryPath = subcategory ? `${category}/${subcategory}` : category;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${currentStyle.bgColor}" ${currentStyle.showBorder ? `stroke="${currentStyle.borderColor}" stroke-width="2" stroke-dasharray="5,5"` : ''}/>
  
  <!-- Main title -->
  <text x="50%" y="${height * 0.35}" font-family="Arial, sans-serif" font-size="${titleSize}" font-weight="bold"
        fill="${currentStyle.textColor}" text-anchor="middle" dominant-baseline="middle">${assetName}</text>
  
  <!-- Category path -->
  <text x="50%" y="${height * 0.5}" font-family="Arial, sans-serif" font-size="${subtitleSize}"
        fill="${currentStyle.textColor}" text-anchor="middle" dominant-baseline="middle">${categoryPath}</text>
  
  <!-- Dimensions -->
  <text x="50%" y="${height * 0.65}" font-family="Arial, sans-serif" font-size="${metaSize}"
        fill="${currentStyle.textColor}" text-anchor="middle" dominant-baseline="middle">${width}×${height}</text>
  
  <!-- Prompt preview (if available) -->
  ${prompt ? `<text x="50%" y="${height * 0.8}" font-family="Arial, sans-serif" font-size="${metaSize}" 
        fill="${currentStyle.textColor}" text-anchor="middle" dominant-baseline="middle" opacity="0.7">"${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}"</text>` : ''}
  
  <!-- Corner identifier -->
  <text x="${width - 10}" y="${height - 10}" font-family="Arial, sans-serif" font-size="${metaSize}" 
        fill="${currentStyle.textColor}" text-anchor="end" dominant-baseline="text-bottom" opacity="0.5">PLACEHOLDER</text>
</svg>`;
}

// Helper functions
function createVerificationResults(): VerificationResults {
  return { issues: [], warnings: [], fixed: 0 };
}

function reportVerificationResults(results: VerificationResults): void {
  console.log('\n📊 Verification Results:');
  console.log(`✅ Issues fixed: ${results.fixed}`);
  console.log(`❌ Critical issues: ${results.issues.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);

  if (results.issues.length > 0) {
    console.log('\n🚨 Critical Issues:');
    results.issues.forEach(issue => console.log(`  • ${issue}`));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(warning => console.log(`  • ${warning}`));
  }
}

async function verifyBuild(): Promise<void> {
  const requiredFiles = ['asset-manifest.toml'];
  
  for (const file of requiredFiles) {
    if (!(await fs.access(file).then(() => true).catch(() => false))) {
      throw new Error(`Required file missing: ${file}`);
    }
  }
  
  console.log('✅ All required files present');
}

// Error handling
program.configureHelp({
  sortSubcommands: true,
  showGlobalOptions: true
});

program.parse();

export { program };