import React, { useState, useRef, useEffect } from 'react';
import { AspectRatio, BrandConfig, CameraMotion, GeneratedImage, GeneratedVideo } from '../types';
import { Video, Sparkles, Wand2, Play, Pause, RotateCcw, Download, Film, Sliders, Volume2, VolumeX, RefreshCw, Layers } from 'lucide-react';
import { enhancePrompt } from '../services/api';

interface VideoStudioProps {
  brand: BrandConfig;
  videos: GeneratedVideo[];
  availableImages: GeneratedImage[];
  onGenerateVideo: (
    prompt: string,
    motion: CameraMotion,
    duration: number,
    fps: number,
    aspect: AspectRatio,
    sourceImg?: string
  ) => Promise<void>;
  isGenerating: boolean;
  preselectedImage?: GeneratedImage | null;
  onSendToEditor: (vid: GeneratedVideo) => void;
}

const MOTIONS: { name: CameraMotion; label: string; desc: string }[] = [
  { name: 'Drone Flyover', label: 'Drone Flyover', desc: 'Sweeping aerial descent through atmospheric mist' },
  { name: 'Zoom In', label: 'Slow Dolly In', desc: 'Cinematic dolly push towards center subject' },
  { name: 'Orbit 360', label: '360° Orbital', desc: 'Seamless orbital turn around focal anchor' },
  { name: 'Pan Right', label: 'Tracking Pan Right', desc: 'Lateral camera dolly along scenic horizon' },
  { name: 'Pan Left', label: 'Tracking Pan Left', desc: 'Fluid camera pan leftwards revealing context' },
  { name: 'Tilt Up', label: 'Monumental Tilt Up', desc: 'Vertical crane sweep revealing soaring height' },
  { name: 'Handheld Cam', label: 'Organic Handheld', desc: 'Subtle realistic cinema camera breathing' },
];

