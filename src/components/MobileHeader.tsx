'use client'

import React from 'react';
import { Menu } from 'lucide-react';

export function MobileHeader({ onOpenMenu, currentUser }: { onOpenMenu: () => void, currentUser?: any }) {
  return (
    <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-black border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-sm bg-black/80">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://idip.com.mx/wp-content/uploads/2024/07/idip-w.png" 
          alt="IDIP Logo" 
          className="h-8 w-auto"
        />
        <div className="h-1 w-1 rounded-full bg-[#afca0b]" />
        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">Marketing Pulse</span>
      </div>
      <div className="flex items-center gap-4">
        {currentUser && (
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-[#afca0b] uppercase tracking-widest leading-none">{currentUser.rol}</p>
            <p className="text-xs font-bold text-white leading-tight">{currentUser.nombre}</p>
          </div>
        )}
        <button 
          onClick={onOpenMenu}
          className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
