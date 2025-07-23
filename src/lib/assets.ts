/**
 * Generated Asset Definitions
 * 
 * This file is auto-generated from asset-manifest.toml
 * DO NOT EDIT MANUALLY - Changes will be overwritten
 * 
 * Generated: 2025-07-23T19:52:44.354Z
 * Manifest: level-up-your-kid v1.0.0
 */

// Asset base paths
const ASSET_BASE = '/assets';
const PLACEHOLDER_IMAGE = '/assets/stubs/placeholder.png';

/**
 * Duolingo-style child avatar illustrations for different ages and personalities
 */
export const childAvatars = {
  boyToddlerHappy: {
    src: `${ASSET_BASE}/illustrations/avatars/boy_toddler_happy.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Happy toddler boy with cheerful smile',
    ageRange: '1-3',
    style: 'Cheerful',
    _meta: {
      prompt: `Duolingo-style child avatar: Happy toddler boy (ages 1-3) with cheerful round face, bright smile, rosy cheeks. Simple colorful clothing, playful expression. Clean vector art with rounded friendly features, optimistic and joyful personality.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'illustrations',
      subcategory: 'avatars',
      format: 'png'
    }
  },
  girlToddlerCurious: {
    src: `${ASSET_BASE}/illustrations/avatars/girl_toddler_curious.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Curious toddler girl with bright eyes',
    ageRange: '1-3',
    style: 'Curious',
    _meta: {
      prompt: `Duolingo-style child avatar: Curious toddler girl (ages 1-3) with bright eyes, questioning expression, head slightly tilted. Simple colorful dress, inquisitive personality showing. Clean vector art with rounded friendly features, eager-to-learn appearance.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'illustrations',
      subcategory: 'avatars',
      format: 'png'
    }
  },
  boyToddlerSleepy: {
    src: `${ASSET_BASE}/illustrations/avatars/boy_toddler_sleepy.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Sleepy toddler boy with peaceful expression',
    ageRange: '1-3',
    style: 'Gentle',
    _meta: {
      prompt: `Duolingo-style child avatar: Sleepy toddler boy (ages 1-3) with droopy eyes, peaceful expression, holding small blanket or stuffed animal. Simple pajamas or comfortable clothing, calm gentle personality.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'illustrations',
      subcategory: 'avatars',
      format: 'png'
    }
  },
  girlToddlerGiggly: {
    src: `${ASSET_BASE}/illustrations/avatars/girl_toddler_giggly.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Giggly toddler girl with big laugh',
    ageRange: '1-3',
    style: 'Joyful',
    _meta: {
      prompt: `Duolingo-style child avatar: Giggly toddler girl (ages 1-3) with wide smile, sparkling eyes, hands covering mouth in laughter gesture. Simple bright clothing, joyful bubbly personality.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'illustrations',
      subcategory: 'avatars',
      format: 'png'
    }
  },
  boyPreschoolPlayful: {
    src: `${ASSET_BASE}/illustrations/avatars/boy_preschool_playful.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Playful preschool boy with energetic expression',
    ageRange: '3-5',
    style: 'Playful',
    _meta: {
      prompt: `Duolingo-style child avatar: Playful preschool boy (ages 3-5) with energetic expression, big smile, active pose. Casual play clothes, dynamic personality.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'illustrations',
      subcategory: 'avatars',
      format: 'png'
    }
  },
  girlPreschoolCreative: {
    src: `${ASSET_BASE}/illustrations/avatars/girl_preschool_creative.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Creative preschool girl with artistic flair',
    ageRange: '3-5',
    style: 'Creative',
    _meta: {
      prompt: `Duolingo-style child avatar: Creative preschool girl (ages 3-5) with imaginative expression, artistic flair, colorful accessories. Paint-splattered apron or creative elements, inventive personality.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'illustrations',
      subcategory: 'avatars',
      format: 'png'
    }
  },
};

/**
 * Interest category icons for child preference selection
 */
