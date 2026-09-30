import { MarketBrandPreset, GeneratedImage, GeneratedVideo } from '../types';

export const MARKET_BRAND_PRESETS: MarketBrandPreset[] = [
  {
    id: 'lumina-ai',
    name: 'LUMINA AI',
    tagline: 'Next-Gen Generative Production Suite for Images & Motion',
    category: 'Market Leader • Flagship',
    marketAppeal: 'High-trust, clean Silicon-Valley aesthetic. Best for broad market appeal, SaaS enterprise, and digital agency creators.',
    accentColor: '#2563EB',
    accentClass: 'bg-blue-600',
    accentTextClass: 'text-blue-500',
    logoLetter: 'L',
    font: 'Outfit',
    isPopular: true
  },
  {
    id: 'apex-motion',
    name: 'APEXMOTION AI',
    tagline: 'Cinema-Grade Hyperdynamic Motion & Visual FX Engine',
    category: 'Commercial Video • High Impact',
    marketAppeal: 'High-octane commercial studio branding. Preferred by video creators, ad filmmakers, and VFX producers.',
    accentColor: '#8B5CF6',
    accentClass: 'bg-violet-600',
    accentTextClass: 'text-violet-500',
    logoLetter: 'A',
    font: 'Outfit'
  },
  {
    id: 'vivid-craft',
    name: 'VIVIDCRAFT STUDIO',
    tagline: 'Precision Visual Art & Photorealistic Synthetic Media',
    category: 'Creative Agency • Premium Design',
    marketAppeal: 'Modern digital agency vibe. Perfect for e-commerce marketers, art directors, and luxury brand content.',
    accentColor: '#10B981',
    accentClass: 'bg-emerald-600',
    accentTextClass: 'text-emerald-500',
    logoLetter: 'V',
    font: 'Plus Jakarta Sans',
    isPopular: true
  },
  {
    id: 'cinemorph-ai',
    name: 'CINEMORPH AI',
    tagline: 'Deep Diffusion Cinematic Video & Continuous Sequence Lab',
    category: 'Hollywood Cinema • Longform',
    marketAppeal: 'Targeted at cinematographers and indie filmmakers looking for photorealistic camera physics and continuous motion.',
    accentColor: '#F43F5E',
    accentClass: 'bg-rose-600',
    accentTextClass: 'text-rose-500',
    logoLetter: 'C',
    font: 'Outfit'
  },
  {
    id: 'kroma-studio',
    name: 'KROMA STUDIO',
    tagline: 'Minimalist High-Fidelity Generative Art & Editorial Aesthetics',
    category: 'Editorial Luxury • High Fashion',
    marketAppeal: 'Ultra-sleek European luxury aesthetic with high typography discipline and restrained palette.',
    accentColor: '#F59E0B',
    accentClass: 'bg-amber-500',
    accentTextClass: 'text-amber-500',
    logoLetter: 'K',
    font: 'Space Mono'
  },
  {
    id: 'omnigenius-ai',
    name: 'OMNIGENIUS AI',
    tagline: 'Universal Multimodal Neural Platform for Enterprise Assets',
    category: 'Enterprise Tech • Global Scale',
    marketAppeal: 'Corporate venture & scalable tech branding. Ideal for enterprise teams demanding high throughput generation.',
    accentColor: '#06B6D4',
    accentClass: 'bg-cyan-600',
    accentTextClass: 'text-cyan-500',
    logoLetter: 'O',
    font: 'Plus Jakarta Sans'
  }
];

