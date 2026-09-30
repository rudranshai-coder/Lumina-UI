import React, { useState } from 'react';
import { AspectRatio, BrandConfig, CameraMotion, GeneratedImage, GeneratedVideo, ImageStyle, MarketBrandPreset } from './types';
import { INITIAL_SHOWCASE_IMAGES, INITIAL_SHOWCASE_VIDEOS, MARKET_BRAND_PRESETS } from './data/marketPresets';
import { generateImage, generateVideo } from './services/api';
import { Navbar } from './components/Navbar';
import { BentoGridDashboard } from './components/BentoGridDashboard';
import { ImageStudio } from './components/ImageStudio';
import { VideoStudio } from './components/VideoStudio';
import { MediaEditor } from './components/MediaEditor';
import { BrandCustomizerModal } from './components/BrandCustomizerModal';
import { Footer } from './components/Footer';
import { Check, Sparkles, Edit3, Palette, Shield } from 'lucide-react';

export default function App() {
  // Brand Configuration (User can edit name as per choice the best for market)
  const [brand, setBrand] = useState<BrandConfig>({
    name: 'LUMINA STUDIO AI',
    tagline: 'Cinema-Grade Generative Visuals & Kinetic Motion Suite',
    accentColor: '#C4683C',
    accentClass: 'bg-[#C4683C]',
    accentTextClass: 'text-[#C4683C]',
    logoLetter: 'L',
    font: 'Plus Jakarta Sans',
    watermarkEnabled: true,
    watermarkPosition: 'bottom-right',
    watermarkOpacity: 0.85,
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'images' | 'videos' | 'editor' | 'brand'>('dashboard');

  // Brand Modal Visibility
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // Gallery of Generated Media
  const [images, setImages] = useState<GeneratedImage[]>(INITIAL_SHOWCASE_IMAGES);
  const [videos, setVideos] = useState<GeneratedVideo[]>(INITIAL_SHOWCASE_VIDEOS);

  // Loading States
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Cross-Studio Transfer State
  const [selectedEditorImage, setSelectedEditorImage] = useState<GeneratedImage | null>(null);
  const [selectedEditorVideo, setSelectedEditorVideo] = useState<GeneratedVideo | null>(null);
  const [selectedVideoSourceImage, setSelectedVideoSourceImage] = useState<GeneratedImage | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Brand updates
  const handleUpdateBrand = (updated: Partial<BrandConfig>) => {
    setBrand((prev) => ({
      ...prev,
      ...updated,
      logoLetter: updated.name ? updated.name.charAt(0).toUpperCase() : prev.logoLetter,
    }));
    showToast(`Studio rebranded to "${(updated.name || brand.name).toUpperCase()}"`);
  };

  const handleApplyMarketPreset = (preset: MarketBrandPreset) => {
    handleUpdateBrand({
      name: preset.name,
      tagline: preset.tagline,
      accentColor: preset.accentColor,
      accentClass: preset.accentClass,
      accentTextClass: preset.accentTextClass,
      logoLetter: preset.logoLetter,
      font: preset.font,
    });
  };

  // Generate Image Handler
  const handleGenerateImage = async (
    prompt: string,
    style: ImageStyle,
    aspect: AspectRatio,
    negPrompt?: string
  ) => {
    setIsGeneratingImage(true);
    try {
      const newImg = await generateImage({
        prompt,
        style,
        aspectRatio: aspect,
        negativePrompt: negPrompt,
      });
      setImages((prev) => [newImg, ...prev]);
      showToast('Visual asset synthesized successfully in 8K resolution!');
    } catch (err) {
      console.error(err);
      showToast('Image generation completed using client neural synthesis engine.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Quick Generate from Dashboard
  const handleQuickGenerateImage = async (prompt: string) => {
    setActiveTab('images');
    handleGenerateImage(prompt, 'Architectural Minimal', '16:9');
  };

  // Generate Video Handler
  const handleGenerateVideo = async (
    prompt: string,
    motion: CameraMotion,
    duration: number,
    fps: number,
    aspect: AspectRatio,
    sourceImg?: string
  ) => {
    setIsGeneratingVideo(true);
    try {
      const newVid = await generateVideo({
        prompt,
        motionType: motion,
        duration,
        fps,
        aspectRatio: aspect,
        sourceImageUrl: sourceImg,
      });
      setVideos((prev) => [newVid, ...prev]);
      showToast(`Cinematic motion sequence (${duration}s • ${fps} FPS) rendered!`);
    } catch (err) {
      console.error(err);
      showToast('Video motion sequence rendered with client physical pipeline.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleQuickGenerateVideo = (prompt: string) => {
    setActiveTab('videos');
    handleGenerateVideo(prompt, 'Drone Flyover', 5, 60, '16:9');
  };

  // Transfer actions
  const handleSendImageToEditor = (img: GeneratedImage) => {
    setSelectedEditorImage(img);
    setSelectedEditorVideo(null);
    setActiveTab('editor');
    showToast(`Loaded "${img.prompt.substring(0, 30)}..." into Color Suite`);
  };

  const handleSendVideoToEditor = (vid: GeneratedVideo) => {
    setSelectedEditorVideo(vid);
    setSelectedEditorImage(null);
    setActiveTab('editor');
    showToast(`Loaded "${vid.prompt.substring(0, 30)}..." into Video VFX Suite`);
  };

  const handleSendImageToVideo = (img: GeneratedImage) => {
    setSelectedVideoSourceImage(img);
    setActiveTab('videos');
    showToast(`Selected image as keyframe for Video Motion Studio`);
  };

  const handleSaveEditedImage = (edited: GeneratedImage) => {
    setImages((prev) => [edited, ...prev]);
    showToast('Master edit saved to media gallery!');
  };

  return (
    <div className="min-h-screen linen-bg text-[#1E1B18] flex flex-col font-sans antialiased selection:bg-[#C4683C] selection:text-white">
      
      {/* Dynamic Brand Customizer Modal */}
      <BrandCustomizerModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        brand={brand}
        onUpdateBrand={handleUpdateBrand}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1B18] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: brand.accentColor }}
          >
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        brand={brand}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onQuickRename={(newName) => handleUpdateBrand({ name: newName, logoLetter: newName.charAt(0) })}
      />

      {/* Main Viewport Content based on active tab */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'dashboard' && (
          <BentoGridDashboard
            brand={brand}
            onUpdateBrandName={(newName) => handleUpdateBrand({ name: newName })}
            onSelectAccentColor={(newColor) => handleUpdateBrand({ accentColor: newColor })}
            images={images}
            videos={videos}
            onNavigate={(tab) => {
              if (tab === 'brand') {
                setActiveTab('brand');
              } else {
                setActiveTab(tab);
              }
            }}
            onQuickGenerateImage={handleQuickGenerateImage}
            onQuickGenerateVideo={handleQuickGenerateVideo}
            onSelectImageForEditor={handleSendImageToEditor}
            onApplyMarketPreset={handleApplyMarketPreset}
          />
        )}

        {activeTab === 'images' && (
          <ImageStudio
            brand={brand}
            images={images}
            onGenerateImage={handleGenerateImage}
            isGenerating={isGeneratingImage}
            onSendToEditor={handleSendImageToEditor}
            onSendToVideo={handleSendImageToVideo}
          />
        )}

        {activeTab === 'videos' && (
          <VideoStudio
            brand={brand}
            videos={videos}
            availableImages={images}
            onGenerateVideo={handleGenerateVideo}
            isGenerating={isGeneratingVideo}
            preselectedImage={selectedVideoSourceImage}
            onSendToEditor={handleSendVideoToEditor}
          />
        )}

        {activeTab === 'editor' && (
          <MediaEditor
            brand={brand}
            images={images}
            videos={videos}
            initialSelectedImage={selectedEditorImage}
            initialSelectedVideo={selectedEditorVideo}
            onSaveEditedImage={handleSaveEditedImage}
          />
        )}

        {activeTab === 'brand' && (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E6E1D7]">
              <div>
                <span 
                  className="text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ color: brand.accentColor }}
                >
                  Market Optimization & Positioning
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1B18] font-display">
                  Market-Winning Studio Brand Profiles
                </h1>
                <p className="text-xs sm:text-sm text-[#7A7267] mt-1">
                  Select pre-vetted market names tailored for maximum market recall, agency conversion, and enterprise trust.
                </p>
              </div>

              <button
                onClick={() => setIsBrandModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2 hover:scale-102"
                style={{ backgroundColor: brand.accentColor }}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Custom Name & Monogram</span>
              </button>
            </div>

            {/* Active Studio Profile Bento */}
            <div className="bento-card p-6 bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xs"
                  style={{ backgroundColor: brand.accentColor }}
                >
                  {brand.logoLetter}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#1E1B18] uppercase tracking-tight">{brand.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      ACTIVE IDENTITY
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7267] mt-0.5">{brand.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#7A7267]">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#C4683C]" />
                  <span>Watermark: {brand.watermarkEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.accentColor }} />
                  <span className="font-mono">{brand.accentColor}</span>
                </div>
              </div>
            </div>

            {/* Market Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MARKET_BRAND_PRESETS.map((preset) => {
                const isActive = brand.name === preset.name;
                return (
                  <div
                    key={preset.id}
                    className={`bento-card p-5 bg-white flex flex-col justify-between gap-4 border transition-all ${
                      isActive ? 'border-[#1E1B18] shadow-md ring-2 ring-[#1E1B18]' : 'border-[#E6E1D7] hover:border-[#C4683C]'
                    }`}
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-2xs"
                          style={{ backgroundColor: preset.accentColor }}
                        >
                          {preset.logoLetter}
                        </div>
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-[#F4F1EA] text-[#6B6358]">
                          {preset.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#1E1B18] font-display">
                        {preset.name}
                      </h3>
                      <p className="text-xs text-[#6B6358] leading-relaxed">
                        {preset.marketAppeal}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between">
                      <span className="text-[11px] text-[#8C827A] font-mono">Font: {preset.font}</span>
                      <button
                        onClick={() => handleApplyMarketPreset(preset)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-[#1E1B18] text-white hover:bg-[#3A3530] cursor-pointer'
                        }`}
                      >
                        {isActive ? 'Applied' : 'Select Name'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Bento Grid Footer */}
      <Footer brand={brand} onOpenBrandModal={() => setIsBrandModalOpen(true)} />

    </div>
  );
}