export const childInterests = {
  animalsPets: {
    src: `${ASSET_BASE}/illustrations/interests/animals_pets.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Animals and pets interest - cute dog and cat illustration',
    category: 'Nature',
    _meta: {
      prompt: `Duolingo-style child interest illustration: Cute friendly animals including playful dog, calm cat, colorful parrot, and gentle rabbit. Child-appropriate design with rounded friendly features, bright engaging colors.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'illustrations',
      subcategory: 'interests',
      format: 'png'
    }
  },
  booksReading: {
    src: `${ASSET_BASE}/illustrations/interests/books_reading.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Books and reading interest - open storybook with magical elements',
    category: 'Learning',
    _meta: {
      prompt: `Duolingo-style child interest illustration: Open storybook with magical elements - fairy tale characters, stars, sparkles emerging from pages. Stack of colorful children's books nearby.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'illustrations',
      subcategory: 'interests',
      format: 'png'
    }
  },
  musicSinging: {
    src: `${ASSET_BASE}/illustrations/interests/music_singing.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Music and singing interest - musical notes and instruments',
    category: 'Arts',
    _meta: {
      prompt: `Duolingo-style child interest illustration: Musical notes floating in air, child-friendly instruments (xylophone, tambourine, maracas), microphone, colorful sound waves.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'illustrations',
      subcategory: 'interests',
      format: 'png'
    }
  },
};

/**
 * Key illustrations for onboarding user experience
 */