export const INITIAL_SHOWCASE_IMAGES: GeneratedImage[] = [
  {
    id: 'img-1',
    prompt: 'Hyper-realistic portrait of an astronaut on a glass moon reflecting a deep purple nebula in the helmet visor, cinematic rim lighting, 8k resolution, Hasselblad 80mm f/1.4',
    enhancedPrompt: 'Full-frame cinematic master photograph of a solitary space explorer standing on a mirrored obsidian lunar surface, helmet visor reflecting cosmic violet aurora borealis and spiral galaxies, anamorphic lens flare, sharp volumetric lighting, 8k render, photorealistic realism',
    style: 'Cinematic Film',
    aspectRatio: '16:9',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    timestamp: Date.now() - 3600000 * 2,
    width: 1920,
    height: 1080,
    tags: ['Cosmic', 'Cinematic', 'Nebula', '8K', 'Hasselblad'],
    seed: 482910
  },
  {
    id: 'img-2',
    prompt: 'Cyberpunk neon sports car speeding through rain-slicked Tokyo streets, glowing blue underglow, water splashes, steam vents',
    enhancedPrompt: 'Low-angle motion tracking shot of an ultra-aerodynamic futuristic electric supercar drifting through Neo-Shinjuku drenched in neon rain, vibrant cyan and magenta reflections on wet asphalt, volumetric mist, Ray-tracing reflections, Unreal Engine 5 render',
    style: 'Cyberpunk Neon',
    aspectRatio: '16:9',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    timestamp: Date.now() - 3600000 * 4,
    width: 1920,
    height: 1080,
    tags: ['Cyberpunk', 'Tokyo', 'Supercar', 'Raytracing'],
    seed: 902148
  },
  {
    id: 'img-3',
    prompt: 'Ethereal floating architectural pavilion in a serene alpine lake surrounded by misty fir trees, minimal Scandinavian design, morning golden hour light',
    enhancedPrompt: 'Architectural photography of an ultra-modern glass and charred timber pavilion suspended above crystal clear still waters of a Nordic fjord, soft golden dawn sunlight breaking through mountain mist, natural wood reflections, 70mm lens shot',
    style: 'Photorealistic',
    aspectRatio: '4:3',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    timestamp: Date.now() - 3600000 * 6,
    width: 1600,
    height: 1200,
    tags: ['Architecture', 'Nordic', 'Minimal', 'Golden Hour'],
    seed: 312984
  },
  {
    id: 'img-4',
    prompt: 'Macro portrait of a mechanical cyborg hummingbird with translucent crystalline wings sipping liquid light from an iridescent flower',
    enhancedPrompt: 'Extreme macro photography of an intricate biomechanical avian drone hovering over a bio-luminescent flora, sapphire titanium feathers, microscopic gears visible beneath quartz casing, cinematic bokeh, depth of field f/1.8',
    style: '3D Isometric',
    aspectRatio: '1:1',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    timestamp: Date.now() - 3600000 * 8,
    width: 1080,
    height: 1080,
    tags: ['Biomechanical', 'Cyborg', 'Macro', 'Bioluminescence'],
    seed: 774129
  },
  {
    id: 'img-5',
    prompt: 'High-fashion editorial portrait of a model wearing an architectural chrome dress, dramatic shadow play, monochromatic studio lighting',
    enhancedPrompt: 'Vogue editorial cover portrait, avant-garde liquid mercury sculpted gown, razor-sharp jawline, stark chiaroscuro lighting, glossy high-fashion magazine aesthetic, 50mm prime portrait lens',
    style: 'Editorial Fashion',
    aspectRatio: '9:16',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    timestamp: Date.now() - 3600000 * 12,
    width: 1080,
    height: 1920,
    tags: ['Fashion', 'High Contrast', 'Chiaroscuro', 'Vogue'],
    seed: 554312
  }
];

export const INITIAL_SHOWCASE_VIDEOS: GeneratedVideo[] = [
  {
    id: 'vid-1',
    prompt: 'Cinematic drone flyover descending from clouds onto a luminous cybernetic metropolis at dusk, highway light trails and flying vehicles',
    sourceImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    duration: 5,
    fps: 60,
    motionType: 'Drone Flyover',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    timestamp: Date.now() - 3600000,
    aspectRatio: '16:9',
    status: 'ready',
    audioTrack: 'cyberpunk_pulse'
  },
  {
    id: 'vid-2',
    prompt: 'Slow dolly zoom into ancient stone temple hidden in lush tropical jungle waterfalls, sunbeams penetrating the misty canopy',
    sourceImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    duration: 6,
    fps: 30,
    motionType: 'Zoom In',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    timestamp: Date.now() - 3600000 * 3,
    aspectRatio: '16:9',
    status: 'ready',
    audioTrack: 'cinematic_orchestral'
  },
  {
    id: 'vid-3',
    prompt: 'Fluid 360-degree orbital rotation around a glowing quantum computer core pulsating with electric plasma filaments',
    sourceImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    duration: 4,
    fps: 60,
    motionType: 'Orbit 360',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    timestamp: Date.now() - 3600000 * 5,
    aspectRatio: '16:9',
    status: 'ready',
    audioTrack: 'ambient_space'
  }
];

export const AUDIO_TRACK_NAMES = {
  none: 'Muted (No Audio)',
  cyberpunk_pulse: 'Cyberpunk Pulse (Synthwave 120BPM)',
  cinematic_orchestral: 'Cinematic Dawn (Orchestral Strings)',
  lofi_horizon: 'Lo-Fi Horizon (Warm Vinyl Chill)',
  ambient_space: 'Nebula Drift (Cosmic Sub-bass Drone)'
};
