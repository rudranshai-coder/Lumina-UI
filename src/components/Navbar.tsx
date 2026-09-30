import React, { useState } from 'react';
import { BrandConfig } from '../types';
import { Sparkles, Edit3, Image as ImageIcon, Video, Sliders, Palette, Check } from 'lucide-react';

interface NavbarProps {
  brand: BrandConfig;
  activeTab: 'dashboard' | 'images' | 'videos' | 'editor' | 'brand';
  setActiveTab: (tab: 'dashboard' | 'images' | 'videos' | 'editor' | 'brand') => void;
  onOpenBrandModal: () => void;
  onQuickRename?: (newName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  activeTab,
  setActiveTab,
  onOpenBrandModal,
  onQuickRename,
}) => {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineVal, setInlineVal] = useState(brand.name);

  const handleSaveInline = () => {
    if (inlineVal.trim() && onQuickRename) {
      onQuickRename(inlineVal.trim().toUpperCase());
    }
    setIsEditingInline(false);
  };

  return (
    <header className="w-full border-b border-[#E6E1D7] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand & Monogram Logo with Inline Rename */}
        <div className="flex items-center gap-3">
          <button 
            id="brand-logo-btn"
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            title="Studio Workspace Overview"
          >
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-xs transition-transform group-hover:scale-105 duration-200"
              style={{ backgroundColor: brand.accentColor }}
            >
              {brand.logoLetter || brand.name.charAt(0) || 'L'}
            </div>
          </button>

          <div className="flex flex-col">
            {isEditingInline ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={inlineVal}
                  onChange={(e) => setInlineVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveInline()}
                  className="px-2.5 py-1 text-sm font-bold text-[#1E1B18] bg-[#F4F1EA] border border-[#D9D3C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4683C]"
                  autoFocus
                />
                <button
                  onClick={handleSaveInline}
                  className="p-1 rounded-md bg-[#1E1B18] text-white hover:bg-[#3A3530]"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <span 
                  onClick={() => setActiveTab('dashboard')}
                  className="text-lg sm:text-xl font-bold tracking-tight text-[#1E1B18] font-display uppercase cursor-pointer hover:text-[#C4683C] transition-colors"
                >
                  {brand.name}
                </span>

                <button
                  onClick={() => {
                    setInlineVal(brand.name);
                    setIsEditingInline(true);
                  }}
                  className="p-1 text-[#8C827A] hover:text-[#1E1B18] transition-colors cursor-pointer"
                  title="Rename software studio name"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F4F1EA] text-[#7A7267] border border-[#E6E1D7]">
                  PRO STUDIO
                </span>
              </div>
            )}
            <span className="text-[11px] text-[#7A7267] hidden md:block truncate max-w-[280px]">
              {brand.tagline}
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Bento Studio) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F4F1EA] p-1 rounded-full border border-[#E6E1D7]">
          <button
            id="nav-dashboard-btn"
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#FFFFFF] text-[#1E1B18] shadow-xs'
                : 'text-[#6B6358] hover:text-[#1E1B18]'
            }`}
          >
            Studio Bento
          </button>
          
          <button
            id="nav-images-btn"
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'images'
                ? 'bg-[#FFFFFF] text-[#1E1B18] shadow-xs'
                : 'text-[#6B6358] hover:text-[#1E1B18]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#C4683C]" />
            <span>Image Creator</span>
          </button>

          <button
            id="nav-videos-btn"
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-[#FFFFFF] text-[#1E1B18] shadow-xs'
                : 'text-[#6B6358] hover:text-[#1E1B18]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#C4683C]" />
            <span>Cinematic Video</span>
          </button>

          <button
            id="nav-editor-btn"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-[#FFFFFF] text-[#1E1B18] shadow-xs'
                : 'text-[#6B6358] hover:text-[#1E1B18]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Color Suite</span>
          </button>

          <button
            id="nav-brand-btn"
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'brand'
                ? 'bg-[#FFFFFF] text-[#1E1B18] shadow-xs'
                : 'text-[#6B6358] hover:text-[#1E1B18]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#C4683C]" />
            <span>Market Names</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4F1EA] border border-[#E6E1D7] text-[#6B6358] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px]">0.8s Engine</span>
          </div>

          <button
            id="header-market-choice-btn"
            onClick={onOpenBrandModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs hover:shadow-md cursor-pointer hover:scale-102 active:scale-98"
            style={{ backgroundColor: brand.accentColor }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Market Presets</span>
          </button>
        </div>

      </div>

      {/* Mobile navigation tab row */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-[#E6E1D7] bg-[#F9F8F5] overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'text-[#1E1B18] font-bold bg-white shadow-2xs' : 'text-[#6B6358]'}`}
        >
          Studio Bento
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'images' ? 'text-[#1E1B18] font-bold bg-white shadow-2xs' : 'text-[#6B6358]'}`}
        >
          Images
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'videos' ? 'text-[#1E1B18] font-bold bg-white shadow-2xs' : 'text-[#6B6358]'}`}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'editor' ? 'text-[#1E1B18] font-bold bg-white shadow-2xs' : 'text-[#6B6358]'}`}
        >
          Color Suite
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'brand' ? 'text-[#1E1B18] font-bold bg-white shadow-2xs' : 'text-[#6B6358]'}`}
        >
          Brands
        </button>
      </div>
    </header>
  );
};