export const onboardingFlow = {
  welcomeHero: {
    src: `${ASSET_BASE}/illustrations/onboarding/welcome_hero.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Welcome Hero - Family with app success visualization',
    aspectRatio: '9:16',
    _meta: {
      prompt: `Hero illustration showing diverse family (parent + child) with Level Up app interface floating around them, progress visualization graphics, achievement badges, upward growth arrows, success indicators. Duolingo style: rounded, optimistic, colorful.`,
      model: 'flux-kontext',
      aspectRatio: '9:16',
      category: 'illustrations',
      subcategory: 'onboarding',
      format: 'png'
    }
  },
  problemSplit: {
    src: `${ASSET_BASE}/illustrations/onboarding/problem_split.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Problem Split - Overwhelmed vs Confident parent comparison',
    aspectRatio: '9:16',
    _meta: {
      prompt: `Dramatic split-screen comparison illustration combining overwhelmed vs confident parent scenarios side-by-side with stark contrast. LEFT: Chaos, stress, confusion. RIGHT: Order, confidence, success.`,
      model: 'flux-kontext',
      aspectRatio: '9:16',
      category: 'illustrations',
      subcategory: 'onboarding',
      format: 'png'
    }
  },
  guidedActivityHero: {
    src: `${ASSET_BASE}/illustrations/onboarding/guided_activity_hero.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Guided Activity Hero - Parent and child engaged in first learning activity together',
    aspectRatio: '9:16',
    _meta: {
      prompt: `Heartwarming illustration of parent and child engaged in their first Level Up activity together. Parent following app guidance on phone/tablet while child actively participates in hands-on learning activity.`,
      model: 'flux-kontext',
      aspectRatio: '9:16',
      category: 'illustrations',
      subcategory: 'onboarding',
      format: 'png'
    }
  },
};

/**
 * Navigation icons for main app sections
 */
export const navigationIcons = {
  home: {
    src: `${ASSET_BASE}/icons/nav/home.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Home navigation icon',
    _meta: {
      prompt: `Simple navigation icon for home in Duolingo style. House symbol with rounded edges, bright colors, perfect for mobile navigation. Clean minimalist design.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'icons',
      subcategory: 'nav',
      format: 'png'
    }
  },
  activities: {
    src: `${ASSET_BASE}/icons/nav/activities.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Activities navigation icon',
    _meta: {
      prompt: `Simple navigation icon for activities in Duolingo style. Puzzle piece or play symbol with rounded edges, bright colors, perfect for mobile navigation.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'icons',
      subcategory: 'nav',
      format: 'png'
    }
  },
  progress: {
    src: `${ASSET_BASE}/icons/nav/progress.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Progress navigation icon',
    _meta: {
      prompt: `Simple navigation icon for progress in Duolingo style. Chart or graph symbol with rounded edges, bright colors, perfect for mobile navigation.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'icons',
      subcategory: 'nav',
      format: 'png'
    }
  },
};

/**
 * Action icons for buttons and interactions
 */
export const actionIcons = {
  add: {
    src: `${ASSET_BASE}/icons/actions/add.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Add action icon',
    _meta: {
      prompt: `Action icon for add in Duolingo style. Plus symbol with rounded friendly design, bright engaging colors. Clear intuitive symbol.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'icons',
      subcategory: 'actions',
      format: 'png'
    }
  },
  complete: {
    src: `${ASSET_BASE}/icons/actions/complete.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Complete action icon',
    _meta: {
      prompt: `Action icon for complete in Duolingo style. Checkmark symbol with rounded friendly design, bright engaging colors. Clear intuitive symbol.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'icons',
      subcategory: 'actions',
      format: 'png'
    }
  },
  favorite: {
    src: `${ASSET_BASE}/icons/actions/favorite.png`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Favorite action icon',
    _meta: {
      prompt: `Action icon for favorite in Duolingo style. Heart symbol with rounded friendly design, bright engaging colors. Clear intuitive symbol.`,
      model: 'flux-kontext',
      aspectRatio: '1:1',
      category: 'icons',
      subcategory: 'actions',
      format: 'png'
    }
  },
};

/**
 * Professional family photography for aspirational content
 */
export const heroFamilies = {
  diverseFamily_01: {
    src: `${ASSET_BASE}/photos/hero_families/diverse_family_01.webp`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Diverse family reading together - African American father and daughter',
    _meta: {
      prompt: `Professional lifestyle photography: African American father (30s) in casual button-down shirt sitting cross-legged on hardwood floor reading colorful picture book with 4-year-old daughter in bright yellow dress. Both fully engaged, genuine smiles, natural lighting from large windows.`,
      model: 'flux-kontext',
      aspectRatio: '9:16',
      category: 'photos',
      subcategory: 'hero_families',
      format: 'webp'
    }
  },
  diverseFamily_02: {
    src: `${ASSET_BASE}/photos/hero_families/diverse_family_02.webp`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Diverse family building together - Hispanic mother and twin boys',
    _meta: {
      prompt: `Candid family moment: Hispanic mother (early 30s) in comfortable sweater sitting on carpet with 3-year-old twin boys building colorful wooden blocks. All three focused on construction project, natural expressions of concentration and joy.`,
      model: 'flux-kontext',
      aspectRatio: '9:16',
      category: 'photos',
      subcategory: 'hero_families',
      format: 'webp'
    }
  },
};

/**
 * Video content for onboarding and engagement
 */
export const videos = {
  aspirationMontage: {
    src: `${ASSET_BASE}/videos/aspiration_montage.mp4`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Aspirational montage showing parent transformation journey',
    duration: 20,
    aspectRatio: '9:16',
    _meta: {
      prompt: `Cinematic lifestyle commercial showing parent transformation journey. Scene 1: Stressed parent with crying child, scattered toys, chaotic living room. Scene 2: Same parent confidently engaging with happy child in structured play. Scene 3: Child hitting developmental milestone with celebrating parent. Warm lighting, smooth transitions, aspirational mood.`,
      model: 'veo-3-fast',
      aspectRatio: '9:16',
      category: 'videos',
      subcategory: '',
      format: 'mp4'
    }
  },
  testimonialsCompilation: {
    src: `${ASSET_BASE}/videos/testimonials_compilation.mp4`,
    fallback: PLACEHOLDER_IMAGE,
    alt: 'Parent testimonials compilation',
    duration: 45,
    aspectRatio: '9:16',
    _meta: {
      prompt: `Professional testimonial video compilation featuring diverse parents sharing success stories. Clean modern backgrounds, warm lighting, authentic emotional expressions. Parents speaking directly to camera about child development progress.`,
      model: 'veo-3-fast',
      aspectRatio: '9:16',
      category: 'videos',
      subcategory: '',
      format: 'mp4'
    }
  },
};

// Type Definitions
export interface AssetDefinition {
  src: string;
  fallback: string;
  alt: string;
  ageRange?: string;
  style?: string;
  category?: string;
  duration?: number;
  aspectRatio?: string;
  _meta: {
    prompt: string;
    model: string;
    aspectRatio: string;
    category: string;
    subcategory: string;
    format: string;
  };
}

// Manifest Metadata
export const ASSET_MANIFEST = {
  name: 'level-up-your-kid',
  version: '1.0.0',
  description: 'Asset manifest for Level Up Your Kid parenting app',
  generatedAt: '2025-07-23T19:52:44.355Z',
  totalAssets: 22
};