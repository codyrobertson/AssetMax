/**
 * AssetMax CLI
 * Project scaffolding and asset management CLI
 */

import { Command } from 'commander';
import { promises as fs } from 'fs';
import * as path from 'path';
import { generateManifest } from '../generators/manifest-generator.js';
import { AssetCompiler } from '../core/compiler.js';
import { AssetCLI } from '../core/asset-cli.js';
import { ProjectScaffolder } from '../scaffolding/project-scaffolder.js';

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
      const { ManifestValidator } = await import('../validation/validator.js');
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
      const { getAllModels } = await import('../models/model-registry.js');
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
          const { getModelConfig } = await import('../models/model-registry.js');
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
          const { getModelConfig } = await import('../models/model-registry.js');
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
          const { getModelConfig } = await import('../models/model-registry.js');
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
        const { TemplateManager } = await import('../templates/template-manager.js');
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
          const { TemplateManager } = await import('../templates/template-manager.js');
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