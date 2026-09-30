export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '21:9';

export type ImageStyle = 
  | 'Photorealistic'
  | 'Cinematic Film'
  | 'Cyberpunk Neon'
  | 'Anime & Manga'
  | '3D Isometric'
  | 'Oil Painting'
  | 'Dark Fantasy'
  | 'Minimalist Vector'
  | 'Editorial Fashion'
  | 'Architectural Minimal';

export type CameraMotion = 
  | 'Pan Left'
  | 'Pan Right'
  | 'Zoom In'
  | 'Zoom Out'
  | 'Tilt Up'
  | 'Tilt Down'
  | 'Orbit 360'
  | 'Drone Flyover'
  | 'Handheld Cam'
  | 'Dolly In'
  | 'Crane Up'
  | 'Drone Aerial'
  | 'Handheld Cinematic';

export type MediaType = 'image' | 'video';

export interface BrandConfig {
  name: string;
  tagline: string;
  accentColor: string;
  accentClass: string;
  accentTextClass: string;
  logoLetter: string;
  font: string;
  watermarkEnabled: boolean;
  watermarkPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'center';
  watermarkOpacity: number;
}

export interface MarketBrandPreset {
  id: string;
  name: string;
  tagline: string;
  category: string;
  marketAppeal: string;
  accentColor: string;
  accentClass: string;
  accentTextClass: string;
  logoLetter: string;
  font: string;
  isPopular?: boolean;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  url: string;
  timestamp: number;
  width: number;
  height: number;
  tags: string[];
  seed?: number;
  favorite?: boolean;
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  sourceImageUrl?: string;
  duration: number; // in seconds
  fps: number;
  motionType: CameraMotion;
  videoUrl: string;
  thumbnailUrl: string;
  timestamp: number;
  aspectRatio: AspectRatio;
  status: 'rendering' | 'ready' | 'failed';
  audioTrack?: string;
}

export interface ImageAdjustment {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  temperature: number; // -100 to 100 (warmth)
  sharpness: number; // 0 to 100
  vignette: number; // 0 to 100
  blur: number; // 0 to 20
  filterPreset: 'normal' | 'cinematic' | 'golden_hour' | 'cyberpunk' | 'vintage_35mm' | 'noir' | 'pastel' | 'linen' | 'editorial' | 'nordic';
  inpaintPrompt?: string;
  watermarkText?: string;
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'top-right';
}

export interface VideoAdjustment {
  trimStart: number;
  trimEnd: number;
  effectOverlay: 'none' | 'anamorphic_flare' | 'film_grain' | 'vhs_scanlines' | 'cinematic_bloom';
  audioTrack: 'none' | 'cyberpunk_pulse' | 'cinematic_orchestral' | 'lofi_horizon' | 'ambient_space';
  playbackSpeed: number;
  includeWatermark: boolean;
}
