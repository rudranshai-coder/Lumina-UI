import React, { useState } from 'react';
import { BrandConfig, MarketBrandPreset } from '../types';
import { MARKET_BRAND_PRESETS } from '../data/marketPresets';
import { Palette, Sparkles, Check, X, Shield, Type, RefreshCw, Zap } from 'lucide-react';

interface BrandCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandConfig;
  onUpdateBrand: (updated: Partial<BrandConfig>) => void;
}

const COLOR_PRESETS = [
  { hex: '#C4683C', name: 'Warm Sandstone', class: 'bg-[#C4683C]', textClass: 'text-[#C4683C]' },
  { hex: '#26221F', name: 'Espresso Onyx', class: 'bg-[#26221F]', textClass: 'text-[#26221F]' },
  { hex: '#B57E3E', name: 'Amber Brass', class: 'bg-[#B57E3E]', textClass: 'text-[#B57E3E]' },
  { hex: '#A34827', name: 'Terracotta', class: 'bg-[#A34827]', textClass: 'text-[#A34827]' },
  { hex: '#5A6B46', name: 'Olive Sage', class: 'bg-[#5A6B46]', textClass: 'text-[#5A6B46]' },
  { hex: '#1D3557', name: 'Cobalt Navy', class: 'bg-[#1D3557]', textClass: 'text-[#1D3557]' },
];

