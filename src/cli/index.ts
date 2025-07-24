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