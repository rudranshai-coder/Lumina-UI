import React, { useState } from 'react';
import { AspectRatio, BrandConfig, GeneratedImage, ImageStyle } from '../types';
import { Sparkles, Wand2, Download, Sliders, Film, Copy, Check, ZoomIn, RefreshCw, Layers } from 'lucide-react';
import { enhancePrompt } from '../services/api';

interface ImageStudioProps {
  brand: BrandConfig;
  images: GeneratedImage[];
  onGenerateImage: (prompt: string, style: ImageStyle, aspect: AspectRatio, negPrompt?: string) => Promise<void>;
  isGenerating: boolean;
  onSendToEditor: (img: GeneratedImage) => void;
  onSendToVideo: (img: GeneratedImage) => void;
}

const STYLES: { name: ImageStyle; label: string; desc: string }[] = [
  { name: 'Photorealistic', label: 'Photorealistic', desc: 'True-to-life 8k natural optics' },
  { name: 'Editorial Fashion', label: 'Editorial Fashion', desc: 'Vogue cover high-contrast studio portrait' },
  { name: 'Cinematic Film', label: 'Cinematic Film', desc: 'Anamorphic lens, 70mm movie still' },
  { name: 'Architectural Minimal', label: 'Architecture', desc: 'Travertine stone & slatted wood light' },
  { name: '3D Isometric', label: '3D Octane', desc: 'Octane & Redshift clay render 3D' },
  { name: 'Cyberpunk Neon', label: 'Cyberpunk', desc: 'Luminous cyan, magenta, rainy reflections' },
  { name: 'Anime & Manga', label: 'Anime & Manga', desc: 'Makoto Shinkai style hand-drawn vibrancy' },
  { name: 'Oil Painting', label: 'Oil Painting', desc: 'Classic textured brush strokes and chiaroscuro' },
  { name: 'Dark Fantasy', label: 'Dark Fantasy', desc: 'Moody atmospheric gothic concept art' },
];

const ASPECT_RATIOS: { ratio: AspectRatio; label: string; icon: string }[] = [
  { ratio: '16:9', label: 'Landscape (16:9)', icon: 'w-6 h-3.5' },
  { ratio: '9:16', label: 'Story / Reel (9:16)', icon: 'w-3.5 h-6' },
  { ratio: '1:1', label: 'Square (1:1)', icon: 'w-5 h-5' },
  { ratio: '4:3', label: 'Classic (4:3)', icon: 'w-5 h-4' },
  { ratio: '21:9', label: 'Cinemascope (21:9)', icon: 'w-7 h-3' },
];

