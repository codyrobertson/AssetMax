"use strict";
/**
 * AssetMax - Manifest-driven asset management system
 * Main library exports
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = exports.TemplateManager = exports.ManifestValidator = exports.ProjectScaffolder = exports.AssetCLI = exports.AssetCompiler = exports.generateManifest = exports.ManifestGenerator = void 0;
// Core functionality
var manifest_generator_js_1 = require("./generators/manifest-generator.js");
Object.defineProperty(exports, "ManifestGenerator", { enumerable: true, get: function () { return manifest_generator_js_1.ManifestGenerator; } });
Object.defineProperty(exports, "generateManifest", { enumerable: true, get: function () { return manifest_generator_js_1.generateManifest; } });
var compiler_js_1 = require("./core/compiler.js");
Object.defineProperty(exports, "AssetCompiler", { enumerable: true, get: function () { return compiler_js_1.AssetCompiler; } });
var asset_cli_js_1 = require("./core/asset-cli.js");
Object.defineProperty(exports, "AssetCLI", { enumerable: true, get: function () { return asset_cli_js_1.AssetCLI; } });
var project_scaffolder_js_1 = require("./scaffolding/project-scaffolder.js");
Object.defineProperty(exports, "ProjectScaffolder", { enumerable: true, get: function () { return project_scaffolder_js_1.ProjectScaffolder; } });
// Validation
var validator_js_1 = require("./validation/validator.js");
Object.defineProperty(exports, "ManifestValidator", { enumerable: true, get: function () { return validator_js_1.ManifestValidator; } });
// Template management
var template_manager_js_1 = require("./templates/template-manager.js");
Object.defineProperty(exports, "TemplateManager", { enumerable: true, get: function () { return template_manager_js_1.TemplateManager; } });
// CLI program (for programmatic access)
var index_js_1 = require("./cli/index.js");
Object.defineProperty(exports, "program", { enumerable: true, get: function () { return index_js_1.program; } });
//# sourceMappingURL=index.js.map