export const VideoStudio: React.FC<VideoStudioProps> = ({
  brand,
  videos,
  availableImages,
  onGenerateVideo,
  isGenerating,
  preselectedImage,
  onSendToEditor,
}) => {
  const [prompt, setPrompt] = useState('Cinematic slow-motion shot of natural linen curtains fluttering in morning wind in travertine gallery, 4k 60fps');
  const [motion, setMotion] = useState<CameraMotion>('Drone Flyover');
  const [duration, setDuration] = useState<number>(5);
  const [fps, setFps] = useState<number>(60);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedSourceImage, setSelectedSourceImage] = useState<string | undefined>(preselectedImage?.url);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Active player state
  const activeVideo = videos[0];
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(activeVideo || null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(5);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    }
  }, [videos, selectedVideo]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt, 'video');
      setPrompt(enhanced);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoElementRef.current) {
      setCurrentTime(videoElementRef.current.currentTime);
      setVideoDuration(videoElementRef.current.duration || 5);
    }
  };

  const togglePlay = () => {
    if (videoElementRef.current) {
      if (isPlaying) {
        videoElementRef.current.pause();
        setIsPlaying(false);
      } else {
        videoElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoElementRef.current) {
      videoElementRef.current.playbackRate = speed;
    }
  };

  const handleToggleMute = () => {
    if (videoElementRef.current) {
      videoElementRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerateVideo(prompt, motion, duration, fps, aspectRatio, selectedSourceImage);
  };

  const handleDownload = (vid: GeneratedVideo) => {
    const a = document.createElement('a');
    a.href = vid.videoUrl;
    a.download = `${brand.name.toLowerCase()}-motion-${vid.id}.mp4`;
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
              Motion Physics Engine
            </span>
            <span className="text-xs text-[#7A7267] font-mono">Neural Cinema Synthesizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1B18] font-display">
            Cinematic AI Video Generation
          </h1>
          <p className="text-[#7A7267] text-sm mt-1 max-w-2xl">
            Synthesize continuous high-definition motion video sequences with customizable camera trajectories, frame rates, and temporal continuity.
          </p>
        </div>

        <div className="text-xs text-[#6B6358] bg-white px-3.5 py-2 rounded-xl border border-[#E6E1D7] flex items-center gap-2 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Videos Ready: <strong className="text-[#1E1B18] font-mono">{videos.length}</strong></span>
        </div>
      </div>

      {/* Main Two-Column Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form & Motion Parameters (Span 6) */}
        <div className="lg:col-span-6 bento-card p-6 sm:p-7 bg-white shadow-xs flex flex-col gap-5">
          <form onSubmit={handleGenerate} className="flex flex-col gap-5">
            
            {/* Prompt */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6358] flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#C4683C]" />
                  <span>Cinematic Motion Prompt</span>
                </label>

                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="text-xs font-semibold text-[#1E1B18] bg-[#F4F1EA] hover:bg-[#EAE4D8] px-3 py-1.5 rounded-lg border border-[#E6E1D7] disabled:opacity-40 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  {isEnhancing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C4683C]" />
                      <span>Directing scene...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5 text-[#C4683C]" />
                      <span>AI Cinematographer</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe scene action, fluid dynamics, camera movement, and atmospheric effects..."
                className="w-full bg-white border border-[#E6E1D7] focus:ring-2 focus:ring-[#C4683C] rounded-2xl p-4 text-sm text-[#1E1B18] placeholder-[#9C9486] focus:outline-none transition-all resize-none shadow-inner"
              />
            </div>

            {/* Camera Motion Trajectory */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A7267]">
                Camera Rig Physics
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MOTIONS.map((m) => (
                  <button
                    type="button"
                    key={m.name}
                    onClick={() => setMotion(m.name)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      motion === m.name
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-xs'
                        : 'bg-[#F9F8F5] text-[#2B2723] border-[#E6E1D7] hover:border-[#C4683C]'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className={`text-[10px] line-clamp-1 mt-0.5 ${motion === m.name ? 'text-white/70' : 'text-[#7A7267]'}`}>
                      {m.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Parameters: Duration, FPS, Aspect Ratio */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#F0EBE1]">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#7A7267]">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="bg-[#F4F1EA] border border-[#E6E1D7] rounded-xl px-3 py-2 text-xs font-bold text-[#1E1B18] focus:outline-none"
                >
                  <option value={3}>3 Seconds</option>
                  <option value={5}>5 Seconds</option>
                  <option value={8}>8 Seconds (Pro)</option>
                  <option value={10}>10 Seconds (Cinema)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#7A7267]">Framerate</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="bg-[#F4F1EA] border border-[#E6E1D7] rounded-xl px-3 py-2 text-xs font-bold text-[#1E1B18] focus:outline-none"
                >
                  <option value={24}>24 FPS (Film Look)</option>
                  <option value={30}>30 FPS (Standard)</option>
                  <option value={60}>60 FPS (Ultra Smooth)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#7A7267]">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="bg-[#F4F1EA] border border-[#E6E1D7] rounded-xl px-3 py-2 text-xs font-bold text-[#1E1B18] focus:outline-none"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Reel / Story</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="21:9">21:9 Cinemascope</option>
                </select>
              </div>
            </div>

            {/* Optional Source Image Anchor */}
            {availableImages.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#F0EBE1]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A7267]">
                    Optional Keyframe Anchor (Image-to-Video)
                  </span>
                  {selectedSourceImage && (
                    <button
                      type="button"
                      onClick={() => setSelectedSourceImage(undefined)}
                      className="text-[10px] text-[#C4683C] hover:underline"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {availableImages.map((img) => (
                    <button
                      type="button"
                      key={img.id}
                      onClick={() => setSelectedSourceImage(img.url)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedSourceImage === img.url
                          ? 'border-[#C4683C] scale-105 shadow-xs'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between">
              <span className="text-xs text-[#7A7267]">
                Camera Physics: <strong className="text-[#1E1B18]">{motion}</strong>
              </span>

              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="px-7 py-3 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2 shadow-xs hover:shadow-md disabled:opacity-50 hover:scale-102 active:scale-98"
                style={{ backgroundColor: brand.accentColor }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rendering Temporal Frames...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    <span>Synthesize Motion Video</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Interactive Video Player Stage (Span 6) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {selectedVideo ? (
            <div className="bento-card p-6 bg-white shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B18]">Master Monitor</h3>
                  <span className="text-[11px] text-[#7A7267]">
                    {selectedVideo.fps} FPS • {selectedVideo.motionType} • {selectedVideo.duration}s
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSendToEditor(selectedVideo)}
                    className="p-1.5 rounded-lg bg-[#F4F1EA] hover:bg-[#EAE4D8] text-[#1E1B18] transition-colors"
                    title="Send to Editor"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownload(selectedVideo)}
                    className="p-1.5 rounded-lg bg-[#F4F1EA] hover:bg-[#EAE4D8] text-[#1E1B18] transition-colors"
                    title="Download MP4"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Video Monitor */}
              <div className="relative rounded-2xl overflow-hidden bg-[#12100E] aspect-16/9 flex items-center justify-center group shadow-xs">
                <video
                  ref={videoElementRef}
                  src={selectedVideo.videoUrl}
                  poster={selectedVideo.thumbnailUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
                  >
                    <Play className="w-7 h-7 text-[#1E1B18] ml-1 fill-[#1E1B18]" />
                  </button>
                )}

                {brand.watermarkEnabled && (
                  <div className="absolute bottom-3 right-3 text-[10px] font-bold tracking-widest text-white/80 uppercase px-2.5 py-0.5 rounded bg-black/40 backdrop-blur-xs pointer-events-none">
                    {brand.name}
                  </div>
                )}
              </div>

              {/* Scrubber Timeline */}
              <div className="flex flex-col gap-2 pt-1">
                <input
                  type="range"
                  min={0}
                  max={videoDuration}
                  step={0.05}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-[#C4683C] cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs text-[#7A7267]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-1 text-[#1E1B18] hover:text-[#C4683C] font-semibold"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleToggleMute}
                      className="p-1 text-[#7A7267] hover:text-[#1E1B18]"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[11px]">
                      {currentTime.toFixed(1)}s / {videoDuration.toFixed(1)}s
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[0.5, 1, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          playbackSpeed === s
                            ? 'bg-[#1E1B18] text-white'
                            : 'bg-[#F4F1EA] text-[#7A7267] hover:text-[#1E1B18]'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0EBE1] text-xs text-[#4A443D] leading-relaxed">
                <span className="font-semibold text-[#1E1B18]">Prompt:</span> "{selectedVideo.prompt}"
              </div>
            </div>
          ) : (
            <div className="bento-card p-12 bg-white flex flex-col items-center justify-center text-center gap-3">
              <Film className="w-8 h-8 text-[#8C827A]" />
              <h4 className="text-sm font-bold text-[#1E1B18]">No Video Selected</h4>
              <p className="text-xs text-[#7A7267]">Select a video from the library below or synthesize a new sequence.</p>
            </div>
          )}

          {/* Video Library Strip */}
          <div className="bento-card p-4 bg-white flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7267]">
              Video Generation Archive ({videos.length})
            </span>
            <div className="grid grid-cols-3 gap-2">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-video ${
                    selectedVideo?.id === vid.id ? 'border-[#C4683C] shadow-xs' : 'border-transparent hover:border-[#E6E1D7]'
                  }`}
                >
                  <img src={vid.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white opacity-80" />
                  </div>
                  <div className="absolute bottom-1 left-1 px-1 rounded bg-black/60 text-[9px] font-mono text-white">
                    {vid.duration}s
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
