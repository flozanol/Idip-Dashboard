'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  BarChart3, 
  MapPin, 
  Calendar,
  Settings,
  BookOpen,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Leads', href: '/leads' },
  { icon: BarChart3, label: 'Inversiones', href: '/investments' },
  { icon: Settings, label: 'Configuración', href: '/settings' },
  { icon: MapPin, label: 'Sedes', href: '/sedes' },
  { icon: BookOpen, label: 'Manual', href: '/manual' },
  { icon: ExternalLink, label: 'Dir. Estratégica', href: 'https://direccion-idip.vercel.app/', external: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 flex flex-col h-screen sticky top-0 bg-black/50 backdrop-blur-xl">
      <div className="p-6 flex flex-col items-center gap-4">
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://idip.com.mx/wp-content/uploads/2024/07/idip-w.png" 
            alt="IDIP Logo" 
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#98C222]" />
          <h1 className="font-bold tracking-tight text-xs uppercase text-zinc-500">Marketing Pulse</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isExternal = 'external' in item && item.external;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                isActive 
                  ? "bg-[#98C222]/10 text-[#98C222] font-medium" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              <item.icon size={18} className={cn(isActive ? "text-[#98C222]" : "text-zinc-400 group-hover:text-white")} />
              <span className="flex-1">{item.label}</span>
              {isExternal && <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-[#98C222]" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-lg transition-colors text-rose-400/80 hover:text-rose-400">
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
