'use client'

import React from 'react';
import { Menu } from 'lucide-react';

export function MobileHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-black border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-sm bg-black/80">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://idip.com.mx/wp-content/uploads/2024/07/idip-w.png" 
          alt="IDIP Logo" 
          className="h-8 w-auto"
        />
        <div className="h-1 w-1 rounded-full bg-[#98C222]" />
        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">Marketing Pulse</span>
      </div>
      <button 
        onClick={onOpenMenu}
        className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}