export const BrandCustomizerModal: React.FC<BrandCustomizerModalProps> = ({
  isOpen,
  onClose,
  brand,
  onUpdateBrand,
}) => {
  const [customName, setCustomName] = useState(brand.name);
  const [customTagline, setCustomTagline] = useState(brand.tagline);
  const [selectedColor, setSelectedColor] = useState(brand.accentColor);
  const [activePresetId, setActivePresetId] = useState<string>('lumina-ai');
  const [watermarkEnabled, setWatermarkEnabled] = useState(brand.watermarkEnabled);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: MarketBrandPreset) => {
    setActivePresetId(preset.id);
    setCustomName(preset.name);
    setCustomTagline(preset.tagline);
    setSelectedColor(preset.accentColor);

    onUpdateBrand({
      name: preset.name,
      tagline: preset.tagline,
      accentColor: preset.accentColor,
      accentClass: preset.accentClass,
      accentTextClass: preset.accentTextClass,
      logoLetter: preset.logoLetter,
      font: preset.font,
    });
  };

  const handleSaveCustom = () => {
    const trimmed = customName.trim().toUpperCase() || 'LUMINA AI';
    const firstLetter = trimmed.charAt(0);
    const colorObj = COLOR_PRESETS.find(c => c.hex === selectedColor) || COLOR_PRESETS[0];

    onUpdateBrand({
      name: trimmed,
      tagline: customTagline.trim(),
      accentColor: selectedColor,
      accentClass: colorObj.class,
      accentTextClass: colorObj.textClass,
      logoLetter: firstLetter,
      watermarkEnabled: watermarkEnabled,
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="max-w-3xl w-full bg-[#FFFFFF] border border-[#E6E1D7] rounded-3xl overflow-hidden flex flex-col shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-[#E6E1D7] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full bg-[#F4F1EA] border border-[#E6E1D7]"
                style={{ color: brand.accentColor }}
              >
                Brand Architecture & Market Identity
              </span>
              <span className="text-xs text-[#7A7267] font-mono">Positioning Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1E1B18] font-display">
              Software Name & Market Choice
            </h2>
            <p className="text-[#7A7267] text-xs sm:text-sm mt-1">
              Choose from pre-vetted market-winning names or customize your own studio brand name, monogram, and color palette.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C827A] hover:text-[#1E1B18] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
          
          {/* Section 1: Pre-curated Top-Market Choices */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6358] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C4683C]" />
                <span>Market-Best Brand Choices (1-Click Apply)</span>
              </span>
              <span className="text-[11px] text-[#8C827A] font-mono">High Market Recall</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MARKET_BRAND_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    activePresetId === preset.id || brand.name === preset.name
                      ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-md scale-[1.02]'
                      : 'bg-[#F9F8F5] text-[#1E1B18] border-[#E6E1D7] hover:border-[#C4683C]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm text-white"
                        style={{ backgroundColor: preset.accentColor }}
                      >
                        {preset.logoLetter}
                      </div>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        activePresetId === preset.id || brand.name === preset.name
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F4F1EA] text-[#7A7267]'
                      }`}>
                        {preset.category.split('•')[0].trim()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-display">
                      {preset.name}
                    </h4>
                    <p className={`text-[11px] mt-1 leading-relaxed line-clamp-2 ${
                      activePresetId === preset.id || brand.name === preset.name ? 'text-white/70' : 'text-[#7A7267]'
                    }`}>
                      {preset.marketAppeal}
                    </p>
                  </div>

                  <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] ${
                    activePresetId === preset.id || brand.name === preset.name ? 'border-white/10 text-white/60' : 'border-[#F0EBE1] text-[#8C827A]'
                  }`}>
                    <span>{preset.font}</span>
                    {(activePresetId === preset.id || brand.name === preset.name) && (
                      <span className="text-[#C4683C] font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3 text-[#C4683C]" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Custom Name Editor */}
          <div className="bento-subcard p-6 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6358] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#C4683C]" />
              <span>Customize Name As Per Your Choice</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6358]">Software Studio Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. LUMINA AI, APEX STUDIO, YOURBRAND"
                  className="bg-white border border-[#D9D3C7] rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B18] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#C4683C] font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6358]">Studio Tagline / Slogan</label>
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  placeholder="e.g. Next-Gen Generative Production Suite"
                  className="bg-white border border-[#D9D3C7] rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#C4683C]"
                />
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#F0EBE1]">
              <label className="text-xs font-semibold text-[#6B6358]">Brand Accent Color Theme</label>
              <div className="flex flex-wrap items-center gap-2.5">
                {COLOR_PRESETS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => setSelectedColor(col.hex)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      selectedColor === col.hex
                        ? 'border-[#1E1B18] bg-[#F4F1EA] text-[#1E1B18] shadow-2xs font-bold'
                        : 'border-[#E6E1D7] bg-white text-[#6B6358] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: col.hex }} />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Watermark Protection Option */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F0EBE1]">
              <div>
                <div className="text-xs font-bold text-[#1E1B18] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#C4683C]" />
                  <span>Media Export Watermark</span>
                </div>
                <div className="text-[11px] text-[#7A7267]">
                  Automatically imprint "{customName.toUpperCase() || brand.name}" onto generated deliverables
                </div>
              </div>

              <input
                type="checkbox"
                checked={watermarkEnabled}
                onChange={(e) => setWatermarkEnabled(e.target.checked)}
                className="accent-[#C4683C] w-4 h-4 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Section 3: Live Identity Preview Card */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D7] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-xs"
                style={{ backgroundColor: selectedColor }}
              >
                {customName.trim().charAt(0) || 'L'}
              </div>
              <div>
                <div className="text-base font-bold text-[#1E1B18] font-display uppercase tracking-tight">
                  {customName.trim() || 'LUMINA AI'}
                </div>
                <div className="text-xs text-[#7A7267]">
                  {customTagline.trim() || brand.tagline}
                </div>
              </div>
            </div>

            <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-white text-[#7A7267] border border-[#E6E1D7]">
              Live Preview
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-[#E6E1D7] bg-[#FAF8F5] flex items-center justify-between">
          <span className="text-xs text-[#7A7267]">
            Changes apply instantly to studio headers, cards, and watermarks
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A7267] hover:text-[#1E1B18] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCustom}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-xs hover:shadow-md"
              style={{ backgroundColor: selectedColor }}
            >
              Apply Rebranded Identity
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