export const ImageStudio: React.FC<ImageStudioProps> = ({
  brand,
  images,
  onGenerateImage,
  isGenerating,
  onSendToEditor,
  onSendToVideo,
}) => {
  const [prompt, setPrompt] = useState('Minimalist travertine pavilion with pure unbleached linen drapery, soft morning sun rays, architectural editorial');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('Editorial Fashion');
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>('16:9');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, oversaturated, deformed hands');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<GeneratedImage | null>(null);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt, 'image');
      setPrompt(enhanced);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerateImage(prompt, selectedStyle, selectedAspect, negativePrompt);
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = `${brand.name.toLowerCase()}-image-${img.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 font-sans">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E6E1D7]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span 
              className="text-xs font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full bg-[#F4F1EA] border border-[#E6E1D7]"
              style={{ color: brand.accentColor }}
            >
              Synthesis Module
            </span>
            <span className="text-xs text-[#7A7267] font-mono">Gemini Flash Image Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1B18] font-display">
            High-Fidelity Image Generation
          </h1>
          <p className="text-[#7A7267] text-sm mt-1 max-w-2xl">
            Synthesize photo-realist scenes, concept art, and high-resolution commercial visual assets with full aspect ratio control and cinematic camera optics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-[#6B6358] bg-white px-3.5 py-2 rounded-xl border border-[#E6E1D7] flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Total Synthesized: <strong className="text-[#1E1B18] font-mono">{images.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Creation Card */}
      <div className="bento-card p-6 sm:p-8 bg-white shadow-xs relative overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Prompt Input Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6358] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C4683C]" />
                <span>Prompt Input</span>
              </label>

              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !prompt.trim()}
                className="text-xs font-semibold text-[#1E1B18] bg-[#F4F1EA] hover:bg-[#EAE4D8] px-3 py-1.5 rounded-lg border border-[#E6E1D7] disabled:opacity-40 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="Use Gemini AI to enhance prompt with camera, lighting, and texture specifications"
              >
                {isEnhancing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C4683C]" />
                    <span>Expanding prompt...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-[#C4683C]" />
                    <span>AI Magic Enhance</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe your visual concept in detail (subject, environment, lighting, lens, mood)..."
                className="w-full bg-white border border-[#E6E1D7] focus:ring-2 focus:ring-[#C4683C] rounded-2xl p-4 text-sm text-[#1E1B18] placeholder-[#9C9486] focus:outline-none transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          {/* Style Selector Chips */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7267]">
              Artistic & Optical Style
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {STYLES.map((st) => (
                <button
                  type="button"
                  key={st.name}
                  onClick={() => setSelectedStyle(st.name)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedStyle === st.name
                      ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-xs'
                      : 'bg-[#F9F8F5] text-[#2B2723] border-[#E6E1D7] hover:border-[#C4683C]'
                  }`}
                >
                  <div className="text-xs font-bold">{st.label}</div>
                  <div className={`text-[10px] truncate mt-0.5 ${selectedStyle === st.name ? 'text-white/70' : 'text-[#7A7267]'}`}>
                    {st.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[#F0EBE1]">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A7267]">
                Aspect Ratio Format
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    type="button"
                    key={ar.ratio}
                    onClick={() => setSelectedAspect(ar.ratio)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedAspect === ar.ratio
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-xs'
                        : 'bg-[#F4F1EA] text-[#6B6358] border-[#E6E1D7] hover:bg-[#EAE4D8]'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-medium text-[#7A7267] hover:text-[#1E1B18] underline cursor-pointer self-end sm:self-auto"
            >
              {showAdvanced ? 'Hide Advanced Options' : 'Advanced Tuning (Negative Prompt)'}
            </button>
          </div>

          {/* Advanced Options Accordion */}
          {showAdvanced && (
            <div className="p-4 bg-[#F9F8F5] rounded-2xl border border-[#E6E1D7] flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A7267]">
                Negative Prompt (Elements to avoid)
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="e.g. low quality, blurry, duplicate, watermark"
                className="w-full bg-white border border-[#D9D3C7] rounded-xl px-3.5 py-2 text-xs text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#C4683C]"
              />
            </div>
          )}

          {/* Action Button Row */}
          <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE1]">
            <div className="text-xs text-[#7A7267]">
              Output: <span className="font-mono text-[#1E1B18] font-semibold">8K Ultra Resolution • {selectedAspect}</span>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer flex items-center gap-2 shadow-xs hover:shadow-md disabled:opacity-50 hover:scale-102 active:scale-98"
              style={{ backgroundColor: brand.accentColor }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Visuals...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Artwork</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Gallery Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1E1B18] font-display">
            Synthesized Media Archive
          </h2>
          <span className="text-xs text-[#7A7267] font-mono">{images.length} assets ready</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bento-card overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md bg-white border-[#E6E1D7]"
            >
              {/* Image Display */}
              <div 
                className="relative bg-black aspect-video overflow-hidden cursor-pointer"
                onClick={() => setSelectedPreviewImage(img)}
              >
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Style badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white border border-white/10">
                    {img.style}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white/90 border border-white/10">
                    {img.aspectRatio}
                  </span>
                </div>

                {/* Hover overlay with zoom */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2.5 rounded-full bg-white/30 backdrop-blur-xs text-white">
                    <ZoomIn className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Card Meta & Controls */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <p className="text-xs text-[#4A443D] line-clamp-2 leading-relaxed">
                  "{img.prompt}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE1] text-xs text-[#7A7267]">
                  <button
                    onClick={() => handleCopyPrompt(img.prompt, img.id)}
                    className="flex items-center gap-1 hover:text-[#1E1B18] transition-colors cursor-pointer"
                    title="Copy Prompt"
                  >
                    {copiedId === img.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Prompt</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSendToEditor(img)}
                      className="p-1.5 rounded-lg bg-[#F4F1EA] hover:bg-[#EAE4D8] text-[#1E1B18] transition-colors cursor-pointer"
                      title="Open in Image Editor"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSendToVideo(img)}
                      className="p-1.5 rounded-lg bg-[#F4F1EA] hover:bg-[#EAE4D8] text-[#C4683C] transition-colors cursor-pointer"
                      title="Generate Video from this Image"
                    >
                      <Film className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDownload(img)}
                      className="p-1.5 rounded-lg bg-[#F4F1EA] hover:bg-[#EAE4D8] text-[#1E1B18] transition-colors cursor-pointer"
                      title="Download 8K Visual"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {selectedPreviewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div 
            className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={selectedPreviewImage.url}
                alt={selectedPreviewImage.prompt}
                className="max-h-[70vh] w-auto object-contain"
              />

              {brand.watermarkEnabled && (
                <div className="absolute bottom-4 right-4 text-xs font-bold uppercase tracking-widest text-white/90 bg-black/50 px-3 py-1 rounded backdrop-blur-xs pointer-events-none">
                  {brand.name}
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C4683C] block mb-1">
                  {selectedPreviewImage.style} • {selectedPreviewImage.aspectRatio}
                </span>
                <p className="text-xs text-[#1E1B18] leading-relaxed">
                  "{selectedPreviewImage.prompt}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onSendToEditor(selectedPreviewImage);
                    setSelectedPreviewImage(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E1B18] text-white hover:bg-[#3A3530]"
                >
                  Open in Editor
                </button>
                <button
                  onClick={() => handleDownload(selectedPreviewImage)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F4F1EA] text-[#1E1B18] hover:bg-[#EAE4D8]"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
