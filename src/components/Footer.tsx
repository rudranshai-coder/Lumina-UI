import React from 'react';
import { BrandConfig } from '../types';

interface FooterProps {
  brand: BrandConfig;
  onOpenBrandModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ brand, onOpenBrandModal }) => {
  return (
    <footer className="w-full border-t border-[#E6E1D7] bg-white/70 backdrop-blur-xs py-7 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#7A7267]">
        <div className="flex items-center gap-3">
          <span 
            className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] text-white"
            style={{ backgroundColor: brand.accentColor }}
          >
            {brand.logoLetter}
          </span>
          <span className="font-semibold text-[#1E1B18]">© {new Date().getFullYear()} {brand.name} STUDIO</span>
          <span className="hidden sm:inline">— Generative Production Suite</span>
          <button
            onClick={onOpenBrandModal}
            className="text-[#C4683C] hover:underline font-semibold cursor-pointer"
          >
            [Edit Name]
          </button>
        </div>

        <div className="flex items-center gap-5 text-xs text-[#7A7267]">
          <span className="hover:text-[#1E1B18] transition-colors cursor-pointer">Commercial Terms</span>
          <span className="hover:text-[#1E1B18] transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-[#1E1B18] transition-colors cursor-pointer">API Docs</span>
          <span className="text-emerald-700 font-mono font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% OPERATIONAL
          </span>
        </div>
      </div>
    </footer>
  );
};
