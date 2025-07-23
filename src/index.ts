/**
 * AssetMax - Manifest-driven asset management system
 * Main library exports
 */

// Core functionality
export { ManifestGenerator, generateManifest } from './generators/manifest-generator.js';
export { AssetCompiler } from './core/compiler.js';
export { AssetCLI } from './core/asset-cli.js';
export { ProjectScaffolder } from './scaffolding/project-scaffolder.js';

// Types
export type {
  AssetDefinition,
  ManifestConfig,
  AssetGroup,
  AssetCategory,
  GenerationModel,
  ScaffoldOptions,
} from './types/index.js';

// Validation
export { ManifestValidator } from './validation/validator.js';

// Template management
export { TemplateManager } from './templates/template-manager.js';

// CLI program (for programmatic access)
export { program } from './cli/index.js';