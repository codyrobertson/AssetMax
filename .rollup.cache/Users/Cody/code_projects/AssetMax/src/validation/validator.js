"use strict";
/**
 * Asset Manifest Validator (TypeScript version)
 * Validates TOML manifest for correctness and completeness
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestValidator = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const toml = tslib_1.__importStar(require("@iarna/toml"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class ManifestValidator {
    errors = [];
    warnings = [];
    manifest = null;
    async validate(manifestPath = 'asset-manifest.toml') {
        console.log(chalk_1.default.blue.bold('🔍 Validating Asset Manifest\n'));
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
        }
        catch (error) {
            this.addError(`Fatal validation error: ${error.message}`);
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
    async loadManifest(manifestPath) {
        if (!(await fs_1.promises.access(manifestPath).then(() => true).catch(() => false))) {
            throw new Error(`Manifest not found: ${manifestPath}`);
        }
        const content = await fs_1.promises.readFile(manifestPath, 'utf-8');
        this.manifest = toml.parse(content);
        console.log(`✅ Loaded manifest: ${manifestPath}`);
    }
    validateStructure() {
        const required = ['meta', 'categories', 'assets', 'build', 'cli'];
        for (const section of required) {
            if (!this.manifest[section]) {
                this.addError(`Missing required section: [${section}]`);
            }
        }
        // Validate meta section
        if (this.manifest.meta) {
            const metaRequired = ['name', 'version', 'description'];
            for (const field of metaRequired) {
                if (!this.manifest?.meta?.[field]) {
                    this.addError(`Missing meta.${field}`);
                }
            }
        }
    }
    validateAssets() {
        if (!this.manifest.assets)
            return;
        let totalAssets = 0;
        for (const [groupName, groupConfig] of Object.entries(this.manifest.assets)) {
            this.validateAssetGroup(groupName, groupConfig);
            // Count assets in this group
            for (const [, value] of Object.entries(groupConfig)) {
                if (typeof value === 'object' && 'prompt' in value) {
                    totalAssets++;
                }
            }
        }
        console.log(`📊 Found ${totalAssets} assets across ${Object.keys(this.manifest.assets).length} groups`);
    }
    validateAssetGroup(groupName, groupConfig) {
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
                this.validateAsset(groupName, assetName, assetConfig);
            }
        }
    }
    validateAsset(groupName, assetName, assetConfig) {
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
    validateConfiguration() {
        // Validate CLI configuration
        if (this.manifest.cli) {
            if (!this.manifest.cli.models) {
                this.addError('CLI configuration missing models section');
            }
            if (!this.manifest.cli.pricing) {
                this.addWarning('CLI configuration missing pricing section');
            }
        }
        // Validate build configuration
        if (this.manifest.build) {
            const required = ['output_dir', 'output_file'];
            for (const field of required) {
                if (!this.manifest?.build?.[field]) {
                    this.addError(`Build configuration missing: ${field}`);
                }
            }
        }
    }
    addError(message) {
        this.errors.push(message);
    }
    addWarning(message) {
        this.warnings.push(message);
    }
    countAssets() {
        if (!this.manifest?.assets)
            return 0;
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
    printResults() {
        console.log(`\n${chalk_1.default.blue.bold('📋 Validation Results')}`);
        console.log(`${chalk_1.default.blue('─'.repeat(50))}`);
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log(`${chalk_1.default.green('✅ Manifest is valid!')}`);
            return;
        }
        if (this.errors.length > 0) {
            console.log(`\n${chalk_1.default.red.bold(`❌ Errors (${this.errors.length}):`)}`);
            for (const error of this.errors) {
                console.log(`${chalk_1.default.red(`  • ${error}`)}`);
            }
        }
        if (this.warnings.length > 0) {
            console.log(`\n${chalk_1.default.yellow.bold(`⚠️  Warnings (${this.warnings.length}):`)}`);
            for (const warning of this.warnings) {
                console.log(`${chalk_1.default.yellow(`  • ${warning}`)}`);
            }
        }
        if (this.errors.length > 0) {
            console.log(`\n${chalk_1.default.red.bold('❌ Validation failed')}`);
        }
        else {
            console.log(`\n${chalk_1.default.green('✅ Validation passed with warnings')}`);
        }
    }
}
exports.ManifestValidator = ManifestValidator;
//# sourceMappingURL=validator.js.map