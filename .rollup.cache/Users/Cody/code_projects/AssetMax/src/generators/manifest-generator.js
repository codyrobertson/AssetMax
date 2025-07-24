#!/usr/bin/env node
"use strict";
/**
 * TOML Manifest Auto-Generator
 * Scans existing assets and generates manifest.toml automatically
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateManifest = exports.ManifestGenerator = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path = tslib_1.__importStar(require("path"));
const toml = tslib_1.__importStar(require("@iarna/toml"));
class ManifestGenerator {
    supportedFormats = new Set([
        '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg',
        '.mp4', '.webm', '.mov'
    ]);
    categoryMapping = {
        'icons': 'icons',
        'avatars': 'illustrations',
        'photos': 'photos',
        'videos': 'videos',
        'illustrations': 'illustrations',
        'hero': 'photos',
        'onboarding': 'illustrations'
    };
    async generateFromDirectory(assetsDir, config) {
        console.log(`🔍 Scanning assets in: ${assetsDir}`);
        const assets = await this.scanAssets(assetsDir);
        const groupedAssets = this.groupAssets(assets);
        const manifest = this.buildManifest(groupedAssets, config);
        return toml.stringify(manifest);
    }
    async generateFromExistingAssets(assetsFilePath, config) {
        console.log(`📖 Reading existing assets from: ${assetsFilePath}`);
        const assetsContent = await fs_1.promises.readFile(assetsFilePath, 'utf-8');
        const assets = await this.parseAssetsFile(assetsContent);
        const manifest = this.buildManifestFromAssets(assets, config);
        return toml.stringify(manifest);
    }
    async scanAssets(directory) {
        const assets = [];
        const scan = async (dir, relativePath = '') => {
            const entries = await fs_1.promises.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relPath = path.join(relativePath, entry.name);
                if (entry.isDirectory()) {
                    await scan(fullPath, relPath);
                }
                else if (entry.isFile()) {
                    const ext = path.extname(entry.name).toLowerCase();
                    if (this.supportedFormats.has(ext)) {
                        assets.push(this.createAssetInfo(entry.name, relPath));
                    }
                }
            }
        };
        await scan(directory);
        return assets;
    }
    createAssetInfo(filename, relativePath) {
        const name = path.basename(filename, path.extname(filename));
        const pathParts = relativePath.split(path.sep);
        const category = this.inferCategory(pathParts);
        const subcategory = this.inferSubcategory(pathParts);
        const assetInfo = {
            name: this.sanitizeName(name),
            path: relativePath,
            extension: path.extname(filename).slice(1),
            category,
            estimatedPrompt: this.generatePrompt(name, category, subcategory),
            altText: this.generateAltText(name, category)
        };
        if (subcategory !== undefined) {
            assetInfo.subcategory = subcategory;
        }
        return assetInfo;
    }
    inferCategory(pathParts) {
        for (const part of pathParts) {
            const normalized = part.toLowerCase();
            if (this.categoryMapping[normalized]) {
                return this.categoryMapping[normalized] || 'illustrations';
            }
        }
        // Default categorization based on common patterns
        const lastPart = pathParts[pathParts.length - 2]?.toLowerCase() || '';
        return this.categoryMapping[lastPart] || 'illustrations';
    }
    inferSubcategory(pathParts) {
        if (pathParts.length > 2) {
            return pathParts[pathParts.length - 2];
        }
        return undefined;
    }
    generatePrompt(name, category, subcategory) {
        const cleanName = name.replace(/[_-]/g, ' ');
        const context = subcategory ? `${subcategory} ` : '';
        switch (category) {
            case 'icons':
                return `Simple ${context}icon: ${cleanName} in modern flat design style. Clean minimalist vector with rounded edges, perfect for UI navigation.`;
            case 'illustrations':
                return `Duolingo-style ${context}illustration: ${cleanName} with friendly cartoon aesthetic, bright colors, rounded shapes, optimistic mood.`;
            case 'photos':
                return `Professional lifestyle photography: ${cleanName} scene with natural lighting, authentic expressions, high quality composition.`;
            case 'videos':
                return `Professional video content: ${cleanName} with smooth cinematography, engaging visuals, appropriate pacing for user experience.`;
            default:
                return `High-quality ${category} asset: ${cleanName} designed for modern user interface with attention to accessibility and user experience.`;
        }
    }
    generateAltText(name, category) {
        const cleanName = name.replace(/[_-]/g, ' ');
        return `${cleanName} ${category === 'icons' ? 'icon' : category === 'photos' ? 'photo' : 'illustration'}`;
    }
    sanitizeName(name) {
        return name
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .replace(/_{2,}/g, '_')
            .replace(/^_|_$/g, '');
    }
    groupAssets(assets) {
        const groups = {};
        for (const asset of assets) {
            const groupKey = asset.subcategory
                ? `${asset.category}_${asset.subcategory}`
                : asset.category;
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(asset);
        }
        return groups;
    }
    buildManifest(groupedAssets, config) {
        const manifest = {
            meta: {
                name: config.projectName,
                version: '1.0.0',
                description: `Asset manifest for ${config.projectName}`,
                base_url: config.baseUrl,
                generated_at: new Date().toISOString()
            },
            categories: {
                illustrations: { path: 'illustrations', type: 'image', formats: ['png', 'jpg', 'webp'] },
                photos: { path: 'photos', type: 'image', formats: ['webp', 'jpg'] },
                videos: { path: 'videos', type: 'video', formats: ['mp4', 'webm'] },
                icons: { path: 'icons', type: 'icon', formats: ['png', 'svg'] }
            },
            assets: {},
            build: {
                output_dir: 'src/lib',
                output_file: 'assets.ts',
                type_definitions: true,
                fallback_image: `${config.baseUrl}/stubs/placeholder.png`
            },
            cli: {
                models: { images: 'flux-kontext', videos: 'veo-3-fast' },
                pricing: { 'flux-kontext': 0.015, 'veo-3-fast': 0.050 },
                output_dir: config.outputDir
            },
            generation: {
                skip_existing: true,
                convert_formats: true,
                verify_output: true,
                max_retries: 3
            }
        };
        // Add asset groups
        for (const [groupName, assets] of Object.entries(groupedAssets)) {
            const firstAsset = assets[0];
            if (!firstAsset) {
                throw new Error(`No assets found for group: ${groupName}`);
            }
            const groupConfig = {
                description: `${groupName.replace(/_/g, ' ')} assets`,
                category: firstAsset.category,
                format: this.getDefaultFormat(firstAsset.extension),
                generation_model: firstAsset.category === 'videos' ? 'veo-3-fast' : 'flux-kontext'
            };
            if (firstAsset.subcategory) {
                groupConfig.subcategory = firstAsset.subcategory;
            }
            // Add individual assets
            for (const asset of assets) {
                groupConfig[asset.name] = {
                    prompt: asset.estimatedPrompt,
                    alt: asset.altText,
                    aspect_ratio: this.inferAspectRatio(asset.name, asset.category)
                };
            }
            manifest.assets[groupName] = groupConfig;
        }
        return manifest;
    }
    async parseAssetsFile(content) {
        // Parse TypeScript assets file and extract asset definitions
        const assets = [];
        // Extract asset definitions using regex (simplified - could be improved with AST parsing)
        const assetMatches = content.matchAll(/(\w+):\s*\{[^}]+src:\s*`[^`]+\/([^`]+)`[^}]+alt:\s*'([^']+)'[^}]*\}/g);
        for (const match of assetMatches) {
            const [, name, filename, alt] = match;
            if (!name || !filename || !alt)
                continue;
            const ext = path.extname(filename).slice(1);
            const pathParts = filename.split('/');
            const assetInfo = {
                name,
                path: filename,
                extension: ext,
                category: this.inferCategory(pathParts),
                estimatedPrompt: `Generated prompt for ${name}`,
                altText: alt
            };
            const subcategory = this.inferSubcategory(pathParts);
            if (subcategory !== undefined) {
                assetInfo.subcategory = subcategory;
            }
            assets.push(assetInfo);
        }
        return assets;
    }
    buildManifestFromAssets(assets, config) {
        const groupedAssets = this.groupAssets(assets);
        return this.buildManifest(groupedAssets, config);
    }
    getDefaultFormat(extension) {
        const formatMap = {
            'jpg': 'png', 'jpeg': 'png', 'png': 'png', 'webp': 'webp',
            'svg': 'png', 'gif': 'png',
            'mp4': 'mp4', 'webm': 'mp4', 'mov': 'mp4'
        };
        return formatMap[extension.toLowerCase()] || 'png';
    }
    inferAspectRatio(name, category) {
        const nameLower = name.toLowerCase();
        if (nameLower.includes('hero') || nameLower.includes('onboarding')) {
            return '9:16';
        }
        if (category === 'icons' || nameLower.includes('avatar')) {
            return '1:1';
        }
        if (category === 'videos') {
            return '16:9';
        }
        return '1:1';
    }
}
exports.ManifestGenerator = ManifestGenerator;
// CLI interface
async function generateManifest(options) {
    const generator = new ManifestGenerator();
    const config = {
        projectName: options.projectName,
        baseUrl: options.baseUrl || '/assets',
        outputDir: options.outputDir || 'public/assets'
    };
    let manifestContent;
    if (options.assetsDir) {
        manifestContent = await generator.generateFromDirectory(options.assetsDir, config);
    }
    else if (options.assetsFile) {
        manifestContent = await generator.generateFromExistingAssets(options.assetsFile, config);
    }
    else {
        throw new Error('Either assetsDir or assetsFile must be provided');
    }
    const outputPath = options.outputFile || 'asset-manifest.toml';
    await fs_1.promises.writeFile(outputPath, manifestContent, 'utf-8');
    console.log(`✅ Generated manifest: ${outputPath}`);
}
exports.generateManifest = generateManifest;
//# sourceMappingURL=manifest-generator.js.map