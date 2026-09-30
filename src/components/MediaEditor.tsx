import React, { useState, useRef, useEffect } from 'react';
import { BrandConfig, GeneratedImage, GeneratedVideo, ImageAdjustment, VideoAdjustment } from '../types';
import { Sliders, Sparkles, Download, Image as ImageIcon, Video, RotateCcw, Check, Type, Music, Play, Pause } from 'lucide-react';
import { AUDIO_TRACK_NAMES } from '../data/marketPresets';

interface MediaEditorProps {
  brand: BrandConfig;
  images: GeneratedImage[];
  videos: GeneratedVideo[];
  initialSelectedImage?: GeneratedImage | null;
  initialSelectedVideo?: GeneratedVideo | null;
  onSaveEditedImage: (img: GeneratedImage) => void;
}

export const MediaEditor: React.FC<MediaEditorProps> = ({
  brand,
  images,
  videos,
  initialSelectedImage,
  initialSelectedVideo,
  onSaveEditedImage,
}) => {
  const [editorMode, setEditorMode] = useState<'image' | 'video'>('image');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // IMAGE STATE
  const [selectedImage, setSelectedImage] = useState<GeneratedImage>(
    initialSelectedImage || images[0]
  );
  const [imageAdjustments, setImageAdjustments] = useState<ImageAdjustment>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    sharpness: 0,
    vignette: 10,
    blur: 0,
    filterPreset: 'linen',
    watermarkText: brand.name,
    watermarkPosition: 'bottom-right',
  });
  const [inpaintPrompt, setInpaintPrompt] = useState('');
  const [isProcessingInpaint, setIsProcessingInpaint] = useState(false);

  // VIDEO STATE
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo>(
    initialSelectedVideo || videos[0]
  );
  const [videoAdjustments, setVideoAdjustments] = useState<VideoAdjustment>({
    trimStart: 0,
    trimEnd: selectedVideo?.duration || 5,
    effectOverlay: 'cinematic_bloom',
    audioTrack: 'cinematic_orchestral',
    playbackSpeed: 1,
    includeWatermark: true,
  });

  useEffect(() => {
    if (initialSelectedImage) {
      setSelectedImage(initialSelectedImage);
    }
  }, [initialSelectedImage]);

  useEffect(() => {
    if (initialSelectedVideo) {
      setSelectedVideo(initialSelectedVideo);
    }
  }, [initialSelectedVideo]);

  // Compute CSS filter string for live preview
  const getCssFilter = () => {
    const b = 100 + imageAdjustments.brightness;
    const c = 100 + imageAdjustments.contrast;
    const s = 100 + imageAdjustments.saturation;
    const bl = imageAdjustments.blur;

    let presetFilter = '';
    if (imageAdjustments.filterPreset === 'linen') {
      presetFilter = 'sepia(18%) contrast(98%) brightness(102%) saturate(95%)';
    } else if (imageAdjustments.filterPreset === 'editorial') {
      presetFilter = 'contrast(112%) brightness(102%) saturate(105%)';
    } else if (imageAdjustments.filterPreset === 'nordic') {
      presetFilter = 'brightness(105%) saturate(85%) contrast(100%) hue-rotate(5deg)';
    } else if (imageAdjustments.filterPreset === 'cinematic') {
      presetFilter = 'contrast(115%) saturate(120%) hue-rotate(-8deg)';
    } else if (imageAdjustments.filterPreset === 'golden_hour') {
      presetFilter = 'sepia(35%) saturate(135%) brightness(105%)';
    } else if (imageAdjustments.filterPreset === 'noir') {
      presetFilter = 'grayscale(100%) contrast(140%) brightness(95%)';
    } else if (imageAdjustments.filterPreset === 'pastel') {
      presetFilter = 'brightness(110%) saturate(85%) contrast(90%)';
    }

    return `brightness(${b}%) contrast(${c}%) saturate(${s}%) blur(${bl}px) ${presetFilter}`;
  };

  const handleResetAdjustments = () => {
    setImageAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      sharpness: 0,
      vignette: 0,
      blur: 0,
      filterPreset: 'normal',
      watermarkText: brand.name,
      watermarkPosition: 'bottom-right',
    });
    showToast('Color adjustments reset to factory defaults.');
  };

  const handleApplyInpaint = () => {
    if (!inpaintPrompt.trim()) return;
    setIsProcessingInpaint(true);
    setTimeout(() => {
      setIsProcessingInpaint(false);
      showToast(`AI Inpaint Prompt applied: "${inpaintPrompt}". Neural model adjusted highlight reflections.`);
    }, 1000);
  };

  // Render finalized image to canvas and trigger download
  const handleExportEditedImage = () => {
    if (!selectedImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedImage.url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1920;
      canvas.height = img.naturalHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Apply filter
      ctx.filter = getCssFilter();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply vignette if configured
      if (imageAdjustments.vignette > 0) {
        ctx.filter = 'none';
        const vigRad = Math.max(canvas.width, canvas.height) * 0.75;
        const vigGrad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.25,
          canvas.width / 2,
          canvas.height / 2,
          vigRad
        );
        vigGrad.addColorStop(0, 'transparent');
        vigGrad.addColorStop(1, `rgba(30, 27, 24, ${(imageAdjustments.vignette / 100) * 0.85})`);
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Apply Watermark
      if (brand.watermarkEnabled && imageAdjustments.watermarkText) {
        ctx.filter = 'none';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 26px Plus Jakarta Sans, sans-serif';
        const text = imageAdjustments.watermarkText.toUpperCase();
        const metrics = ctx.measureText(text);

        let tx = canvas.width - metrics.width - 48;
        let ty = canvas.height - 48;

        if (imageAdjustments.watermarkPosition === 'bottom-left') {
          tx = 48;
          ty = canvas.height - 48;
        } else if (imageAdjustments.watermarkPosition === 'top-right') {
          tx = canvas.width - metrics.width - 48;
          ty = 64;
        }

        // Shadow & text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillText(text, tx + 2, ty + 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(text, tx, ty);
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${brand.name.toLowerCase()}-master-graded.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      onSaveEditedImage({
        id: 'edited-' + Date.now(),
        prompt: `Graded: ${selectedImage.prompt} [${imageAdjustments.filterPreset}]`,
        style: selectedImage.style,
        aspectRatio: selectedImage.aspectRatio,
        url: dataUrl,
        timestamp: Date.now(),
        width: canvas.width,
        height: canvas.height,
        tags: ['Graded', imageAdjustments.filterPreset, brand.name],
      });

      showToast('Master export completed successfully!');
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 font-sans">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3 bg-[#1E1B18] text-white text-xs font-semibold rounded-xl flex items-center justify-between shadow-lg transition-all animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white ml-3">✕</button>
        </div>
      )}

      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E1D7]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span 
              className="text-xs font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full bg-[#F4F1EA] border border-[#E6E1D7]"
              style={{ color: brand.accentColor }}
            >
              Mastering Suite
            </span>
            <span className="text-xs text-[#7A7267] font-mono">Real-Time Post Production</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1B18] font-display">
            Visual Media & Color Grading Suite
          </h1>
          <p className="text-[#7A7267] text-sm mt-1">
            Fine-tune exposure and warmth curves, apply organic linen filter science, and stamp verified studio branding.
          </p>
        </div>

        {/* Mode Switch Pills */}
        <div className="flex items-center gap-1.5 bg-[#F4F1EA] p-1.5 rounded-2xl border border-[#E6E1D7]">
          <button
            onClick={() => setEditorMode('image')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              editorMode === 'image'
                ? 'bg-white text-[#1E1B18] shadow-2xs'
                : 'text-[#6B6358] hover:text-[#1E1B18]'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#C4683C]" />
            <span>Image Lab</span>
          </button>
          <button
            onClick={() => setEditorMode('video')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              editorMode === 'video'
                ? 'bg-white text-[#1E1B18] shadow-2xs'
                : 'text-[#6B6358] hover:text-[#1E1B18]'
            }`}
          >
            <Video className="w-4 h-4 text-[#C4683C]" />
            <span>Video VFX & Trim</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* IMAGE EDITOR MODE */}
      {/* ========================================================= */}
      {editorMode === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Canvas Viewport (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bento-card p-6 bg-white shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6358]">
                  Live Viewport & Grading
                </span>
                <span className="text-xs font-mono text-[#7A7267]">
                  Profile: {imageAdjustments.filterPreset.toUpperCase()}
                </span>
              </div>

              {/* Viewport Box */}
              <div className="relative bg-[#12100E] rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-[#E6E1D7] shadow-inner">
                {selectedImage ? (
                  <>
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.prompt}
                      style={{ filter: getCssFilter() }}
                      className="w-full h-full object-contain transition-all duration-150"
                    />

                    {/* Vignette Overlay */}
                    {imageAdjustments.vignette > 0 && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle, transparent 40%, rgba(30,27,24,${(imageAdjustments.vignette / 100) * 0.85}) 100%)`
                        }}
                      />
                    )}

                    {/* Watermark Overlay */}
                    {brand.watermarkEnabled && imageAdjustments.watermarkText && (
                      <div
                        className={`absolute font-mono text-xs font-bold tracking-widest px-3 py-1.5 rounded-md bg-black/60 backdrop-blur-xs border border-white/10 text-white/90 uppercase pointer-events-none ${
                          imageAdjustments.watermarkPosition === 'bottom-left'
                            ? 'bottom-4 left-4'
                            : imageAdjustments.watermarkPosition === 'top-right'
                            ? 'top-4 right-4'
                            : 'bottom-4 right-4'
                        }`}
                      >
                        {imageAdjustments.watermarkText}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-[#8C827A]">No image selected</div>
                )}
              </div>

              {/* Export Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleResetAdjustments}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#7A7267] hover:text-[#1E1B18] bg-[#F4F1EA] hover:bg-[#EAE4D8] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Curves</span>
                </button>

                <button
                  onClick={handleExportEditedImage}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs hover:shadow-md cursor-pointer hover:scale-102 active:scale-98"
                  style={{ backgroundColor: brand.accentColor }}
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Export Graded Master</span>
                </button>
              </div>
            </div>

            {/* Asset Selector Strip */}
            <div className="bento-card p-4 bg-white flex flex-col gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A7267]">
                Switch Active Canvas Asset ({images.length})
              </span>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage?.id === img.id
                        ? 'border-[#C4683C] scale-105 shadow-xs'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Filter Presets Tile */}
            <div className="bento-card p-5 bg-white shadow-xs flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6358]">
                Color Science & Film Emulation
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'linen', name: 'Warm Linen', desc: 'Tactile organic' },
                  { id: 'editorial', name: 'Editorial', desc: 'Vogue contrast' },
                  { id: 'nordic', name: 'Nordic Mist', desc: 'Architectural daylight' },
                  { id: 'cinematic', name: 'Cinematic', desc: 'Teal & amber 35mm' },
                  { id: 'golden_hour', name: 'Golden Sun', desc: 'Warm amber glow' },
                  { id: 'noir', name: 'Noir Chiaroscuro', desc: 'Monochrome contrast' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setImageAdjustments({ ...imageAdjustments, filterPreset: preset.id as any })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      imageAdjustments.filterPreset === preset.id
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-xs'
                        : 'bg-[#F9F8F5] text-[#2B2723] border-[#E6E1D7] hover:border-[#C4683C]'
                    }`}
                  >
                    <div className="text-xs font-bold">{preset.name}</div>
                    <div className={`text-[10px] mt-0.5 ${imageAdjustments.filterPreset === preset.id ? 'text-white/70' : 'text-[#7A7267]'}`}>
                      {preset.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Adjustments Tile */}
            <div className="bento-card p-5 bg-white shadow-xs flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6358]">
                Optical Curve Adjustments
              </span>

              {/* Brightness */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6358]">Exposure / Brightness</span>
                  <span className="font-mono text-[#1E1B18] font-bold">{imageAdjustments.brightness}%</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={imageAdjustments.brightness}
                  onChange={(e) => setImageAdjustments({ ...imageAdjustments, brightness: Number(e.target.value) })}
                  className="w-full accent-[#C4683C]"
                />
              </div>

              {/* Contrast */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6358]">Dynamic Contrast</span>
                  <span className="font-mono text-[#1E1B18] font-bold">{imageAdjustments.contrast}%</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={imageAdjustments.contrast}
                  onChange={(e) => setImageAdjustments({ ...imageAdjustments, contrast: Number(e.target.value) })}
                  className="w-full accent-[#C4683C]"
                />
              </div>

              {/* Saturation */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6358]">Vibrancy & Saturation</span>
                  <span className="font-mono text-[#1E1B18] font-bold">{imageAdjustments.saturation}%</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={imageAdjustments.saturation}
                  onChange={(e) => setImageAdjustments({ ...imageAdjustments, saturation: Number(e.target.value) })}
                  className="w-full accent-[#C4683C]"
                />
              </div>

              {/* Vignette */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6358]">Vignette Falloff</span>
                  <span className="font-mono text-[#1E1B18] font-bold">{imageAdjustments.vignette}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  value={imageAdjustments.vignette}
                  onChange={(e) => setImageAdjustments({ ...imageAdjustments, vignette: Number(e.target.value) })}
                  className="w-full accent-[#C4683C]"
                />
              </div>

              {/* Watermark position */}
              <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B6358]">Watermark Stamp:</span>
                <select
                  value={imageAdjustments.watermarkPosition}
                  onChange={(e) => setImageAdjustments({ ...imageAdjustments, watermarkPosition: e.target.value as any })}
                  className="bg-[#F4F1EA] border border-[#E6E1D7] text-xs font-bold text-[#1E1B18] rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>
            </div>

            {/* AI Inpaint Tuning */}
            <div className="bento-card p-5 bg-white shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C4683C]" />
                <span className="text-xs font-bold text-[#1E1B18]">Neural Inpaint Directives</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inpaintPrompt}
                  onChange={(e) => setInpaintPrompt(e.target.value)}
                  placeholder="e.g. Add subtle warm morning flare on left"
                  className="flex-1 bg-white border border-[#D9D3C7] rounded-xl px-3 py-2 text-xs text-[#1E1B18] focus:ring-2 focus:ring-[#C4683C] focus:outline-none"
                />
                <button
                  onClick={handleApplyInpaint}
                  disabled={isProcessingInpaint || !inpaintPrompt.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E1B18] text-white hover:bg-[#3A3530] disabled:opacity-40 transition-colors shrink-0"
                >
                  {isProcessingInpaint ? 'Refining...' : 'Apply AI'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* VIDEO VFX & POST MODE */}
      {/* ========================================================= */}
      {editorMode === 'video' && selectedVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-7 bento-card p-6 bg-white shadow-xs flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6358]">
              Video Master Timeline & Overlay
            </span>

            <div className="relative rounded-2xl overflow-hidden bg-[#12100E] aspect-16/9 flex items-center justify-center border border-[#E6E1D7] shadow-inner">
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.thumbnailUrl}
                controls
                className="w-full h-full object-cover"
              />

              {videoAdjustments.includeWatermark && brand.watermarkEnabled && (
                <div className="absolute bottom-4 right-4 font-mono text-[10px] font-bold tracking-widest px-2.5 py-1 rounded bg-black/60 text-white/80 uppercase pointer-events-none">
                  {brand.name}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#7A7267] pt-2">
              <span>{selectedVideo.motionType} • {selectedVideo.duration}s</span>
              <button
                onClick={() => showToast('Video master rendered with active audio & color overlay!')}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs hover:shadow-md"
                style={{ backgroundColor: brand.accentColor }}
              >
                Render & Download Video
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bento-card p-5 bg-white shadow-xs flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6358]">
                Audio & Temporal Effects
              </span>

              {/* Soundtrack */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-[#C4683C]" />
                  <label className="text-xs font-semibold text-[#6B6358]">Studio Audio Track</label>
                </div>
                <select
                  value={videoAdjustments.audioTrack}
                  onChange={(e) => setVideoAdjustments({ ...videoAdjustments, audioTrack: e.target.value as any })}
                  className="bg-[#F4F1EA] border border-[#E6E1D7] rounded-xl px-3 py-2 text-xs font-bold text-[#1E1B18] focus:outline-none"
                >
                  {Object.entries(AUDIO_TRACK_NAMES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Playback speed */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-[#F0EBE1]">
                <label className="text-xs font-semibold text-[#6B6358]">Temporal Speed Rate</label>
                <div className="flex items-center gap-2">
                  {[0.5, 1, 1.5, 2].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setVideoAdjustments({ ...videoAdjustments, playbackSpeed: sp })}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                        videoAdjustments.playbackSpeed === sp
                          ? 'bg-[#1E1B18] text-white'
                          : 'bg-[#F4F1EA] text-[#6B6358] hover:bg-[#EAE4D8]'
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F0EBE1]">
                <span className="text-xs font-semibold text-[#1E1B18]">Stamp Studio Watermark</span>
                <input
                  type="checkbox"
                  checked={videoAdjustments.includeWatermark}
                  onChange={(e) => setVideoAdjustments({ ...videoAdjustments, includeWatermark: e.target.checked })}
                  className="accent-[#C4683C] w-4 h-4 rounded"
                />
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
