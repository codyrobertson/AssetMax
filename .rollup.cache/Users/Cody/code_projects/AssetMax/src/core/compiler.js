"use strict";
/**
 * TOML to TypeScript Compiler
 * Converts asset manifest to type-safe TypeScript definitions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetCompiler = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const toml = tslib_1.__importStar(require("@iarna/toml"));
class AssetCompiler {
    manifest = null;
    output = [];
    async compile(inputFile = 'asset-manifest.toml', outputFile) {
        console.log('📝 Compiling manifest to TypeScript...');
        await this.loadManifest(inputFile);
        this.generateTypeScript();
        const outputPath = outputFile || this.manifest.build.output_dir + '/' + this.manifest.build.output_file;
        await this.writeOutput(outputPath);
        console.log(`✅ Compiled to: ${outputPath}`);
    }
    async loadManifest(manifestPath) {
        if (!(await fs_1.promises.access(manifestPath).then(() => true).catch(() => false))) {
            throw new Error(`Manifest not found: ${manifestPath}`);
        }
        const content = await fs_1.promises.readFile(manifestPath, 'utf-8');
        this.manifest = toml.parse(content);
        console.log(`📋 Loaded manifest: ${this.manifest.meta.name} v${this.manifest.meta.version}`);
    }
    generateTypeScript() {
        if (!this.manifest)
            throw new Error('Manifest not loaded');
        this.output = [];
        // File header
        this.addHeader();
        // Constants
        this.addConstants();
        // Asset exports
        this.generateAssetExports();
        // Type definitions
        this.addTypeDefinitions();
        // Manifest metadata
        this.addManifestMetadata();
    }
    addHeader() {
        const timestamp = new Date().toISOString();
        this.output.push('/**', ' * Generated Asset Definitions', ' * ', ' * This file is auto-generated from asset-manifest.toml', ' * DO NOT EDIT MANUALLY - Changes will be overwritten', ' * ', ` * Generated: ${timestamp}`, ` * Manifest: ${this.manifest.meta.name} v${this.manifest.meta.version}`, ' */', '');
    }
    addConstants() {
        this.output.push('// Asset base paths', `const ASSET_BASE = '${this.manifest.meta.base_url}';`, `const PLACEHOLDER_IMAGE = '${this.manifest.build.fallback_image}';`, '');
    }
    generateAssetExports() {
        for (const [groupName, groupConfig] of Object.entries(this.manifest.assets)) {
            this.generateAssetGroup(groupName, groupConfig);
        }
    }
    generateAssetGroup(groupName, groupConfig) {
        // Group comment
        this.output.push('/**', ` * ${groupConfig.description}`, ' */', `export const ${this.toCamelCase(groupName)} = {`);
        // Individual assets
        for (const [assetName, assetConfig] of Object.entries(groupConfig)) {
            if (typeof assetConfig === 'object' && 'prompt' in assetConfig) {
                this.addAssetDefinition(assetName, assetConfig, groupConfig);
            }
        }
        this.output.push('};', '');
    }
    addAssetDefinition(assetName, assetConfig, groupConfig) {
        const category = groupConfig.category;
        const subcategory = groupConfig.subcategory;
        const format = groupConfig.format;
        // Build file path
        const fileName = `${assetName}.${format}`;
        const filePath = subcategory
            ? `\${ASSET_BASE}/${category}/${subcategory}/${fileName}`
            : `\${ASSET_BASE}/${category}/${fileName}`;
        this.output.push(`  ${this.toCamelCase(assetName)}: {`);
        this.output.push(`    src: \`${filePath}\`,`);
        this.output.push(`    fallback: PLACEHOLDER_IMAGE,`);
        this.output.push(`    alt: '${assetConfig.alt}',`);
        // Add custom fields
        for (const [key, value] of Object.entries(assetConfig)) {
            if (key !== 'prompt' && key !== 'alt') {
                this.output.push(`    ${this.toCamelCase(key)}: '${value}',`);
            }
        }
        // Add generation metadata
        this.output.push(`    _meta: {`);
        this.output.push(`      prompt: \`${assetConfig.prompt.replace(/`/g, '\\`')}\`,`);
        this.output.push(`      model: '${groupConfig.generation_model}',`);
        this.output.push(`      aspectRatio: '${assetConfig.aspect_ratio || groupConfig.aspect_ratio || '1:1'}',`);
        this.output.push(`      category: '${category}',`);
        this.output.push(`      subcategory: '${subcategory || ''}',`);
        this.output.push(`      format: '${format}'`);
        this.output.push(`    }`);
        this.output.push(`  },`);
    }
    addTypeDefinitions() {
        this.output.push('// Type Definitions', 'export interface AssetDefinition {', '  src: string;', '  fallback: string;', '  alt: string;', '  ageRange?: string;', '  style?: string;', '  category?: string;', '  duration?: number;', '  aspectRatio?: string;', '  _meta: {', '    prompt: string;', '    model: string;', '    aspectRatio: string;', '    category: string;', '    subcategory: string;', '    format: string;', '  };', '}', '');
    }
    addManifestMetadata() {
        const totalAssets = this.countAssets();
        this.output.push('// Manifest Metadata', 'export const ASSET_MANIFEST = {', `  name: '${this.manifest.meta.name}',`, `  version: '${this.manifest.meta.version}',`, `  description: '${this.manifest.meta.description}',`, `  generatedAt: '${new Date().toISOString()}',`, `  totalAssets: ${totalAssets}`, '};');
    }
    countAssets() {
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
    toCamelCase(str) {
        return str.replace(/[_-](.)/g, (_, char) => char.toUpperCase());
    }
    async writeOutput(outputPath) {
        const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
        await fs_1.promises.mkdir(outputDir, { recursive: true });
        await fs_1.promises.writeFile(outputPath, this.output.join('\n'), 'utf-8');
    }
}
exports.AssetCompiler = AssetCompiler;
//# sourceMappingURL=compiler.js.map