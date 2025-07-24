"use strict";
/**
 * Template Manager
 * Manages manifest templates for different project types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateManager = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path = tslib_1.__importStar(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class TemplateManager {
    templatesDir = path.join(__dirname, '../../templates');
    async listTemplates() {
        console.log(chalk_1.default.blue.bold('📋 Available Templates\n'));
        const templates = [
            {
                name: 'react-app',
                description: 'React application with UI components and icons',
                assets: ['UI icons', 'Hero images', 'Component illustrations']
            },
            {
                name: 'nextjs-app',
                description: 'Next.js application with optimized images',
                assets: ['Hero images', 'Feature illustrations', 'UI icons', 'Product photos']
            },
            {
                name: 'marketing-site',
                description: 'Marketing website with hero content',
                assets: ['Hero videos', 'Feature illustrations', 'Team photos', 'Logo variations']
            },
            {
                name: 'mobile-app',
                description: 'Mobile application with app store assets',
                assets: ['App icons', 'Onboarding illustrations', 'Feature graphics', 'Screenshots']
            },
            {
                name: 'dashboard',
                description: 'Admin dashboard with data visualizations',
                assets: ['Chart icons', 'Status illustrations', 'User avatars', 'Empty states']
            },
            {
                name: 'ecommerce',
                description: 'E-commerce platform with product assets',
                assets: ['Product photos', 'Category icons', 'Promotional banners', 'UI elements']
            }
        ];
        for (const template of templates) {
            console.log(`${chalk_1.default.green('▶')} ${chalk_1.default.bold(template.name)}`);
            console.log(`   ${template.description}`);
            console.log(`   Assets: ${template.assets.join(', ')}\n`);
        }
    }
    async createFromTemplate(templateName, data) {
        const templateContent = this.getTemplateContent(templateName, data);
        await fs_1.promises.writeFile('asset-manifest.toml', templateContent, 'utf-8');
        console.log(`✅ Created manifest from template: ${templateName}`);
        console.log(`📋 Generated: asset-manifest.toml`);
    }
    getTemplateContent(templateName, data) {
        const templates = {
            'react-app': this.getReactAppTemplate,
            'nextjs-app': this.getNextJsAppTemplate,
            'marketing-site': this.getMarketingSiteTemplate,
            'mobile-app': this.getMobileAppTemplate,
            'dashboard': this.getDashboardTemplate,
            'ecommerce': this.getEcommerceTemplate
        };
        const generator = templates[templateName];
        if (!generator) {
            throw new Error(`Unknown template: ${templateName}`);
        }
        return generator(data);
    }
    getReactAppTemplate = (data) => `# ${data.projectName} Asset Manifest
# Generated from react-app template

[meta]
name = "${data.projectName}"
version = "1.0.0"
description = "Asset manifest for ${data.projectName} React application"
base_url = "${data.baseUrl || '/assets'}"

[categories]
illustrations = { path = "illustrations", type = "image", formats = ["png", "webp"] }
icons = { path = "icons", type = "icon", formats = ["png"] }
photos = { path = "photos", type = "image", formats = ["webp", "jpg"] }

[assets.ui_icons]
description = "User interface navigation icons"
category = "icons"
format = "png"
generation_model = "flux-kontext"

  [assets.ui_icons.home]
  prompt = "Modern home icon in flat design style, rounded corners, suitable for navigation"
  alt = "Home navigation icon"

  [assets.ui_icons.menu]
  prompt = "Hamburger menu icon in flat design style, three horizontal lines"
  alt = "Menu navigation icon"

  [assets.ui_icons.search]
  prompt = "Search icon with magnifying glass in flat design style"
  alt = "Search icon"

  [assets.ui_icons.user]
  prompt = "User profile icon in flat design style, person silhouette"
  alt = "User profile icon"

[assets.hero_images]
description = "Hero images for landing pages"
category = "illustrations"
format = "png"
generation_model = "flux-kontext"

  [assets.hero_images.main_hero]
  prompt = "Modern hero illustration showing people using ${data.projectName} app, vibrant colors, optimistic mood"
  alt = "Main hero image for ${data.projectName}"
  aspect_ratio = "16:9"

  [assets.hero_images.features]
  prompt = "Feature showcase illustration with modern design elements, technology theme"
  alt = "Features illustration"
  aspect_ratio = "4:3"

[build]
output_dir = "src/lib"
output_file = "assets.ts"
type_definitions = true
fallback_image = "${data.baseUrl || '/assets'}/stubs/placeholder.png"

[cli]
models = { images = "flux-kontext", videos = "veo-3-fast" }
pricing = { "flux-kontext" = 0.015, "veo-3-fast" = 0.050 }
output_dir = "public/assets"

[generation]
skip_existing = true
convert_formats = true
verify_output = true
max_retries = 3
`;
    getNextJsAppTemplate = (data) => `# ${data.projectName} Asset Manifest
# Generated from nextjs-app template

[meta]
name = "${data.projectName}"
version = "1.0.0"
description = "Asset manifest for ${data.projectName} Next.js application"
base_url = "${data.baseUrl || '/assets'}"

[categories]
illustrations = { path = "illustrations", type = "image", formats = ["png", "webp"] }
photos = { path = "photos", type = "image", formats = ["webp", "jpg"] }
icons = { path = "icons", type = "icon", formats = ["png"] }
videos = { path = "videos", type = "video", formats = ["mp4"] }

[assets.hero_content]
description = "Hero section content"
category = "videos"
format = "mp4"
generation_model = "veo-3-fast"

  [assets.hero_content.intro_video]
  prompt = "Professional product demonstration video for ${data.projectName}, modern interface, smooth transitions"
  alt = "Product introduction video"
  aspect_ratio = "16:9"

[assets.feature_illustrations]
description = "Feature section illustrations"
category = "illustrations"
format = "webp"
generation_model = "flux-kontext"

  [assets.feature_illustrations.feature_01]
  prompt = "Modern illustration showing productivity features, clean design, professional style"
  alt = "Productivity features illustration"
  aspect_ratio = "4:3"

  [assets.feature_illustrations.feature_02]
  prompt = "Team collaboration illustration with modern design elements"
  alt = "Team collaboration illustration"
  aspect_ratio = "4:3"

  [assets.feature_illustrations.feature_03]
  prompt = "Data analytics illustration with charts and graphs, modern style"
  alt = "Analytics features illustration"
  aspect_ratio = "4:3"

[assets.product_photos]
description = "Product photography"
category = "photos"
format = "webp"
generation_model = "flux-kontext"

  [assets.product_photos.product_hero]
  prompt = "Professional product photography of ${data.projectName} interface on modern devices, clean background"
  alt = "Product hero photo"
  aspect_ratio = "16:9"

[build]
output_dir = "src/lib"
output_file = "assets.ts"
type_definitions = true
fallback_image = "${data.baseUrl || '/assets'}/stubs/placeholder.png"

[cli]
models = { images = "flux-kontext", videos = "veo-3-fast" }
pricing = { "flux-kontext" = 0.015, "veo-3-fast" = 0.050 }
output_dir = "public/assets"

[generation]
skip_existing = true
convert_formats = true
verify_output = true
max_retries = 3
`;
    getMarketingSiteTemplate = (data) => `# ${data.projectName} Marketing Site
# Generated from marketing-site template

[meta]
name = "${data.projectName}"
version = "1.0.0"
description = "Marketing site asset manifest for ${data.projectName}"
base_url = "${data.baseUrl || '/assets'}"

[categories]
videos = { path = "videos", type = "video", formats = ["mp4"] }
photos = { path = "photos", type = "image", formats = ["webp", "jpg"] }
illustrations = { path = "illustrations", type = "image", formats = ["png", "webp"] }

[assets.hero_videos]
description = "Hero section videos"
category = "videos"
format = "mp4"
generation_model = "veo-3-fast"

  [assets.hero_videos.main_hero]
  prompt = "Cinematic hero video showcasing ${data.projectName}, professional lighting, engaging visuals"
  alt = "Main hero video"
  aspect_ratio = "16:9"

[assets.team_photos]
description = "Team photography"
category = "photos"
format = "webp"
generation_model = "flux-kontext"

  [assets.team_photos.team_hero]
  prompt = "Professional team photo with diverse group in modern office setting, natural lighting"
  alt = "Team photo"
  aspect_ratio = "16:9"

[build]
output_dir = "src/lib"
output_file = "assets.ts"
type_definitions = true
fallback_image = "${data.baseUrl || '/assets'}/stubs/placeholder.png"

[cli]
models = { images = "flux-kontext", videos = "veo-3-fast" }
pricing = { "flux-kontext" = 0.015, "veo-3-fast" = 0.050 }
output_dir = "public/assets"

[generation]
skip_existing = true
convert_formats = true
verify_output = true
max_retries = 3
`;
    getMobileAppTemplate = (data) => `# ${data.projectName} Mobile App
# Generated from mobile-app template

[meta]
name = "${data.projectName}"
version = "1.0.0"
description = "Mobile app asset manifest for ${data.projectName}"
base_url = "${data.baseUrl || '/assets'}"

[categories]
icons = { path = "icons", type = "icon", formats = ["png"] }
illustrations = { path = "illustrations", type = "image", formats = ["png"] }

[assets.app_icons]
description = "Application icons"
category = "icons"
format = "png"
generation_model = "flux-kontext"

  [assets.app_icons.app_icon]
  prompt = "${data.projectName} mobile app icon, modern design, rounded corners, vibrant colors"
  alt = "App icon"
  aspect_ratio = "1:1"

[assets.onboarding_illustrations]
description = "Onboarding flow illustrations"
category = "illustrations"
format = "png"
generation_model = "flux-kontext"

  [assets.onboarding_illustrations.welcome]
  prompt = "Welcome screen illustration for ${data.projectName} mobile app, friendly and inviting"
  alt = "Welcome screen illustration"
  aspect_ratio = "9:16"

[build]
output_dir = "src/assets"
output_file = "assets.ts"
type_definitions = true
fallback_image = "${data.baseUrl || '/assets'}/stubs/placeholder.png"

[cli]
models = { images = "flux-kontext", videos = "veo-3-fast" }
pricing = { "flux-kontext" = 0.015, "veo-3-fast" = 0.050 }
output_dir = "assets/generated"

[generation]
skip_existing = true
convert_formats = true
verify_output = true
max_retries = 3
`;
    getDashboardTemplate = (data) => `# ${data.projectName} Dashboard
# Generated from dashboard template

[meta]
name = "${data.projectName}"
version = "1.0.0"
description = "Dashboard asset manifest for ${data.projectName}"
base_url = "${data.baseUrl || '/assets'}"

[categories]
icons = { path = "icons", type = "icon", formats = ["png"] }
illustrations = { path = "illustrations", type = "image", formats = ["png", "webp"] }

[assets.dashboard_icons]
description = "Dashboard navigation and feature icons"
category = "icons"
format = "png"
generation_model = "flux-kontext"

  [assets.dashboard_icons.analytics]
  prompt = "Analytics dashboard icon with chart elements, modern flat design"
  alt = "Analytics icon"

  [assets.dashboard_icons.users]
  prompt = "Users management icon with people symbols, modern flat design"
  alt = "Users management icon"

[assets.empty_states]
description = "Empty state illustrations"
category = "illustrations"
format = "png"
generation_model = "flux-kontext"

  [assets.empty_states.no_data]
  prompt = "Friendly empty state illustration showing no data message, encouraging tone"
  alt = "No data empty state"

[build]
output_dir = "src/lib"
output_file = "assets.ts"
type_definitions = true
fallback_image = "${data.baseUrl || '/assets'}/stubs/placeholder.png"

[cli]
models = { images = "flux-kontext", videos = "veo-3-fast" }
pricing = { "flux-kontext" = 0.015, "veo-3-fast" = 0.050 }
output_dir = "public/assets"

[generation]
skip_existing = true
convert_formats = true
verify_output = true
max_retries = 3
`;
    getEcommerceTemplate = (data) => `# ${data.projectName} E-commerce
# Generated from ecommerce template

[meta]
name = "${data.projectName}"
version = "1.0.0"
description = "E-commerce asset manifest for ${data.projectName}"
base_url = "${data.baseUrl || '/assets'}"

[categories]
photos = { path = "photos", type = "image", formats = ["webp", "jpg"] }
icons = { path = "icons", type = "icon", formats = ["png"] }
illustrations = { path = "illustrations", type = "image", formats = ["png", "webp"] }

[assets.product_photos]
description = "Product photography"
category = "photos"
format = "webp"
generation_model = "flux-kontext"

  [assets.product_photos.hero_product]
  prompt = "Professional product photography with clean white background, commercial quality"
  alt = "Hero product photo"
  aspect_ratio = "1:1"

[assets.category_icons]
description = "Product category icons"
category = "icons"
format = "png"
generation_model = "flux-kontext"

  [assets.category_icons.electronics]
  prompt = "Electronics category icon with modern device symbols, clean design"
  alt = "Electronics category icon"

[assets.promotional_banners]
description = "Promotional banner illustrations"
category = "illustrations"
format = "webp"
generation_model = "flux-kontext"

  [assets.promotional_banners.sale_banner]
  prompt = "Attractive sale promotion banner with bold typography and sale elements"
  alt = "Sale promotion banner"
  aspect_ratio = "16:9"

[build]
output_dir = "src/lib"
output_file = "assets.ts"
type_definitions = true
fallback_image = "${data.baseUrl || '/assets'}/stubs/placeholder.png"

[cli]
models = { images = "flux-kontext", videos = "veo-3-fast" }
pricing = { "flux-kontext" = 0.015, "veo-3-fast" = 0.050 }
output_dir = "public/assets"

[generation]
skip_existing = true
convert_formats = true
verify_output = true
max_retries = 3
`;
}
exports.TemplateManager = TemplateManager;
//# sourceMappingURL=template-manager.js.map