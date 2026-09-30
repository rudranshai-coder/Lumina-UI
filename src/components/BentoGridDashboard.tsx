import React, { useState } from 'react';
import { BrandConfig, GeneratedImage, GeneratedVideo, MarketBrandPreset } from '../types';
import { MARKET_BRAND_PRESETS } from '../data/marketPresets';
import { Sparkles, Play, Pause, ArrowUpRight, Zap, RefreshCw, Layers, Check, Sliders, Film, Video, Image as ImageIcon, Wand2, Palette, ShieldCheck, Download, Edit3 } from 'lucide-react';

interface BentoGridDashboardProps {
  brand: BrandConfig;
  onUpdateBrandName: (newName: string) => void;
  onSelectAccentColor: (color: string) => void;
  images: GeneratedImage[];
  videos: GeneratedVideo[];
  onNavigate: (tab: 'images' | 'videos' | 'editor' | 'brand') => void;
  onQuickGenerateImage: (prompt: string) => void;
  onQuickGenerateVideo: (prompt: string) => void;
  onSelectImageForEditor: (img: GeneratedImage) => void;
  onApplyMarketPreset: (preset: MarketBrandPreset) => void;
}

export const BentoGridDashboard: React.FC<BentoGridDashboardProps> = ({
  brand,
  onUpdateBrandName,
  onSelectAccentColor,
  images,
  videos,
  onNavigate,
  onQuickGenerateImage,
  onQuickGenerateVideo,
  onSelectImageForEditor,
  onApplyMarketPreset,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('Minimalist travertine pavilion surrounded by unbleached linen curtains, morning sunlight filtering through louvers, 8k editorial');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [isEditingInlineName, setIsEditingInlineName] = useState(false);
  const [inlineNameVal, setInlineNameVal] = useState(brand.name);
  const [quickMode, setQuickMode] = useState<'image' | 'video'>('image');

  const featuredVideo = videos[0] || {
    id: 'sample-vid',
    prompt: 'Cinematic drone shot gliding through mountain mist unveiling modernist pavilion',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    duration: 5,
    fps: 60,
    motionType: 'Drone Flyover' as any
  };

  const featuredImage = images[0] || {
    id: 'sample-img',
    prompt: 'Architectural still life with natural linen textures and sculpted ceramic stoneware',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    style: 'Architectural Minimal' as any,
    aspectRatio: '16:9' as any,
    tags: ['Architecture', 'Linen', 'Minimalist']
  };

  const handleTogglePlay = () => {
    if (videoRef) {
      if (isVideoPlaying) {
        videoRef.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const handleSaveInlineName = () => {
    if (inlineNameVal.trim()) {
      onUpdateBrandName(inlineNameVal.trim().toUpperCase());
    }
    setIsEditingInlineName(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 font-sans">
      
      {/* Top Banner: Studio State & Direct Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E6E1D7]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-xs font-bold tracking-[0.18em] uppercase"
              style={{ color: brand.accentColor }}
            >
              Generative Visuals & Kinetic Motion
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9D3C7]"></span>
            <span className="text-xs text-[#7A7267] font-mono">Bento Studio Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18] font-display">
            {brand.name} Studio Workspace
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('images')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#F9F8F5] border border-[#E6E1D7] text-[#1E1B18] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#C4683C]" />
            <span>Image Creator</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8C827A]" />
          </button>
          <button
            onClick={() => onNavigate('videos')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#F9F8F5] border border-[#E6E1D7] text-[#1E1B18] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Video className="w-3.5 h-3.5 text-[#C4683C]" />
            <span>Cinematic Motion</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8C827A]" />
          </button>
        </div>
      </div>

      {/* BENTO GRID LEVEL 1: Quick Prompt Deck & Active Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Bento Tile 1: Top Hero Prompt Controller (Span 7) */}
        <div className="lg:col-span-7 bento-card p-6 flex flex-col justify-between gap-5 relative overflow-hidden bg-white">
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: brand.accentColor }}
          />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex p-1 bg-[#F4F1EA] border border-[#E6E1D7] rounded-xl">
                <button
                  onClick={() => setQuickMode('image')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    quickMode === 'image'
                      ? 'bg-white text-[#1E1B18] shadow-2xs'
                      : 'text-[#6B6358] hover:text-[#1E1B18]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C4683C]" />
                  <span>Image Synthesis</span>
                </button>
                <button
                  onClick={() => setQuickMode('video')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    quickMode === 'video'
                      ? 'bg-white text-[#1E1B18] shadow-2xs'
                      : 'text-[#6B6358] hover:text-[#1E1B18]'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-[#C4683C]" />
                  <span>Cinematic Motion</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#7A7267] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.1 & Veo
              </span>
            </div>

            <div className="relative">
              <textarea
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Describe scene concept or motion..."
                rows={3}
                className="w-full px-4 py-3 text-sm text-[#1E1B18] placeholder-[#9C9486] bg-[#FFFFFF] border border-[#E6E1D7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C4683C] transition-all resize-none shadow-inner"
              />
            </div>

            {/* Quick action triggers */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-[10px] uppercase font-bold text-[#8C827A] whitespace-nowrap">Suggested:</span>
              <button 
                onClick={() => setQuickPrompt('Sculptural modern concrete pavilion in warm morning fog, travertine stone, sheer linen fabric')}
                className="px-2.5 py-1 rounded-lg bg-[#F4F1EA] text-[#4A443D] hover:bg-[#EAE4D8] whitespace-nowrap transition-colors"
              >
                Travertine Pavilion
              </button>
              <button 
                onClick={() => setQuickPrompt('Editorial fashion portrait, unbleached linen garments, soft sunlight shadows, 35mm film')}
                className="px-2.5 py-1 rounded-lg bg-[#F4F1EA] text-[#4A443D] hover:bg-[#EAE4D8] whitespace-nowrap transition-colors"
              >
                Linen Editorial
              </button>
              <button 
                onClick={() => setQuickPrompt('Slow drone shot of coastal turquoise waves crashing against sandstone cliffs at dawn')}
                className="px-2.5 py-1 rounded-lg bg-[#F4F1EA] text-[#4A443D] hover:bg-[#EAE4D8] whitespace-nowrap transition-colors"
              >
                Coastal Drone
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE1]">
            <span className="text-xs text-[#7A7267]">
              Instant generation with commercial rights
            </span>

            <button
              onClick={() => {
                if (quickMode === 'image') {
                  onQuickGenerateImage(quickPrompt);
                } else {
                  onQuickGenerateVideo(quickPrompt);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white transition-all shadow-xs hover:shadow-md cursor-pointer hover:scale-102 active:scale-98"
              style={{ backgroundColor: brand.accentColor }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{quickMode === 'image' ? 'Generate Image Still' : 'Synthesize Motion Video'}</span>
            </button>
          </div>
        </div>

        {/* Bento Tile 2: Active Cinematic Video Player (Span 5) */}
        <div className="lg:col-span-5 bento-card p-6 flex flex-col justify-between gap-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F4F1EA] flex items-center justify-center text-[#C4683C]">
                <Film className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E1B18]">Featured Video Playback</h3>
                <span className="text-[11px] text-[#7A7267]">Live scrub & temporal physics</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('videos')}
              className="text-xs text-[#C4683C] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Full Video Studio</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="relative w-full rounded-2xl overflow-hidden bg-[#12100E] aspect-16/9 flex items-center justify-center group shadow-xs">
            <video
              ref={(el) => setVideoRef(el)}
              src={featuredVideo.videoUrl}
              poster={featuredVideo.thumbnailUrl}
              loop
              playsInline
              onEnded={() => setIsVideoPlaying(false)}
              className="w-full h-full object-cover"
            />

            {!isVideoPlaying && (
              <button
                onClick={handleTogglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
              >
                <Play className="w-6 h-6 text-[#1E1B18] ml-1 fill-[#1E1B18]" />
              </button>
            )}

            {/* Studio Watermark Overlay */}
            {brand.watermarkEnabled && (
              <div className="absolute bottom-3 right-3 text-[10px] font-bold tracking-widest text-white/80 uppercase px-2.5 py-0.5 rounded bg-black/40 backdrop-blur-xs pointer-events-none">
                {brand.name}
              </div>
            )}

            {/* Video duration pill */}
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/50 text-[10px] font-mono text-white/90">
              {featuredVideo.duration}s • 60 FPS
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#7A7267] pt-1">
            <span className="line-clamp-1 italic max-w-[280px]">
              "{featuredVideo.prompt}"
            </span>
            <button
              onClick={handleTogglePlay}
              className="font-semibold text-[#1E1B18] hover:text-[#C4683C] transition-colors"
            >
              {isVideoPlaying ? 'Pause Video' : 'Play Video'}
            </button>
          </div>
        </div>

      </div>

      {/* BENTO GRID LEVEL 2: Market-Best Brand Presets & Interactive Identity Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Bento Tile 3: Market-Best Names & Brand Customizer (Span 8) */}
        <div className="lg:col-span-8 bento-card p-6 flex flex-col justify-between gap-5 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F4F1EA] flex items-center justify-center text-[#C4683C]">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1B18]">Market-Best Studio Names & Presets</h3>
                <p className="text-xs text-[#7A7267]">
                  Edit the software name to the best-performing market brand or personalize your own
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('brand')}
              className="text-xs font-semibold text-[#1E1B18] px-3 py-1.5 rounded-lg bg-[#F4F1EA] hover:bg-[#EAE4D8] transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C4683C]" />
              <span>Full Brand Suite</span>
            </button>
          </div>

          {/* Inline Live Name Editor */}
          <div className="bento-subcard p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: brand.accentColor }}
              >
                {brand.logoLetter}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#8C827A]">Active Software Name:</span>
                <span className="text-sm font-bold text-[#1E1B18]">{brand.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <input
                type="text"
                value={inlineNameVal}
                onChange={(e) => setInlineNameVal(e.target.value)}
                placeholder="Enter new studio name..."
                className="px-3 py-1.5 text-xs font-bold text-[#1E1B18] bg-white border border-[#D9D3C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4683C] w-full sm:w-48"
              />
              <button
                onClick={handleSaveInlineName}
                className="px-3 py-1.5 rounded-lg bg-[#1E1B18] text-white text-xs font-semibold hover:bg-[#3A3530] transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Curated Market Presets Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {MARKET_BRAND_PRESETS.map((preset) => {
              const isSelected = brand.name === preset.name;
              return (
                <button
                  key={preset.id}
                  onClick={() => onApplyMarketPreset(preset)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-xs'
                      : 'bg-[#F9F8F5] text-[#2B2723] border-[#E6E1D7] hover:border-[#C4683C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] text-white"
                        style={{ backgroundColor: preset.accentColor }}
                      >
                        {preset.logoLetter}
                      </span>
                      <span className="text-xs font-bold">{preset.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C4683C]" />}
                  </div>

                  <p className={`text-[10px] line-clamp-2 ${isSelected ? 'text-white/70' : 'text-[#7A7267]'}`}>
                    {preset.marketAppeal}
                  </p>

                  <div className="flex items-center justify-between text-[9px] uppercase font-semibold">
                    <span className={isSelected ? 'text-white/60' : 'text-[#8C827A]'}>{preset.category.split('•')[0]}</span>
                    <span className="text-[#C4683C] font-bold">1-Click Apply</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Tile 4: Creative Post-Production & Color Grading (Span 4) */}
        <div className="lg:col-span-4 bento-card p-6 flex flex-col justify-between gap-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F4F1EA] flex items-center justify-center text-[#C4683C]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E1B18]">Color Science & Grading</h3>
                <span className="text-[11px] text-[#7A7267]">Linen & editorial post-processing</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('editor')}
              className="text-xs text-[#C4683C] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Open Suite</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Filter Profile Badges */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bento-subcard p-2.5 flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#1E1B18]">Warm Linen</span>
              <span className="text-[10px] text-[#7A7267]">Tactile organic warmth</span>
            </div>
            <div className="bento-subcard p-2.5 flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#1E1B18]">Editorial Sand</span>
              <span className="text-[10px] text-[#7A7267]">Vogue magazine balance</span>
            </div>
            <div className="bento-subcard p-2.5 flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#1E1B18]">Nordic Mist</span>
              <span className="text-[10px] text-[#7A7267]">Architectural daylight</span>
            </div>
            <div className="bento-subcard p-2.5 flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#1E1B18]">Noir 35mm</span>
              <span className="text-[10px] text-[#7A7267]">Classic chiaroscuro</span>
            </div>
          </div>

          <div className="bento-subcard p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C4683C]" />
              <span className="text-xs font-semibold text-[#1E1B18]">Studio Signature Watermark</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">ENABLED</span>
          </div>

          <button
            onClick={() => onSelectImageForEditor(featuredImage)}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[#1E1B18] text-white hover:bg-[#3A3530] transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Grade Featured Asset</span>
          </button>
        </div>

      </div>

      {/* BENTO GRID LEVEL 3: Production Archive Gallery */}
      <div className="bento-card p-6 flex flex-col gap-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F4F1EA] flex items-center justify-center text-[#C4683C]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E1B18]">Studio Production Showcase</h3>
              <span className="text-xs text-[#7A7267]">Generated masters with optical realism</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('images')}
              className="text-xs font-semibold text-[#1E1B18] hover:text-[#C4683C] transition-colors"
            >
              View All Images ({images.length})
            </button>
            <span className="text-[#D9D3C7]">•</span>
            <button
              onClick={() => onNavigate('videos')}
              className="text-xs font-semibold text-[#1E1B18] hover:text-[#C4683C] transition-colors"
            >
              View All Videos ({videos.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.slice(0, 5).map((img) => (
            <div
              key={img.id}
              onClick={() => onSelectImageForEditor(img)}
              className="group relative rounded-2xl overflow-hidden border border-[#E6E1D7] hover:border-[#C4683C] cursor-pointer transition-all bg-[#F9F8F5] flex flex-col shadow-2xs hover:shadow-sm"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-bold text-white">
                  {img.aspectRatio}
                </div>
              </div>

              <div className="p-2.5 flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-[#1E1B18] line-clamp-1 group-hover:text-[#C4683C] transition-colors">
                  {img.style} Still
                </span>
                <span className="text-[10px] text-[#8C827A] truncate">
                  "{img.prompt}"
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
